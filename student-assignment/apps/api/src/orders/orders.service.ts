import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Order } from '../database/entities/order.entity';
import { OrderDetail } from '../database/entities/order_detail.entity';
import { Product } from '../database/entities/product.entity';
import { StockTransaction, StockTransactionType } from '../database/entities/stock-transaction.entity';
import { Status } from '../database/entities/status.entity';
import { User } from '../database/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Customer } from '../database/entities/customer.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Status)
        private statusRepository: Repository<Status>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private dataSource: DataSource,
    ) { }

    async create(createOrderDto: CreateOrderDto, cashierId: number) {
        const { items, customer_id, payment_id } = createOrderDto;

        if (!items || items.length === 0) {
            throw new BadRequestException('Order must have at least one item');
        }

        // Fetch products
        const productIds = items.map(item => item.product_id);
        const products = await this.productRepository.findBy({ id: In(productIds) });
        const productMap = new Map(products.map(p => [p.id, p]));

        // Validate products and stock
        for (const item of items) {
            const product = productMap.get(item.product_id);
            if (!product) {
                throw new NotFoundException(`Product #${item.product_id} not found`);
            }
            if (Number(product.qty) < item.quantity) {
                throw new BadRequestException(`Insufficient stock for product ${product.name}`);
            }
        }

        // Use transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Get default status (Completed for simple POS) or Pending
            const status = await this.statusRepository.findOneBy({ name: 'Completed' });
            if (!status) throw new Error('Default status not found');

            // Resolve Customer
            let customerId = customer_id;
            if (!customerId) {
                // Find Walk-in Customer
                // In a real app, this ID should be known or fetched via seeding logic
                const walkInUser = await this.userRepository.findOneBy({ email: 'walkin@pos.com' });
                if (walkInUser) {
                    // We need the Customer ID, not User ID. Customer table has user_id.
                    // But wait, order.customer_id is FK to Customer table?
                    // Let's check Order entity again.
                    // @ManyToOne(() => Customer) customer: Customer;
                    // So yes, it needs Customer ID.
                    // My Seeding created a savedUser then savedCustomer.
                    // I need to fetch the Customer entity associated with that user.
                    const customerEntity = await queryRunner.manager.findOne(Customer, { where: { user_id: walkInUser.id } });
                    if (customerEntity) customerId = customerEntity.id;
                }
            }

            if (!customerId) throw new BadRequestException('Customer is required');

            const order = new Order();
            order.cashier_id = cashierId;
            order.customer_id = customerId;
            order.status_id = status.id;
            order.payment_id = payment_id || null;
            order.total_price = 0;
            order.amount_to_pay = 0;
            order.discount = 0;
            // created_at handled by @CreateDateColumn

            // Calculate total and prepare details
            const orderDetails: OrderDetail[] = [];
            let total = 0;

            for (const item of items) {
                const product = productMap.get(item.product_id)!;
                const price = Number(product.unit_price);
                const subtotal = price * item.quantity;
                total += subtotal;

                // Update product stock
                product.qty = Number(product.qty) - item.quantity;
                await queryRunner.manager.save(product);

                // Create Stock Transaction
                const transaction = new StockTransaction();
                transaction.product_id = product.id;
                transaction.quantity = -item.quantity; // Negative for OUT? Or positive with type OUT?
                // Plan said: "quantity: Number (change amount)". Usually OUT is negative if summing, or positive if relying on Type.
                // Let's use positive quantity with Type OUT for clarity, or follow existing convention.
                // StocksService added positive for IN.
                // Let's use negative for OUT to be mathematically consistent if we sum them up, 
                // BUT usually transaction logs imply magnitude.
                // Let's stick to magnitude = quantity, Type = OUT.
                transaction.quantity = item.quantity;
                transaction.type = StockTransactionType.OUT;
                transaction.supplier_id = product.supplier_id; // Optional link
                // transaction.order_id will be set after order save? No, needs order ID.

                // OrderDetail
                const detail = new OrderDetail();
                detail.product_id = product.id;
                detail.qty = item.quantity; // Entity expects 'qty'
                detail.unit_price = price;

                orderDetails.push(detail);

                // We need to save transaction later to link with order?
                // StockTransaction needs order_id. Order needs to be saved first.
            }

            order.total_price = total;
            order.amount_to_pay = total;

            const savedOrder = await queryRunner.manager.save(order);

            // Save details
            for (const detail of orderDetails) {
                detail.order_id = savedOrder.id;
                await queryRunner.manager.save(detail);
            }

            // Create transactions now that we have order ID
            for (const item of items) {
                const product = productMap.get(item.product_id)!;
                const transaction = new StockTransaction();
                transaction.product_id = product.id;
                transaction.quantity = item.quantity;
                transaction.type = StockTransactionType.OUT;
                transaction.order_id = savedOrder.id;
                transaction.supplier_id = product.supplier_id;
                await queryRunner.manager.save(transaction);
            }

            await queryRunner.commitTransaction();

            return savedOrder;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        return this.orderRepository.find({
            relations: {
                cashier: true,
                customer: true,
                status: true,
                details: {
                    product: true
                }
            },
            order: {
                created_at: 'DESC'
            }
        });
    }
}
