import { Router } from 'express';
import { pool } from '../db.js';

export const statsRouter = Router();

// GET /api/stats/streaks -> racha de dias consecutivos subiendo comida, por usuario
statsRouter.get('/streaks', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT u.id AS user_id, u.username, u.first_name,
            DATE(m.created_at) AS dia
     FROM meals m
     JOIN users u ON u.id = m.user_id
     GROUP BY u.id, DATE(m.created_at)
     ORDER BY u.id, dia DESC`
  );

  const daysByUser = new Map();
  for (const row of rows) {
    if (!daysByUser.has(row.user_id)) {
      daysByUser.set(row.user_id, {
        user_id: row.user_id,
        username: row.username,
        first_name: row.first_name,
        dias: [],
      });
    }
    daysByUser.get(row.user_id).dias.push(row.dia);
  }

  const result = [...daysByUser.values()].map((u) => {
    let racha = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    for (const dia of u.dias) {
      const diaDate = new Date(dia);
      diaDate.setHours(0, 0, 0, 0);
      const diff = Math.round((cursor - diaDate) / 86400000);

      if (diff === 0 || diff === 1) {
        racha += 1;
        cursor = diaDate;
      } else {
        break;
      }
    }

    return {
      user_id: u.user_id,
      username: u.username,
      first_name: u.first_name,
      racha_dias: racha,
    };
  });

  res.json(result);
});

// GET /api/stats/weekly -> % de votos "sana" recibidos por usuario en la semana actual
statsRouter.get('/weekly', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT u.id AS user_id, u.username, u.first_name,
            SUM(v.valor = 'sana') AS sana,
            SUM(v.valor = 'no_sana') AS no_sana
     FROM users u
     JOIN meals m ON m.user_id = u.id
     JOIN votes v ON v.meal_id = m.id
     WHERE YEARWEEK(m.created_at, 1) = YEARWEEK(CURDATE(), 1)
     GROUP BY u.id`
  );

  const result = rows.map((r) => {
    const total = r.sana + r.no_sana;
    return {
      user_id: r.user_id,
      username: r.username,
      first_name: r.first_name,
      porcentaje_sana: total ? Math.round((r.sana / total) * 100) : null,
      total_votos: total,
    };
  });

  res.json(result);
});
