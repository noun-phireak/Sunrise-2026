import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './../src/database/entities/user.entity';
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const testUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        dataSource = moduleFixture.get<DataSource>(DataSource);
    });

    afterAll(async () => {
        await app.close();
    });

    // Clean up DB before each test run if needed, or use a separate test DB
    beforeEach(async () => {
        // Optional: Clear users table
        // await dataSource.getRepository(User).delete({ email: testUser.email });
    });

    it('/auth/register (POST)', async () => {
        // Ensure user doesn't exist
        await dataSource.getRepository(User).delete({ email: testUser.email });

        return request(app.getHttpServer())
            .post('/auth/register')
            .send(testUser)
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body.email).toEqual(testUser.email);
                expect(res.body).not.toHaveProperty('password');
            });
    });

    it('/auth/login (POST)', async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('access_token');
                expect(res.body.user.email).toEqual(testUser.email);
            });
    });

    it('/auth/profile (GET)', async () => {
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        const token = loginRes.body.access_token;

        return request(app.getHttpServer())
            .get('/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toEqual(testUser.email);
            });
    });
});
