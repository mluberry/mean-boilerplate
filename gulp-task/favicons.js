module.exports = function (gulp, plugins) {
  return function () {
    return gulp.src('./src/favicon/logo.png').pipe(plugins.favicons({
      'appName': 'Sparvest',
      'appDescription': '',
      'developerName': 'Kernix',
      'developerURL': 'http://www.kernix.com/',
      'background': '#ffffff',
      'theme_color': '#337ab7',
      'path': '/public/favicon/',
      'display': 'standalone',
      'orientation': 'portrait',
      'start_url': '/?android',
      'version': '1.0',
      'lang': 'fr',
      'html': 'index.html',
      'pipeHTML': true,
      'replace': true,
      'logging': false,
      'icons': {
        'android': true,
        'appleIcon': true,
        'appleStartup': true,
        'coast': true,
        'favicons': true,
        'firefox': true,
        'windows': true,
        'yandex': false
      }
    }))
    .on('error', plugins.util.log)
    .pipe(gulp.dest('./src/favicon/build/'));
  };
};
