require('rootpath')();

const conf = require('conf.js');

import _ from 'lodash';
import url from 'url';

const Tools = {
  url: (path) => {
    if (conf.ssl.enabled) {
      return url.resolve(conf.https.url, path);
    }
    return url.resolve(conf.http.url, path);
  },
  routeFormat: (urlString) => {
    const urlObject = url.parse(urlString);
    let route = urlObject.pathname;
    if (urlObject.query && urlObject.query.length > 0) {
      route += '?' + urlObject.query;
    }
    return route;
  },
  cleanRouteFormat: (urlString) => {
    const urlObject = url.parse(urlString);
    return urlObject.pathname;
  },
  validatePassword: (password) => {
    return Boolean(password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/) && password.length >= 8);
  },
  validatePincode: (pincode) => {
    return Boolean(pincode.match(/^\d+$/) && pincode.length === 4);
  }
};

module.exports = Tools;
