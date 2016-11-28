require('rootpath')();

require('lib/Babel.js');

var User = require('model/User.js');

var DataBase = require('lib/DataBase.js');

DataBase.connect(function () {
  User.findOne({
    'email': 'mluberry@project.com'
  }).exec(function (err, user) {
    if (err || !user) {
      user = new User();
    }
    user.email = 'mluberry@project.com';
    user.password = 'azerty';
    user.privilege = 1;
    user.firstname = 'Matthieu';
    user.lastname = 'Luberry';
    user.locale = 'fr';
    user.activated_at = new Date();
    user.save(function (err) {
      if (err) console.error(err);
      console.log('done.');
      process.exit(0);
    });
  });
}, false);
