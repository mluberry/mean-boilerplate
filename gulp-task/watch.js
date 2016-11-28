require('rootpath')();

const conf = require('conf.js');

var fs = require('fs');

module.exports = {
  front: function (gulp, plugins) {
    return function () {
      plugins.livereload.listen({
        'key': fs.readFileSync(conf.https.key, 'utf8'),
        'cert': fs.readFileSync(conf.https.cert, 'utf8')
      });
      gulp.watch([
        './src/less/front.less',
        './src/less/front/*.less',
        './src/less/front/**/*.less'
      ], function () {
        require('./less')(gulp, plugins, 'front', './public/css', true)();
      });
    };
  },
  admin: function (gulp, plugins) {
    return function () {
      plugins.livereload.listen({
        'key': fs.readFileSync(conf.https.key, 'utf8'),
        'cert': fs.readFileSync(conf.https.cert, 'utf8')
      });
      gulp.watch([
        './src/less/admin.less',
        './src/less/admin/*.less',
        './src/less/admin/**/*.less'
      ], function () {
        require('./less')(gulp, plugins, 'admin', './private/css', true)();
      });
    };
  },
  mobile: function (gulp, plugins) {
    return function () {
      gulp.watch([
        './src/less/mobile.less',
        './src/less/mobile/*.less',
        './src/less/mobile/**/*.less'
      ], ['less:mobile']);
      gulp.watch([
        './src/jsx/mobile.jsx',
        './src/jsx/**/*.jsx'
      ], function () {
        require('./less')(gulp, plugins, 'mobile', './src/mobile/sparvest/www/css', false);
      });
    };
  }
};
