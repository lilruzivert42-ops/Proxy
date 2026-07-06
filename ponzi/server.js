const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const rootDir = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const redirectToDashboard = (res) => {
  res.writeHead(303, { Location: '/dashboard.html' });
  res.end();
};

const server = http.createServer((req, res) => {
  const requestUrl = req.url === '/' ? '/Home.html' : req.url;
  const pathOnly = requestUrl.split('?')[0];
  const safeUrl = decodeURIComponent(pathOnly);

  // Clean routes for convenience
  const cleanRoute = (url) => url === '/register' ? '/register.html' : (url === '/signup' ? '/signup.html' : url);
  const finalSafeUrl = cleanRoute(safeUrl);
  const filePath = path.join(rootDir, finalSafeUrl);

  if (safeUrl === '/signup' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = new URLSearchParams(body);
      const fullName = data.get('fullname');
      const email = data.get('email');
      const password = data.get('password');
      console.log('Signup received for', email, 'from', fullName);
      redirectToDashboard(res);
    });
    return;
  }

  if (safeUrl === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = new URLSearchParams(body);
      const email = data.get('email');
      const password = data.get('password');
      console.log('Login received for', email);
      redirectToDashboard(res);
    });
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
