import cron from 'node-cron';
import { pool } from './db.js';
import { notifyMissingToday } from './bot.js';

// Todos los dias a las 21:00, avisa quien no ha subido nada hoy
export function startReminderCron() {
  cron.schedule('0 21 * * *', async () => {
    const groupChatId = process.env.GROUP_CHAT_ID;
    if (!groupChatId) return;

    const [rows] = await pool.query(
      `SELECT u.first_name, u.username
       FROM users u
       WHERE NOT EXISTS (
         SELECT 1 FROM meals m
         WHERE m.user_id = u.id AND DATE(m.created_at) = CURDATE()
       )`
    );

    const nombres = rows.map((r) => r.first_name || r.username || 'alguien');
    await notifyMissingToday(groupChatId, nombres);
  });
}
