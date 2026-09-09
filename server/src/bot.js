import fs from 'node:fs';
import path from 'node:path';
import { Telegraf } from 'telegraf';
import { pool, upsertUser } from './db.js';

const UPLOADS_DIR = path.resolve(process.cwd(), process.env.UPLOADS_DIR || '../uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

export const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('photo', async (ctx) => {
  try {
    const from = ctx.from;
    const caption = ctx.message.caption?.trim() || '';

    const userId = await upsertUser({
      telegramId: from.id,
      username: from.username,
      firstName: from.first_name,
    });

    const photos = ctx.message.photo;
    const bestPhoto = photos[photos.length - 1];
    const fileLink = await ctx.telegram.getFileLink(bestPhoto.file_id);

    const fileName = `${Date.now()}_${bestPhoto.file_unique_id}.jpg`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    const response = await fetch(fileLink.href);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    await pool.query(
      'INSERT INTO meals (user_id, texto, foto_path) VALUES (?, ?, ?)',
      [userId, caption, fileName]
    );
  } catch (err) {
    console.error('Error procesando foto de comida:', err);
  }
});

export async function notifyMissingToday(chatId, names) {
  if (!names.length) return;
  const lista = names.map((n) => `- ${n}`).join('\n');
  await bot.telegram.sendMessage(
    chatId,
    `Recordatorio: hoy todavia no han subido ninguna comida:\n${lista}`
  );
}
