require('rootpath')();

const conf = require('conf.js');

var path = require('path');
var express = require('express');
var helmet = require('helmet');
var forceSSL = require('express-force-ssl');
var morgan = require('morgan');
var logrotateStream = require('logrotate-stream');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var methodOverride = require('method-override');
var ipfilter = require('express-ipfilter').IpFilter;

/*var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackFrontConfig = require('webpack.front.config.js');
var webpackAdminConfig = require('webpack.admin.config.js');*/

var Locale = require('lib/Locale.js');
var DataBase = require('lib/DataBase.js');
var Passport = require('lib/Passport.js');
var Rights = require('lib/Rights.js');
var Engine = require('lib/Engine.js');
var StaticRootFile = require('lib/StaticRootFile.js');

var Scopes = {
  dev: function (app, callback) {
    /*if (!conf.debug) return callback(null);
    //
    const frontCompiler = webpack(webpackFrontConfig);
    app.use(webpackMiddleware(frontCompiler, {
      'hot': true,
      'filename': 'front.js',
      'publicPath': '/public/js/',
      'historyApiFallback': true,
      'stats': {
        'colors': true
      }
    }));
    app.use(webpackHotMiddleware(frontCompiler, {
      'log': console.log,
      'path': '/__webpack_front_hmr',
      'heartbeat': 10 * 1000
    }));
    //
    const adminCompiler = webpack(webpackAdminConfig);
    app.use(webpackMiddleware(adminCompiler, {
      'hot': true,
      'filename': 'admin.js',
      'publicPath': '/private/js/',
      'historyApiFallback': true,
      'stats': {
        'colors': true
      }
    }));
    app.use(webpackHotMiddleware(adminCompiler, {
      'log': console.log,
      'path': '/__webpack_admin_hmr',
      'heartbeat': 10 * 1000
    }));*/
    callback(null);
  },
  express: function (app, callback) {
    if (conf.ssl.enabled) {
      app.use(forceSSL);
      /* */
      app.use(helmet());
      app.use(helmet.hsts({
        'maxAge': 60 * 60 * 24 * 365 * 1000,
        'includeSubdomains': true,
        'force': true
      }));
    }
    /* */
    app.use(morgan(conf.http.log.format, {
      'stream': logrotateStream({
        'file': conf.http.log.path,
        'size': conf.http.log.size,
        'keep': conf.http.log.count
      })
    }));
    if (conf.debug) {
      app.use(morgan(conf.http.log.format));
    }
    /* */
    app.use(StaticRootFile('./public/favicon.ico'));
    /* */
    //app.use(StaticRootFile('./public/favicon/manifest.webapp'));
    /* */
    app.use(compress());
    /* */
    const publicStatic = express.static(path.resolve('public'), {
      'etag': true,
      'maxAge': '1d'
    });
    app.use('/', publicStatic); // /public original
    /* */
    app.use(session({
      'store': new MongoStore({
        'mongooseConnection': DataBase.client.connection
      }),
      'secret': 'mean is cool',
      'rolling': true,
      'resave': true,
      'saveUninitialized': true,
      'cookie': {
        'maxAge': 60 * 15 * 1000,
        'secure': conf.ssl.enabled,
        'httpOnly': true
      }
    }));
    /* */
    app.use(cookieParser());
    /* */
    app.use(Passport.initialize());
    app.use(Passport.session());
    /* */
    app.use(bodyParser.json({
      'limit': conf.http.bodyParser.limit
    }));
    app.use(bodyParser.urlencoded({
      'extended': true
    }));
    /* */
    const privateStatic = express.static(path.resolve('private'), {
      'etag': true,
      'maxAge': '1d'
    });
    app.use('/private', Rights.isAuthenticated, privateStatic);
    /* */
    app.use(methodOverride('X-HTTP-Method'));
    app.use(methodOverride('X-HTTP-Method-Override'));
    app.use(methodOverride('X-Method-Override'));
    /* */
    Locale.init(app);
    /* */
    Engine.init(app);
    /* */
    callback(null);
  },
  front: function (app, callback) {
    const routes = require('route/front.js');
    const isAuthenticated = Rights.isAuthenticated;
    /* */
    app.get('/', routes.renderHome);
    /* */
    app.get('/robots.txt', routes.renderRobots);
    app.get('/sitemap.xml', routes.renderSitemap);
    /* */
    callback(null);
  },
  after: function (app, callback) {
    const routes = require('route/front.js');
    /* */
    app.get('/*', routes.renderNotFound);
    /* */
    Engine.after(app);
    /* */
    callback(null);
  }
};

module.exports = Scopes;
