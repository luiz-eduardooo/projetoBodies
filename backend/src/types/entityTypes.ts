import { Order } from "../entity/Order"
import { OrderItem } from "../entity/OrderItem"
import { Product } from "../entity/Product"
import { ProductVariant } from "../entity/ProductVariant"


export type order = {
    id:string,
    status:string,
    total:number,
    createdAt:Date,
    user:user,
    items:OrderItem[]
}

export type user = {
    id:string,
    name:string,
    email:string,
    password:string,
    orders: Order[]
}

export type orderItems = {
    id:string,
    quantity:number,
    price:number,
    order:order,
    variant:ProductVariant
}

export type productVariant = {
    id:string,
    color:string,
    size:string,
    stockQuantity:number,
    product:Product
}

export type product = {
    id:string,
    name:string,
    description:string,
    price:number,
    imageUrl:string,
    discount:number,
    variants: ProductVariant[]
}

export type item = {
    variantId: string,
    quantity: number
}

export type ProductRequestDTO = {
    name: string;
    description: string;
    price: string;       
    discount?: string;   
    variants: string;   
}