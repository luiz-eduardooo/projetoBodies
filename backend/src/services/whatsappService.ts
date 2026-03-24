

import nodemailer from 'nodemailer';
import { Order } from '../entity/Order';
import { decryptData } from '../middlewares/cryptoUtils';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

export const enviarMensagemPedido = async (order: Order) => {
    const cpfLegivel = decryptData(order.user.cpf);

    const itensHtml = order.items.map(item => `
        <tr>
            <td>${item.variant?.product?.name ?? 'Produto'}</td>
            <td>${item.quantity}</td>
            <td>R$ ${Number(item.price).toFixed(2)}</td>
        </tr>
    `).join('');

    // ✉️ Email para a LOJA
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_LOJA, // ex: loja@gmail.com
        subject: `🛒 Novo pedido #${order.id.slice(0, 8)}`,
        html: `
            <h2>Novo pedido recebido!</h2>
            <p><b>Cliente:</b> ${order.user.name}</p>
            <p><b>Telefone:</b> ${order.user.phone}
            <p><b>Email:</b> ${order.user.email}</p>
            <p><b>CPF:</b> ${cpfLegivel}</p>
            <p><b>Total:</b> R$ ${Number(order.total).toFixed(2)}</p>
            <h3>Itens:</h3>
            <table border="1" cellpadding="8">
                <thead>
                    <tr><th>Produto</th><th>Qtd</th><th>Preço</th></tr>
                </thead>
                <tbody>
                    ${itensHtml}
                </tbody>
            </table>
        `
    });

    // ✉️ Email para o CLIENTE
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: order.user.email,
        subject: `✅ Pedido #${order.id.slice(0, 8)} confirmado!`,
        html: `
            <h2>Seu pedido foi confirmado! 🎉</h2>
            <p>Olá, <b>${order.user.name}</b>!</p>
            <p>Recebemos seu pedido e em breve entraremos em contato.</p>
            <h3>Resumo:</h3>
            <table border="1" cellpadding="8">
                <thead>
                    <tr><th>Produto</th><th>Qtd</th><th>Preço</th></tr>
                </thead>
                <tbody>
                    ${itensHtml}
                </tbody>
            </table>
            <p><b>Total: R$ ${Number(order.total).toFixed(2)}</b></p>
            <br>
            <p>Obrigado pela compra! 💙</p>
        `
    });
};