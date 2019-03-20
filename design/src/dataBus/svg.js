/*
 * svg相关操作
 * @Author: bianhao 
 * @Date: 2017-08-31 20:07:34 
 * @Last Modified by: bianhao
 * @Last Modified time: 2017-11-09 16:18:06
 */

import dataHandle from 'common/dataHandle';
import { getTransformAttr, inArray } from 'common/common.js';


const svg = {


  /**
   * 设置svg素材的颜色
   * @param {String} pageIndex svg所属page的下标
   * @param {String} eleIndex 当前svg下标
   * @param {Object} colors colors
   */
  setSvgColors(pageId, eleIndex, colors) {
    //console.log(dataHandle.getEleJson(pageIndex, eleIndex));
    let elem;
    if (typeof (pageId) != 'string') {
      elem = dataHandle.getEleJson(pageId, eleIndex);
    } else {
      elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    }
  if (elem == undefined) return;
    elem['data-elem']['data-colors'] = colors;
  },

  /**
   * 设置viewBox
   * @param {any} val 
   * @param {any} pageIndex 
   * @param {any} eleIndex 
   */
  setSvgViewBox(val, pageId, eleIndex) {
    let elem;
    if (typeof (pageId) != 'string') {
      elem = dataHandle.getEleJson(pageId, eleIndex);
    } else {
      elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    }
    if (elem == undefined) return;
    elem['data-elem'].viewBox = val;
    dataHandle.commit('element',{
      pageId,
      eleIndex,
      key: 'viewBox',
      value: val,
      eventType: 1
    }).push(true);
  },

  /**
   * 设置svg拉伸
   * @param {String} pageIndex svg所属page的下标
   * @param {String} eleIndex 当前svg下标
   * @param {Object} vary vary
   */
  setSvgVary(pageId, eleIndex, vary) {

    let elem;
    if(typeof(pageId)!='string'){
      elem = dataHandle.getEleJson(pageId, eleIndex);
    }else{
       elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    }
    if (elem == undefined) return;
        elem['data-elem'].vary = vary;
  },

  /**
   * 设置svg重复拉伸width
   * @param {String} pageIndex svg所属page的下标
   * @param {String} eleIndex 当前svg下标
   * @param {Object} repeatWidth repeatWidth
   */
  setSvgRepeatWidth(pageId, eleIndex, repeatWidth) {
    let elem;
    if (typeof (pageId) != 'string') {
      elem = dataHandle.getEleJson(pageId, eleIndex);
    } else {
      elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    }
    if (elem == undefined) return;
    elem['data-elem']['repeat-width'] = repeatWidth;
  },

  /**
   * 设置svg变形的类型默认为等比
   * @param pageIndex
   * @param eleIndex
   * @param varyType  变化的种类
   */
  setSvgVaryType(pageId, eleIndex, varyType = 'db') {
    let elem;
    if (typeof (pageId) != 'string') {
      elem = dataHandle.getEleJson(pageId, eleIndex);
    } else {
      elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    }
    if(elem == undefined) return;
    elem['varyType'] = varyType;
  },


  /**
   * 只能横向拉伸
   */
  hx(info, json) {
    const vuexGetters = dataHandle.vuexGetters();
    const pageScale = vuexGetters.getPageScale;

    if (info.resizeType == 1) {
      let width = info.width / pageScale,
        height = info.height / pageScale,
        viewBoxOrigin = json['data-elem']['viewBox'].split(" ");
      let svgNode = vuexGetters.getFocusElemNode;

      let vary = json['data-elem']['vary'];
      let viewBoxNew = viewBoxOrigin[2] * (width / json['data-elem']['width']);
      viewBoxOrigin[2] = viewBoxNew;
      json['data-elem'].viewBox = viewBoxOrigin.join(" ");
      let eleNodes = {
        nw: {
          width: 0,
        },
        ne: {
          width: 0
        }
      };
      for (let i in vary) {
        let eleNode ;
        if(svgNode)
           eleNode = svgNode.querySelector('#' + i);
        if (eleNode != undefined) {
          eleNodes[i] = eleNode.getBBox();
        }
      }
      let changeRate = 0;
      for (let i in eleNodes) {
        let ele = eleNodes[i];
        let translate = getTransformAttr(vary[i], 'translate'),
          scale = getTransformAttr(vary[i], 'scale');

        if (i == 'ne') {

          let moveWidth = viewBoxNew - ele.x - ele.width - parseFloat(translate[0]);
          translate[0] = parseFloat(translate[0]) + moveWidth;
          vary.ne = `translate(${translate[0]},${translate[1]}) scale(${scale[0]},${scale[1]})`;
        } else if (i == 'n') {

          let moveWidth = viewBoxNew - eleNodes['nw'].width - eleNodes['ne'].width;
          let changeRate = moveWidth / ele.width;
          translate[0] = - parseFloat(ele.x) * (changeRate - 1);
          vary.n = `translate(${translate[0]},${translate[1]}) scale(${changeRate},${scale[1]})`;
        }
      }


    }

  },
  zx(info, json) {

    const vuexGetters = dataHandle.vuexGetters();
    const pageScale = vuexGetters.getPageScale;
    if (info.resizeType == 2) {
      let height = info.height / pageScale,
        viewBoxOrigin = json['data-elem']['viewBox'].split(" ");
      let svgNode = vuexGetters.getFocusElemNode;

      let vary = json['data-elem']['vary'];

      let viewBoxNew = viewBoxOrigin[3] * (height / json['data-elem']['height']);
      viewBoxOrigin[3] = viewBoxNew;
      json['data-elem']['viewBox'] = viewBoxOrigin.join(" ");
      let eleNodes = {
        sw: {
          height: 0,
        },
        nw: {
          height: 0
        }
      };
      for (let i in vary) {
        let eleNode ;
        if(svgNode)
            eleNode = svgNode.querySelector('#' + i);
        if (eleNode != undefined) {
          eleNodes[i] = eleNode.getBBox();
        }
      }
      let changeRate = 0;

      for (let i in eleNodes) {
        let ele = eleNodes[i];
        let translate = getTransformAttr(vary[i], 'translate'),
          scale = getTransformAttr(vary[i], 'scale');

        if (i == 'sw') {

          let moveHeight = viewBoxNew - ele.y - ele.height - parseFloat(translate[1]);
          if (!moveHeight){
            moveHeight = 0;
          }
          translate[1] = parseFloat(translate[1]) + moveHeight;
          vary.sw = `translate(${translate[0]},${translate[1]}) scale(${scale[0]},${scale[1]})`;
        } else if (i == 'w') {

          let moveHeight = viewBoxNew - eleNodes['nw'].height - eleNodes['sw'].height;
          let changeRate = moveHeight / ele.height;
          translate[1] = - parseFloat(ele.y)  * (changeRate - 1);
          vary.w = `translate(${translate[0]},${translate[1]}) scale(${scale[0]},${changeRate})`;
        }
      }
    }
  },
  hx_def(info, json) {
    const vuex = dataHandle.vuexGetters();
    const pageScale = vuex.getPageScale;
    let width = info.width / pageScale,
      height = info.height / pageScale;
    let hx_def = json['data-elem']['vary']['hx_def'];
    let scale = getTransformAttr(hx_def, 'scale');
    if (info.resizeType == 1) {
      let svgInfo = info['svgInfo'];
      let viewBox = json['data-elem']['viewBox'].split(" ");
      let newViewBoxW = width / json['data-elem']['width'] * viewBox[2];
      viewBox[2] =newViewBoxW;
      json['data-elem'].viewBox = viewBox.join(" ");
      json['data-elem']['repeat-width'] = newViewBoxW;
    } else if (info.resizeType == 2) {
      let viewBox = json['data-elem']['viewBox'].split(" "),
        reactHeight = parseFloat(viewBox[3]) / parseFloat(scale[1]);
    
      let originH = json['data-elem']['height'];
      viewBox[3] = parseFloat(viewBox[3] )* height / originH;

      json['data-elem'].viewBox= viewBox.join(" ");
      json['data-elem']['vary']['hx_def'] = `scale(1,${parseFloat(viewBox[3]) / reactHeight})`;
    }
  },
  zx_def(info, json) {

  },
  hs(info, json) {
    const vuexGetters = dataHandle.vuexGetters();
    const pageScale = vuexGetters.getPageScale;
    let width = info.width / pageScale,
      height = info.height / pageScale,
      viewBoxOrigin = json['data-elem']['viewBox'].split(" ");
    let svgNode = vuexGetters.getFocusElemNode;
    let eleNodes = {
      nw: {
        width: 0,
      },
      ne: {
        width: 0
      },
      n: {
        width: 0
      },
      se: {
        width: 0
      },
      s: {
        width: 0
      },
      sw: {
        width: 0
      },
      w: {
        width: 0
      },
      c: {
        width: 0
      },
      e: {
        width: 0
      }
    };
    let vary = json['data-elem']['vary'];
    if (info.resizeType == 1) {
      //横向

      let viewBoxNew = viewBoxOrigin[2] * (width / json['data-elem']['width']);
      
      viewBoxOrigin[2] = viewBoxNew;
      json['data-elem'].viewBox = viewBoxOrigin.join(" ");
      // json['data-elem']['viewBox'] = '0 0 ' + viewBoxNew + " " + viewBoxOrigin[3];

      for (let i in vary) {
        let eleNode = svgNode.querySelector('#' + i);
        if (eleNode != undefined) {
          eleNodes[i] = eleNode.getBBox();
        }
      }
      let changeRate = 0;
      for (let i in eleNodes) {
        let ele = eleNodes[i];
        let translate = getTransformAttr(vary[i], 'translate'),
          scale = getTransformAttr(vary[i], 'scale');

        if (inArray(i, ['ne', 'se', 'e'])) {

          let moveWidth = viewBoxNew - ele.x - ele.width - parseFloat(translate[0]);
          translate[0] = parseFloat(translate[0]) + moveWidth;
          vary[i] = `translate(${translate[0]},${translate[1]}) scale(${scale[0]},${scale[1]})`;
        } else if (inArray(i, ['n', 'c', 's'])) {

          let moveWidth = viewBoxNew - eleNodes['nw'].width - eleNodes['ne'].width;
          let changeRate = moveWidth / ele.width;
          translate[0] = - ele.x * (changeRate - 1);
          vary[i] = `translate(${translate[0]},${translate[1]}) scale(${changeRate},${scale[1]})`;
        }
      }


    } else if (info.resizeType == 2) {
      //纵向

      let viewBoxNew = viewBoxOrigin[3] * (height / json['data-elem']['height']);

      json['data-elem']['viewBox'] = viewBoxOrigin[0]+' '+viewBoxOrigin[1]+' ' + viewBoxOrigin[2] + " " + viewBoxNew;

      for (let i in vary) {
        let eleNode = svgNode.querySelector('#' + i);
        if (eleNode != undefined) {
          eleNodes[i] = eleNode.getBBox();
        }
      }
      let changeRate = 0;

      for (let i in eleNodes) {
        let ele = eleNodes[i];
        let translate = getTransformAttr(vary[i], 'translate'),
          scale = getTransformAttr(vary[i], 'scale');

        if (inArray(i, ['sw', 's', 'se'])) {

          let moveHeight = viewBoxNew - ele.y - ele.height - parseFloat(translate[1]);
          translate[1] = parseFloat(translate[1]) + moveHeight;
          vary[i] = `translate(${translate[0]},${translate[1]}) scale(${scale[0]},${scale[1]})`;
        } else if (inArray(i, ['w', 'c', 'e'])) {

          let moveHeight = viewBoxNew - eleNodes['nw'].height - eleNodes['sw'].height;
          let changeRate = moveHeight / ele.height;
          translate[1] = - ele.y * (changeRate - 1);
          vary[i] = `translate(${translate[0]},${translate[1]}) scale(${scale[0]},${changeRate})`;
        }
      }

    }


  },
  ry(info, json) {


    let vary  = json['data-elem']['vary'] ;
    let ry = vary['ry'];
    const vuex = dataHandle.vuexGetters();
    const pageScale = vuex.getPageScale;
    let scale = getTransformAttr(ry, 'scale'),
      width = info.width / pageScale,
      height = info.height / pageScale,
      viewBoxOrigin = json['data-elem']['viewBox'].split(" ");
    if (info.resizeType == 1) {
      //变换宽度 - viewbox 宽度 横向缩放
      let viewBoxNew = viewBoxOrigin[2] * (width / json['data-elem']['width']);
      let scaleNew = viewBoxNew / (viewBoxOrigin[2] / scale[0]);
      viewBoxOrigin[2] = viewBoxNew;
      json['data-elem'].viewBox = viewBoxOrigin.join(" ");

      vary.ry = `scale(${scaleNew},${scale[1]})`;
    } else if (info.resizeType == 2) {
      let viewBoxNew = viewBoxOrigin[3] * (height / json['data-elem']['height']);
      let scaleNew = viewBoxNew / (viewBoxOrigin[3] / scale[1]);
      viewBoxOrigin[3] = viewBoxNew;
      json['data-elem'].viewBox = viewBoxOrigin.join(" ");
    
      json['data-elem'].vary.ry = `scale(${scale[0]},${scaleNew})`;
    }

  }

}
export default svg;

