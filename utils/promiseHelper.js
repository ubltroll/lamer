/*
 * promiseHelper.js
 * Copyright (C) 2017  <liubj@wangsu.com>
 *
 * Distributed under terms of the MIT license.
 */
const path = require('path');
const { 
  mkdirp,
  getDeletedPath,
  rename,
  getAbsolutePath,
  getDeletedPath4Database,
} = require('./common');

const promiseHelper = {

  getDeleteAndRenamePromises: (pictures, operator) => {
    const renamePromises = [];
    const timestamp = new Date().getTime().toString();
    const deletePromises = pictures.map(picture => {
      const picturePath = picture.path;
      const deletedPath = getDeletedPath(picturePath, timestamp);
      mkdirp(path.parse(deletedPath).dir);
      renamePromises.push(rename(getAbsolutePath(picturePath), deletedPath));
      return picture.update({
        path: getDeletedPath4Database(picturePath, timestamp),
        active: false,
        operator: operator,
      });
    });
    return [...renamePromises, ...deletePromises];
  },

  // 当前用户是否在白名单中
  inWhiteList: (user, whiteList) => {
    return new Promise((resolve, reject) => {
      if(whiteList.indexOf(user) >= 0) {
        resolve();
      }
      reject();
    });
  },
}

module.exports = promiseHelper;
