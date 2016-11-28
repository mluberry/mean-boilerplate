require('rootpath')();

const conf = require('conf.js');

import path from 'path';

const Tools = require('lib/Tools.js');

var Engine = {
  init: (app) => {
    /*let routes = 'src/jsx/route/Front.jsx';
    app.engine('.jsx', renderer.server.create({
      'routes': require(routes),
      'routesFilePath': path.resolve(routes),
      performanceCollector: function (stats) {
        DocumentTitle.rewind();
        if (conf.debug) {
          const name = Tools.cleanRouteFormat(stats.name);
          const duration = stats.duration;
          console.log('Render [', name, '] Duration [', duration, ']');
        }
      }
    }));
    app.set('views', path.resolve('src/jsx/front/'));
    app.set('view engine', 'jsx');
    app.set('view cache', false);
    app.set('view', renderer.expressView);*/
  },
  render: (name, props, callback) => {
    /*const module = require(name);
    const element = React.createElement(module, props);
    callback(ReactDOMServer.renderToStaticMarkup(element));*/
    callback();
  },
  after: (app) => {
    /*app.use(function (err, req, res, next) {
      if (res.headersSent) {
        return next(err);
      }
      let props;
      switch (err._type) {
        case renderer.reactRouterServerErrors.MATCH_REDIRECT:
          return res.redirect(302, err.redirectLocation);
        case renderer.reactRouterServerErrors.MATCH_NOT_FOUND:
          return res.status(404).render(Tools.routeFormat(req.url));
        default:
          return res.status(500).render('/error');
      }
    });*/
  }
};

module.exports = Engine;
