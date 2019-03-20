/*
 * 画布列表相关操作
 * @Author: zhangdi
 * @Date: 2017-09-18 11:26:00
 * @Last Modified by: zhangdi
 * @Last Modified time: 2017-09-18 11:26:00
 */

import dataHandle from 'common/dataHandle';

const pageScaleSet = {

/**
 * 减小画布缩放比例
 */
pageScaleSub() {
  let vuexActions = dataHandle.vuexActions(),
      vuexGetters = dataHandle.vuexGetters(),
      pageScale = vuexGetters.getPageScale,
      defaultPageScale = vuexGetters.getDefaultPageScale,
      minScale = defaultPageScale / 4 > 1 ? 1 : defaultPageScale / 4,
      maxScale = defaultPageScale * 4 < 1 ? 1 : defaultPageScale * 4,
      scaleAva = (maxScale - minScale) / 30,
      newScale = pageScale - scaleAva;
  newScale = newScale < minScale ? minScale : newScale;
  vuexActions.setPageScale[0](newScale);

  let pageWrapRect = vuexGetters.getPageWrapRect,
      pageShowWidth = vuexGetters.getPageShowWidth,
      pageShowHeight = vuexGetters.getPageShowHeight,
      newTop = (pageWrapRect.height - pageShowHeight) / 2,
      newLeft = (pageWrapRect.width - pageShowWidth) / 2;
  vuexActions.setPagePosition[0]({
    top: newTop,
    left: newLeft
  });
},

/**
 * 增大画布缩放比例
 */
pageScaleAdd() {
  let vuexActions = dataHandle.vuexActions(),
      vuexGetters = dataHandle.vuexGetters(),
      pageScale = vuexGetters.getPageScale,
      defaultPageScale = vuexGetters.getDefaultPageScale,
      minScale = defaultPageScale / 4 > 1 ? 1 : defaultPageScale / 4,
      maxScale = defaultPageScale * 4 < 1 ? 1 : defaultPageScale * 4,
      scaleAva = (maxScale - minScale) / 30,
      newScale = pageScale + scaleAva;
  newScale = newScale > maxScale ? maxScale : newScale;
  vuexActions.setPageScale[0](newScale);

  let pageWrapRect = vuexGetters.getPageWrapRect,
      pageShowWidth = vuexGetters.getPageShowWidth,
      pageShowHeight = vuexGetters.getPageShowHeight,
      newTop = (pageWrapRect.height - pageShowHeight) / 2,
      newLeft = (pageWrapRect.width - pageShowWidth) / 2;
  vuexActions.setPagePosition[0]({
    top: newTop,
    left: newLeft
  });
}

}

export default pageScaleSet;

