import React, { useState } from 'react';
import './dark.css';

export default function App() {
  const [houses, setHouses] = useState([]);
  const [name, setName] = useState('');

  async function fetchHouses() {
    try {
      const res = await fetch('http://localhost:3001/api/houses');
      const data = await res.json();
      setHouses(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addHouse() {
    if (!name.trim()) return;
    try {
      const res = await fetch('http://localhost:3001/api/houses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const house = await res.json();
      setHouses([...houses, house]);
      setName('');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="app">
      <h1>Быт</h1>
      <div className="controls">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Название дома"
        />
        <button onClick={addHouse}>Добавить дом</button>
        <button onClick={fetchHouses}>Загрузить дома</button>
      </div>
      <ul>
        {houses.map(h => (
          <li key={h._id || h.name}>{h.name}</li>
        ))}
      </ul>
    </div>
  );
}
