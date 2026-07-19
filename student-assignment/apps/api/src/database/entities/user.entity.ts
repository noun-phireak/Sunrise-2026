import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { UserType } from './user_type.entity';
import { Admin } from './admin.entity';
import { Customer } from './customer.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'type_id' })
    type_id: number;

    @ManyToOne(() => UserType, (type) => type.users)
    @JoinColumn({ name: 'type_id' })
    type: UserType;

    @Column()
    name: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ default: false })
    is_phone_verified: boolean;

    @Column({ nullable: true })
    phone_verified_at: Date;

    @Column({ nullable: true })
    phone_verified_code: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: false })
    is_email_verified: boolean;

    @Column({ nullable: true })
    email_verified_at: Date;

    @Column({ nullable: true })
    email_verified_code: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    password_last_update_at: Date;

    @Column({ nullable: true })
    password_last_updater: string;

    @Column({ default: false })
    is_notified_when_login: boolean;

    @CreateDateColumn()
    created_at: Date;

    @OneToOne(() => Admin, (admin) => admin.user)
    admin: Admin;

    @OneToOne(() => Customer, (customer) => customer.user)
    customer: Customer;
}
