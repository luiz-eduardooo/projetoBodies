import { Order } from "../entity/Order";

import { User } from "../entity/User";

import { AppDataSource } from "../data-source";

import { Request, Response } from "express";

import { OrderItem } from "../entity/OrderItem";

import { ProductVariant } from "../entity/ProductVariant";

import { item, orderItems, productVariant } from "../types/entityTypes";

import { MercadoPagoConfig, Order as MPOrder} from 'mercadopago';  // Comente Order

// Use só ordersApi.create()

const client = new MercadoPagoConfig({ accessToken: process.env.MP_BLA! });

const ordersApi = new MPOrder(client);



export const criarPedido = async (req: Request, res: Response) => {

    // 3. Recebemos os items E os dados de pagamento (formData) que o React vai mandar

    const { userId, items, paymentData } = req.body;

   

    const orderRepository = AppDataSource.getRepository(Order);

    const userRepository = AppDataSource.getRepository(User);

    const variantRepository = AppDataSource.getRepository(ProductVariant);

   

    try {



        const user = await userRepository.findOneBy({ id: userId });

        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });



        const orderItems: OrderItem[] = [];

        const buscasNoBanco = items.map((item: item) => variantRepository.findOne({ where: { id: item.variantId }, relations: ["product"] }));

        const variantesEncontradas = await Promise.all(buscasNoBanco);

       

        let total = 0;



        // 4. Calculamos o Total real no servidor (Nunca confie no total que vem do Frontend, o usuário pode alterar no navegador!)

        for (let i = 0; i < items.length; i++) {

            const itemPedido = items[i];

            const variant = variantesEncontradas[i];



            if (!variant) return res.status(404).json({ error: `Variante não encontrada!` });

            if (variant.stockQuantity < itemPedido.quantity) return res.status(400).json({ error: `Estoque insuficiente` });



            const precoReal = Number(variant.product.price);

            const desconto = Number(variant.product.discount || 0);

            const precoFinal = precoReal - (precoReal * (desconto / 100));



            const orderItem = new OrderItem();

            orderItem.variant = variant;

            orderItem.quantity = itemPedido.quantity;

            orderItem.price = precoFinal;



            orderItems.push(orderItem);

            total += orderItem.price * itemPedido.quantity;

        }



        // 5. Salva o pedido como PENDENTE no banco primeiro (caso dê erro no cartão, o pedido fica salvo)

        let order = orderRepository.create({ user, total, items: orderItems, status: "PENDING" });

        order = await orderRepository.save(order);



        // 6. A HORA DA VERDADE: Efetuar a cobrança no Mercado Pago

       

        const idempotencyKey = crypto.randomUUID();



        const mpBody = {

  type: "online",

  processing_mode: "automatic",  // ← CHAVE: modo Transparente oficial

  external_reference: `order_${order.id}`,

  total_amount: Number(total).toFixed(2),  // MP quer decimal

  payer: paymentData.payer,  // Já vem perfeito do React

  transactions: {

    payments: [{  // ← Seu paymentMethod aqui

      amount: Number(total).toFixed(2),

      payment_method: {

        id: paymentData.payment_method_id,

        type: paymentData.payment_method_id === 'pix' ? "bank_transfer" : "credit_card",

        token: paymentData.token,

        installments: Number(paymentData.installments || 1)

      }

    }]

  }

};



console.log(mpBody)

const mpResponse = await ordersApi.create({  // ← ordersApi = seu MPOrder(client)

  body: mpBody,

  requestOptions: { idempotencyKey }

});



const payment = mpResponse.transactions?.payments?.[0];
const paymentStatus = payment?.status; // 'processed'
const paymentDetail = payment?.status_detail; // 'accredited'

console.log(`Status: ${paymentStatus} | Detail: ${paymentDetail}`);

// No modelo de Orders, 'processed' com 'accredited' é o nosso 'approved'
if (paymentStatus === 'processed' && paymentDetail === 'accredited') {
    
    order.status = "PAGO";
    
    for (const item of orderItems) {
        item.variant.stockQuantity -= item.quantity;
        await variantRepository.save(item.variant);
    }
    
    await orderRepository.save(order);
    
    return res.status(201).json({ 
        message: "Pagamento creditado com sucesso!", 
        order 
    });

} else if (paymentStatus === 'rejected') {
    order.status = "REJEITADO";
    await orderRepository.save(order);
    return res.status(400).json({ error: "Pagamento recusado." });
} else {
    // Caso caia em 'pending' (aguardando boleto/pix)
    order.status = "PENDENTE_PAGAMENTO";
    await orderRepository.save(order);
    return res.status(200).json({ message: "Aguardando confirmação do pagamento.", order });
}

    } catch (error) {

        console.error("Erro no checkout:", error);

        res.status(500).json({ error: "Erro ao processar o pagamento." });

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

        res.status(500).json({ error: "Erro ao listar pedidos"})}}