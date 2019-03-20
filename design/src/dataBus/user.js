/*
 * @Author: bianhao 
 * @Date: 2017-09-07 11:46:53 
 * @Last Modified by: bianhao
 * @Last Modified time: 2017-10-23 20:23:33
 */

import dataHandle from 'common/dataHandle';

const user = {

/**
 * 收藏素材
 * @param {String} id 素材id
 */
collectMaterial(id, callback) {
  let $vue = dataHandle.$vue;
  $vue.$http.post('/material/collectMaterial', {id: id}).then(response => {
    if(response.body.code === 1) {
      this.addCollectedMaterialId(id);
    }
    callback && callback(response.body);
  }).catch(error => {
    console.log(error);
  });
},

setCollectedMaterialIds() {
  let $vue = dataHandle.$vue;
  let vuexActions = dataHandle.vuexActions();
  $vue.$http.post('/material/getCollectedMaterialIdsCache').then(response => {
    vuexActions.setCollectedMaterials[0](response.body.collectedMaterialIds.split(','));
    //vuexActions.
  }).catch(error => {
    console.log(error);
  });
},

/**
 * 增加新收藏素材id
 * @param {any} id 
 */
addCollectedMaterialId(id) {
  let vuexActions = dataHandle.vuexActions();
  vuexActions.addCollectedMaterialId[0](id);
},


/**
 * 删除收藏素材指定id
 * @param {any} id 
 */
removeCollectedMaterialId(id) {
  let vuexActions = dataHandle.vuexActions();
  vuexActions.removeCollectedMaterialId[0](id);
},

/**
 * 返回收藏的素材id
 * @returns Array ids
 */
getCollectedMaterialIds() {
  return dataHandle.vuexGetters().getCollectedMaterials;
},

/**
 * 通过素材id判断是否被收藏
 * @returns Boolean
 */
isCollectedById(id) {
  let ids = this.getCollectedMaterialIds();
  return !!ids.find(item => item == id);
  // return ids.indexOf(id) > -1;
}

}

export default user;