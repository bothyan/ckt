"use strict";
// 用户相关
let getUserInfo = require('./user/getUserInfo'),
    regWithPhone = require('./user/regWithPhone'),
    getDesignType = require('./home/getDesignType'),
    queryUserDesigns = require('./design/queryUserDesigns'),
    queryUserFolders = require('./design/queryUserFolders'),
    moveDesign = require('./design/moveDesign'),
    list = require('./activity/list'),
    publishWork = require('./activity/publishWork'),
    addMakeImageTask = require('./design/addMakeImageTask'),
    makeDesignIdV2 = require('./design/makeDesignIdV2');

function buildJson() {
  const data = {
    'getUserInfo': getUserInfo(),
    'regWithPhone': regWithPhone(),
    'makeDesignIdV2': makeDesignIdV2(),
    'getDesignType': getDesignType(),
    'queryUserFolders': queryUserFolders(),
    'moveDesign': moveDesign(),
    'list': list(),
    'publishWork': publishWork(),
    'addMakeImageTask': addMakeImageTask(),
    'queryUserDesigns': queryUserDesigns()
  };

  return data;
}


module.exports = function () {
  let data = buildJson();
  return data;
};
