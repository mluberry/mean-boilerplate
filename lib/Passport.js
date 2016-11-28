require('rootpath')();

const conf = require('conf.js');

var LocalStrategy = require('passport-local').Strategy;

const User = require('model/User.js');

import passport from 'passport';

passport.serializeUser((user, done) => {
  done(null, user.email);
});
passport.deserializeUser((email, done) => {
  User.findOne({
    'email': email,
    'status': { '$gt': 0 }
  }).exec(done);
});
passport.use(new LocalStrategy(conf.passport.strategy, (email, password, done) => {
  process.nextTick(() => {
    User.findOne({
      'email': email,
      'status': { '$gt': 0 }
    }).exec(function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      user.comparePassword(password, (err, match) => {
        if (err || !match) return done(null, false);
        return done(null, user);
      });
    });
  });
}));

module.exports = passport;
