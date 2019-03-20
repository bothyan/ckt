/*
 * 画布列表相关操作
 * @Author: zhangdi
 * @Date: 2017-09-18 11:26:00
 * @Last Modified by: zhangdi
 * @Last Modified time: 2017-09-18 11:26:00
 */

import dataHandle from 'common/dataHandle'
import designHandle from 'dataBus/design'

const pageList = {

/**
 * 新增画布缩略图
 * @param {String} thumbUrl 画布新的缩略图地址
 * @param {Number} pageIndex 新增缩略图的下标
 */
addPageThumb(thumbUrl, pageIndex) {
  thumbUrl = thumbUrl || '';
  let vuexActions = dataHandle.vuexActions(),
      vuexGetters = dataHandle.vuexGetters();
  let pageThumbList = vuexGetters.getPageThumbList;
  let pageThumb = {
    pageNo: pageIndex,
    pageId: parseInt(100000 * Math.random()),
    taskId: 0,
    thumbnailsUrl: thumbUrl,
    making: false
  }
  pageThumbList.splice(pageIndex, 0, pageThumb);
  vuexActions.setPageThumbList[0](pageThumbList);
  pageList.resetPageListStyle();
},

/**
 * 删除画布缩略图
 * @param {Number} pageIndex 删除缩略图的下标
 */
delPageThumb(pageIndex) {
  let vuexActions = dataHandle.vuexActions(),
      vuexGetters = dataHandle.vuexGetters();
  let pageThumbList = vuexGetters.getPageThumbList;
  pageThumbList.splice(pageIndex, 1);
  vuexActions.setPageThumbList[0](pageThumbList);
  pageList.resetPageListStyle();
},

/**
 * 移动画布缩略图
 * @param {Number} oldIndex 被移动的下标
 * @param {Number} newIndex 新的小标
 */
movePageThumb(oldIndex, newIndex) {
  let vuexActions = dataHandle.vuexActions(),
      vuexGetters = dataHandle.vuexGetters();
  let pageThumbList = vuexGetters.getPageThumbList;
  let pageThumb = JSON.parse(JSON.stringify(pageThumbList.splice(oldIndex, 1)[0]));
  pageThumbList.splice(newIndex, 0, pageThumb);
  vuexActions.setPageThumbList[0](pageThumbList);
  pageList.resetPageListStyle();
},

/**
 * 移动画布序号
 */
resetPageNo() {
  let vuexActions = dataHandle.vuexActions(),
      vuexGetters = dataHandle.vuexGetters();
  let pageThumbList = vuexGetters.getPageThumbList;
  for (let i = 0; i < pageThumbList.length; i++) {
      pageThumbList[i].pageNo = i;
  }
  vuexActions.setPageThumbList[0](pageThumbList);
},

/**
 * 更新画布缩略图地址
 * @param {String} newThumbUrl 画布新的缩略图地址
 * @param {Number} pageIndex 更新画布的下标
 */
updatePageThumb(newThumbUrl, pageIndex) {
  pageIndex = pageIndex === null || pageIndex === undefined ? dataHandle.vuexGetters().getFocusPageIndex + 1 : pageIndex;
  const vuex = dataHandle.vuexGetters();
  let pageThumbList = vuex.getPageThumbList;
  pageThumbList[pageIndex].thumbnailsUrl = newThumbUrl;
},


/**
 * 保存画布缩略图信息
 */
savePageThumb(newPageIndex, callBack, pageCopyIndex,cb2) {
  let vuexActions = dataHandle.vuexActions(),
      vuexGetters = dataHandle.vuexGetters(),
      teamId = vuexGetters.getTeamId;

  let pageThumbList = vuexGetters.getPageThumbList,
      length = pageThumbList.length,
      taskIds = [],
      copiedIds = [];

  for (let i = 0; i < length; i++) {
    taskIds.push(pageThumbList[i].taskId);
    copiedIds.push(0);
  }

  if(pageCopyIndex != undefined) {
    copiedIds[pageCopyIndex + 1] = taskIds[pageCopyIndex];
  }

  dataHandle.$vue.$http.post('/design/setThumbnails',{
      d: designHandle.getDesignInfo().designId,
      tid: teamId ? teamId : 0,
      ids: taskIds.join(','),
      copied_ids: copiedIds.join(',')
    }).then((data)=>{
      // code : -1 参数错误；-2未登录；-3权限不足；0操作失败，1操作成功
      let code = data.body.code;
      if(code === -2) {
        vuexActions.setLogregShow[0](1);
      } else if(code === -3) {
        vuexActions.setLogregShow[0](3);
      } else if(code <= 0) {
        vuexActions.setMessageShow[0]({
          placeHolder:'保存画布缩略图出错！'
        });
      } else if(code === 1) {
          let taskIds = data.body.taskIds;
          for (let i = 0; i < length; i++) {
            pageThumbList[i].taskId = taskIds[i] || 0;
          }
          vuexActions.setPageThumbList[0](pageThumbList);
          if(vuexGetters.getFocusPageIndex === newPageIndex) {
            if(callBack)
              callBack();
          }
	      cb2&&cb2()
      }
      vuexActions.setIndexPageSaving[0](-1);
    }).catch((error)=>{
      console.log('保存设计画布缩略图地址error!');
    });

},

/**
 * 重置画布缩略图样式
 */
resetPageListStyle() {
  let vuexActions = dataHandle.vuexActions(),
      vuexGetters = dataHandle.vuexGetters();
  let radio = vuexGetters.getPageWidth / vuexGetters.getPageHeight,
      pageLiWidth = 160,
      pageLiHeight = pageLiWidth * (1 / radio),
      wideLlist = [],
      straitList = [];
  vuexActions.setWidePageHeight[0](pageLiHeight);
  for (let i = 0; i < vuexGetters.getPageSum; i++) {
    wideLlist.push({
      width: pageLiWidth,
      height: pageLiHeight,
      left: 0,
      top: i * pageLiHeight,
      moveUp: false,
      moveDown: false
    });
    straitList.push({
      width: 54,
      height: 54,
      left: 0,
      top: i * 54,
      moveUp: false,
      moveDown: false
    });
  }
  vuexActions.setWidePageStyleList[0](wideLlist);
  vuexActions.setStraitPageStyleList[0](straitList);
}

}

export default pageList;

