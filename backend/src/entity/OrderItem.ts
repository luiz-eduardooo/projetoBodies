import { PrimaryGeneratedColumn, } from "typeorm/decorator/columns/PrimaryGeneratedColumn.js";
import { Entity } from "typeorm/decorator/entity/Entity.js";
import { ManyToOne } from "typeorm/decorator/relations/ManyToOne.js";
import { Order } from "./Order";
import { Column } from "typeorm/decorator/columns/Column.js";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    quantity: number; 

    @Column('decimal')
    price: number; 

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;

    @ManyToOne(() => ProductVariant) 
    variant: ProductVariant;
}