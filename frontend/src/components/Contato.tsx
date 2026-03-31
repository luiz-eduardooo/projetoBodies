import '../css/Contato.css';

export function Contato() {
  return (
    <div className="contato-page">
      <div className="contato-header">
        <h1>Fale Conosco</h1>
        <p>Estamos aqui para ajudar! Escolha o melhor canal para falar com a nossa equipe.</p>
      </div>

      <div className="contato-container">
        <div className="contato-info-card">
          <h2>Nossos Canais de Atendimento</h2>
          <p className="contato-subtitle">
            Tem alguma dúvida, sugestão ou precisa de ajuda com seu pedido? Entre em contato direto com a gente!
          </p>

          <div className="info-grid">
            <div className="info-item">
              <span className="material-symbols-outlined">mail</span>
              <div>
                <strong>E-mail</strong>
                <p>suporte@bereshit.com.br</p>
              </div>
            </div>

            <div className="info-item">
              <span className="material-symbols-outlined">call</span>
              <div>
                <strong>Telefone / WhatsApp</strong>
                <p>(32) 9966-7442</p>
              </div>
            </div>

            <div className="info-item">
              <span className="material-symbols-outlined">schedule</span>
              <div>
                <strong>Horário de Atendimento</strong>
                <p>Segunda a Sexta, das 07h às 17h</p>
              </div>
            </div>

            <div className="info-item">
              <span className="material-symbols-outlined">location_on</span>
              <div>
                <strong>Endereço</strong>
                <p>Vermelho, 123 - Muriaé, MG</p>
              </div>
            </div>
          </div>

          <div className="contato-action">
            {/* Opcional: Um botão real que abre o WhatsApp Web! */}
            <a href="https://wa.me/553299667442" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}