/*
 * mailer.js
 * Copyright (C) 2017  <liubj@wangsu.com>
 *
 * Distributed under terms of the MIT license.
 */
const nodemailer = require('nodemailer');

let poolConfig = {
    pool: true,
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: '3004157662@qq.com',
        pass: 'nkmmkjyoxmzidgda'
    }
};
// let poolConfig = {
//     pool: true,
//     host: 'mail.wangsu.com',
//     port: 25,
//     // secure: true,
//     auth: {
//         user: 'liubj@wangsu.com',
//         pass: 'Tz888888*'
//     }
// };

// let mailOptions = {
//   subject: 'Hello world?',
//   from: '3004157662@qq.com',
//   to: 'liubj@wangsu.com',
//   text: 'Welcom!',
// }

const transporter = nodemailer.createTransport(poolConfig)
// transporter.sendMail(mailOptions);

module.exports = transporter;
