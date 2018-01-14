/*
 * api.js
 * Copyright (C) 2017  <liubj@wangsu.com>
 *
 * Distributed under terms of the MIT license.
 */
const express = require('express');
const router = express.Router();
const userRouter = require('./user');

router.use('/users', userRouter);

module.exports = router;
