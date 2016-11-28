module.exports = {
  'debug': process.env.NODE_ENV !== 'production',
  'ips': {
    'admin': [ '127.0.0.1' ]
  },
  'mongodb': {
    'connection': 'mongodb://mongodb/project'
  },
  'locale': {
    'default': 'fr'
  },
  'ssl': {
    'enabled': false
  },
  'bcrypt': {
    'salt': 10
  },
  'analytics': {
    'id': ''
  },
  'upload': {
    'limit': {
      'fileSize': 10 * 1000 * 1000,
      'files': 1
    },
    'path': 'private/upload/'
  },
  'http': {
    'port': 3000, // 80
    'host': 'dev.project.com',
    'url': 'http://dev.project.com',
    'bodyParser': {
      'limit': '16mb'
    },
    'log': {
      'format': 'combined',
      'path': 'log/access.log',
      'size': '25m',
      'count': 4
    }
  },
  'https': {
    'port': 443,
    'host': 'dev.project.com',
    'url': 'https://dev.project.com'
  },
  'passport': {
    'strategy': {
      'usernameField': 'email',
      'passwordField': 'password',
      'session': true
    }
  },
  'admin': {
    'recipients': [{
      'Email': 'mluberry@project.com'
    }]
  },
  'mail': {
    'from': {
      'email': 'mluberry@project.com',
      'name': 'Project'
    }
  },
  'google': {
    'apikey': ''
  }
};
