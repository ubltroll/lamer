/*
 * common.js
 * Copyright (C) 2017  <liubj@wawngsu.com>
 *
 * Distributed under terms of the MIT license.
 */
const {
  toNumber,
  trim,
  pick,
  pickBy,
  includes,
} = require('lodash');
const logger = require('./log')('error');
const path = require('path');
const { resize, pathConfig} = require('../config');
const fs = require('fs');
const moment = require('moment');

const commonUtils = {

  getOffset(params) {
    return toNumber(params.start);
  },

  getMaterialThumbnailPath: (picture, size) => {
    const picDir = path.join(pathConfig.static, pathConfig.PIC_DIR);
    const originPath = `${picDir}${picture.path}`;
    const pathParser = path.parse(originPath);
    const prefix = pathParser.dir;
    const postfix = pathParser.ext;
    return path.join(prefix, `${picture.name}_${size}${postfix}`);
  },

  getLogoPath: (picture, size) => {
    const picDir = path.join(pathConfig.static, pathConfig.PIC_DIR);
    const originPath = `${picDir}${picture.path}`;
    const pathParser = path.parse(originPath);
    const prefix = pathParser.dir;
    const postfix = pathParser.ext;
    return toNumber(size) === 1024 ? originPath: path.join(prefix, `${picture.name}_${picture.typesetting}_${picture.scence}_${size}${postfix}`);
  },

  getFilename: (path) => {
    const lastSlashIndex = path.lastIndexOf('/') !== -1 ? path.lastIndexOf('/') : path.lastIndexOf('\\');
    return trim(path.slice(lastSlashIndex + 1));
  },

  getAbsolutePath: (relativePath) => {
    return path.join(pathConfig.static, pathConfig.XLSX_DIR, relativePath);
  },


  // 获取到删除后移动到的绝对路径
  getDeletedPath: (relativePath, timestamp) => {
    const parser = path.parse(relativePath);
    const deletedRelativePath = path.join(parser.dir, `${parser.name}-${timestamp}${parser.ext}`);
    const absolutePath = path.join(pathConfig.static, pathConfig.DELETED_PIC_DIR, deletedRelativePath);
    return absolutePath;
  },

  // 获取删除后移动到的路径，用于存在数据库（相对路径)
  getDeletedPath4Database: (relativePath, timestamp) => {
    const parser = path.parse(relativePath);
    const deletedRelativePath = path.join(parser.dir, `${parser.name}-${timestamp}${parser.ext}`);
    return path.join(pathConfig.DELETED_PIC_DIR, deletedRelativePath).replace(/\\/g, '/');
  },

  // 迭代创建目标文件夹
  mkdirp: (targetDir) => {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(parentDir, childDir);
      if (!fs.existsSync(curDir)) {
        fs.mkdirSync(curDir);
      }
      return curDir;
    }, initDir);
  },

  // 从原路径移动到目标路径
  rename: (originPath, targetPath) => {
    return new Promise((resolve, reject) => {
      return fs.rename(originPath, targetPath, (err) => {
        if(err) {
          logger.error(err);
          reject(err);
        }else {
          resolve();
        }
      });
    });
  },

  getGridData(objs, count) {
    const rows = objs;
    return {
      count: count,
      rows: rows,
    };
  },

  pickByAttrs(params, attrs) {
    return pickBy(params, (value, key) => value && includes(attrs, key));
  },

  getFormattedMoment(date) {
    return moment(date).format('YYYY-MM-DD');
  },

}

module.exports = commonUtils;
