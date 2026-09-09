import { useEffect, useState } from 'react';
import { getStreaks, getWeekly } from '../lib/api.js';

export function Stats() {
  const [streaks, setStreaks] = useState([]);
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    getStreaks().then(setStreaks);
    getWeekly().then(setWeekly);
  }, []);

  return (
    <div className="stats">
      <section>
        <h2>Rachas</h2>
        <ul>
          {streaks.map((s) => (
            <li key={s.user_id}>
              {s.first_name || s.username}: {s.racha_dias} dia(s) seguidos
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Esta semana</h2>
        <ul>
          {weekly.map((w) => (
            <li key={w.user_id}>
              {w.first_name || w.username}: {w.porcentaje_sana ?? '—'}% comidas sanas ({w.total_votos} votos)
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
