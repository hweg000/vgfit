import crypto from 'node:crypto';
import { upsertUser } from '../db.js';

function validateInitData(initData, botToken) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (computedHash !== hash) return null;

  const userRaw = params.get('user');
  return userRaw ? JSON.parse(userRaw) : null;
}

// Valida el initData que manda la Mini App de Telegram y adjunta req.userId
// (id interno en nuestra base, no el telegram_id) al request.
export async function telegramAuth(req, res, next) {
  const initData = req.header('x-telegram-init-data');

  if (initData) {
    const user = validateInitData(initData, process.env.BOT_TOKEN);
    if (!user) return res.status(401).json({ error: 'initData invalido' });

    req.userId = await upsertUser({
      telegramId: user.id,
      username: user.username,
      firstName: user.first_name,
    });
    return next();
  }

  // Bypass solo para desarrollo local fuera de Telegram (probar en el navegador).
  if (process.env.ALLOW_DEV_AUTH === 'true' && req.body?.dev_user_id) {
    req.userId = Number(req.body.dev_user_id);
    return next();
  }

  return res.status(401).json({ error: 'Falta x-telegram-init-data' });
}
