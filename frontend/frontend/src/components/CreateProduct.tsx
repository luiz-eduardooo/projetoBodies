import React, { useState } from 'react';
// Importe a sua instância do axios configurada (ex: api.ts)
// import { api } from '../services/api'; 
import api from '../api';

interface Variant {
  color: string;
  size: string;
  stockQuantity: number;
}

export default function CreateProduct() {
  // Estados dos campos de texto
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('0');
  
  // Estado da imagem
  const [image, setImage] = useState<File | null>(null);

  // Estado das variantes
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variantInput, setVariantInput] = useState<Variant>({ color: '', size: '', stockQuantity: 0 });

  // Função para adicionar variante na lista antes de salvar
  const handleAddVariant = () => {
    if (!variantInput.color || !variantInput.size || variantInput.stockQuantity <= 0) {
      alert("Preencha cor, tamanho e um estoque maior que zero!");
      return;
    }
    setVariants([...variants, variantInput]);
    setVariantInput({ color: '', size: '', stockQuantity: 0 }); // Limpa os campos da variante
  };

  // Função principal para enviar os dados para o Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Por favor, selecione uma imagem para o body.");
      return;
    }

    if (variants.length === 0) {
      alert("Adicione pelo menos uma variante (tamanho/cor)!");
      return;
    }

    // 1. Criamos o FormData (obrigatório por causa da imagem)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('discount', discount);
    
    // 2. O Segredo: Transformamos o array de variantes em String!
    formData.append('variants', JSON.stringify(variants));
    
    // 3. Adicionamos a imagem
    formData.append('image', image);

    try {
      // Troque pela URL da sua API ou use a sua instância configurada
      const response = await api.post('http://localhost:3000/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Authorization': `Bearer ${seuTokenDeAdmin}` -> Descomente se a rota exigir token agora
        }
      });
      
      alert("Produto criado com sucesso na Bereshit!");
      console.log("Resposta:", response.data);
      
      // Limpar formulário se quiser...
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert("Erro ao criar produto. Olhe o console.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Cadastrar Novo Body</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <input type="text" placeholder="Nome do Produto" value={name} onChange={e => setName(e.target.value)} required />
        <textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="number" step="0.01" placeholder="Preço (ex: 149.90)" value={price} onChange={e => setPrice(e.target.value)} required />
        <input type="number" placeholder="Desconto (%)" value={discount} onChange={e => setDiscount(e.target.value)} />
        
        {/* Input de Arquivo para a Imagem */}
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files ? e.target.files[0] : null)} required />

        <hr />

        {/* Seção de Variantes */}
        <h3>Variantes (Cor e Tamanho)</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="Cor (ex: Preto)" value={variantInput.color} onChange={e => setVariantInput({...variantInput, color: e.target.value})} />
          <input type="text" placeholder="Tamanho (ex: P)" value={variantInput.size} onChange={e => setVariantInput({...variantInput, size: e.target.value})} />
          <input type="number" placeholder="Estoque" value={variantInput.stockQuantity || ''} onChange={e => setVariantInput({...variantInput, stockQuantity: Number(e.target.value)})} />
          <button type="button" onClick={handleAddVariant}>Adicionar Variante</button>
        </div>

        {/* Lista de variantes adicionadas */}
        <ul>
          {variants.map((v, index) => (
            <li key={index}>{v.color} - Tamanho {v.size} (Estoque: {v.stockQuantity})</li>
          ))}
        </ul>

        <hr />

        <button type="submit" style={{ padding: '10px', background: 'black', color: 'white', cursor: 'pointer' }}>
          Salvar Produto
        </button>
      </form>
    </div>
  );
}