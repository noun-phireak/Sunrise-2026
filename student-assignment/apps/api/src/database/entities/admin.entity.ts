import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('admin')
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    user_id: number;

    @OneToOne(() => User, (user) => user.admin)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
