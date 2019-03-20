/*
 * 素材对齐线
 * @Author: zhangdi
 * @Date: 2017-09-05 11:26:00 
 * @Last Modified by: bianhao
 * @Last Modified time: 2017-10-18 18:23:39
 */

import dataHandle from 'common/dataHandle';

const guideLine = {

/**
 * 设置元素吸附
 * @param {String} focusRect 当前元素的rect
 * @param {String} rectList 除了当前元素的rect列表
 */
setEleAdsorption(focusRect, rectList) {
  let vuexGetters = dataHandle.vuexGetters(),
      vuexAcitons = dataHandle.vuexActions(),
      pageScale = vuexGetters.getPageScale,
      length = rectList.length,
      eleRect,
      newLeft = focusRect.left,
      newTop = focusRect.top;
  focusRect.xMid = focusRect.left + focusRect.width / 2;
  focusRect.yMid = focusRect.top + focusRect.height / 2;

  let dis = 6; //吸附距离

  for (let i = 0; i < length; i++) {

    eleRect = rectList[i];
    eleRect.xMid = eleRect.left + eleRect.width / 2;
    eleRect.yMid = eleRect.top + eleRect.height / 2;

    if(Math.abs(focusRect.left - eleRect.left) * pageScale < dis) {
      newLeft = eleRect.left
    }
    else if(Math.abs(focusRect.left - eleRect.xMid) * pageScale < dis) {
      newLeft = focusRect.left + (eleRect.xMid - focusRect.left);
    }
    else if(Math.abs(focusRect.left - eleRect.right) * pageScale < dis) {
      newLeft = focusRect.left + (eleRect.right - focusRect.left);
    }

    else if(Math.abs(focusRect.xMid - eleRect.left) * pageScale < dis) {
      newLeft = focusRect.left + (eleRect.left - focusRect.xMid);
    }
    else if(Math.abs(focusRect.xMid - eleRect.xMid) * pageScale < dis) {
      newLeft = focusRect.left + (eleRect.xMid - focusRect.xMid);
    }
    else if(Math.abs(focusRect.xMid - eleRect.right) * pageScale < dis) {
      newLeft = focusRect.left + (eleRect.right - focusRect.xMid);
    }

    else if(Math.abs(focusRect.right - eleRect.left) * pageScale < dis) {
      newLeft = focusRect.left + (eleRect.left - focusRect.right);
    }
    else if(Math.abs(focusRect.right - eleRect.xMid) * pageScale < dis) {
      newLeft = focusRect.left + (eleRect.xMid - focusRect.right);
    }
    else if(Math.abs(focusRect.right - eleRect.right) * pageScale < dis) {
      newLeft = focusRect.left + (eleRect.right - focusRect.right);
    }

    else if(Math.abs(focusRect.top - eleRect.top) * pageScale < dis) {
      newTop = focusRect.top + (eleRect.top - focusRect.top);
    }
    else if(Math.abs(focusRect.top - eleRect.yMid) * pageScale < dis) {
      newTop = focusRect.top + (eleRect.yMid - focusRect.top);
    }
    else if(Math.abs(focusRect.top - eleRect.bottom) * pageScale < dis) {
      newTop = focusRect.top + (eleRect.bottom - focusRect.top);
    }

    else if(Math.abs(focusRect.yMid - eleRect.top) * pageScale < dis) {
      newTop = focusRect.top + (eleRect.top - focusRect.yMid);
    }
    else if(Math.abs(focusRect.yMid - eleRect.yMid) * pageScale < dis) {
      newTop = focusRect.top + (eleRect.yMid - focusRect.yMid);
    }
    else if(Math.abs(focusRect.yMid - eleRect.bottom) * pageScale < dis) {
      newTop = focusRect.top + (eleRect.bottom - focusRect.yMid);
    }

    else if(Math.abs(focusRect.bottom - eleRect.top) * pageScale < dis) {
      newTop = focusRect.top + (eleRect.top - focusRect.bottom);
    }
    else if(Math.abs(focusRect.bottom - eleRect.yMid) * pageScale < dis) {
      newTop = focusRect.top + (eleRect.yMid - focusRect.bottom);
    }
    else if(Math.abs(focusRect.bottom - eleRect.bottom) * pageScale < dis) {
      newTop = focusRect.top + (eleRect.bottom - focusRect.bottom);
    }

  }

  vuexAcitons.setCircleSelectElementsNow[0]([]);

  if(newTop !== focusRect.top || newLeft !== focusRect.left) {
    vuexAcitons.setGuideLineShow[0](true);
    return {
      newTop: newTop,
      newLeft: newLeft
    }
  } else {
    vuexAcitons.setGuideLineShow[0](false);
  }

}

}

export default guideLine;

