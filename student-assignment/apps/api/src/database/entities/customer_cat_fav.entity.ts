import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Category } from './category.entity';

@Entity('customer_cat_fav')
export class CustomerCatFav {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_id' })
    customer_id: number;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ name: 'category_id' })
    category_id: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ default: 0 })
    hits: number;
}
