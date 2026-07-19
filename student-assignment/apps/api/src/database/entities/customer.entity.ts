import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('customer')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    user_id: number;

    @OneToOne(() => User, (user) => user.customer)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: true })
    address: string;
}
