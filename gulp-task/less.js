module.exports = function (gulp, plugins, name, dest, reload) {
  return function () {
    return gulp.src('./src/less/' + name + '.less')
      .pipe(plugins.plumber({
        errorHandler: function (err) {
          console.dir(err, {
            'showHidden': true,
            'depth': null,
            'colors': true
          });
          this.emit('end');
        }
      }))
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.less({
        'plugins': [
          new plugins.lessPluginAutoprefix({
            'browsers': ['last 2 versions']
          })
        ]
      }))
      .pipe(plugins.cleanCss())
      .pipe(plugins.rename(name + '.css'))
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest(dest))
      .pipe(plugins.if(reload, plugins.livereload()));
  };
};
