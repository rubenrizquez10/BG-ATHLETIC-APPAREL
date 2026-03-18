import { Router } from 'express';
import pool from '../db/connection.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/orders  — crear orden (cliente autenticado o público)
router.post('/', async (req, res) => {
  const { customer_name, customer_email, items, shipping } = req.body;

  if (!customer_name || !customer_email || !items?.length || !shipping)
    return res.status(400).json({ error: 'Datos incompletos' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Calcular total y verificar stock
    let total = 0;
    for (const item of items) {
      const { rows } = await client.query(
        'SELECT price, stock FROM products WHERE id=$1 AND active=TRUE',
        [item.product_id]
      );
      if (!rows[0]) throw new Error(`Producto ${item.product_id} no encontrado`);
      if (rows[0].stock < item.quantity) throw new Error(`Stock insuficiente para producto ${item.product_id}`);
      total += parseFloat(rows[0].price) * item.quantity;
    }

    // Crear orden
    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (customer_name, customer_email, total)
       VALUES ($1, $2, $3) RETURNING *`,
      [customer_name, customer_email, total]
    );
    const order = orderRows[0];

    // Insertar items y descontar stock
    for (const item of items) {
      const { rows: pRows } = await client.query(
        'SELECT name, price FROM products WHERE id=$1',
        [item.product_id]
      );
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, price, quantity)
         VALUES ($1,$2,$3,$4,$5)`,
        [order.id, item.product_id, pRows[0].name, pRows[0].price, item.quantity]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1, updated_at=NOW() WHERE id=$2',
        [item.quantity, item.product_id]
      );
    }

    // Guardar info de envío
    await client.query(
      `INSERT INTO shipping_info
         (order_id, cedula, shipping_agency, city, agency_address, contact_number)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [order.id, shipping.cedula, shipping.shippingAgency,
       shipping.city, shipping.agencyAddress, shipping.contactNumber]
    );

    await client.query('COMMIT');
    res.status(201).json({ ...order, total });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// GET /api/orders  — admin: todas las órdenes
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT o.*,
              json_agg(oi.*) AS items,
              row_to_json(s.*) AS shipping_info
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN shipping_info s ON s.order_id = o.id
       GROUP BY o.id, s.id
       ORDER BY o.created_at DESC`
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

// GET /api/orders/:id  — admin
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT o.*,
              json_agg(oi.*) AS items,
              row_to_json(s.*) AS shipping_info
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN shipping_info s ON s.order_id = o.id
       WHERE o.id = $1
       GROUP BY o.id, s.id`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al obtener orden' });
  }
});

// PATCH /api/orders/:id/status  — admin
router.patch('/:id/status', authenticate, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const valid = ['Pendiente', 'En Proceso', 'Enviado', 'Entregado', 'Cancelado'];
  if (!valid.includes(status))
    return res.status(400).json({ error: 'Estado inválido' });

  try {
    const { rows } = await pool.query(
      `UPDATE orders SET status=$1, updated_at=NOW()
       WHERE id=$2 RETURNING *`,
      [status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// DELETE /api/orders/:id  — admin
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE id=$1', [req.params.id]);
    res.json({ message: 'Orden eliminada' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar orden' });
  }
});

export default router;
