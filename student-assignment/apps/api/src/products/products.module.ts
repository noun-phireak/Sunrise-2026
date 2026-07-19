import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../database/entities/product.entity';
import { S3Service } from '../common/services/s3.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([Product]), ConfigModule],
    controllers: [ProductsController],
    providers: [ProductsService, S3Service],
    exports: [ProductsService],
})
export class ProductsModule { }
