import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// GET /api/categories  — público
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

export default router;
