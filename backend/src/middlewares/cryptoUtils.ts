import crypto from 'crypto';

// Sua chave precisa ter 32 caracteres
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'chave-secreta-padrao-com-32-char'; 

// Em vez de aleatório, pegamos os 16 primeiros caracteres da sua própria chave secreta!
// Assim, o IV fica fixo, secreto e seguro.
const FIXED_IV = Buffer.from(ENCRYPTION_KEY.substring(0, 16));

export function encryptData(text: string) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), FIXED_IV);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // Agora só retorna o texto criptografado puro (sem o IV grudado nele)
    return encrypted.toString('hex');
}

export function decryptData(text: string) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), FIXED_IV);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
}