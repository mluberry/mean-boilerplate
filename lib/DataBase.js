require('rootpath')();

import conf from 'conf.js';

import mongoose from 'mongoose';

import 'model/User.js';
import 'model/Article.js';

let DataBase = {
  client: mongoose,
  connect: (callback, debug = conf.debug) => {
    DataBase.client.Promise = global.Promise;
    DataBase.client.set('debug', debug && conf.debug);
    DataBase.client.connect(conf.mongodb.connection, err => {
      if (err) {
        console.error('DataBase: Error:', err);
        return callback(err);
      }
      console.log('DataBase: Ready');
      if (callback) callback(null);
    });
  },
  close: (callback) => {
    DataBase.client.connection.close(() => {
      if (callback) callback(null);
    });
  }
};

module.exports = DataBase;
