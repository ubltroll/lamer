/*
 * user.js
 * Copyright (C) 2017  <liubj@wangsu.com>
 *
 * Distributed under terms of the MIT license.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StationSchema = require('./station');

const UserSchema = new Schema({
  account: {
    type: String,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: String,
  phone: {
    type: String,
  },
  residence: StationSchema,
  bus: [{
    station: StationSchema,
    frequency: {
      type: Number,
      min: 1,
    },
    commutingType: String,
    // 班次
    bus: Schema.Types.ObjectId,
  }],
});
// bus object
// { // 上车站点
//     station: Schema.Types.ObjectId,
//     frequency: {
//       type: Number,
//       min: 1,
//     },
//     commutingType: String,
//     // 班次
//     bus: Schema.Types.ObjectId,
//   }
module.exports = UserSchema;
