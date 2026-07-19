import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { StockTransaction } from '../database/entities/stock-transaction.entity';
import { Product } from '../database/entities/product.entity';
import { Stock } from '../database/entities/stock.entity';
import { StockDetail } from '../database/entities/stock_detail.entity';
import { Status } from '../database/entities/status.entity';

@Module({
    imports: [TypeOrmModule.forFeature([StockTransaction, Product, Stock, StockDetail, Status])],
    controllers: [StocksController],
    providers: [StocksService],
    exports: [StocksService],
})
export class StocksModule { }
