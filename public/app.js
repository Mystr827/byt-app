const { HashRouter, Switch, Route, Link, useParams } = ReactRouterDOM;

async function api(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error('API error');
  return res.json();
}

function HousesPage() {
  const [houses, setHouses] = React.useState([]);
  React.useEffect(() => {
    api('/api/houses').then(setHouses);
  }, []);

  const addHouse = async () => {
    const name = prompt('Название дома');
    if (!name) return;
    const house = await api('/api/houses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    setHouses(houses.concat(house));
  };

  return React.createElement('div', null,
    React.createElement('h1', null, 'Дома'),
    React.createElement('ul', null,
      houses.map(h => React.createElement('li', { key: h.id },
        React.createElement(Link, { to: `/house/${h.id}` }, h.name)
      ))
    ),
    React.createElement('button', { onClick: addHouse }, 'Добавить дом')
  );
}

function HousePage() {
  const { id } = useParams();
  const [house, setHouse] = React.useState(null);
  const [rooms, setRooms] = React.useState([]);

  React.useEffect(() => {
    api(`/api/houses/${id}`).then(setHouse);
    api(`/api/houses/${id}/rooms`).then(setRooms);
  }, [id]);

  const addRoom = async () => {
    const name = prompt('Название комнаты');
    if (!name) return;
    const room = await api(`/api/houses/${id}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    setRooms(rooms.concat(room));
  };

  if (!house) return React.createElement('div', null, 'Загрузка...');

  return React.createElement('div', null,
    React.createElement(Link, { to: '/' }, 'Назад'),
    React.createElement('h2', null, house.name),
    React.createElement('ul', null,
      rooms.map(r => React.createElement('li', { key: r.id },
        React.createElement(Link, { to: `/house/${id}/room/${r.id}` }, r.name)
      ))
    ),
    React.createElement('button', { onClick: addRoom }, 'Добавить комнату')
  );
}

function RoomPage() {
  const { houseId, roomId } = useParams();
  const [room, setRoom] = React.useState(null);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    api(`/api/houses/${houseId}/rooms`).then(rooms => {
      const r = rooms.find(r => r.id === roomId);
      setRoom(r);
    });
    api(`/api/houses/${houseId}/rooms/${roomId}/items`).then(setItems);
  }, [houseId, roomId]);

  const addItem = async () => {
    const name = prompt('Название элемента');
    if (!name) return;
    const item = await api(`/api/houses/${houseId}/rooms/${roomId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    setItems(items.concat(item));
  };

  if (!room) return React.createElement('div', null, 'Загрузка...');

  return React.createElement('div', null,
    React.createElement(Link, { to: `/house/${houseId}` }, 'Назад'),
    React.createElement('h3', null, room.name),
    React.createElement('ul', null,
      items.map(it => React.createElement('li', { key: it.id }, it.name))
    ),
    React.createElement('button', { onClick: addItem }, 'Добавить элемент')
  );
}

function App() {
  return React.createElement(HashRouter, null,
    React.createElement(Switch, null,
      React.createElement(Route, { path: '/', exact: true, component: HousesPage }),
      React.createElement(Route, { path: '/house/:id', exact: true, component: HousePage }),
      React.createElement(Route, { path: '/house/:houseId/room/:roomId', component: RoomPage })
    )
  );
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

ReactDOM.render(React.createElement(App), document.getElementById('app'));
