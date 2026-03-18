import React, { useState } from 'react';
import './LoginModal.css';

function RegisterModal({ isOpen, onClose, onSwitchToLogin, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Register submitted:', formData);
    onRegister(formData.name, formData.email, formData.password);
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
          <h2>Registrarse</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
            />
          </div>
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
              minLength="8"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength="8"
            />
          </div>
          <button type="submit" className="submit-btn">
            Registrarse
          </button>
        </form>
        <div className="modal-footer">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <a href="#" onClick={onSwitchToLogin}>
              Inicia Sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;