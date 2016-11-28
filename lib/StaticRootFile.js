import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mime from 'mime';

function StaticRootFileMiddleware (filepath, options) {
  options = options || {};
  if (!filepath) throw new Error('StaticFile: No path provided');
  let maxAge = options.maxAge || 86400000;
  let data = fs.readFileSync(filepath);
  let headers = {
    'Content-Type': options.mimeType || mime.lookup(filepath),
    'Content-Length': data.length,
    'ETag': '"' + crypto.createHash('md5').update(data).digest('hex') + '"',
    'Cache-Control': 'public, max-age=' + (maxAge / 1000)
  };
  return function middleware (req, res, next) {
    if (('/' + path.basename(filepath)) !== req.url) return next();
    res.writeHead(200, headers);
    res.end(data);
  };
}

module.exports = StaticRootFileMiddleware;
