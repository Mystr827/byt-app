async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  return res.json();
}

async function loadHouses() {
  const houses = await fetchJSON('/api/houses');
  const container = document.getElementById('app');
  container.innerHTML = `<h1>Дома</h1>`;
  const list = document.createElement('ul');
  houses.forEach(h => {
    const li = document.createElement('li');
    li.textContent = h.name;
    list.appendChild(li);
  });
  container.appendChild(list);
  const btn = document.createElement('button');
  btn.textContent = 'Добавить дом';
  btn.onclick = async () => {
    const name = prompt('Название дома');
    if (!name) return;
    await fetchJSON('/api/houses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    loadHouses();
  };
  container.appendChild(btn);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

loadHouses();
