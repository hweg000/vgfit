import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function upsertUser({ telegramId, username, firstName }) {
  await pool.query(
    `INSERT INTO users (telegram_id, username, first_name)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE username = VALUES(username), first_name = VALUES(first_name)`,
    [telegramId, username ?? null, firstName ?? null]
  );
  const [rows] = await pool.query('SELECT id FROM users WHERE telegram_id = ?', [telegramId]);
  return rows[0].id;
}
