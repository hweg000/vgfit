import { useEffect, useState } from 'react';
import { getMeals, voteMeal, photoUrl } from '../lib/api.js';

export function Feed() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getMeals();
    setMeals(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleVote(mealId, valor) {
    await voteMeal(mealId, valor);
    load();
  }

  if (loading) return <p>Cargando...</p>;
  if (!meals.length) return <p>Todavia no hay comidas subidas.</p>;

  return (
    <div className="feed">
      {meals.map((meal) => (
        <article className="meal-card" key={meal.id}>
          <img src={photoUrl(meal.foto_path)} alt={meal.texto} />
          <div className="meal-info">
            <strong>{meal.first_name || meal.username}</strong>
            <p>{meal.texto || <em>(sin descripción)</em>}</p>
            <time>{new Date(meal.created_at).toLocaleString()}</time>
          </div>
          <div className="meal-votes">
            <button onClick={() => handleVote(meal.id, 'sana')}>
              🥗 Sana ({meal.votos_sana || 0})
            </button>
            <button onClick={() => handleVote(meal.id, 'no_sana')}>
              🍟 No tan sana ({meal.votos_no_sana || 0})
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
