#!/usr/bin/env node
/**
 * 简易本地预览服务器
 * 用于本地预览构建后的 _site 目录
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const ROOT = path.join(__dirname, '..', '_site');
const BASEURL = '/zhinenganquanmao';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url;

  // 去掉 baseurl 前缀
  if (urlPath.startsWith(BASEURL)) {
    urlPath = urlPath.slice(BASEURL.length);
  }

  // 默认首页
  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  }

  // 去掉查询参数
  urlPath = urlPath.split('?')[0];

  const filePath = path.join(ROOT, urlPath);
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 尝试 .html 后缀
      if (!ext) {
        fs.readFile(filePath + '.html', (err2, data2) => {
          if (!err2) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data2);
            return;
          }
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<h1>404 Not Found</h1>');
        });
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n🌐 本地预览服务器已启动: http://localhost:${PORT}${BASEURL}/\n`);
});
