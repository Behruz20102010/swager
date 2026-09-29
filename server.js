const http = require('http');
const fs = require('fs');
const path = require('path');

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8')
);

const send = (res, code, type, body) => {
  res.writeHead(code, {
    'Content-Type': type
  });
  res.end(body);
};

http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  // Barcha userlar
  if (url === '/api/users') {
    return send(
      res,
      200,
      'application/json',
      JSON.stringify(users)
    );
  }

  // ID bo'yicha user
  const m = url.match(/^\/api\/users\/(\d+)$/);

  if (m) {
    const u = users.find(x => x.id === Number(m[1]));

    return u
      ? send(
          res,
          200,
          'application/json',
          JSON.stringify(u)
        )
      : send(
          res,
          404,
          'application/json',
          JSON.stringify({
            error: 'User not found'
          })
        );
  }

  // OpenAPI
  if (url === '/openapi.yaml') {
    return send(
      res,
      200,
      'text/yaml',
      fs.readFileSync(
        path.join(__dirname, 'openapi.yaml'),
        'utf8'
      )
    );
  }

  // Swagger UI
  if (url === '/' || url === '/index.html') {
    return send(
      res,
      200,
      'text/html',
      fs.readFileSync(
        path.join(__dirname, 'index.html'),
        'utf8'
      )
    );
  }

  send(res, 404, 'text/plain', 'Not found');

}).listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Server ishlayapti: ${process.env.PORT || 3000}`);
});