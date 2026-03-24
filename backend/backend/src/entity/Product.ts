import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('decimal')
    price: number;

    @Column()
    imageUrl: string;

    @Column({default: 0})
    discount: number;

    @OneToMany(() => ProductVariant, (variant) => variant.product, {cascade: true})
    variants: ProductVariant[];

    get discountedPrice(): number {
        return this.price - (this.price * (this.discount / 100));
    }
}