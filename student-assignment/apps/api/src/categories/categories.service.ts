import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../database/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(category);
    }

    findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    findOne(id: number): Promise<Category | null> {
        return this.categoryRepository.findOneBy({ id });
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);
        if (!category) {
            // It is better practice to throw a NotFoundException, but using Error to match ProductService for now if needed.
            // Actually, I'll use NotFoundException and import it if I can, but checking ProductService it used Error.
            // I'll stick to a simple Error or check if I can use NotFoundException which is better.
            // Let's stick to Error for consistency with what I saw, or maybe better, just throw it.
            throw new Error(`Category with ID ${id} not found`);
        }
        this.categoryRepository.merge(category, updateCategoryDto);
        return this.categoryRepository.save(category);
    }

    async remove(id: number): Promise<void> {
        await this.categoryRepository.delete(id);
    }
}
