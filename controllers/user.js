/*
 * user.js
 * Copyright (C) 2017  <liubj@wangsu.com>
 *
 * Distributed under terms of the MIT license.
 */
const db = require('../models');
const { SUCCESS, FAILED_UPDATE_USER } = require('../commons/respCommons');
const logger = require('../utils/log')('error');
const { getOffset, getGridData, pickByAttrs } = require('../utils/common');
const { toNumber, compact, pickBy, assignIn, includes } = require('lodash');
const { identity, slice, map, set, compose } = require('lodash/fp');
const bcrypt = require('bcryptjs');

const userController = {

  update(req, resp, next) {
    const userName = req.session.user.userName;
    const body = req.body;
    const id = req.params.id;
    db.User.findById(id).then((user) => {
      // 如果是当前用户,继续进行编辑
      if(user.account === userName) {
        const params = pickByAttrs(body, ['residence', 'name', 'email', 'phone', 'bus']);
        user = assignIn(user, params);
        return user.save();
      }else {
        resp.failed(FAILED_UPDATE_USER);
      }
    }).then(user => {
      resp.success(user);
    }).catch(next);
  },

  select(req, resp, next) {
    const id = req.params.id;
    db.User.findById(id).then((user) => {
      resp.success(user);
    }).catch(next);
  },

  create(req, resp, next) {
    const body = req.body;
    let findInvitor;
    db.User.findOne({
      phone: body.phone
    }).then((user) => {
      if(!user) {
        // TODO 校验码比较
        const salt = bcrypt.genSaltSync(10);
        const newUser = new db.User({
          phoneNum: body.phone,
          hash: bcrypt.hashSync(body.pwd, salt),
        });
        if(body.invitor) {
          findInvitor = db.User.findById(body.invitor);
        }
        return Promise.all([newUser.save(), findInvitor]);
      }
    }).then(([user, invitor]) => {
      if(invitor) {
        invitor.invited.push(user.id);
        return Promise.all([user, invitor.save()]);
      }else {
        return Promise.all([user]);
      }
    }).then(([user]) => {
      resp.success(`${user.name}用户创建成功！`);
    }).catch(err => {
      next(err);
    });
  },

  login(req, resp, next) {
    const body = req.body;
    db.User.findOne({
      name: body.name,
    }).then(user => {
      if(!user) {
        resp.failed(`不存在的账户！`);
      }else {
        // TODO 添加校验码比较
        if(bcrypt.compareSync(body.pwd, user.hash)) {
          req.session.user = user.toJSON();
          resp.success('登录成功!');
        }else {
          resp.failed('密码不正确！');
        }
      }
    }).catch(err => {
      next(err);
    })
  },

}

module.exports = userController;
