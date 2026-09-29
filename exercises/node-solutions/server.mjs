import http from 'node:http';

const port = 3000;

// Send a JSON response with the specified status code.
function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  // req.url is only the path and query string (e.g. "/hello?name=Alice"): give
  // it a base to parse it as a full URL.
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname !== '/hello') {
    return sendJson(res, 404, { error: 'Not found' });
  }

  // Bonus: the path exists, but only for GET.
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const name = url.searchParams.get('name') ?? 'World';
  sendJson(res, 200, { greeting: `Hello, ${name}!` });
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
