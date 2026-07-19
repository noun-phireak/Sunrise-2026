import { Test, TestingModule } from '@nestjs/testing';
import { StocksService } from './stocks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockTransaction } from '../database/entities/stock-transaction.entity';
import { Product } from '../database/entities/product.entity';
import { Stock } from '../database/entities/stock.entity';
import { StockDetail } from '../database/entities/stock_detail.entity';
import { Status } from '../database/entities/status.entity';
import { DataSource } from 'typeorm';

describe('StocksService', () => {
    let service: StocksService;
    let dataSource: DataSource;

    const mockStock = { id: 1, status_id: 1, details: [{ product_id: 1, qty: 10 }] };
    const mockProduct = { id: 1, name: 'Test Product', unit_price: 100, qty: 10 };
    const mockStatus = { id: 1, name: 'Pending' };

    const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            save: jest.fn().mockImplementation((entity) => Promise.resolve({ ...entity, id: 1 })),
            findOne: jest.fn().mockResolvedValue(mockProduct),
        },
    };

    const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const mockStockRepo = {
        findOne: jest.fn().mockResolvedValue(mockStock),
        findOneBy: jest.fn().mockResolvedValue(mockStock),
        find: jest.fn().mockResolvedValue([mockStock]),
        save: jest.fn().mockResolvedValue(mockStock),
    };

    const mockProductRepo = {
        findOneBy: jest.fn().mockResolvedValue(mockProduct),
    };

    const mockStatusRepo = {
        findOneBy: jest.fn().mockResolvedValue(mockStatus),
    };

    // Other repos are not used directly but injected
    const mockTransactionRepo = {};
    const mockDetailRepo = {};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StocksService,
                { provide: getRepositoryToken(StockTransaction), useValue: mockTransactionRepo },
                { provide: getRepositoryToken(Product), useValue: mockProductRepo },
                { provide: getRepositoryToken(Stock), useValue: mockStockRepo },
                { provide: getRepositoryToken(StockDetail), useValue: mockDetailRepo },
                { provide: getRepositoryToken(Status), useValue: mockStatusRepo },
                { provide: DataSource, useValue: mockDataSource },
            ],
        }).compile();

        service = module.get<StocksService>(StocksService);
        dataSource = module.get<DataSource>(DataSource);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('addStock', () => {
        it('should create a stock request', async () => {
            const dto = { product_id: 1, quantity: 10, supplier_id: 1 };
            const result = await service.addStock(dto, 1);

            expect(mockProductRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.manager.save).toHaveBeenCalled(); // Stock, StockDetail
            expect(result.stock).toBeDefined();
        });
    });

    describe('approveStock', () => {
        it('should approve stock and update inventory', async () => {
            const completedStatus = { id: 2, name: 'Completed' };
            mockStatusRepo.findOneBy.mockResolvedValueOnce(completedStatus); // for approve logic check
            // Actually implementation calls findOneBy({name: 'Completed'})

            const result = await service.approveStock(1);

            expect(mockStockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: { details: true } });
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            // Should update stock status and product quantity
            expect(mockQueryRunner.manager.save).toHaveBeenCalled();
            expect(result.message).toContain('approved');
        });
    });

    describe('rejectStock', () => {
        it('should reject a stock request', async () => {
            const cancelledStatus = { id: 3, name: 'Cancelled' };
            // Implementation calls findOneBy({name: 'Cancelled'})
            mockStatusRepo.findOneBy.mockImplementation((query) => {
                if (query.name === 'Cancelled') return Promise.resolve(cancelledStatus);
                if (query.name === 'Pending') return Promise.resolve(mockStatus);
                return Promise.resolve(null);
            });

            await service.rejectStock(1);

            expect(mockStockRepo.save).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return stock history', async () => {
            const result = await service.findAll();
            expect(result).toEqual([mockStock]);
        });
    });
});
