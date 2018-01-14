const middleware = require('../middleware');
const apiRouter = require('./api');
const config = require('../config');

module.exports = function(app) {
  app.use(require('./auth')); 
  app.get('/auth', middleware.auth, function(req, res, next) {
    res.redirect('/');
  });
  app.get('/', middleware.auth, (req, resp, next) => {
    resp.render('index');
  });
  app.get('/logout', (req, res, next) => {
    req.session.user = null;
    // TODO 回到主页
    res.redirect(`${config.cas.logout}?service=http://${req.headers.host}/`);
  });

  app.use('/api', middleware.auth, apiRouter);
};
