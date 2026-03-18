import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ShoppingCart from './components/ShoppingCart';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { products as initialProducts } from './data/products';
import { useLocalStorage } from './hooks/useLocalStorage';
import './styles/App.css';

// Simulated user data
const users = [
  { email: 'admin@bgathletic.com', password: 'admin123', name: 'Administrador', role: 'admin' },
  { email: 'cliente@bgathletic.com', password: 'cliente123', name: 'Cliente Prueba', role: 'user' }
];

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useLocalStorage('bga_products', initialProducts);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useLocalStorage('bga_orders', [
    { id: 1001, customer: 'Juan Pérez', date: '2024-02-20', total: 159.97, status: 'Entregado', items: 3 },
    { id: 1002, customer: 'María García', date: '2024-02-21', total: 89.98, status: 'En Proceso', items: 2 },
    { id: 1003, customer: 'Ana Martínez', date: '2024-02-22', total: 249.95, status: 'Pendiente', items: 5 },
    { id: 1004, customer: 'Carlos López', date: '2024-02-23', total: 79.99, status: 'Enviado', items: 1 }
  ]);
  const [usersData, setUsersData] = useLocalStorage('bga_users', [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Cliente', status: 'Activo', registeredDate: '2024-01-15' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'Cliente', status: 'Activo', registeredDate: '2024-02-20' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'Admin', status: 'Activo', registeredDate: '2024-01-10' },
    { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'Cliente', status: 'Inactivo', registeredDate: '2024-03-05' }
  ]);

  const handleAddOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      customer: orderData.fullName,
      email: orderData.email,
      date: new Date().toISOString().split('T')[0],
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'Pendiente',
      items: cartItems.length,
      shippingInfo: {
        cedula: orderData.cedula,
        shippingAgency: orderData.shippingAgency,
        city: orderData.city,
        agencyAddress: orderData.agencyAddress,
        contactNumber: orderData.contactNumber
      },
      products: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };
    
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prev.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(prev => {
        return prev.map(item => {
          if (item.id === productId) {
            return { ...item, quantity: Math.min(newQuantity, item.stock) };
          }
          return item;
        });
      });
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCartToggle = () => {
    setCartOpen(prev => !prev);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  const handleLoginClick = () => {
    setLoginOpen(true);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleRegisterClick = () => {
    setRegisterOpen(true);
  };

  const handleRegisterClose = () => {
    setRegisterOpen(false);
  };

  const handleSwitchToRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      handleLoginClose();
      if (user.role === 'admin') {
        setAdminDashboardOpen(true);
      }
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleRegister = (name, email, password) => {
    const newUser = {
      email,
      password,
      name,
      role: 'user'
    };
    users.push(newUser);
    setCurrentUser(newUser);
    handleRegisterClose();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAdminDashboardOpen(false);
  };

  const handleAdminDashboardClose = () => {
    setAdminDashboardOpen(false);
  };

  return (
    <div className="app">
      <Header 
        cartItems={cartItems} 
        onCartToggle={handleCartToggle}
        onLoginClick={handleLoginClick}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <Hero />

      <main className="main-content">
        <div className="container">
          <section id="catalog" className="catalog-section">
            <h2 className="section-title">Nuestro Catálogo</h2>
            <p className="section-description">
              Equipamiento deportivo diseñado para rendimiento y estilo
            </p>
            
            <div className="products-grid">
              {products.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>

          <section id="about" className="about-section">
            <h2 className="section-title">Sobre BG Athletic</h2>
            <div className="about-content">
              <p>
                BG Athletic Apparel se dedica a proporcionar equipamiento deportivo 
                de alta calidad para atletas de todos los niveles. Nuestra misión es 
                combinar funcionalidad, comfort y estilo en cada pieza que creamos.
              </p>
              <p>
                Trabajamos con materiales premium y colaboramos con diseñadores 
                especializados para asegurar que cada producto cumpla con las 
                más altas normas de calidad y durabilidad.
              </p>
              <div className="about-values">
                <div className="value-card">
                  <h4>Calidad Premium</h4>
                  <p>Materiales seleccionados cuidadosamente</p>
                </div>
                <div className="value-card">
                  <h4>Diseño Funcional</h4>
                  <p>Creado para rendimiento máximo</p>
                </div>
                <div className="value-card">
                  <h4>Sostenibilidad</h4>
                  <p>Prácticas éticas y responsables</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />

      <ShoppingCart
        isOpen={cartOpen}
        onClose={handleCartClose}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onAddOrder={handleAddOrder}
      />
      
      <LoginModal
        isOpen={loginOpen}
        onClose={handleLoginClose}
        onSwitchToRegister={handleSwitchToRegister}
        onLogin={handleLogin}
      />
      
      <RegisterModal
        isOpen={registerOpen}
        onClose={handleRegisterClose}
        onSwitchToLogin={handleSwitchToLogin}
        onRegister={handleRegister}
      />
      
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={handleAdminDashboardClose}
        onLogout={handleLogout}
        orders={orders}
        setOrders={setOrders}
        products={products}
        setProducts={setProducts}
        usersData={usersData}
        setUsersData={setUsersData}
      />
    </div>
  );
}

export default App;
