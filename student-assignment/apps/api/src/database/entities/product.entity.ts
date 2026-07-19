import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Supplier } from './supplier.entity';
import { StockTransaction } from './stock-transaction.entity';
import { OrderDetail } from './order_detail.entity';

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'category_id' })
    category_id: number;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'supplier_id', nullable: true })
    supplier_id: number | null;

    @ManyToOne(() => Supplier, (supplier) => supplier.products)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    unit_price: number;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: 0 })
    qty: number;

    @OneToMany(() => StockTransaction, (transaction) => transaction.product)
    stockTransactions: StockTransaction[];

    @OneToMany(() => OrderDetail, (detail) => detail.product)
    orderDetails: OrderDetail[];
}
