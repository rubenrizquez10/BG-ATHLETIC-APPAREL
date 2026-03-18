import React from 'react';
import './Header.css';

function Header({ cartItems, onCartToggle, onLoginClick, currentUser, onLogout }) {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="#" className="logo" onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            <img 
              src="/assets/logo.png" 
              alt="BG Athletic Apparel" 
              className="logo-image"
            />
          </a>
          <nav className="nav">
            <a href="#catalog" className="nav-link">Catálogo</a>
            <a href="#about" className="nav-link">Nosotros</a>
          </nav>
          <div className="header-actions">
            {currentUser ? (
              <>
                <div className="user-info">
                  <span className="user-name">{currentUser.name}</span>
                  {currentUser.role === 'admin' && (
                    <span className="admin-badge">Admin</span>
                  )}
                </div>
                <button className="logout-button" onClick={onLogout}>
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <button className="login-button" onClick={onLoginClick}>
                Iniciar Sesión
              </button>
            )}
            <div className="cart-container">
              <button className="cart-toggle" onClick={onCartToggle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span className="cart-badge">{itemCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
