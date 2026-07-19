import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Product } from './product.entity';

@Entity('customer_prod_fav')
export class CustomerProdFav {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_id' })
    customer_id: number;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ name: 'product_id' })
    product_id: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ default: 0 })
    hits: number;
}
