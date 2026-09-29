const http = require('http');
const fs = require('fs');
const path = require('path');

const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
const send = (res, code, type, body) => { res.writeHead(code, { 'Content-Type': type }); res.end(body); };

http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/api/users') return send(res, 200, 'application/json', JSON.stringify(users));
  const m = url.match(/^\/api\/users\/(\d+)$/);
  if (m) {
    const u = users.find(x => x.id === Number(m[1]));
    return u ? send(res, 200, 'application/json', JSON.stringify(u))
             : send(res, 404, 'application/json', JSON.stringify({ error: 'User not found' }));
  }
  if (url === '/openapi.yaml') return send(res, 200, 'text/yaml', fs.readFileSync(path.join(__dirname, 'openapi.yaml')));
  if (url === '/' || url === '/index.html') return send(res, 200, 'text/html', fs.readFileSync(path.join(__dirname, 'index.html')));
  send(res, 404, 'text/plain', 'Not found');
}).listen(3000, () => console.log('Swagger: http://localhost:3000'));
