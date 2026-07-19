import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersService } from './suppliers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from '../database/entities/supplier.entity';
import { Repository } from 'typeorm';

describe('SuppliersService', () => {
    let service: SuppliersService;
    let repository: Repository<Supplier>;

    const mockSupplier = {
        id: 1,
        name: 'Test Supplier',
        email: 'supplier@test.com',
        phone: '1234567890',
        address: 'Test Address',
    };

    const mockRepository = {
        create: jest.fn().mockImplementation((dto) => dto),
        save: jest.fn().mockResolvedValue(mockSupplier),
        find: jest.fn().mockResolvedValue([mockSupplier]),
        findOneBy: jest.fn().mockResolvedValue(mockSupplier),
        merge: jest.fn(),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SuppliersService,
                {
                    provide: getRepositoryToken(Supplier),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<SuppliersService>(SuppliersService);
        repository = module.get<Repository<Supplier>>(getRepositoryToken(Supplier));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a supplier', async () => {
            const dto = { name: 'Test Supplier', email: 'supplier@test.com', phone: '1234567890', address: 'Test Address' };
            expect(await service.create(dto)).toEqual(mockSupplier);
            expect(repository.create).toHaveBeenCalledWith(dto);
            expect(repository.save).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return an array of suppliers', async () => {
            expect(await service.findAll()).toEqual([mockSupplier]);
            expect(repository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a supplier by id', async () => {
            expect(await service.findOne(1)).toEqual(mockSupplier);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        });
    });

    describe('update', () => {
        it('should update a supplier', async () => {
            const dto = { name: 'Updated Name' };
            expect(await service.update(1, dto)).toEqual(mockSupplier);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repository.merge).toHaveBeenCalledWith(mockSupplier, dto);
            expect(repository.save).toHaveBeenCalledWith(mockSupplier);
        });

        it('should throw an error if supplier not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
            await expect(service.update(999, {})).rejects.toThrow('Supplier with ID 999 not found');
        });
    });

    describe('remove', () => {
        it('should remove a supplier', async () => {
            await service.remove(1);
            expect(repository.delete).toHaveBeenCalledWith(1);
        });
    });
});
