import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;

// Supported MIME types map
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Prevent logs polluting standard output excessively, but log requests
  console.log(`${req.method} ${req.url}`);

  // Discard query params or hash parameters
  let reqPath = req.url.split('?')[0].split('#')[0];

  // Resolve directory indexes
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Prevent directory traversal
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const absolutePath = path.join(__dirname, safePath);

  // Check if directory matches project root
  if (!absolutePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Verify file existence and type
  fs.stat(absolutePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Internal Server Error: ${err.code}`);
      }
      return;
    }

    if (stats.isDirectory()) {
      // Try to append index.html inside the directory
      const indexFallback = path.join(absolutePath, 'index.html');
      fs.stat(indexFallback, (fallbackErr, fallbackStats) => {
        if (fallbackErr || !fallbackStats.isFile()) {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('403 Forbidden: Directory Listing Denied');
        } else {
          serveFile(indexFallback, res);
        }
      });
    } else if (stats.isFile()) {
      serveFile(absolutePath, res);
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('400 Bad Request');
    }
  });
});

/**
 * Serves a file with appropriate MIME type headers.
 * @param {string} filePath
 * @param {http.ServerResponse} res
 */
function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const stream = fs.createReadStream(filePath);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  stream.on('error', (err) => {
    console.error(`ReadStream error: ${err.message}`);
    // Only write headers if not already sent
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    }
  });

  stream.pipe(res);
}

server.listen(PORT, () => {
  console.log(`Vibe Game dev server running at: http://localhost:${PORT}/`);
});
