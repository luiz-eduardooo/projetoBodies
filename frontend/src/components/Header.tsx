import { useState } from 'react';
import { Link } from 'react-router-dom';
import "../css/header.css";
import logoPng from "../img/logo.png";
import { useAuth } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, openCart, clearCart } = useCart();
  
  // Estado para controlar o menu do celular
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSair = () => {
    logout();
    clearCart(); // Limpa o carrinho ao sair para não misturar com outro cliente
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // A TRAVA DE SEGURANÇA: 
  // Verifica se 'user' e 'user.name' existem. Se sim, pega o primeiro nome. Se não, escreve "Admin" ou "Cliente".
  const firstName = user?.name ? user.name.split(' ')[0] : 'Visitante';

  return (
    <header>
      {/* Ícone do Menu Hambúrguer (Mobile) */}
      <div className="mobile-menu-icon" onClick={toggleMenu}>
        <span className="material-symbols-outlined">
          {isMenuOpen ? 'close' : 'menu'}
        </span>
      </div>

      {/* Logo */}
      <div className="logo-container">
        <Link to="/">
          <img src={logoPng} alt="Logo Bereshit" />
        </Link>
      </div>
      
      {/* Links de Navegação */}
      <nav id="containerHeader" className={isMenuOpen ? 'open' : ''}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/catalogo" onClick={() => setIsMenuOpen(false)}>Produtos</Link>
        <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Painel</Link> {/* Já deixei um atalho pro painel aqui! */}
      </nav>
      
      {/* Área do Usuário (Carrinho e Login) */}
      <div id="user">
        <div className="cart-icon-container" title="Carrinho de Compras" onClick={openCart}>
          <span className="material-symbols-outlined cart-icon">shopping_cart</span>
          {itemCount > 0 && (
            <span className="cart-badge">{itemCount}</span>
          )}
        </div>
        
        {isAuthenticated ? (
          <div className="user-logged">
            {/* Agora aqui não quebra mais! */}
            <span className="user-name">Olá, {firstName}</span>
            <div className="logout-btn-container" onClick={handleSair} title="Sair">
              <span className="material-symbols-outlined logout-icon">logout</span>
              <span className="logout-text">Sair</span>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
             <Link to="/login" className="login-btn">Entrar</Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header;