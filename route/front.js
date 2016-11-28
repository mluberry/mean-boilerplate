require('rootpath')();

import path from 'path';
import sm from 'sitemap';

const Tools = require('lib/Tools.js');

let FrontScope = {
  renderHome: (req, res) => {
    res.sendFile(path.join(path.resolve('public'), '/index.html'));
  },
  renderNotFound: (req, res) => {
    res.status(404).render(Tools.routeFormat(req.url));
  },
  renderRobots: (req, res) => {
    let text = 'User-agent: *';
    text += '\nSitemap: ' + Tools.url('/sitemap.xml');
    text += '\nSitemap: ' + Tools.url('/sitemap.articles.xml');
    res.set('Content-Type', 'text/plain').send(text);
  },
  renderSitemap: (req, res) => {
    const urls = [{
      'url': '/',
      'changefreq': 'daily'
    }, {
      'url': '/about',
      'changefreq': 'weekly'
    }, {
      'url': '/login',
      'changefreq': 'weekly'
    }, {
      'url': '/recover',
      'changefreq': 'weekly'
    }, {
      'url': '/signup',
      'changefreq': 'weekly'
    }, {
      'url': '/terms',
      'changefreq': 'weekly'
    }, {
      'url': '/privacy',
      'changefreq': 'weekly'
    }];
    const sitemap = sm.createSitemap({
      'hostname': Tools.url('/'),
      'cacheTime': 60 * 60 * 12 * 1000,
      'urls': urls
    });
    sitemap.toXML((err, xml) => {
      if (err) return res.status(500).end();
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    });
  }
};

module.exports = FrontScope;
