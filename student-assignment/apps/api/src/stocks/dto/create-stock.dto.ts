import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    product_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    supplier_id?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    sale_price?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    stock_price?: number;
}
