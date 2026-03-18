import React, { useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ isOpen, onClose, onLogout, orders, setOrders, products, setProducts, usersData, setUsersData }) {
  const [activeTab, setActiveTab] = useState('products');
  const [productsData, setProductsData] = [products, setProducts];
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    featured: false
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);

  // Estado para órdenes (ahora viene de props)
  const [selectedOrder, setSelectedOrder] = useState(null);

  const categories = ['Camisetas', 'Pantalones', 'Sudadera', 'Leggings', 'Chaquetas', 'Tops', 'Zapatillas', 'Accesorios'];

  const handleProductUpdate = (productId, updates) => {
    setProductsData(prev => prev.map(product => 
      product.id === productId ? { ...product, ...updates } : product
    ));
  };

  const handleProductDelete = (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProductsData(prev => prev.filter(product => product.id !== productId));
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      ...newProduct,
      id: Date.now(),
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      featured: Boolean(newProduct.featured)
    };
    setProductsData(prev => [...prev, product]);
    setNewProduct({
      name: '',
      category: '',
      price: '',
      stock: '',
      image: '',
      description: '',
      featured: false
    });
    setImagePreview(null);
    setIsAddModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor selecciona un archivo de imagen válido');
    }
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProduct({ ...selectedProduct, image: reader.result });
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor selecciona un archivo de imagen válido');
    }
  };

  const closeEditModal = () => {
    setSelectedProduct(null);
    setEditImagePreview(null);
  };

  // Funciones para usuarios
  const handleUserUpdate = (userId, updates) => {
    setUsersData(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  const handleUserDelete = (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsersData(prev => prev.filter(user => user.id !== userId));
    }
  };

  const toggleUserStatus = (userId) => {
    setUsersData(prev => prev.map(user => 
      user.id === userId ? { ...user, status: user.status === 'Activo' ? 'Inactivo' : 'Activo' } : user
    ));
  };

  // Funciones para órdenes
  const handleOrderStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleOrderDelete = (orderId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta orden?')) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  const handleMarkAsShipped = (order) => {
    if (window.confirm(`¿Confirmar que el envío ha sido realizado para ${order.customer}?`)) {
      // Actualizar estado de la orden a "Enviado"
      handleOrderStatusUpdate(order.id, 'Enviado');
      
      // Simular envío de correo (en producción, aquí iría la llamada al backend)
      const emailData = {
        to: order.email || 'cliente@email.com', // Email del cliente
        subject: 'Tu pedido ha sido enviado - BG Athletic',
        body: `
Hola ${order.customer},

¡Buenas noticias! Tu pedido #${order.id} ha sido enviado.

Detalles del envío:
- Agencia: ${order.shippingInfo?.shippingAgency || 'N/A'}
- Ciudad: ${order.shippingInfo?.city || 'N/A'}
- Dirección: ${order.shippingInfo?.agencyAddress || 'N/A'}

Total: $${order.total.toFixed(2)}

Puedes recoger tu pedido en la agencia indicada.

Gracias por tu compra,
BG Athletic Apparel
        `
      };
      
      console.log('📧 Correo que se enviaría:', emailData);
      
      alert(`✅ Orden marcada como enviada.\n\n📧 Se enviaría un correo a: ${emailData.to}\n\nEn producción, esto enviaría un email real al cliente notificando el envío.`);
      
      // Cerrar el modal
      setSelectedOrder(null);
    }
  };

  // Funciones para reportes
  const calculateStats = () => {
    const totalProducts = productsData.length;
    const totalStock = productsData.reduce((sum, p) => sum + p.stock, 0);
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const totalUsers = usersData.length;
    const activeUsers = usersData.filter(u => u.status === 'Activo').length;
    
    return {
      totalProducts,
      totalStock,
      totalRevenue,
      totalOrders,
      totalUsers,
      activeUsers,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    };
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay active">
      <div className="admin-dashboard">
        <div className="admin-header">
          <h2>Panel de Administración</h2>
          <div className="admin-actions">
            <button className="logout-btn" onClick={onLogout}>
              Cerrar Sesión
            </button>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-sidebar">
            <button 
              className={`sidebar-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              📦 Productos
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Usuarios
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📋 Órdenes
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              📊 Reportes
            </button>
          </div>

          <div className="admin-main">
            {activeTab === 'products' && (
              <div className="products-section">
                <div className="section-header">
                  <h3>Gestión de Productos</h3>
                  <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
                    + Agregar Producto
                  </button>
                </div>

                <div className="products-grid">
                  {productsData.map(product => (
                    <div key={product.id} className="admin-product-card">
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p className="product-category">{product.category}</p>
                        <p className="product-price">${product.price.toFixed(2)}</p>
                        <p className="product-stock">Stock: {product.stock}</p>
                        {product.featured && <span className="featured-tag">Destacado</span>}
                      </div>
                      <div className="product-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => setSelectedProduct(product)}
                        >
                          Editar
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleProductDelete(product.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-section">
                <div className="section-header">
                  <h3>Gestión de Usuarios</h3>
                  <p className="section-subtitle">Total: {usersData.length} usuarios</p>
                </div>

                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Fecha Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>
                            <span className={`status-badge ${user.status.toLowerCase()}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>{user.registeredDate}</td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="edit-btn-small"
                                onClick={() => setSelectedUser(user)}
                              >
                                Editar
                              </button>
                              <button 
                                className="toggle-btn-small"
                                onClick={() => toggleUserStatus(user.id)}
                              >
                                {user.status === 'Activo' ? 'Desactivar' : 'Activar'}
                              </button>
                              <button 
                                className="delete-btn-small"
                                onClick={() => handleUserDelete(user.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <div className="section-header">
                  <h3>Gestión de Órdenes</h3>
                  <p className="section-subtitle">Total: {orders.length} órdenes</p>
                </div>

                <div className="orders-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID Orden</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.date}</td>
                          <td>{order.items}</td>
                          <td>${order.total.toFixed(2)}</td>
                          <td>
                            <select 
                              className={`status-select ${order.status.toLowerCase().replace(' ', '-')}`}
                              value={order.status}
                              onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="En Proceso">En Proceso</option>
                              <option value="Enviado">Enviado</option>
                              <option value="Entregado">Entregado</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="view-btn-small"
                                onClick={() => setSelectedOrder(order)}
                              >
                                Ver
                              </button>
                              <button 
                                className="delete-btn-small"
                                onClick={() => handleOrderDelete(order.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="reports-section">
                <div className="section-header">
                  <h3>Reportes y Estadísticas</h3>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <h4>Total Productos</h4>
                      <p className="stat-value">{calculateStats().totalProducts}</p>
                      <p className="stat-label">Stock Total: {calculateStats().totalStock}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <h4>Ingresos Totales</h4>
                      <p className="stat-value">${calculateStats().totalRevenue.toFixed(2)}</p>
                      <p className="stat-label">Promedio: ${calculateStats().avgOrderValue.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                      <h4>Total Órdenes</h4>
                      <p className="stat-value">{calculateStats().totalOrders}</p>
                      <p className="stat-label">Órdenes procesadas</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <h4>Usuarios</h4>
                      <p className="stat-value">{calculateStats().totalUsers}</p>
                      <p className="stat-label">Activos: {calculateStats().activeUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="reports-details">
                  <div className="report-card">
                    <h4>Productos Más Vendidos</h4>
                    <div className="report-list">
                      {productsData
                        .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                        .slice(0, 5)
                        .map(product => (
                          <div key={product.id} className="report-item">
                            <span>{product.name}</span>
                            <span className="report-value">${product.price.toFixed(2)}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="report-card">
                    <h4>Productos con Bajo Stock</h4>
                    <div className="report-list">
                      {productsData
                        .filter(p => p.stock < 25)
                        .sort((a, b) => a.stock - b.stock)
                        .map(product => (
                          <div key={product.id} className="report-item alert">
                            <span>{product.name}</span>
                            <span className="report-value stock-low">Stock: {product.stock}</span>
                          </div>
                        ))}
                      {productsData.filter(p => p.stock < 25).length === 0 && (
                        <p className="no-data">Todos los productos tienen stock suficiente</p>
                      )}
                    </div>
                  </div>

                  <div className="report-card">
                    <h4>Estado de Órdenes</h4>
                    <div className="report-list">
                      {['Pendiente', 'En Proceso', 'Enviado', 'Entregado'].map(status => {
                        const count = orders.filter(o => o.status === status).length;
                        return (
                          <div key={status} className="report-item">
                            <span>{status}</span>
                            <span className="report-value">{count} órdenes</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedProduct && (
          <div className="edit-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Editar Producto</h3>
                <button className="close-btn" onClick={closeEditModal}>
                  ×
                </button>
              </div>
              <form className="edit-form" onSubmit={(e) => {
                e.preventDefault();
                handleProductUpdate(selectedProduct.id, selectedProduct);
                closeEditModal();
              }}>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={selectedProduct.category}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <input
                    type="number"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={selectedProduct.stock}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Imagen del Producto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    className="file-input"
                  />
                  {(editImagePreview || selectedProduct.image) && (
                    <div className="image-preview">
                      <img src={editImagePreview || selectedProduct.image} alt="Vista previa" />
                    </div>
                  )}
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    Deja vacío para mantener la imagen actual
                  </p>
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={selectedProduct.description}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Destacado</label>
                  <input
                    type="checkbox"
                    checked={selectedProduct.featured}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, featured: e.target.checked })}
                  />
                </div>
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="delete-btn" 
                    onClick={() => {
                      handleProductDelete(selectedProduct.id);
                      closeEditModal();
                    }}
                  >
                    Eliminar Producto
                  </button>
                  <div className="modal-actions-right">
                    <button type="button" className="cancel-btn" onClick={closeEditModal}>
                      Regresar
                    </button>
                    <button type="submit" className="save-btn">
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {isAddModalOpen && (
          <div className="add-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Agregar Producto</h3>
                <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>
                  ×
                </button>
              </div>
              <form className="add-form" onSubmit={handleAddProduct}>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Imagen del Producto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required
                    className="file-input"
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Vista previa" />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Destacado</label>
                  <input
                    type="checkbox"
                    checked={newProduct.featured}
                    onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="save-btn">
                    Agregar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedUser && (
          <div className="edit-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Editar Usuario</h3>
                <button className="close-btn" onClick={() => setSelectedUser(null)}>
                  ×
                </button>
              </div>
              <form className="edit-form" onSubmit={(e) => {
                e.preventDefault();
                handleUserUpdate(selectedUser.id, selectedUser);
                setSelectedUser(null);
              }}>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    required
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                    required
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setSelectedUser(null)}>
                    Cancelar
                  </button>
                  <button type="submit" className="save-btn">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedOrder && (
          <div className="view-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Detalles de Orden #{selectedOrder.id}</h3>
                <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                  ×
                </button>
              </div>
              <div className="order-details">
                <div className="detail-row">
                  <span className="detail-label">Cliente:</span>
                  <span className="detail-value">{selectedOrder.customer}</span>
                </div>
                {selectedOrder.email && (
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedOrder.email}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Fecha:</span>
                  <span className="detail-value">{selectedOrder.date}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Items:</span>
                  <span className="detail-value">{selectedOrder.items} productos</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total:</span>
                  <span className="detail-value total">${selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Estado:</span>
                  <span className={`detail-value status-badge ${selectedOrder.status.toLowerCase().replace(' ', '-')}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                
                {selectedOrder.shippingInfo && (
                  <>
                    <div className="detail-section-title">Información de Envío</div>
                    <div className="detail-row">
                      <span className="detail-label">Cédula:</span>
                      <span className="detail-value">{selectedOrder.shippingInfo.cedula}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Agencia:</span>
                      <span className="detail-value">{selectedOrder.shippingInfo.shippingAgency}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Ciudad:</span>
                      <span className="detail-value">{selectedOrder.shippingInfo.city}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Dirección Agencia:</span>
                      <span className="detail-value">{selectedOrder.shippingInfo.agencyAddress}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Teléfono:</span>
                      <span className="detail-value">{selectedOrder.shippingInfo.contactNumber}</span>
                    </div>
                  </>
                )}

                {selectedOrder.products && (
                  <>
                    <div className="detail-section-title">Productos</div>
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="detail-row">
                        <span className="detail-label">{product.name} x{product.quantity}</span>
                        <span className="detail-value">${(product.price * product.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setSelectedOrder(null)}>
                  Cerrar
                </button>
                {selectedOrder.status !== 'Enviado' && selectedOrder.status !== 'Entregado' && (
                  <button 
                    className="ship-btn" 
                    onClick={() => handleMarkAsShipped(selectedOrder)}
                  >
                    📦 Marcar como Enviado
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;