import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockTransaction, StockTransactionType } from '../database/entities/stock-transaction.entity';
import { Product } from '../database/entities/product.entity';
import { Stock } from '../database/entities/stock.entity';
import { StockDetail } from '../database/entities/stock_detail.entity';
import { Status } from '../database/entities/status.entity';
import { CreateStockDto } from './dto/create-stock.dto';

@Injectable()
export class StocksService {
    constructor(
        @InjectRepository(StockTransaction)
        private transactionRepository: Repository<StockTransaction>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Stock)
        private stockRepository: Repository<Stock>,
        @InjectRepository(StockDetail)
        private stockDetailRepository: Repository<StockDetail>,
        @InjectRepository(Status)
        private statusRepository: Repository<Status>,
        private dataSource: DataSource,
    ) { }

    async addStock(createStockDto: CreateStockDto, stockerId: number) {
        const { product_id, quantity, supplier_id } = createStockDto;

        if (!supplier_id) {
            throw new BadRequestException('Supplier is required for stock in');
        }

        const product = await this.productRepository.findOneBy({ id: product_id });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Get Status (Pending) - Default for new requests
            let status = await this.statusRepository.findOneBy({ name: 'Pending' });
            if (!status) {
                // Fallback
                status = await this.statusRepository.findOneBy({ id: 1 });
            }

            // 2. Create Stock Header
            const stock = new Stock();
            stock.stocker_id = stockerId;
            stock.supplier_id = supplier_id;
            stock.code = `STK-${Date.now()}`;
            stock.status_id = status?.id || 1;
            stock.requested_at = new Date();

            // Calculate prices
            // Use provided stock_price (Unit Cost) or fallback to current product price? 
            // Usually stock_price input = Unit Cost.
            // Calculate prices
            // Use provided stock_price (Unit Cost) or fallback to current product price? 
            const unitCost = createStockDto.stock_price !== undefined ? Number(createStockDto.stock_price) : Number(product.unit_price);
            const totalCost = unitCost * quantity;

            stock.stock_price = totalCost; // Assuming this column means Total Cost based on previous logic "stock.stock_price = totalPrice;"
            // Or if stock_price column means Unit Cost?
            // "total_price" exists clearly. "stock_price" might be redundant or mean Unit Cost.
            // Previous code: stock.stock_price = totalPrice;
            // Let's assume stock_price in DB means Total Cost for compatibility, or check entity type?
            // Entity: @Column('decimal', { precision: 10, scale: 2 }) stock_price: number;
            // Let's stick to previous logic: stock_price = totalCost.

            stock.total_price = totalCost;

            if (createStockDto.sale_price) {
                stock.sale_price = Number(createStockDto.sale_price);
            }

            const savedStock = await queryRunner.manager.save(stock);

            // 3. Create Stock Detail
            const stockDetail = new StockDetail();
            stockDetail.stock_id = savedStock.id;
            stockDetail.product_id = product.id;
            stockDetail.qty = quantity;
            stockDetail.unit_price = unitCost; // This is the Cost Price per unit

            await queryRunner.manager.save(stockDetail);

            // 4. DO NOT Update Product Quantity yet (Wait for approval)

            await queryRunner.commitTransaction();

            return {
                message: 'Stock request created successfully. Waiting for approval.',
                stock: savedStock
            };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async approveStock(id: number) {
        const stock = await this.stockRepository.findOne({
            where: { id },
            relations: { details: true } // Need details to update inventory
        });

        if (!stock) {
            throw new NotFoundException('Stock request not found');
        }

        // Get Pending status to verify? Or just check current status.
        // For now, let's assume we can approve any non-completed stock? 
        // Or strictly check if it's Pending.

        const completedStatus = await this.statusRepository.findOneBy({ name: 'Completed' }); // or Approved
        if (!completedStatus) {
            throw new NotFoundException('Completed status not found');
        }

        if (stock.status_id === completedStatus.id) {
            throw new BadRequestException('Stock is already approved/completed');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Update Stock Status
            stock.status_id = completedStatus.id;
            await queryRunner.manager.save(stock);

            // 2. Update Product Inventory for each detail
            if (stock.details) {
                for (const detail of stock.details) {
                    // Use queryRunner manager to be part of the transaction and ensure latest data
                    const product = await queryRunner.manager.findOne(Product, {
                        where: { id: detail.product_id }
                    });

                    if (product) {
                        const currentQty = Number(product.qty || 0);
                        const addQty = Number(detail.qty);

                        // console.log(`Updating Stock: Product ${product.id} (${product.name}). Current: ${currentQty}, Add: ${addQty}`);

                        product.qty = currentQty + addQty;
                        await queryRunner.manager.save(product);
                    }
                }
            }

            await queryRunner.commitTransaction();

            return {
                message: 'Stock approved and inventory updated successfully',
                stock
            };

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async rejectStock(id: number) {
        const stock = await this.stockRepository.findOneBy({ id });
        if (!stock) {
            throw new NotFoundException('Stock request not found');
        }

        const cancelledStatus = await this.statusRepository.findOneBy({ name: 'Cancelled' });
        if (!cancelledStatus) {
            throw new NotFoundException('Cancelled status not found');
        }

        if (stock.status_id !== (await this.statusRepository.findOneBy({ name: 'Pending' }))?.id) {
            // Optional: Allow cancelling if not already completed? 
            // For safety, only allow rejecting Pending items.
            const completedStatus = await this.statusRepository.findOneBy({ name: 'Completed' });
            if (stock.status_id === completedStatus?.id) {
                throw new BadRequestException('Cannot reject a completed stock request');
            }
        }

        stock.status_id = cancelledStatus.id;
        return this.stockRepository.save(stock);
    }

    async findAll() {
        return this.stockRepository.find({
            relations: {
                supplier: true,
                stocker: true,
                status: true // Include status to show Pending/Completed
            },
            order: {
                requested_at: 'DESC'
            }
        });
    }

}
