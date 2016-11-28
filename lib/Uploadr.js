require('rootpath')();

const conf = require('conf.js');

import path from 'path';
import fs from 'fs';
import S from 'string';
import multer from 'multer';
import uniqid from 'uniqid';

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var d = new Date();
    var destination = path.join(conf.upload.path, d.getFullYear());
    fs.mkdirSync(destination);
    destination = path.join(destination, d.getMonth() + 1);
    fs.mkdirSync(destination);
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    var uid = uniqid();
    var extname = path.extname(file.originalname);
    var basename = path.basename(file.originalname, extname);
    cb(null, uid + '_' + S(basename).slugify().s + extname);
  }
});

module.exports = multer({
  'storage': storage,
  'limits': {
    'fileSize': conf.upload.limit.fileSize,
    'files': conf.upload.limit.files
  }
});
