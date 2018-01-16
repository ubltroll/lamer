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
const querystring = require('querystring');
const https = require('https');

const getSmsOption = (content) => {
  return {
      host:'sms-api.luosimao.com',
      path:'/v1/send.json',
      method:'POST',
      auth:'api:key-442199e5d02324bc7d1ff2a2f675882e',
      agent:false,
      rejectUnauthorized : false,
      headers:{
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length' :content.length
    }
  }
}

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

  getCapcha(req, resp, next) {
    const body = req.body;
    const code = Math.random().toString().slice(-6);
    // TODO 验证码存入数据库以及定时删除
    const postData = {
      mobile: body.phone,
      message: `您的验证码为${code}请在5分钟内完成注册。【以太战舰】`
    };
    const content = querystring.stringify(postData);
    const options = getSmsOption(content);
    const smsReq = https.request(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        if(chunk.error === 0) {
          resp.success(SUCCESS);
        }else {
          resp.failed(chunk.msg);
        }
      });
      res.on('end', () => {
        console.log('over');
      });
    });
    smsReq.write(content);
    smsReq.end();
  },

}

module.exports = userController;




