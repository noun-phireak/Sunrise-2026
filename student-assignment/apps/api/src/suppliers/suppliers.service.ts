import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../database/entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
    constructor(
        @InjectRepository(Supplier)
        private supplierRepository: Repository<Supplier>,
    ) { }

    create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
        const supplier = this.supplierRepository.create(createSupplierDto);
        return this.supplierRepository.save(supplier);
    }

    findAll(): Promise<Supplier[]> {
        return this.supplierRepository.find();
    }

    findOne(id: number): Promise<Supplier | null> {
        return this.supplierRepository.findOneBy({ id });
    }

    async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
        const supplier = await this.findOne(id);
        if (!supplier) {
            throw new Error(`Supplier with ID ${id} not found`);
        }
        this.supplierRepository.merge(supplier, updateSupplierDto);
        return this.supplierRepository.save(supplier);
    }

    async remove(id: number): Promise<void> {
        await this.supplierRepository.delete(id);
    }
}
