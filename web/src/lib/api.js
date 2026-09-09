import { getInitData, isInsideTelegram, getDevUser } from './telegram.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(isInsideTelegram ? { 'x-telegram-init-data': getInitData() } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`Error ${res.status} en ${path}`);
  return res.status === 204 ? null : res.json();
}

export function getMeals(filters = {}) {
  const params = new URLSearchParams(filters);
  return request(`/api/meals?${params}`);
}

export function voteMeal(mealId, valor) {
  const body = isInsideTelegram ? { valor } : { valor, dev_user_id: getDevUser().id };
  return request(`/api/meals/${mealId}/vote`, { method: 'POST', body: JSON.stringify(body) });
}

export function getStreaks() {
  return request('/api/stats/streaks');
}

export function getWeekly() {
  return request('/api/stats/weekly');
}

export function photoUrl(fotoPath) {
  return `${API_URL}/uploads/${fotoPath}`;
}
