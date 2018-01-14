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

  findOrCreateUser(option) {
    db.User.findOne({
      account: option.account
    }).then((user) => {
      const newUser = new db.User(option);
      if(!user) {
        return newUser.save();
      }
    }).then((user) => {
      console.log(`${user.account}用户创建成功!`);
    }).catch(err => {
      logger.error(err);
    });
  },

  getEnrolls(req, resp, next) {
    const userName = req.session.user.userName;
    const query = req.query;
    const offset = getOffset(query);
    const limit = toNumber(query.limit);
    db.User.findOne({
      account: userName,
    }).then(user => {
      const count = user.bus.length;
      const sliceBuses = (offset >= 0) && limit ? slice(offset, limit) : identity;
      const getBuses = compose(map(({bus}) => bus && db.Bus.findById(bus)), sliceBuses);
      return Promise.all([count, ...getBuses(user.bus)]);
    }).then(params => {
      const count = params[0];
      const buses = compact(params.slice(1));
      const getTypes = buses instanceof Array && buses.map(bus => db.ActivityType.findById(bus.activityType));
      return Promise.all([buses, count, ...getTypes]);
    }).then(params => {
      const buses = params[0];
      const count = params[1];
      const types = params.slice(2);
      const result = buses.map((bus, key) => {
        const setType = set('activityType', types[key] && types[key].name);
        const setIsApply = set('isApply', true);
        const route = map((station) => assignIn(station, { longlat:`${station.longitude},${station.latitude}`}))(bus.route);
        const setRoute = set('route', route);
        return compose(setRoute, setIsApply, setType)(bus.toJSON());
      });
      resp.success(getGridData(compact(result), count));
    }).catch(err => {
      next(err);
    })
  },
}

module.exports = userController;
