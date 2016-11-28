require('rootpath')();

const conf = require('conf.js');

import locale from 'locale';

let Locale = {
  supported: ['fr', 'en'],
  countries: {
    'fr': 'FR',
    'en': 'GB'
  },
  init: (app) => {
    app.use(locale(Locale.supported));
    app.use(Locale.check);
    app.post('/locale', Locale.apply);
    if (conf.debug) app.use(Locale.inspect);
  },
  check: (req, res, next) => {
    if (req.cookies.locale) {
      req.locale = Locale.best(req.cookies.locale);
    } else if (req.session.locale) {
      req.locale = Locale.best(req.session.locale);
    }
    next();
  },
  apply: (req, res) => {
    const best = Locale.best(req.body.locale);
    req.session.locale = best;
    res.cookie('locale', best, {
      'maxAge': 60 * 60 * 24 * 365 * 1000,
      'secure': conf.ssl.enabled,
      'httpOnly': true
    }).json({'locale': best});
  },
  inspect: (req, res, next) => {
    console.log('Locale [', req.locale, ']');
    next();
  },
  best: (str) => {
    const supported = new locale.Locales(Locale.supported);
    const best = (new locale.Locales(str)).best(supported).toString();
    return best;
  },
  country: (locale) => {
    return Locale.countries[locale];
  }
};

module.exports = Locale;
