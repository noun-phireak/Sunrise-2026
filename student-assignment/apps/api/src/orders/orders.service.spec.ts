import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../database/entities/order.entity';
import { Product } from '../database/entities/product.entity';
import { Status } from '../database/entities/status.entity';
import { User } from '../database/entities/user.entity';
import { Customer } from '../database/entities/customer.entity';
import { DataSource } from 'typeorm';

describe('OrdersService', () => {
    let service: OrdersService;
    let dataSource: DataSource;

    const mockOrder = { id: 1, total_price: 100 };
    const mockProduct = { id: 1, name: 'Test Product', unit_price: 100, qty: 10, supplier_id: 1 };
    const mockStatus = { id: 1, name: 'Completed' };
    const mockUser = { id: 1, email: 'walkin@pos.com' };
    const mockCustomer = { id: 1, user_id: 1 };

    const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            save: jest.fn().mockImplementation((entity) => Promise.resolve({ ...entity, id: 1 })),
            findOne: jest.fn().mockResolvedValue(mockCustomer),
        },
    };

    const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const mockOrderRepo = {
        find: jest.fn().mockResolvedValue([mockOrder]),
    };
    const mockProductRepo = {
        findBy: jest.fn().mockResolvedValue([mockProduct]),
    };
    const mockStatusRepo = {
        findOneBy: jest.fn().mockResolvedValue(mockStatus),
    };
    const mockUserRepo = {
        findOneBy: jest.fn().mockResolvedValue(mockUser),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrdersService,
                { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
                { provide: getRepositoryToken(Product), useValue: mockProductRepo },
                { provide: getRepositoryToken(Status), useValue: mockStatusRepo },
                { provide: getRepositoryToken(User), useValue: mockUserRepo },
                { provide: DataSource, useValue: mockDataSource },
            ],
        }).compile();

        service = module.get<OrdersService>(OrdersService);
        dataSource = module.get<DataSource>(DataSource);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create an order successfully', async () => {
            const dto = {
                items: [{ product_id: 1, quantity: 1 }],
                payment_id: 1,
            };

            const result = await service.create(dto, 1); // cashierId = 1

            expect(mockProductRepo.findBy).toHaveBeenCalled();
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.manager.save).toHaveBeenCalled(); // Order, Details, Transactions
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(result).toBeDefined();
        });

        it('should rollback transaction on error', async () => {
            const dto = { items: [{ product_id: 1, quantity: 1 }] };
            mockQueryRunner.manager.save.mockRejectedValueOnce(new Error('Save failed'));

            await expect(service.create(dto, 1)).rejects.toThrow('Save failed');
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return all orders', async () => {
            const result = await service.findAll();
            expect(result).toEqual([mockOrder]);
            expect(mockOrderRepo.find).toHaveBeenCalled();
        });
    });
});
