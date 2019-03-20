/*
 * text相关操作
 * @Author: Chuanfeng
 * @Date: 2017-09-11 13:24:34
 */

import dataHandle from 'common/dataHandle';
import pageBus from 'dataBus/page'
import toolsBarBus from 'dataBus/toolsBar'
import {getTransformAttr} from 'common/common';

const text = {
  setTextHtml(value, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json.html = value;
    return {
      type: 'element',
      event: {
        pageIndex,
        eleIndex,
        key: 'html',
        value,
        eventType: 1
      }
    }
  },

  setFontColor(color, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem'].fill = color;
  },

  setFontFamily(family, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem']['font-family'] = family;
  },

  /**
   * 取得指定元素的font-size
   * @param {Number} pageIndex 
   * @param {Number} eleIndex 
   * @return
   */
  getFontSize(pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    return json['data-elem']['font-size']
  },

  setFontSize(size, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem']['font-size'] = size;
    json['data-elem'].fs = size;
  },

  setFontBold(bold, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem']['data-bold'] = bold;
  },

  setFontItalic(italic, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem']['data-italic'] = italic + '';
  },

  setFontDecoration(dec, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem']['data-decoration'] = dec + '';
  },

  setFontAlign(align, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem']['data-align'] = align + '';
  },

  /**
   * 字间距（1000为一个字体宽度）
   * @param wspace
   * @param pageIndex
   * @param eleIndex
   */
  setFontWspace(wspace, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem'].wspace = wspace;
  },
  setTextWspace(wspace, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem'].wspace = wspace;
    json['data-elem'].wsp = wspace;
  },

  /**
   * 行间距（1000为一个字体高度）
   * @param vspace
   * @param pageIndex
   * @param eleIndex
   */
  setFontVspace(vspace, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem'].vspace = vspace;
  },
  setTextVspace(vspace, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem'].vspace = vspace;
    json['data-elem'].vsp = vspace;
  },

  resizeText(info, elem, scale) {
    if (info.resizeType === 1) { // 横拉伸
    } else if (info.resizeType === 3) { // 斜拉伸
      elem['data-elem']['font-size'] = elem['data-elem']['font-size'] / scale;
    }
  },

  setFontWidth(pageIndex, eleIndex) { // 设置用于监听的临时宽度
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem'].w = json['data-elem'].width;
    let data = {
      pageIndex: dataHandle.$vue.$store.getters.getFocusPageIndex,
      eleIndex: dataHandle.$vue.$store.getters.getFocusElemIndex,
      key: 'w',
      value: json['data-elem'].width,
      eventType: 1
    };
    dataHandle.commit('element', data) //修改
  },

  setUpdateFlagByPageId(v, pageId, eleIndex) {
    let elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    if(elem == undefined) return;

    elem['data-elem'].needToUpdate = v;

    let flag = {
      pageId,
      pageIndex: 1, // 有 pageId 会忽略 pageIndex
      eleIndex,
      key: 'needToUpdate',
      value: v,
      eventType: 1
    }
    dataHandle.commit('element', flag).push(true)
  }
};

export default text;