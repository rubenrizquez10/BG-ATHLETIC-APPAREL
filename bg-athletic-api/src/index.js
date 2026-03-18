import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes       from './routes/auth.js';
import productRoutes    from './routes/products.js';
import orderRoutes      from './routes/orders.js';
import userRoutes       from './routes/users.js';
import categoryRoutes   from './routes/categories.js';

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/categories', categoryRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// ── 404 ───────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
