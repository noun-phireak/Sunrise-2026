import {
    Controller,
    Get,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../database/entities/product.entity';
import { S3Service } from '../common/services/s3.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly s3Service: S3Service,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product with image' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                unit_price: { type: 'number' },
                description: { type: 'string' },
                qty: { type: 'number' },
                category_id: { type: 'number' },
                supplier_id: { type: 'number' },
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
                ],
                fileIsRequired: true,
            }),
        )
        file: Express.Multer.File,
    ) {
        const imageUrl = await this.s3Service.uploadFile(file);
        return this.productsService.create(createProductDto, imageUrl);
    }

    @Get()
    @ApiOperation({ summary: 'List all products' })
    @ApiResponse({ status: 200, description: 'Return all products.', type: [Product] })
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a product by id' })
    @ApiResponse({ status: 200, description: 'Return a product.', type: Product })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', nullable: true },
                unit_price: { type: 'number', nullable: true },
                description: { type: 'string', nullable: true },
                qty: { type: 'number', nullable: true },
                category_id: { type: 'number', nullable: true },
                supplier_id: { type: 'number', nullable: true },
                image: {
                    type: 'string',
                    format: 'binary',
                    nullable: true
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
                ],
                fileIsRequired: false,
            }),
        )
        file?: Express.Multer.File,
    ) {
        let imageUrl: string | undefined;
        if (file) {
            imageUrl = await this.s3Service.uploadFile(file);
        }
        return this.productsService.update(+id, updateProductDto, imageUrl);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' })
    @ApiResponse({ status: 200, description: 'The product has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id);
    }
}
