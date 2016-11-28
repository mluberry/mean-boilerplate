var _ = require('lodash');

module.exports = function (gulp, plugins) {
  return function (done) {
    const pageres = new plugins.pageres({'delay': 5});
    const sizes = [
      'iPhone 5s',
      'iPhone 6',
      'iPhone 6 Plus',
      'iPad Air',
      '1280x1024'
    ];
    const urls = [
      '/',
      '/about',
      '/blog',
      '/login',
      '/login/recover',
      '/signup',
      '/terms',
      '/privacy'
    ];
    _.each(urls, function (url) {
      pageres.src('https://staging.sparvest.com' + url, sizes, {
        'crop': false,
        'scale': '2'
      });
    });
    pageres.dest('./src/screenshot/').run().then(function () {
      done();
    });
  };
};
