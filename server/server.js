const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(express.static(path.join(__dirname, '../build')));

app.use(
  '/api',
  createProxyMiddleware({
    target: process.env.API_HOST ?? 'http://example.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/'
    },
  })
);

app.get('/health', function (req, res) {
  res.json({ status: 'UP' });
});

app.get('/*wildcard', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port = process.env.PORT ?? 3000;
app.listen(port, function () {
  console.info(`Server listening on http://localhost:${port}`);
});
