import { Link } from "react-router-dom"; // Usando Link para não recarregar a página
import "../css/footer.css";
import logoPng from "../img/logo.png"; // Vamos puxar a logo para o rodapé também!

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* Coluna 1: Marca e Missão */}
        <div className="footer-column brand-column">
          <img src={logoPng} alt="Logo Bereshit" className="footer-logo" />
          <p className="brand-description">
            Nascemos da paixão por vestir bem e da vontade de entregar qualidade de verdade. Vista-se de você mesmo. Vista BereShit.
          </p>
        </div>

        {/* Coluna 2: Acesso Rápido */}
        <div className="footer-column">
          <h3>Acesso Rápido</h3>
          <Link to="/">Home</Link>
          <Link to="/catalogo">Catálogo de Produtos</Link>
          <Link to="/login">Minha Conta</Link>
        </div>

        {/* Coluna 3: Contato e Redes (Infos do Manual) */}
        <div className="footer-column">
          <h3>Fale Conosco</h3>
          <div className="contact-info">
            <span className="material-symbols-outlined">phone_iphone</span>
            <p>(32) 9906-3510</p>
          </div>
          <div className="contact-info">
            <span className="material-symbols-outlined">location_on</span>
            <p>Rua Alberto Cerqueira</p>
          </div>
          <div className="contact-info">
            <span className="material-symbols-outlined">alternate_email</span>
            <p>@bereshit.oficial</p>
          </div>
        </div>

      </div>
      
      {/* Direitos Autorais */}
      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} BereShit - Fábrica de Vestuário. Todos os direitos reservados.</p>
        <p className="footer-credits">Desenvolvido com dedicação.</p>
      </div>
    </footer>
  );
};

export default Footer;