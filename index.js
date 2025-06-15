const http = require('http');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const DB_FILE = path.join(__dirname, 'data', 'db.json');
const PORT = process.env.PORT || 3000;

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return { houses: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function serveFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

function handleApi(req, res) {
  const data = readDB();
  if (req.method === 'GET' && req.url === '/api/houses') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.houses));
    return;
  }
  if (req.method === 'POST' && req.url === '/api/houses') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const payload = body ? JSON.parse(body) : {};
      const house = {
        id: randomUUID(),
        name: payload.name || 'Дом',
        address: payload.address || '',
        coordinates: payload.coordinates || { lat: 0, lon: 0 },
        floors: payload.floors || 1,
        rooms: [],
        settings: { timezone: 'UTC', units: 'metric', language: 'ru' }
      };
      data.houses.push(house);
      writeDB(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(house));
    });
    return;
  }
  res.writeHead(404);
  res.end('Not found');
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    handleApi(req, res);
    return;
  }
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const map = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
  };
  const contentType = map[ext] || 'text/plain';
  serveFile(filePath, contentType, res);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
