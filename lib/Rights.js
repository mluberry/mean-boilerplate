var Rights = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) next();
    else Rights._reject(req, res);
  },
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.privilege === 1) next();
    else Rights._reject(req, res);
  },
  _reject: (req, res) => {
    if (req.query.json) return res.status(401).send();
    res.status(302).redirect('/login');
  }
};

module.exports = Rights;
