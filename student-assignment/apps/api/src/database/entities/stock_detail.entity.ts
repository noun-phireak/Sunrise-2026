import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Stock } from './stock.entity';
import { Product } from './product.entity';

@Entity('stock_detail')
export class StockDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'stock_id' })
    stock_id: number;

    @ManyToOne(() => Stock)
    @JoinColumn({ name: 'stock_id' })
    stock: Stock;

    @Column({ name: 'product_id' })
    product_id: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column('decimal', { precision: 10, scale: 2 })
    unit_price: number;

    @Column()
    qty: number;
}
