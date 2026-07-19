import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from '../database/entities/category.entity';

describe('CategoriesController', () => {
    let controller: CategoriesController;
    let service: CategoriesService;

    const mockCategory = {
        id: 1,
        name: 'Test Category',
        description: 'Test Description',
    } as Category;

    const mockService = {
        create: jest.fn().mockResolvedValue(mockCategory),
        findAll: jest.fn().mockResolvedValue([mockCategory]),
        findOne: jest.fn().mockResolvedValue(mockCategory),
        update: jest.fn().mockResolvedValue(mockCategory),
        remove: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CategoriesController],
            providers: [
                {
                    provide: CategoriesService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<CategoriesController>(CategoriesController);
        service = module.get<CategoriesService>(CategoriesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a category', async () => {
            const dto = { name: 'Test Category', description: 'Test Description' };
            expect(await controller.create(dto)).toEqual(mockCategory);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return an array of categories', async () => {
            expect(await controller.findAll()).toEqual([mockCategory]);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a category', async () => {
            expect(await controller.findOne('1')).toEqual(mockCategory);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('update', () => {
        it('should update a category', async () => {
            const dto = { name: 'Updated Name' };
            expect(await controller.update('1', dto)).toEqual(mockCategory);
            expect(service.update).toHaveBeenCalledWith(1, dto);
        });
    });

    describe('remove', () => {
        it('should remove a category', async () => {
            expect(await controller.remove('1')).toBeUndefined();
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
});
