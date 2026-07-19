import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async create(createProductDto: CreateProductDto, imageUrl: string): Promise<Product> {
        const product = this.productRepository.create({
            ...createProductDto,
            image: imageUrl,
        });
        return this.productRepository.save(product);
    }

    findAll(): Promise<Product[]> {
        return this.productRepository.find({ relations: ['category', 'supplier'] });
    }

    findOne(id: number): Promise<Product | null> {
        return this.productRepository.findOne({ where: { id }, relations: ['category', 'supplier'] });
    }

    async update(id: number, updateProductDto: any, imageUrl?: string): Promise<Product> {
        const product = await this.findOne(id);
        if (!product) {
            throw new Error('Product not found');
        }

        // Merge updates
        const updatedProduct = {
            ...product,
            ...updateProductDto,
            ...(imageUrl ? { image: imageUrl } : {}),
        };

        return this.productRepository.save(updatedProduct);
    }

    async remove(id: number): Promise<void> {
        await this.productRepository.delete(id);
    }
}
