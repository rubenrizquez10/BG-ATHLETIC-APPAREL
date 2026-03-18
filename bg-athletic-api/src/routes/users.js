import { Router } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db/connection.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/users  — admin
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// PUT /api/users/:id  — admin
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { name, email, role, status } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET name=$1, email=$2, role=$3, status=$4, updated_at=NOW()
       WHERE id=$5
       RETURNING id, name, email, role, status, created_at`,
      [name, email, role, status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// PATCH /api/users/:id/status  — admin (toggle activo/inactivo)
router.patch('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET status = CASE WHEN status='active' THEN 'inactive' ELSE 'active' END,
           updated_at = NOW()
       WHERE id=$1
       RETURNING id, name, email, role, status`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
});

// DELETE /api/users/:id  — admin
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ message: 'Usuario eliminado' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;
