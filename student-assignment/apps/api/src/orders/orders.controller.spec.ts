import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
    let controller: OrdersController;
    let service: OrdersService;

    const mockOrder = { id: 1, total_price: 100 };

    const mockService = {
        create: jest.fn().mockResolvedValue(mockOrder),
        findAll: jest.fn().mockResolvedValue([mockOrder]),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrdersController],
            providers: [
                {
                    provide: OrdersService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<OrdersController>(OrdersController);
        service = module.get<OrdersService>(OrdersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create an order', async () => {
            const dto = { items: [{ product_id: 1, quantity: 1 }] };
            const req = { user: { id: 1 } };
            expect(await controller.create(dto, req)).toEqual(mockOrder);
            expect(service.create).toHaveBeenCalledWith(dto, 1);
        });
    });

    describe('findAll', () => {
        it('should return all orders', async () => {
            expect(await controller.findAll()).toEqual([mockOrder]);
            expect(service.findAll).toHaveBeenCalled();
        });
    });
});
