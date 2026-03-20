import { Order } from "../entity/Order";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { OrderItem } from "../entity/OrderItem";
import { ProductVariant } from "../entity/ProductVariant";
import { item, orderItems, productVariant } from "../types/entityTypes";




export const criarPedido = async (req: Request, res: Response) => {
    const { userId, items} = req.body as {userId:string, items:item[]};
    const orderRepository = AppDataSource.getRepository(Order);
    const userRepository = AppDataSource.getRepository(User);
    const variantRepository = AppDataSource.getRepository(ProductVariant);
    try {
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const orderItems: OrderItem[] = [];
        // Procurar promise.all
        const buscasNoBanco = items.map((item)=>{
            return variantRepository.findOne({
                where: {id: item.variantId},
                relations: ["product"]
            })
        })

        const variantesEncontradas = await Promise.all(buscasNoBanco)


        let total = 0;

        for(let i = 0; i < items.length; i++){
            const itemPedido = items[i]
            const variant = variantesEncontradas[i]
            
        
            if(!variant){
                return res.status(404).json({error: `Variante id: ${itemPedido.variantId} não encontrada!`})
            }

            if(variant.stockQuantity < itemPedido.quantity){
                return res.status(400).json({error:`Estoque insuficiente para o produto ${variant.product.name}`})
            }

            const orderItem = new OrderItem()
            orderItem.variant = variant
            orderItem.quantity = itemPedido.quantity
            orderItem.price = variant.product.discountedPrice

            orderItems.push(orderItem)

            total += orderItem.price * itemPedido.quantity
        }


        const order = orderRepository.create({ user,total , items: orderItems, status: "PENDING" });
        await orderRepository.save(order);
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar pedido" });
    }
}

export const cancelarPedido = async (req: Request, res: Response) => {
    const { id } = req.params;
    const orderRepository = AppDataSource.getRepository(Order);
    try {
        const order = await orderRepository.findOne({
            where: { id: id as string },
            relations: ["items", "items.variant"]
        });
        if (!order) {
            return res.status(404).json({ error: "Pedido não encontrado" });
        }
        if (order.status !== "PENDING") {
            return res.status(400).json({ error: "Somente pedidos pendentes podem ser cancelados" });
        }
        await orderRepository.remove(order);
        res.json({ message: "Pedido cancelado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao cancelar pedido" });
    }
}


export const listarPedidos = async (req: Request, res: Response) => {
    const orderRepository = AppDataSource.getRepository(Order);
    try {
        const orders = await orderRepository.find({
            relations: ["user", "items", "items.variant", "items.variant.product"]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar pedidos" });
    }
}

export const atualizarStatusPedido = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const orderRepository = AppDataSource.getRepository(Order);
    try {
        const order = await orderRepository.findOne({
            where: { id: id as string },
            relations: ["items", "items.variant"]
        });
        if (!order) {
            return res.status(404).json({ error: "Pedido não encontrado" });
        }
        if(order.status !== "PAGO" && status === "PAGO"){
            const variantRepository = AppDataSource.getRepository(ProductVariant);
            const variantesParaAtualizar: ProductVariant[] = [];
            for(const item of order.items) {
                const variant = await variantRepository.findOne(
                    {where: {id: item.variant.id},
                    relations: ["product"]
                });
                if(!variant) {
                    return res.status(404).json({ error: `Variante de produto com ID ${item.variant.id} não encontrada` });
                }
                if (variant.stockQuantity < item.quantity) {
                    return res.status(400).json({ 
                        error: `Opa! O produto ${variant.id} esgotou antes da confirmação do pagamento.` 
                    });
                }
                variant.stockQuantity -= item.quantity;
                variantesParaAtualizar.push(variant);
            }
            await variantRepository.save(variantesParaAtualizar);
        }
        order.status = status;
        await orderRepository.save(order);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar status do pedido" });
    }
}