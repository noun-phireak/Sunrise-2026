import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from '../database/entities/supplier.entity';

@ApiTags('suppliers')
@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new supplier' })
    @ApiResponse({ status: 201, description: 'The supplier has been successfully created.', type: Supplier })
    create(@Body() createSupplierDto: CreateSupplierDto) {
        return this.suppliersService.create(createSupplierDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all suppliers' })
    @ApiResponse({ status: 200, description: 'Return all suppliers.', type: [Supplier] })
    findAll() {
        return this.suppliersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a supplier by id' })
    @ApiResponse({ status: 200, description: 'Return a supplier.', type: Supplier })
    findOne(@Param('id') id: string) {
        return this.suppliersService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a supplier' })
    @ApiResponse({ status: 200, description: 'The supplier has been successfully updated.', type: Supplier })
    update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
        return this.suppliersService.update(+id, updateSupplierDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a supplier' })
    @ApiResponse({ status: 200, description: 'The supplier has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.suppliersService.remove(+id);
    }
}
