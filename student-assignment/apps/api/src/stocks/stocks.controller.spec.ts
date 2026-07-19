import { Test, TestingModule } from '@nestjs/testing';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

describe('StocksController', () => {
    let controller: StocksController;
    let service: StocksService;

    const mockResponse = { message: 'Success' };

    const mockService = {
        addStock: jest.fn().mockResolvedValue(mockResponse),
        approveStock: jest.fn().mockResolvedValue(mockResponse),
        rejectStock: jest.fn().mockResolvedValue(mockResponse),
        findAll: jest.fn().mockResolvedValue([]),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StocksController],
            providers: [
                {
                    provide: StocksService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<StocksController>(StocksController);
        service = module.get<StocksService>(StocksService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('addStock', () => {
        it('should add stock', async () => {
            const dto = { product_id: 1, quantity: 10, supplier_id: 1 };
            const req = { user: { userId: 1 } };
            expect(await controller.addStock(dto, req)).toEqual(mockResponse);
            expect(service.addStock).toHaveBeenCalledWith(dto, 1);
        });
    });

    describe('approveStock', () => {
        it('should approve stock', async () => {
            expect(await controller.approveStock('1')).toEqual(mockResponse);
            expect(service.approveStock).toHaveBeenCalledWith(1);
        });
    });

    describe('rejectStock', () => {
        it('should reject stock', async () => {
            expect(await controller.rejectStock('1')).toEqual(mockResponse);
            expect(service.rejectStock).toHaveBeenCalledWith(1);
        });
    });

    describe('findAll', () => {
        it('should return stock history', async () => {
            expect(await controller.findAll()).toEqual([]);
            expect(service.findAll).toHaveBeenCalled();
        });
    });
});
