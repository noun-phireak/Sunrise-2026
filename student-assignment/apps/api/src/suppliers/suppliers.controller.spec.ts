import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';

describe('SuppliersController', () => {
    let controller: SuppliersController;
    let service: SuppliersService;

    const mockSupplier = {
        id: 1,
        name: 'Test Supplier',
    };

    const mockService = {
        create: jest.fn().mockResolvedValue(mockSupplier),
        findAll: jest.fn().mockResolvedValue([mockSupplier]),
        findOne: jest.fn().mockResolvedValue(mockSupplier),
        update: jest.fn().mockResolvedValue(mockSupplier),
        remove: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SuppliersController],
            providers: [
                {
                    provide: SuppliersService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<SuppliersController>(SuppliersController);
        service = module.get<SuppliersService>(SuppliersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a supplier', async () => {
            const dto = { name: 'Test Supplier', email: 'test@test.com', phone: '123', address: 'addr' };
            expect(await controller.create(dto)).toEqual(mockSupplier);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return an array of suppliers', async () => {
            expect(await controller.findAll()).toEqual([mockSupplier]);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a supplier', async () => {
            expect(await controller.findOne('1')).toEqual(mockSupplier);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('update', () => {
        it('should update a supplier', async () => {
            const dto = { name: 'Updated Name' };
            expect(await controller.update('1', dto)).toEqual(mockSupplier);
            expect(service.update).toHaveBeenCalledWith(1, dto);
        });
    });

    describe('remove', () => {
        it('should remove a supplier', async () => {
            expect(await controller.remove('1')).toBeUndefined();
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
});
