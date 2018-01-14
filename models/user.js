/*
 * user.js
 * Copyright (C) 2017  <liubj@wangsu.com>
 *
 * Distributed under terms of the MIT license.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  invited: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },
});

UserSchema.virtual('phoneNum').set(function(value) {
  this.name = value;
})

UserSchema.virtual('invitedCount').get(function() {
  if(this.invited) {
    return this.invited.length;
  }
})

module.exports = UserSchema;
