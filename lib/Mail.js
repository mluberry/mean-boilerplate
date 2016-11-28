require('rootpath')();

const conf = require('conf.js');

import _ from 'lodash';
import Mailjet from 'node-mailjet';

const Engine = require('lib/Engine.js');
const Tools = require('lib/Tools.js');
const I18n = require('src/jsx/lib/I18n.js');

const Styliner = new (require('styliner'))('/', {'url': Tools.url});

const Mail = {
  client: Mailjet.connect(conf.mail.api.key, conf.mail.api.secret),
  translations: {
    'fr': I18n.importMessages(require('src/i18n/translations/fr/mail.json')),
    'en': I18n.importMessages(require('src/i18n/translations/en/mail.json'))
  },
  signup: (locale, recipient, props, callback) => {
    props = _.merge({}, props, {
      'locale': locale,
      'alert': 'warning',
      'message': 'mail.signup.alert'
    });
    let data = {
      'Subject': Mail.subject(locale, 'mail.signup.subject'),
      'Recipients': [{
        'Email': recipient
      }]
    };
    Mail.render('Signup', props, data, function (data) {
      Mail.send(data, callback);
    });
  },
  recoverPassword: (locale, recipient, props, callback) => {
    props = _.merge({}, props, {
      'locale': locale,
      'alert': 'warning',
      'message': 'mail.recover.password.alert'
    });
    let data = {
      'Subject': Mail.subject(locale, 'mail.recover.password.subject'),
      'Recipients': [{
        'Email': recipient
      }]
    };
    Mail.render('RecoverPassword', props, data, function (data) {
      Mail.send(data, callback);
    });
  },
  newPassword: (locale, recipient, props, callback) => {
    props = _.merge({}, props, {
      'locale': locale,
      'alert': 'success',
      'message': 'mail.new.password.alert'
    });
    let data = {
      'Subject': Mail.subject(locale, 'mail.new.password.subject'),
      'Recipients': [{
        'Email': recipient
      }]
    };
    Mail.render('NewPassword', props, data, function (data) {
      Mail.send(data, callback);
    });
  },
  render: (template, props, data, callback) => {
    template = 'src/jsx/mail/' + template + '.jsx';
    if (!props.locale) props.locale = conf.locale.default;
    Engine.render(template, props, function (markup) {
      Styliner.processHTML(markup).then(function (html) {
        html = html.replace(/(\s\s+|\t)/g, ' ').replace(/\s,\s/g, ', ');
        data['Html-part'] = html;
        callback(data);
      });
    });
  },
  subject: (locale, id) => {
    let title = 'Sparvest';
    if (Mail.translations[locale] && Mail.translations[locale][id]) {
      title = Mail.translations[locale][id];
    }
    return title;
  },
  send: (data, callback) => {
    data = _.merge({
      'Subject': '',
      'Html-part': '',
      'Recipients': [],
      'Attachments': []
    }, data, {
      'FromEmail': conf.mail.from.email,
      'FromName': conf.mail.from.email
    });
    Mail.client.post('send').request(data).then(data => {
      if (callback) callback(null, data);
    }).catch(err => {
      if (callback) callback(err);
    });
  }
};

module.exports = Mail;
