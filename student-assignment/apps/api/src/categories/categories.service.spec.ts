import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../database/entities/category.entity';
import { Repository } from 'typeorm';

describe('CategoriesService', () => {
    let service: CategoriesService;
    let repository: Repository<Category>;

    const mockCategory = {
        id: 1,
        name: 'Test Category',
        description: 'Test Description',
        products: [],
    };

    const mockRepository = {
        create: jest.fn().mockImplementation((dto) => dto),
        save: jest.fn().mockResolvedValue(mockCategory),
        find: jest.fn().mockResolvedValue([mockCategory]),
        findOneBy: jest.fn().mockResolvedValue(mockCategory),
        merge: jest.fn(),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<CategoriesService>(CategoriesService);
        repository = module.get<Repository<Category>>(getRepositoryToken(Category));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a category', async () => {
            const dto = { name: 'Test Category', description: 'Test Description' };
            expect(await service.create(dto)).toEqual(mockCategory);
            expect(repository.create).toHaveBeenCalledWith(dto);
            expect(repository.save).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return an array of categories', async () => {
            expect(await service.findAll()).toEqual([mockCategory]);
            expect(repository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a category by id', async () => {
            expect(await service.findOne(1)).toEqual(mockCategory);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        });
    });

    describe('update', () => {
        it('should update a category', async () => {
            const dto = { name: 'Updated Name' };
            expect(await service.update(1, dto)).toEqual(mockCategory);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repository.merge).toHaveBeenCalledWith(mockCategory, dto);
            expect(repository.save).toHaveBeenCalledWith(mockCategory);
        });

        it('should throw an error if category not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
            await expect(service.update(999, {})).rejects.toThrow('Category with ID 999 not found');
        });
    });

    describe('remove', () => {
        it('should remove a category', async () => {
            await service.remove(1);
            expect(repository.delete).toHaveBeenCalledWith(1);
        });
    });
});
