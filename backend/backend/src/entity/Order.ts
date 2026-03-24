import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from "typeorm"
import { User } from "./User";
import { OrderItem } from "./OrderItem";
@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    status: string;

    @Column('decimal')
    total: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @OneToMany(() => OrderItem, (item) => item.order, {cascade: true})
    items: OrderItem[];
}