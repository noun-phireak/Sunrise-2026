import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    unit_price: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    qty?: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    category_id: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    supplier_id?: number;
}
