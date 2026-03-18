import React from 'react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.featured && <span className="featured-badge">Destacado</span>}
        {product.stock < 10 && product.stock > 0 && (
          <span className="low-stock-badge">Pocas unidades</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-stock">
          {product.stock > 0 ? (
            <span className="in-stock">En stock: {product.stock} unidades</span>
          ) : (
            <span className="out-of-stock">Agotado</span>
          )}
        </div>
        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;