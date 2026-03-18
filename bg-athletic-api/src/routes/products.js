import { Router } from 'express';
import pool from '../db/connection.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/products  — público
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.name AS category
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.active = TRUE
       ORDER BY p.featured DESC, p.created_at DESC`
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.name AS category
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.id = $1 AND p.active = TRUE`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// POST /api/products  — admin
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { name, category_id, price, stock, image_url, description, featured } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO products (name, category_id, price, stock, image_url, description, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [name, category_id, price, stock ?? 0, image_url, description, featured ?? false]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /api/products/:id  — admin
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { name, category_id, price, stock, image_url, description, featured } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE products
       SET name=$1, category_id=$2, price=$3, stock=$4,
           image_url=$5, description=$6, featured=$7, updated_at=NOW()
       WHERE id=$8
       RETURNING *`,
      [name, category_id, price, stock, image_url, description, featured, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE /api/products/:id  — admin (soft delete)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query(
      'UPDATE products SET active=FALSE, updated_at=NOW() WHERE id=$1',
      [req.params.id]
    );
    res.json({ message: 'Producto eliminado' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;
