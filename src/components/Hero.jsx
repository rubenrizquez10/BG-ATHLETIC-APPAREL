import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-eyebrow">Nueva Colección 2026</p>
          <h2 className="hero-title">
            <span className="highlight">Estética</span>
            <span className="highlight">Perfecta</span>
            <span className="highlight">Para Ti</span>
          </h2>
          <p className="hero-description">
            Equipamiento deportivo diseñado para maximizar tu rendimiento.
            Confort, durabilidad y estilo en cada pieza.
          </p>
          <div className="hero-cta-group">
            <a href="#catalog" className="cta-button">
              Ver Catálogo
            </a>
            <a href="#about" className="cta-button-secondary">
              Nuestra Historia
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <div className="placeholder-content">
              <p className="placeholder-text">BG Athletic</p>
              <p className="placeholder-year">2026</p>
              <img 
                src="/assets/logo-login.jpeg" 
                alt="BG Athletic Apparel" 
                className="hero-logo-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
