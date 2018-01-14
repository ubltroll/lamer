/*
 * index.js
 * Copyright (C) 2017  <liubj@wangsu.com>
 *
 * Distributed under terms of the MIT license.
 */
const mongoose = require('mongoose');

const UserSchema = require('./user');

const db = Object.create(null);

[UserSchema].map(schema => {
  schema.virtual('id').get(function() {
    return this._id.toHexString();
  });
  schema.set('toObject', {
    virtuals: true,
  });
  schema.set('toJSON', {
    virtuals: true,
  });
});

db.mongoose = mongoose;
db.Schema = mongoose.Schema;
db.User = mongoose.model('User', UserSchema);

module.exports = db;
