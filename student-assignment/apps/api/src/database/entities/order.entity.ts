import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { User } from './user.entity'; // For cashier
import { Status } from './status.entity';
import { PaymentMethod } from './payment_method.entity';
import { OrderDetail } from './order_detail.entity';

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_id' })
    customer_id: number;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ name: 'cashier_id', nullable: true })
    cashier_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'cashier_id' })
    cashier: User;

    @Column({ name: 'status_id' })
    status_id: number;

    @ManyToOne(() => Status, (status) => status.orders)
    @JoinColumn({ name: 'status_id' })
    status: Status;

    @Column({ name: 'payment_id', nullable: true })
    payment_id: number | null;

    @ManyToOne(() => PaymentMethod, (payment) => payment.orders)
    @JoinColumn({ name: 'payment_id' })
    payment: PaymentMethod;

    @Column('decimal', { precision: 10, scale: 2 })
    total_price: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount_to_pay: number;

    @Column({ nullable: true })
    paid_at: Date;

    @Column({ nullable: true })
    rejected_at: Date;

    @Column({ name: 'rejector_id', nullable: true })
    rejector_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'rejector_id' })
    rejector: User;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => OrderDetail, (detail) => detail.order)
    details: OrderDetail[];
}
