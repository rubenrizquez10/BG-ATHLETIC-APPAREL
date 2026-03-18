import React, { useEffect, useRef, useState } from 'react';
import './ShoppingCart.css';

function ShoppingCart({ isOpen, onClose, cartItems, onRemoveFromCart, onUpdateQuantity, onClearCart, onAddOrder }) {
  const cartRef = useRef(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    cedula: '',
    shippingAgency: '',
    city: '',
    agencyAddress: '',
    contactNumber: ''
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      // No cerrar si hay modales abiertos
      if (showPaymentModal || showShippingForm) {
        return;
      }
      
      if (cartRef.current && !cartRef.current.contains(event.target) && !event.target.closest('.cart-toggle')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, showPaymentModal, showShippingForm]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copiado al portapapeles');
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Confirmando pago, mostrando formulario de envío');
    setShowPaymentModal(false);
    setTimeout(() => {
      setShowShippingForm(true);
    }, 150);
  };

  const handleShippingInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    // Agregar la orden al sistema
    onAddOrder(shippingData);
    
    alert('¡Gracias! Hemos recibido tu información de envío. Nos pondremos en contacto contigo pronto.');
    setShowShippingForm(false);
    setShippingData({
      fullName: '',
      email: '',
      cedula: '',
      shippingAgency: '',
      city: '',
      agencyAddress: '',
      contactNumber: ''
    });
    onClearCart();
    onClose();
  };

  const handleCloseShippingForm = () => {
    setShowShippingForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay active">
      <div className="cart-sidebar" ref={cartRef}>
        <div className="cart-header">
          <h2>Carrito de Compras</h2>
          <button className="cart-close" onClick={onClose}>
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Tu carrito está vacío</p>
            <button className="continue-shopping" onClick={onClose}>
              Seguir Comprando
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <p className="cart-item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => onRemoveFromCart(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-price">${total.toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={onClearCart}>
                  Limpiar Carrito
                </button>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceder al Pago
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <h3>Datos de Pago Móvil</h3>
              <button className="modal-close-btn" onClick={handleClosePaymentModal}>
                ×
              </button>
            </div>
            <div className="payment-modal-content">
              <div className="payment-info-card">
                <div className="payment-info-item">
                  <span className="payment-label">Banco:</span>
                  <div className="payment-value-container">
                    <span className="payment-value">Bancamiga</span>
                    <button 
                      className="copy-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyToClipboard('Bancamiga');
                      }}
                      title="Copiar"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <div className="payment-info-item">
                  <span className="payment-label">Teléfono:</span>
                  <div className="payment-value-container">
                    <span className="payment-value">04128809632</span>
                    <button 
                      className="copy-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyToClipboard('04128809632');
                      }}
                      title="Copiar"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <div className="payment-info-item">
                  <span className="payment-label">Cédula:</span>
                  <div className="payment-value-container">
                    <span className="payment-value">31717920</span>
                    <button 
                      className="copy-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyToClipboard('31717920');
                      }}
                      title="Copiar"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <div className="payment-info-item total-amount">
                  <span className="payment-label">Monto a pagar:</span>
                  <span className="payment-value amount">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="payment-instructions">
                <p>Por favor, realiza la transferencia y envía el comprobante al número de contacto.</p>
              </div>
            </div>
            <div className="payment-modal-actions">
              <button className="payment-confirm-btn" onClick={handleConfirmPayment}>
                Ya envié el pago
              </button>
              <button className="payment-close-btn" onClick={handleClosePaymentModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showShippingForm && (
        <div className="payment-modal-overlay">
          <div className="payment-modal shipping-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <h3>Información de Envío</h3>
              <button className="modal-close-btn" onClick={handleCloseShippingForm}>
                ×
              </button>
            </div>
            <form onSubmit={handleShippingSubmit}>
              <div className="payment-modal-content">
                <div className="shipping-form">
                  <div className="form-group">
                    <label htmlFor="fullName">Nombre Completo</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={shippingData.fullName}
                      onChange={handleShippingInputChange}
                      required
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingData.email}
                      onChange={handleShippingInputChange}
                      required
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cedula">Cédula</label>
                    <input
                      type="text"
                      id="cedula"
                      name="cedula"
                      value={shippingData.cedula}
                      onChange={handleShippingInputChange}
                      required
                      placeholder="Ej: 12345678"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingAgency">Agencia de Envío</label>
                    <select
                      id="shippingAgency"
                      name="shippingAgency"
                      value={shippingData.shippingAgency}
                      onChange={handleShippingInputChange}
                      required
                    >
                      <option value="">Selecciona una agencia</option>
                      <option value="MRW">MRW</option>
                      <option value="Zoom">Zoom</option>
                      <option value="Tealca">Tealca</option>
                      <option value="Domesa">Domesa</option>
                      <option value="Otra">Otra</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">Ciudad</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingInputChange}
                      required
                      placeholder="Ingresa tu ciudad"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="agencyAddress">Dirección de Agencia</label>
                    <textarea
                      id="agencyAddress"
                      name="agencyAddress"
                      value={shippingData.agencyAddress}
                      onChange={handleShippingInputChange}
                      required
                      placeholder="Dirección completa de la agencia"
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactNumber">Número de Contacto</label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={shippingData.contactNumber}
                      onChange={handleShippingInputChange}
                      required
                      placeholder="Ej: 04121234567"
                    />
                  </div>
                </div>
              </div>
              <div className="payment-modal-actions">
                <button type="button" className="payment-close-btn" onClick={handleCloseShippingForm}>
                  Cancelar
                </button>
                <button type="submit" className="payment-confirm-btn">
                  Confirmar Envío
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingCart;