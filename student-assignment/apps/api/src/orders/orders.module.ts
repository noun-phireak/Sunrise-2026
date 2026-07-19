import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from '../database/entities/order.entity';
import { OrderDetail } from '../database/entities/order_detail.entity';
import { Product } from '../database/entities/product.entity';
import { StockTransaction } from '../database/entities/stock-transaction.entity';
import { Status } from '../database/entities/status.entity';
import { User } from '../database/entities/user.entity';
import { Customer } from '../database/entities/customer.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Order,
            OrderDetail,
            Product,
            StockTransaction,
            Status,
            User,
            Customer
        ])
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule { }
