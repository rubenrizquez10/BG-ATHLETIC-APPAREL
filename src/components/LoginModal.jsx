import React, { useState } from 'react';
import './LoginModal.css';

function LoginModal({ isOpen, onClose, onSwitchToRegister, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    onLogin(formData.email, formData.password);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-logo">
          <img 
            src="/assets/logo-login.jpeg" 
            alt="BG Athletic Apparel" 
            className="modal-logo-image"
          />
        </div>
        <div className="modal-header">
          <h2>Iniciar Sesión</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="submit-btn">
            Iniciar Sesión
          </button>
        </form>
        <div className="modal-footer">
          <p>
            ¿No tienes una cuenta?{' '}
            <a href="#" onClick={onSwitchToRegister}>
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;