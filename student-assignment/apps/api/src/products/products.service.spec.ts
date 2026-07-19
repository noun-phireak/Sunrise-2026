import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { S3Service } from '../common/services/s3.service';

describe('ProductsService', () => {
    let service: ProductsService;
    let s3Service: S3Service;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
    };

    const mockS3Service = {
        uploadFile: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockRepository,
                },
                {
                    provide: S3Service,
                    useValue: mockS3Service,
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        s3Service = module.get<S3Service>(S3Service);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a product with an image', async () => {
            const createProductDto = { name: 'Test Product', unit_price: 100, category_id: 1, supplier_id: 1 };
            const imageUrl = 'http://s3.example.com/test.jpg';
            const expectedProduct = { id: 1, ...createProductDto, image: imageUrl };

            mockRepository.create.mockReturnValue(expectedProduct);
            mockRepository.save.mockResolvedValue(expectedProduct);

            const result = await service.create(createProductDto, imageUrl);

            // S3 upload is handled in controller, not service
            expect(mockRepository.create).toHaveBeenCalledWith({ ...createProductDto, image: imageUrl });
            expect(mockRepository.save).toHaveBeenCalledWith(expectedProduct);
            expect(result).toEqual(expectedProduct);
        });
    });

    describe('findAll', () => {
        it('should return an array of products', async () => {
            const products = [{ id: 1, name: 'Test Product' }];
            mockRepository.find.mockResolvedValue(products);

            const result = await service.findAll();

            expect(mockRepository.find).toHaveBeenCalled();
            expect(result).toEqual(products);
        });
    });
});
