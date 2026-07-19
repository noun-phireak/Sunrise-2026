import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { S3Service } from './../src/common/services/s3.service';
import { DataSource } from 'typeorm';
import { Product } from './../src/database/entities/product.entity';
import { JwtService } from '@nestjs/jwt';

describe('ProductsController (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    let dataSource: DataSource;

    const mockS3Service = {
        uploadFile: jest.fn().mockResolvedValue('http://mock-s3-url.com/image.jpg'),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(S3Service)
            .useValue(mockS3Service)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        dataSource = moduleFixture.get<DataSource>(DataSource);
        const jwtService = moduleFixture.get<JwtService>(JwtService);

        // Create a valid token for authentication (assuming payload structure)
        accessToken = jwtService.sign({ sub: 1, email: 'test@example.com', role: 'Admin' });
    });

    afterAll(async () => {
        await app.close();
    });

    it('/products (POST)', async () => {
        return request(app.getHttpServer())
            .post('/products')
            .set('Authorization', `Bearer ${accessToken}`)
            .attach('file', Buffer.from('fake image data'), 'test-image.jpg')
            .field('name', 'E2E Product')
            .field('price', 99.99)
            .field('category_id', 1)
            .field('supplier_id', 1)
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body.name).toEqual('E2E Product');
                expect(res.body.image).toEqual('http://mock-s3-url.com/image.jpg');
            });
    });

    it('/products (GET)', async () => {
        return request(app.getHttpServer())
            .get('/products')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body)).toBe(true);
                const createdProduct = res.body.find((p) => p.name === 'E2E Product');
                expect(createdProduct).toBeDefined();
            });
    });
});
