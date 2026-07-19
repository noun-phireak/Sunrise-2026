import { IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    product_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ type: [CreateOrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    customer_id?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    payment_id?: number;
}
