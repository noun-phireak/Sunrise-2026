import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order (Checkout)' })
    @ApiResponse({ status: 201, description: 'Order created successfully.' })
    create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
        // req.user is populated by JwtAuthGuard (from Validate strategy)
        // Usually req.user contains the payload or the user object.
        // Assuming req.user.id exists.
        return this.ordersService.create(createOrderDto, req.user.id);
    }
    @Get()
    @ApiOperation({ summary: 'List all orders' })
    @ApiResponse({ status: 200, description: 'List of orders with details.' })
    findAll() {
        return this.ordersService.findAll();
    }
}
