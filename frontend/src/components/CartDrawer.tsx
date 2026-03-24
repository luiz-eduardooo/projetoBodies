import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/CartDrawer.css';

export const CartDrawer = () => {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user, isAuthenticated } = useAuth(); 
  const navigate = useNavigate();
  const handleFinalizarCompra = () => {
    closeCart(); 

    if (!isAuthenticated || !user) {
      alert("Você precisa fazer login para finalizar a compra!");
      navigate('/login'); 
    } else {
      navigate('/checkout'); 
    }
  };

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={closeCart}></div>}

      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Seu Carrinho</h2>
          <span className="material-symbols-outlined close-btn" onClick={closeCart}>
            close
          </span>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">Seu carrinho está vazio.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h4 style={{ fontSize: '14px' }}>{item.name}</h4>
                  <p>R$ {item.price.toFixed(2)}</p>
                </div>
                
                <div className="item-actions">
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    
                    <input 
                      type="number"
                      className="cart-qtd-input"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          updateQuantity(item.id, val);
                        }
                      }}
                      onBlur={(e) => {
                        if (!e.target.value || parseInt(e.target.value) <= 0) {
                          updateQuantity(item.id, 1);
                        }
                      }}
                    />
                    
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <span 
                    className="material-symbols-outlined remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remover"
                  >
                    delete
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="total">
              <span>Total:</span>
              <span>R$ {cartTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleFinalizarCompra}>
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
};