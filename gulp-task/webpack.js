module.exports = function (gulp, plugins, name, dest) {
  return function (done) {
    let config = require('../webpack.' + name + '.config.js');
    let entry = {};
    entry[name] = './src/jsx/' + name + '.jsx';
    plugins.webpack({
      'entry': entry,
      'output': {
        'filename': dest + '/[name].js'
      },
      'module': config.module,
      'resolve': config.resolve,
      'plugins': [
        new plugins.webpack.optimize.CommonsChunkPlugin({
          name: name,
          minChunks: function (module) {
            var resource = module.resource || '';
            return resource.indexOf('node_modules') >= 0;
          }
        }),
        new plugins.webpack.optimize.CommonsChunkPlugin({
          name: 'vendors',
          chunks: [name],
          minChunks: function (module) {
            var resource = module.resource || '';
            return resource.indexOf('node_modules') >= 0;
          }
        }),
        new plugins.lodashWebpackPlugin(),
        new plugins.webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|fr/),
        new plugins.webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        }),
        new plugins.webpack.optimize.DedupePlugin(),
        new plugins.webpack.optimize.OccurenceOrderPlugin(),
        new plugins.webpack.optimize.UglifyJsPlugin({
          'comments': false,
          'compress': {
            'warnings': false
          },
          'mangle': {
            'except': [
              'require',
              'react',
              'redux'
            ]
          }
        })
      ]
    }, function (err, stats) {
      if (err) throw new plugins.util.PluginError('webpack', err);
      plugins.util.log('[webpack:' + name + ']', stats.toString());
      done();
    });
  };
};
