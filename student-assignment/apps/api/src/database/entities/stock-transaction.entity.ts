import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Supplier } from './supplier.entity';

export enum StockTransactionType {
    IN = 'IN',
    OUT = 'OUT',
}

@Entity('stock_transaction')
export class StockTransaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'product_id' })
    product_id: number;

    @ManyToOne(() => Product, (product) => product.stockTransactions)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    quantity: number;

    @Column({
        type: 'enum',
        enum: StockTransactionType,
    })
    type: StockTransactionType;

    @Column({ name: 'order_id', nullable: true })
    order_id: number | null;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'supplier_id', nullable: true })
    supplier_id: number | null;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @CreateDateColumn()
    created_at: Date;
}
