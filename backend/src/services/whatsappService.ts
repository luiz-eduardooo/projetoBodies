import axios from 'axios';

const PHONE_ID = process.env.WA_PHONE_NUMBER_ID!;
const TOKEN = process.env.WA_TOKEN!;
const NUMERO_DESTINO = process.env.WA_NUMERO_LOJA!; // ex: 5527999999999

export const enviarMensagemPedido = async (order: any) => {
    const itens = order.items?.map((item: any) => {
        const nome = item.variant?.product?.name || 'Produto';
        const preco = Number(item.price).toFixed(2);
        return `• ${nome} x${item.quantity} — R$ ${preco}`;
    }).join('\n') || '';

    const mensagem =
`🛍️ *Novo Pedido Aprovado!*

📦 *Pedido:* #${order.id.slice(0, 8).toUpperCase()}
👤 *Cliente:* ${order.user?.name || 'Cliente'}
💰 *Total:* R$ ${Number(order.total).toFixed(2)}

📋 *Itens:*
${itens}

✅ Pagamento confirmado!`;

    try {
        await axios.post(
            `https://graph.facebook.com/v22.0/${PHONE_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                to: NUMERO_DESTINO,
                type: 'text',
                text: { body: mensagem }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("📱 WhatsApp enviado com sucesso!");
    } catch (error: any) {
        console.log("❌ Erro ao enviar WhatsApp:", error?.response?.data || error?.message);
    }
};