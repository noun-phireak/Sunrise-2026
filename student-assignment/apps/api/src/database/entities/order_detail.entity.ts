import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_detail')
export class OrderDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'order_id' })
    order_id: number;

    @ManyToOne(() => Order, (order) => order.details)
    @JoinColumn({ name: 'order_id' })
    order: Order;

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
