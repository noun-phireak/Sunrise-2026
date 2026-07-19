import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { StockTransaction } from './stock-transaction.entity';

@Entity('supplier')
export class Supplier {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Product, (product) => product.supplier)
    products: Product[];

    @OneToMany(() => StockTransaction, (transaction) => transaction.supplier)
    stockTransactions: StockTransaction[];
}
