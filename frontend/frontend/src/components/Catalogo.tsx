// src/pages/Catalogo.tsx
import { useEffect, useState } from "react";
import api from "../api";
import "../css/catalogo.css"; // Importando o CSS novo

type Produto = {
  id: string;
  name: string;
  description: string;
  discountedPrice: number;
  imageUrl: string;
};

const Catalogo = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const resposta = await api.get("/products"); 
        setProdutos(resposta.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        alert("Erro ao carregar a vitrine.");
      } finally {
        setCarregando(false);
      }
    };

    buscarProdutos();
  }, []);

  if (carregando) {
    return <h2 className="catalogo-loading">Carregando novidades... 🐑</h2>;
  }

  return (
    <div className="catalogo-container">
      <h1 className="catalogo-title">Nossa Coleção</h1>
      
      <div className="catalogo-grid">
        {produtos.map((produto) => (
          <div key={produto.id} className="produto-card">
            
            <img 
              src={produto.imageUrl} 
              alt={produto.name} 
              className="produto-img" 
            />
            
            <h3 className="produto-nome">{produto.name}</h3>
            
            <p className="produto-preco">
              {produto.discountedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            
            <button className="produto-btn">
              Ver Detalhes
            </button>
          </div>
        ))}

        {produtos.length === 0 && (
          <p className="catalogo-empty">Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
};

export default Catalogo;