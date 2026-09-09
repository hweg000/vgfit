import { Router } from 'express';
import { pool } from '../db.js';
import { telegramAuth } from '../middleware/telegramAuth.js';

export const mealsRouter = Router();

// GET /api/meals?user_id=&from=&to=
mealsRouter.get('/', async (req, res) => {
  const { user_id, from, to } = req.query;
  const conditions = [];
  const params = [];

  if (user_id) {
    conditions.push('m.user_id = ?');
    params.push(user_id);
  }
  if (from) {
    conditions.push('m.created_at >= ?');
    params.push(from);
  }
  if (to) {
    conditions.push('m.created_at <= ?');
    params.push(to);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT
       m.id, m.texto, m.foto_path, m.created_at,
       u.id AS user_id, u.username, u.first_name,
       SUM(v.valor = 'sana') AS votos_sana,
       SUM(v.valor = 'no_sana') AS votos_no_sana
     FROM meals m
     JOIN users u ON u.id = m.user_id
     LEFT JOIN votes v ON v.meal_id = m.id
     ${where}
     GROUP BY m.id
     ORDER BY m.created_at DESC`,
    params
  );

  res.json(rows);
});

// POST /api/meals/:id/vote  { valor }  (usuario se identifica via header x-telegram-init-data)
mealsRouter.post('/:id/vote', telegramAuth, async (req, res) => {
  const { id } = req.params;
  const { valor } = req.body;

  if (!['sana', 'no_sana'].includes(valor)) {
    return res.status(400).json({ error: 'valor (sana|no_sana) es requerido' });
  }

  await pool.query(
    `INSERT INTO votes (meal_id, user_id, valor)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE valor = VALUES(valor)`,
    [id, req.userId, valor]
  );

  res.status(204).end();
});
