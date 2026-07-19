import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { StocksModule } from './stocks/stocks.module';
import { OrdersModule } from './orders/orders.module';
import { SeedingService } from './database/seeding.service';
import { Category } from './database/entities/category.entity';
import { Supplier } from './database/entities/supplier.entity';
import { Status } from './database/entities/status.entity';
import { User } from './database/entities/user.entity';
import { UserType } from './database/entities/user_type.entity';
import { Customer } from './database/entities/customer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: false, // We will use migrations
    }),
    TypeOrmModule.forFeature([Category, Supplier, Status, User, UserType, Customer]),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    SuppliersModule,
    StocksModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedingService],
})
export class AppModule { }
