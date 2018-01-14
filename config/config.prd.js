const path = require('path');

module.exports = {
  db: {
    uri: 'mongodb://10.8.227.218:27017/bus',
    option: {
    },
    database: '2u',
    username: 'root',
    password: '123456',
    connect: {
      host: 'localhost',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      define: {
        freezeTableName: true,
        underscored: true
      }
    }
  },
  cas: {
    login: 'https://portal-its.chinanetcenter.com/cas/login',
    validate: 'https://portal-its.chinanetcenter.com/cas/serviceValidate',
    logout: 'https://portal-its.chinanetcenter.com/cas/logout'
  },
  resize: {
    LOGO_THUMBNAIL_SIZE: 100,
    MATERIAL_THUMBNAIL_SIZE: 60,
    BACK_LOGO_THUMBNAIL_SIZE: 105,
    BACK_MATERIAL_THUMBNAIL_SIZE: 128,
    LOGO_DEFAULT_SIZES: [144, 105],
    MATERIAL_DEFAULT_SIZES: [128, 60],
  },
  staticResource: 'img.chinanetcenter.com',
  pathConfig: {
    PIC_DIR: '/xlxs/',
    root: path.resolve(__dirname, '..'),
    static: path.resolve(__dirname, '../public'),
  }
}
