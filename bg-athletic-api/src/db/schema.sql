-- ============================================================
-- BG Athletic Apparel - Database Schema
-- PostgreSQL
-- ============================================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  status      VARCHAR(20)  NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO categories (name) VALUES
  ('Camisetas'), ('Pantalones'), ('Sudadera'), ('Leggings'),
  ('Chaquetas'), ('Tops'), ('Zapatillas'), ('Accesorios')
ON CONFLICT DO NOTHING;

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  category_id  INT REFERENCES categories(id) ON DELETE SET NULL,
  price        NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock        INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url    TEXT,
  description  TEXT,
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id              SERIAL PRIMARY KEY,
  user_id         INT REFERENCES users(id) ON DELETE SET NULL,
  customer_name   VARCHAR(150) NOT NULL,
  customer_email  VARCHAR(150) NOT NULL,
  total           NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  status          VARCHAR(30) NOT NULL DEFAULT 'Pendiente'
                    CHECK (status IN ('Pendiente', 'En Proceso', 'Enviado', 'Entregado', 'Cancelado')),
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  INT REFERENCES products(id) ON DELETE SET NULL,
  name        VARCHAR(150) NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  quantity    INT NOT NULL CHECK (quantity > 0)
);

-- SHIPPING INFO
CREATE TABLE IF NOT EXISTS shipping_info (
  id               SERIAL PRIMARY KEY,
  order_id         INT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  cedula           VARCHAR(20)  NOT NULL,
  shipping_agency  VARCHAR(100) NOT NULL,
  city             VARCHAR(100) NOT NULL,
  agency_address   TEXT NOT NULL,
  contact_number   VARCHAR(30)  NOT NULL
);

-- ============================================================
-- Seed: default admin  (password: admin123)
-- ============================================================
INSERT INTO users (name, email, password, role) VALUES
  ('Administrador', 'admin@bgathletic.com',
   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Seed: sample products
-- ============================================================
INSERT INTO products (name, category_id, price, stock, image_url, description, featured) VALUES
  ('Camiseta Básica',      1, 19.99, 50, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop', 'Camiseta de algodón premium con corte ajustado.', TRUE),
  ('Pantalón Deportivo',   2, 39.99, 35, 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=400&h=500&fit=crop', 'Pantalón de tejido transpirable con elasticidad premium.', TRUE),
  ('Hoodie Oversized',     3, 59.99, 25, 'https://images.unsplash.com/photo-1556909114-f6e7e165161c?w=400&h=500&fit=crop', 'Sudadera oversized con capucha y bolsillo frontal.', TRUE),
  ('Leggings Compresivos', 4, 29.99, 40, 'https://images.unsplash.com/photo-1578681994432-8784a9487c76?w=400&h=500&fit=crop', 'Leggings compresivos con tecnología antideslizante.', FALSE),
  ('Chaqueta Windbreaker', 5, 79.99, 20, 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=500&fit=crop', 'Chaqueta windbreaker ligera y resistente al viento.', FALSE),
  ('Top Deportivo',        6, 24.99, 30, 'https://images.unsplash.com/photo-1583472584273-5a487a583172?w=400&h=500&fit=crop', 'Top deportivo con soporte moderado y ajuste perfecto.', FALSE),
  ('Zapatillas Running',   7, 89.99, 15, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop', 'Zapatillas de running con amortiguación premium.', FALSE),
  ('Gorra Baseball',       8, 14.99, 60, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop', 'Gorra baseball con logo estampado.', FALSE),
  ('Mochila Gym',          8, 49.99, 18, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop', 'Mochila espaciosa con compartimento para zapatillas.', FALSE)
ON CONFLICT DO NOTHING;
