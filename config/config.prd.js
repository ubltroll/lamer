const path = require('path');

module.exports = {
  db: {
    uri: 'mongodb://bellchet58:tz8888@127.0.0.1:27017/lamer',
    option: {
    },
  },
  staticResource: '127.0.0.1',
  pathConfig: {
    root: path.resolve(__dirname, '..'),
    static: path.resolve(__dirname, '../public'),
  }
}
