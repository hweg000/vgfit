import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { bot } from './bot.js';
import { mealsRouter } from './routes/meals.js';
import { statsRouter } from './routes/stats.js';
import { startReminderCron } from './cron.js';

const app = express();
app.use(cors());
app.use(express.json());

const UPLOADS_DIR = path.resolve(process.cwd(), process.env.UPLOADS_DIR || '../uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

app.use('/api/meals', mealsRouter);
app.use('/api/stats', statsRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));

bot.launch().then(() => console.log('Bot de Telegram corriendo (polling)'));
startReminderCron();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
