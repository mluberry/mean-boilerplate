var S = require('string');

var _ = require('lodash');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tools = require('lib/Tools.js');

var ArticleSchema = new Schema({
  'title': {
    'type': String,
    'index': {'unique': true},
    'required': true
  },
  'description': {
    'type': String,
    'trim': true,
    'required': true
  },
  'content': {
    'type': String,
    'trim': true,
    'required': true
  },
  'author': {
    'type': Schema.Types.ObjectId,
    'ref': 'User'
  },
  'tags': [{
    'type': Schema.Types.ObjectId,
    'ref': 'Tag'
  }],
  'locale': {
    'type': String,
    'trim': true,
    'index': true,
    'required': true
  },
  'online': {
    'type': Boolean,
    'default': false
  },
  'deleted': {
    'type': Boolean,
    'default': false
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

ArticleSchema.index({'$**': 'text'});

ArticleSchema.virtual('location').get(function () {
  return '/blog/' + S(this.title).slugify().s + '/' + this._id;
});

ArticleSchema.virtual('url').get(function () {
  return Tools.url('/blog/' + S(this.title).slugify().s + '/' + this._id);
});

ArticleSchema.pre('save', function (next) {
  var article = this;
  article.updated_at = new Date();
  next();
});

ArticleSchema.methods.getMetas = function () {
  const keywords = _.map(this.tags, function (tag) {
    return tag.value;
  });
  return {
    'title': this.title,
    'description': this.description,
    'url': this.url,
    'keywords': _.join(keywords, ', '),
    'image': '',
    'type': 'article'
  };
};

module.exports = mongoose.model('Article', ArticleSchema);
