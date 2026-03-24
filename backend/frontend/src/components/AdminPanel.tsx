import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import '../css/AdminPanel.css';
import { useAuth } from '../context/AuthContext';

export function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  // Busca os produtos assim que a página carrega
  const { user, isAuthenticated, token } = useAuth(); 

  useEffect(() => {
    console.log(token)
    // 3. Trava de Segurança do Frontend: 
    // Se não estiver logado ou não for admin, chuta pra fora da página!
    if (!isAuthenticated || user?.role !== 'admin') {
      alert("Acesso restrito a administradores.");
      navigate('/'); 
      return; // Para a execução aqui
    }

    fetchProducts();
  }, [isAuthenticated, user, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3000/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este produto definitivamente?");
    
    if (confirmacao) {
      try {
        const res = await fetch(`http://localhost:3000/products/${id}`, { 
          method: 'DELETE',
          // 4. Passando o token do nosso AuthContext direto no cabeçalho!
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        
        if (res.ok) {
          setProducts(products.filter(p => p.id !== id));
          alert("Produto removido com sucesso!");
        } else {
          const errorData = await res.json();
          alert(`Erro: ${errorData.message || errorData.error}`);
        }
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Painel de Administração</h1>
          <p className="admin-subtitle">Gerencie o catálogo da Bereshit</p>
        </div>
        {/* Reaproveitamos a tela que você já criou para adicionar! */}
        <button className="btn-add-new" onClick={() => navigate('/cadastroProduct')}>
          + Novo Produto
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome da Peça</th>
              <th>Preço</th>
              <th>Estoque Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              // Calcula o estoque total somando todas as variações de cor/tamanho
              const totalStock = product.variants?.reduce((acc, v) => acc + v.stockQuantity, 0) || 0;
              
              return (
                <tr key={product.id}>
                  <td>
                    <img src={product.imageUrl} alt={product.name} className="admin-prod-img" />
                  </td>
                  <td className="admin-prod-name">{product.name}</td>
                  <td>R$ {Number(product.price).toFixed(2)}</td>
                  <td>
                    <span className={`admin-stock-badge ${totalStock < 5 ? 'low' : 'ok'}`}>
                      {totalStock} un
                    </span>
                  </td>
                  <td className="admin-actions">
                    {/* Vamos criar a lógica de edição no próximo passo! */}
                    <button 
                      className="btn-edit-admin" 
                      onClick={() => alert("Logo vamos conectar isso na tela de edição!")}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-delete-admin" 
                      onClick={() => handleDelete(product.id as string)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="admin-empty">Nenhum produto cadastrado no momento.</p>
        )}
      </div>
    </div>
  );
}