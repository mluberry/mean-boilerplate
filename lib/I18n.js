var Locale = require('./Locale.js');

var areIntlLocalesSupported = require('intl-locales-supported');

if (global.Intl) {
  if (!areIntlLocalesSupported(Locale.supported)) {
    var IntlPolyfill = require('intl');
    Intl.NumberFormat   = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  }
} else {
  global.Intl = require('intl');
}
