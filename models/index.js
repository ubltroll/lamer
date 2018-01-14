/*
 * index.js
 * Copyright (C) 2017  <liubj@wangsu.com>
 *
 * Distributed under terms of the MIT license.
 */
const mongoose = require('mongoose');

const ActivityTypeSchema = require('./activityType');
const StationSchema = require('./station');
const UserSchema = require('./user');
const BusSchema = require('./bus');
const AnnouncementSchema = require('./announcement');
const FeedbackSchema = require('./feedback');

const db = Object.create(null);

[ActivityTypeSchema, StationSchema, UserSchema, BusSchema, AnnouncementSchema, FeedbackSchema].map(schema => {
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
db.Announcement = mongoose.model('Announcement', AnnouncementSchema);
db.Feedback = mongoose.model('Feedback', FeedbackSchema);
db.ActivityType = mongoose.model('ActivityType', ActivityTypeSchema);
db.Station = mongoose.model('Station', StationSchema);
db.Bus = mongoose.model('Bus', BusSchema);
db.User = mongoose.model('User', UserSchema);

module.exports = db;
