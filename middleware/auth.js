var request = require('request');
var parseString = require('xml2js').parseString;
var _ = require('lodash');

const { findOrCreateUser } = require('../controllers/user');
var config = require('../config');
var utils = require('../utils');

function getCas() {
  return config.cas;
}

const createUser = (option, req) => {
  option.name = option['DISPLAY_NAME'];
  option.email = option['EMAIL'];
  option.account = option['LOGIN_NAME'];
  req.session.user = { userName: option.account, displayName: option.name};
  findOrCreateUser(option);
};

function validateLogin(req, res, next) {
  var cas = getCas(),
    params = utils.url.params(_.omit(req.query, ['ticket'])),
    originUrl = req.protocol + '://' + req.hostname + ':' + req.app.get('port') + req.baseUrl + (req.path != '/' ? req.path : '/') + (params ? '?' + params : '');
  validateUrl = cas.validate + '?service=' + encodeURIComponent(originUrl) + '&ticket=' + req.query.ticket;
  request.get(validateUrl, function (error, response, body) {
    if (error) {
      next(error);
    } else {
      parseString(body, function (error, result) {
        if (error) {
          next(error);
        } else {
          result = result['cas:serviceResponse'];
          if (result['cas:authenticationFailure']) {
            next(result['cas:authenticationFailure'][0]);
          } else {
            result = result['cas:authenticationSuccess'][0];
            createUser(JSON.parse(result['cas:principal'][0]).allAttrs, req);
            // var userName = result['cas:user'][0];
            res.redirect(originUrl);
          }
        }
      });
    }
  });
};

function login(req, res, next) {
  var cas = getCas(),
    loginUrl = cas.login + '?service=' + encodeURIComponent(req.protocol + '://' + req.hostname + ':' + req.app.get('port') + req.originalUrl.split("?")[0]);
  res.redirect(loginUrl);
}

module.exports = function (req, res, next) {
  if (req.session && req.session.user) { //如果已经登录
    next();
  } else if (req.query.ticket) { //如果是从portal那边获取了ticket，那么进行登录校验
    validateLogin(req, res, next);
  } else { //如果还没有登录
    login(req, res, next);
  }
}
