import { useState } from 'react';
import { Feed } from './pages/Feed.jsx';
import { Stats } from './pages/Stats.jsx';
import './App.css';

function App() {
  const [tab, setTab] = useState('feed');

  return (
    <div className="app">
      <header>
        <h1>Comidas del grupo</h1>
        <nav>
          <button className={tab === 'feed' ? 'active' : ''} onClick={() => setTab('feed')}>
            Feed
          </button>
          <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>
            Stats
          </button>
        </nav>
      </header>

      <main>{tab === 'feed' ? <Feed /> : <Stats />}</main>
    </div>
  );
}

export default App;
