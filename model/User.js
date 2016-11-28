require('rootpath')();

const conf = require('conf.js');

import _ from 'lodash';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  'email': {
    'type': String,
    'trim': true,
    'index': {'unique': true},
    'required': true
  },
  'password': {
    'type': String,
    'required': true
  },
  'password_activation': {
    'type': String,
    'trim': true
  },
  'pincode': {
    'type': String,
    'trim': true
  },
  'pincode_activation': {
    'type': String,
    'trim': true
  },
  'privilege': {
    'type': Number,
    'index': true,
    'default': 0
  },
  'locale': {
    'type': String,
    'default': 'fr'
  },
  'firstname': {
    'type': String,
    'trim': true
  },
  'lastname': {
    'type': String,
    'trim': true
  },
  'tel': {
    'type': String,
    'trim': true
  },
  'address': {
    'type': String,
    'trim': true
  },
  'zipcode': {
    'type': String,
    'trim': true
  },
  'city': {
    'type': String,
    'trim': true
  },
  'country': {
    'type': String,
    'trim': true
  },
  'birthday': {
    'type': Date
  },
  'question': {
    'type': String,
    'trim': true
  },
  'answer': {
    'type': String,
    'trim': true
  },
  'status': {
    'type': Number,
    'index': true,
    'default': 1
  },
  'activation': {
    'type': String,
    'trim': true
  },
  'activated_at': {
    'type': Date,
    'index': true
  },
  'agreed_at': {
    'type': Date,
    'index': true
  },
  'created_at': {
    'type': Date,
    'default': Date.now,
    'index': true
  },
  'updated_at': {
    'type': Date,
    'default': Date.now,
    'index': true
  }
}, {
  'id': false,
  'toObject': {
    'virtuals': true
  },
  'toJSON': {
    'virtuals': true
  }
});

UserSchema.index({
  'email': 'text',
  'firstname': 'text',
  'lastname': 'text'
});

UserSchema.post('init', () => {
  this._original = this.toObject();
});

UserSchema.virtual('fullname').get(() => {
  if (this.firstname && this.lastname) {
    return this.firstname + ' ' + this.lastname;
  }
  return this.email;
});

UserSchema.virtual('hasValidEmail').get(() => {
  return Boolean(this.activated_at);
});

UserSchema.virtual('hasAgreed').get(() => {
  return Boolean(this.agreed_at);
});

UserSchema.virtual('hasIdentity').get(() => {
  return Boolean(this.lastname) &&
         Boolean(this.firstname) &&
         Boolean(this.tel);
});

UserSchema.virtual('hasAddress').get(() => {
  return Boolean(this.address) &&
         Boolean(this.zipcode) &&
         Boolean(this.city) &&
         Boolean(this.country);
});

UserSchema.virtual('hasAge').get(() => {
  return Boolean(this.birthday);
});

UserSchema.virtual('hasSecret').get(() => {
  return Boolean(this.question) &&
         Boolean(this.answer);
});

UserSchema.pre('save', (next) => {
  let user = this;
  user.updated_at = new Date();
  if (!user.settings) user.settings = {};
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(conf.bcrypt.salt, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = (candidatePassword, callback) => {
  const user = this;
  bcrypt.compare(candidatePassword, user.password, (err, match) => {
    if (err) return callback(err);
    callback(null, match);
  });
};

UserSchema.methods.export = () => {
  const user = this;
  return _.omit(user.toObject(), [
    '__v',
    'activation',
    'items',
    'password',
    'privilege',
    'status',
    'answer',
    'token'
  ]);
};

UserSchema.methods.getItems = () => {
  const user = this;
  let items = [];
  _.each(user.items, (item) => {
    item.push(item.id);
  });
  return items;
};

UserSchema.methods.getAccounts = () => {
  const user = this;
  let accounts = [];
  _.each(user.items, (item) => {
    _.each(item.accounts, (account) => {
      accounts.push(account.id);
    });
  });
  return accounts;
};

module.exports = mongoose.model('User', UserSchema);
