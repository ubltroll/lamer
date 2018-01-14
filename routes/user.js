/*
 * user.js
 * Copyright (C) 2017  <liubj@wangsu.com>
 *
 * Distributed under terms of the MIT license.
 */
const express = require('express');
const router = express.Router();
const { update, select, getEnrolls } = require('../controllers/user');

router.get('/activityBus', getEnrolls);
router.get('/:id', select);
router.put('/:id', update);

module.exports = router;
