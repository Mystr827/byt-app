async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  return res.json();
}

async function updateHouse(id, data) {
  return fetchJSON(`/api/houses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

async function deleteHouse(id) {
  await fetch(`/api/houses/${id}`, { method: 'DELETE' });
}

async function loadHouses() {
  const houses = await fetchJSON('/api/houses');
  const container = document.getElementById('app');
  container.innerHTML = `<h1>Дома</h1>`;
  const list = document.createElement('ul');
  houses.forEach(h => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = h.name;
    li.appendChild(span);

    const viewBtn = document.createElement('button');
    viewBtn.textContent = 'Детали';
    const details = document.createElement('div');
    details.className = 'details';
    details.style.display = 'none';
    details.innerHTML = `\n      <div>Адрес: ${h.address || '—'}</div>\n      <div>Этажей: ${h.floors}</div>\n      <div>Координаты: ${h.coordinates.lat}, ${h.coordinates.lon}</div>\n      <div>Комнат: ${h.rooms.length}</div>`;
    viewBtn.onclick = () => {
      details.style.display = details.style.display === 'none' ? 'block' : 'none';
    };
    li.appendChild(viewBtn);
    li.appendChild(details);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Редактировать';
    editBtn.onclick = async () => {
      const name = prompt('Новое название', h.name);
      if (!name) return;
      await updateHouse(h.id, { name });
      loadHouses();
    };
    li.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.onclick = async () => {
      if (!confirm('Удалить дом?')) return;
      await deleteHouse(h.id);
      loadHouses();
    };
    li.appendChild(delBtn);

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
