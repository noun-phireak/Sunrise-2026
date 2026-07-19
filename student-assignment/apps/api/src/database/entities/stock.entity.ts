import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Supplier } from './supplier.entity';
import { StockDetail } from './stock_detail.entity';
import { Status } from './status.entity';

@Entity('stock')
export class Stock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'stocker_id' })
    stocker_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'stocker_id' })
    stocker: User;

    @Column({ name: 'supplier_id' })
    supplier_id: number;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @Column()
    code: string;

    @Column({ name: 'status_id' })
    status_id: number;

    @ManyToOne(() => Status)
    @JoinColumn({ name: 'status_id' })
    status: Status;

    @OneToMany(() => StockDetail, (detail) => detail.stock)
    details: StockDetail[];

    @Column('decimal', { precision: 10, scale: 2 })

    @Column('decimal', { precision: 10, scale: 2 })
    total_price: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    sale_price: number;

    @Column('decimal', { precision: 10, scale: 2 })
    stock_price: number;

    @Column()
    requested_at: Date;
}
