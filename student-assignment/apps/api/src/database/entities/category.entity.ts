import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Product, (product: Product) => product.category)
    products: Product[];
}
