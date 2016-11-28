require('rootpath')();

require('lib/Babel.js');
require('lib/I18n.js');

const conf = require('conf.js');

import async from 'async';
import fs from 'fs';
import http from 'http';
import spdy from 'spdy';
import express from 'express';

const DataBase = require('lib/DataBase.js');
const Scopes = require('lib/Scopes.js');

let app = express();

async.series([
  (next) => DataBase.connect(next),
  (next) => Scopes.dev(app, next),
  (next) => Scopes.express(app, next),
  (next) => Scopes.front(app, next),
  (next) => Scopes.after(app, next)
], () => {
  http.createServer(app).listen(conf.http.port, () => {
    console.log('Server: ' + conf.http.url + ':' + conf.http.port);
  });
  if (conf.ssl.enabled) {
    spdy.createServer({
      'key': fs.readFileSync(conf.https.key, 'utf8'),
      'cert': fs.readFileSync(conf.https.cert, 'utf8'),
      'ca': fs.readFileSync(conf.https.ca, 'utf8'),
      'ciphers': conf.https.ciphers.join(':')
    }, app).listen(conf.https.port, () => {
      console.log(conf.https.url);
    });
  }
});
