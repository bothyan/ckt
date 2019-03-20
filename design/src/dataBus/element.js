/**
 * element 数据处理层
 * created by huyg in 2017/8/16
 * phone：15280907093
 */

import { inArray, getTransformAttr, setTransformAttr } from "../common/common";
//import { setEditorState } from 'dataBus/editor.js';
//import { setToolsBarState } from 'dataBus/toolsBar.js';
import tableBus from './table.js';
import userMethods from 'dataBus/user.js';
import dataHandle from 'common/dataHandle';
import SVG from './svg.js'
import pageEvent from 'dataBus/page.js';
import editorBus from 'dataBus/editor.js';
import svgFrame from 'dataBus/svgFrame';
import pageEleBus from 'dataBus/pageEle'
import textBus from 'dataBus/text.js';
import groupBus from 'dataBus/group.js';
import svgChart from 'dataBus/svgChart.js';
import guideLineBus from 'dataBus/guideLine.js';
import pageBus from 'dataBus/page.js';
/** 
 * element对外暴露的一些方法。
*/
const element = {

  /**
   * 根据指定元素判断当前元素是不是纯色背景。
   * 
   * @param {any} pageIndex 
   * @param {any} eleIndex 
   * @returns 
   */
isFillColorBackground(pageIndex){
  let json = dataHandle.getEleJson(pageIndex, 0);
  let type = 'rect';
  if(json){
    let type = json['data-type'];
    if(type=='background'){
      let dataKind = json['data-elem']['data-img-kind'];
      if(dataKind){
        if(dataKind.indexOf('svg') > -1){
          type = 'svg';
        } else {
          type = 'img';
        }
      }
    }
  }
  return type;
},
/**
 * 
 * @param {*} pageIndex 
 * @param {*} eleIndex 
 */
initReverseType(pageIndex,eleIndex){

  let json = dataHandle.getEleJson(pageIndex, eleIndex);
  let matrix = getTransformAttr(json['reverse'], "matrix");
  let reverseType =[0,0];

    if (matrix[0] == 0) {

      reverseType[0] = 0 ;

    } else if (matrix[0] == "-1") {
      reverseType[0] = 1;
    } else {
      reverseType[0] = 0 ;
    }

    //设置纵向
    if (matrix[0] == 0) {
      reverseType[1] = 0 ;
    } else if (matrix[3] == "-1") {
      reverseType[1] = 1;
    } else {
      reverseType[1] = 0 ;
    }
   
  
  json['reverseType'] = reverseType;
},
/**
 * 
 * element的双击调用的方法
 * @param {any} pageIndex 
 * @param {any} eleIndex 
 * @param {any} childIndex 
 * @param {any} target 
 */
 elementDbclick(pageIndex, eleIndex, target){
  const json = dataHandle.getEleJson(pageIndex, eleIndex);
  const vuexActions = dataHandle.vuexActions();
  // console.log(vuexActions);
  if(json['data-type'] == 'svgFrame'){

    if(target!=undefined){
      let className = target.getAttribute('class'); 
      if(!className){
        json['focusChildIndex']  = 1;
      }else{
        json['focusChildIndex'] = className.split("_")[1] ;
      }
      //这里触发 编辑框的时候需要把这个index 传过去 因为getcutinfo要用
      let thisData =json['data-elem']['data-xhref-imgs'];
      if(!thisData[className]){
        return -1;
      }
      vuexActions.setFrameClipInfo[0](svgFrame.getSvgFrameCutInfo(pageIndex, eleIndex, json['focusChildIndex'],target));
      vuexActions.setFrameClip[0](true);
      vuexActions.setFocusElemIndex[0]({index: eleIndex});
    }
  }
 },
  /**
   * 控制element hover状态下移动的函数
   * @param {any hover点击左键的起始点} startPoint 
   * @param {any 当前元素的索引} ElemIndex 
   */

  hoverMousemove(startPoint,elemIndex){

    let me = this;
    const elem = dataHandle.getEleJson(undefined, elemIndex);

    if(!elem) return;
    
    let notFocusEleRect = pageEleBus.getNotFocusEleRectList([elemIndex]);

    if(elem==undefined) return;
    const vuex = dataHandle.vuexGetters();
    const pageScale = vuex.getPageScale;
    let pageIndex = vuex.getFocusPageIndex;
    let selectArr = vuex.getCircleSelectElements;
    
    let opacity = elem['data-elem']['opacity'] !== undefined ? elem['data-elem']['opacity'] : 1;
    let move_drag = false;

    let initOpacity = editorBus._getInitOpacity();

    let moveDrag = false;

    window.addEventListener('mousemove',_mouseMove);
    window.addEventListener('mouseup',_mouseUp);
 
    function _mouseMove(){
      let e = event || window.event;

      if(Math.abs(e.clientX - startPoint.x) > 1 || Math.abs(e.clientY - startPoint.y)) {
        moveDrag = true;
      }

      if(!moveDrag) return;

      let groupV = elem.group && groupBus.getGroupValueById(elem.group);
      if(groupV) {
        if(groupV.lock === true || groupV.lock === 'true') {
          return;
        }
      }

      if(!move_drag){
        if(elem['data-type']=='img')
          pageEvent.cloneFocusPageToMove(svgFrame.svgFrameImgHoverIn,svgFrame.svgFrameImgHoverOut);

      }
      
      move_drag = true;

      let disX = (e.clientX - startPoint.x) / pageScale,
          disY = (e.clientY - startPoint.y) / pageScale;

      let result, // 是否检测到吸附
          focusElemRect; // 焦点素材的rect

      if(groupV) {
        let groupTransform = groupV.transform;
        let translate =getTransformAttr(groupTransform,'translate');
        let rotate =getTransformAttr(groupTransform,'rotate');

        focusElemRect = groupBus.getGroupRectById(elem.group);
        focusElemRect.left += disX;
        focusElemRect.right += disX;
        focusElemRect.xMid += disX;
        focusElemRect.top += disY;
        focusElemRect.bottom += disY;
        focusElemRect.yMid += disY;
        
        // 检查是否有吸附
        result = guideLineBus.setEleAdsorption(focusElemRect, notFocusEleRect);

        if(result) {
          let focusElemRect = groupBus.getGroupRectById(elem.group),
              disX = result.newLeft - focusElemRect.left,
              disY = result.newTop - focusElemRect.top;
          selectArr.forEach(item => {
            let elem = dataHandle.getEleJson(pageIndex, item);
            let translate =getTransformAttr(elem['transform'],'translate');
            let rotate =getTransformAttr(elem['transform'],'rotate');
            translate[0] = parseFloat(translate[0])  + disX;
            translate[1] = parseFloat(translate[1]) + disY;
      
            elem['transform'] =`translate(${translate[0]},${translate[1]})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`;
            elem['data-elem']['opacity'] = 0.5;
          })
          translate[0] = parseFloat(translate[0]) + disX;
          translate[1] = parseFloat(translate[1]) + disY;
          dataHandle.getPageJson().elegroups[elem.group].transform =`translate(${translate[0]},${translate[1]})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`;
        } else {
          selectArr.forEach(item => {
            let elem = dataHandle.getEleJson(pageIndex, item);
            let translate =getTransformAttr(elem['transform'],'translate');
            let rotate =getTransformAttr(elem['transform'],'rotate');
            translate[0] = parseFloat(translate[0])  + disX;
            translate[1] = parseFloat(translate[1]) + disY;
      
            elem['transform'] =`translate(${translate[0]},${translate[1]})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`;
            elem['data-elem']['opacity'] = 0.5;
          })
          translate[0] = parseFloat(translate[0]) + disX;
          translate[1] = parseFloat(translate[1]) + disY;
          dataHandle.getPageJson().elegroups[elem.group].transform =`translate(${translate[0]},${translate[1]})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`;
        }

      } else {
        let translate = getTransformAttr(elem['transform'],'translate').map(item => parseFloat(item) );
        let rotate = getTransformAttr(elem['transform'],'rotate');

        focusElemRect = element.getFocusElemRect(undefined,elemIndex);
        focusElemRect.left += disX;
        focusElemRect.right += disX;
        focusElemRect.xMid += disX;
        focusElemRect.top += disY;
        focusElemRect.bottom += disY;
        focusElemRect.yMid += disY;
        
        // 检查是否有吸附
        result = guideLineBus.setEleAdsorption(focusElemRect, notFocusEleRect);
        if(result) {
        // debugger
          translate[0] += result.newLeft - focusElemRect.left + disX;
          translate[1] += result.newTop - focusElemRect.top + disY;
        } else {
          translate[0] = parseFloat(translate[0]) + disX;
          translate[1] = parseFloat(translate[1]) + disY;
        }
        
        elem['transform'] =`translate(${translate[0]},${translate[1]})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`;
        elem['data-elem']['opacity'] = 0.5;

      }

      if(result) {
        dataHandle.vuexActions().setGuideLineFocusEle[0](elemIndex);
        dataHandle.vuexActions().setEleDragging[0](!vuex.getEleDragging);
        let newDisX = (result.newLeft - focusElemRect.left) * pageScale,
            newDisY = (result.newTop - focusElemRect.top) * pageScale;
        startPoint.x = e.clientX + newDisX;
        startPoint.y = e.clientY + newDisY;
      } else {
        startPoint.x = e.clientX;
        startPoint.y = e.clientY;
      }
      

      //vuex.setFocusElemIndex(true);
    }  

    function _mouseUp(event) {
      window.removeEventListener('mousemove', _mouseMove);
      window.removeEventListener('mouseup', _mouseUp);

      if (!move_drag) {
        return;
      }

      dataHandle.vuexActions().setGuideLineShow[0](false);
      dataHandle.vuexActions().setCircleSelectElementsNow[0]([]);

      if (elem.group && groupBus.getGroupValueById(elem.group)) {
        editorBus._setInitOpacity(initOpacity);
        pageEleBus.setGroupByGroupId(elem.group);
      }
      else {
        elem['data-elem']['opacity'] = opacity;
      }

      if(!elem.group || !groupBus.getGroupValueById(elem.group)) {
        element.dispatchCommit({
          pageIndex,
          eleIndex:elemIndex,
          type:3
        })      
      }

      if(document.getElementById('page-clone')){
        let frameIndex = svgFrame.getCurrentSvgFrameIndex()
        if(frameIndex != -1){
          let json = dataHandle.getEleJson(pageIndex,frameIndex)
          if(!json) return;
          let value = json['data-elem']['data-xhref-imgs'];
          let tempValue = JSON.parse(JSON.stringify(value));
          //剔除掉闲杂属性
          for (let i in tempValue){
            let v = tempValue[i];
            delete v.EditorImg;
            delete v.imgUrl;
            delete v.fromLeft;
            tempValue[i] = v;
          }
          dataHandle.commit('element',{
            pageIndex,
            eleIndex:frameIndex,
            key:'data-xhref-imgs',
            value: tempValue,
            eventType:1
          });
        }        
        svgFrame.setCurrentSvgFrameIndex(-1);
        pageEvent.removePageClone();
      }    
      let targClass =event.target.parentNode.getAttribute("class");
      
      if (elem['data-type'] == 'img' && !elem.group) {
        if(targClass == 'layoutImgWrap') {
          dataHandle.commit('element',{
            pageIndex,
            eleIndex:elemIndex,
            key:null,
            value:null,
            eventType:3
          });
          
          pageEleBus.delElement(pageIndex, elemIndex);
          pageBus.elementBlur();
        }
        else {
          dataHandle.$vue.$store.dispatch('setFocusElemIndex', {
            index: elemIndex,
            eleType: 'img'
          })
          editorBus.setEditorState();
          dataHandle.$vue.$store.dispatch('setEditorShow', true);
        }
        //dataHandle.push();
      }      

      if(elem.group && groupBus.getGroupValueById(elem.group)) {
        selectArr.forEach(item => {
          dataHandle.commit('element', {
            pageIndex,
            eleIndex: item,
            key: 'transform',
            value: me.getTransform(pageIndex, item),
            eventType: 1
          })
        })
        groupBus.dispatchCommit('transform', elem.group);
      }
      move_drag = false;
      // console.log('ok!')
      dataHandle.$vue.$nextTick(() => {
        dataHandle.push();
      })

    }
  },
  /**
   * 设置元素位置和变形数据
   * @param {Obj} info 移动的相关变化
   * @param {int} pageIndex 当前元素所在页面所引
   * @param {int} elemIndex 当前操作元素索引
   */
  setElemInfo(info, pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);
    if(elem == undefined)
     return;
    let vuex = dataHandle.vuexGetters();
    let elemVaryType =elem.varyType||'db';
    pageIndex = pageIndex || vuex.getFocusPageIndex;
    elemIndex = elemIndex || vuex.getFocusElemIndex;

    let pageScale = vuex.getPageScale;
    let width = info.width / pageScale,
      height = info.height / pageScale;
    let translate =[info.left / pageScale,info.top / pageScale]
    let transform = `translate(${translate[0]},${translate[1]})rotate(${info.rotate},${width / 2},${height / 2})`;
    let  reverseTranslate = getTransformAttr(elem['reverse'],'translate');
    let  matrix = getTransformAttr(elem['reverse'],'matrix');
   
    //判断有没有反转
    if(matrix[3]!=undefined){
      let trans = [0,0];
        if(reverseTranslate[0] < 0 && reverseTranslate[1] == 0){
          trans[0] = -width;
        }else if(reverseTranslate[0] == 0 && reverseTranslate[1] < 0){
          trans[1] = -height;
        }
        else if(reverseTranslate[1] < 0&&reverseTranslate[0] < 0){
          trans[0] = -width;
          trans[1] = -height;
        }
        elem.reverse = 'rotate(0,0,0) matrix(' + matrix[0] + ',0,0,' + matrix[3] + ',0,0) translate('+trans[0]+',' +trans[1] + ')';
    }

    //  'rotate(0,0,0) matrix(' + matrix[0] + ',0,0,' + matrix[3] + ',0,0) translate(' + translate[0] + ',' + translate[1] + ')';
    if (info.resizeType !== 0) {
      switch (elemVaryType) {
        case 'hx_def':
          SVG.hx_def(info, elem);
          break;
        case 'hx':
          SVG.hx(info, elem);
          break;
        case "hs":
          SVG.hs(info, elem);
          break;
        case "ry":
          SVG.ry(info, elem);
          break;
        case "zx":
          SVG.zx(info, elem);
          break;
          
      }
      if (elem['data-type'] === 'table') {
        tableBus.resizeTable(info, elem);
      }
      if (elem['data-type'] === 'svgChart') {
        svgChart.resizeTable(info, elem);
      }
      if(elem['data-type'] === 'text' ){
        textBus.resizeText(info,elem, elem['data-elem']['width'] / width);
      }
      elem['data-elem']['width'] = width;
      elem['data-elem']['height'] = height;

      //setToolsBarState();
    }
    if(info.opacity !== undefined){
      elem['data-elem']['opacity'] = info.opacity;
    }
    elem['transform'] = transform;
   
  },
  /**
   * 设置svg的 translate 
   * @param {any} [translate=[0,0]] 
   */
 setElementTranslate(translate, pageIndex, elemIndex){
      const elem = dataHandle.getEleJson(pageIndex, elemIndex);
      let rotate =getTransformAttr(elem['transform'],'rotate');
      let oldTranslate =getTransformAttr(elem['transform'],'translate');
      translate[0] = translate[0]!=undefined?translate[0]:oldTranslate[0];
      translate[1] =  translate[1]!=undefined?translate[1]:oldTranslate[1];
      elem['transform']  = `translate(${translate[0]},${translate[1]})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`;
    },
  /**
   * [changeFocusElemSize description] 改变当前操作素材尺寸
   * @param  {[Object]} option    [description] 改变后的值
   *                     {
   *                       width, 
   *                       height,
   *                       type   1为宽度改变，2为高度改变
   *                     }
   * @param  {[type]} pageIndex [description]
   * @param  {[type]} eleIndex  [description]
   */
  changeFocusElemSize(option, pageIndex, eleIndex) {

    let vuexGetters = dataHandle.vuexGetters(),
      elem = dataHandle.getEleJson(pageIndex, eleIndex),
      translate = getTransformAttr(elem.transform, 'translate'),
      rotate = getTransformAttr(elem.transform, 'rotate'),
      width = option.width,
      height = option.height,
      resizeType = option.type;

    if (elem.varyType==='db' || elem['data-type'] === 'img' || elem['data-type'] === 'svgChart' || elem['data-type'] === 'svgFrame') {

      if (resizeType === 1) {
        height = width / elem['data-elem'].width * elem['data-elem'].height;
      } else if (resizeType === 2) {
        width = height / elem['data-elem'].height * elem['data-elem'].width;
      }
    }
    let transform = `translate(${translate[0] - (width - elem['data-elem'].width) / 2},${translate[1] - (height - elem['data-elem'].height) / 2})rotate(${rotate[0]},${width / 2},${height / 2})`;
    let pageScale = dataHandle.vuexGetters().getPageScale,
      info = {
        width: width * pageScale,
        height: height * pageScale,
        resizeType
      };

    switch (elem.varyType) {
      case 'hx_def':
        SVG.hx_def(info, elem);
        break;
      case 'hx':
        SVG.hx(info, elem);
        break;
      case "hs":
        SVG.hs(info, elem);
        break;
      case "ry":
        SVG.ry(info, elem);
        break;
      case "zx":
        SVG.zx(info, elem);
        break;
    }
    if (elem['data-type'] === 'table') {
      tableBus.resizeTable(info, elem);
    }
    if (elem['data-type'] === 'svgChart') {
      svgChart.resizeTable(info, elem);
    }
    if(elem['data-type'] === 'text' ){
      textBus.resizeText(info,elem, elem['data-elem']['width'] / width);
    }
    elem.transform = transform;
    elem['data-elem'].width = width;
    elem['data-elem'].height = height;
    if (vuexGetters.getFocusElemIndex > -1) {
      //setToolsBarState();
      //setEditorState();
    }
  },
  /**
   * 对外提供element基本属性
   * @param {*当前元素所在页面索引} pageIndex 
   * @param {*当前元素索引} eleIndex 
   */
  getElemRect(pageIndex, eleIndex) {
     let vuexGetters = dataHandle.vuexGetters();

    pageIndex = pageIndex !== undefined ? pageIndex : vuexGetters.getFocusPageIndex;
    eleIndex = eleIndex !== undefined ? eleIndex : vuexGetters.getFocusElemIndex;

    return _getElemRect(dataHandle.getEleJson(pageIndex, eleIndex));
  },
  getEleIsLoading(pageIndex, eleIndex) {
    let ele = dataHandle.getEleJson(pageIndex, eleIndex);
    return !!ele.loading // Boolean
  },
  
  setLeft(v, pageIndex, eleIndex) {
    let ele = dataHandle.getEleJson(pageIndex, eleIndex);
    let translate = getTransformAttr(ele.transform,'translate');
    translate[0] = v;
    element.setElementTranslate(translate, pageIndex, eleIndex);
  },
  
  setLeftDis(v, pageIndex, eleIndex) {
    let ele = dataHandle.getEleJson(pageIndex, eleIndex);
    let translate = getTransformAttr(ele.transform,'translate');
    translate[0] = parseFloat(translate[0]) + v;
    element.setElementTranslate(translate, pageIndex, eleIndex);
  },
  setTop(v, pageIndex, eleIndex) {
    let ele = dataHandle.getEleJson(pageIndex, eleIndex);
    let translate = getTransformAttr(ele.transform,'translate');
    translate[1] =v;
    element.setElementTranslate(translate, pageIndex, eleIndex);
  },
  setTopDis(v, pageIndex, eleIndex) {
    let ele = dataHandle.getEleJson(pageIndex, eleIndex);
    let translate = getTransformAttr(ele.transform,'translate');
    translate[1] = parseFloat(translate[1]) + v;
    element.setElementTranslate(translate, pageIndex, eleIndex);
  },
  setWidth(v, pageIndex, eleIndex) {
    let elem = dataHandle.getEleJson(pageIndex, eleIndex);
    if(elem == undefined) return;

    elem['data-elem'].width = v;
  },
  setWidthByPageId(v, pageId, eleIndex) {
    let elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    if(elem == undefined) return;

    elem['data-elem'].width = v;
  },
  setW(v, pageIndex, eleIndex) {
    let elem = dataHandle.getEleJson(pageIndex, eleIndex);

    elem['data-elem'].w = v;
  },
  setHeight(v, pageIndex, eleIndex) {
    let elem = dataHandle.getEleJson(pageIndex, eleIndex);
    if(elem == undefined) return;

    elem['data-elem'].height = v;
  },
  setHeightByPageId(v, pageId, eleIndex) {
    let elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    if(elem == undefined) return;

    elem['data-elem'].height = v;
  },
  setTransform(v, pageIndex, eleIndex) {
    let elem = dataHandle.getEleJson(pageIndex, eleIndex);

    elem.transform = v;
  },
  setTransformByPageId(v, pageId, eleIndex) {
    let elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    if(elem == undefined) return;

    elem.transform = v;
  },
  setMaterialIdByPageId(v, pageId, eleIndex) {
    let elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    if(elem == undefined) return;

    elem['data-elem']['id'] = v;
  },
  /**
   * 置空 data-elem 内某个 key 的值
   * @param key
   * @param pageId
   * @param eleIndex
   */
  emptyDataElemValue(key, pageId, eleIndex) {
    let elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);

    elem['data-elem'][key] = '';
  },
  setViewBox(v, pageIndex, eleIndex) {
    let elem = dataHandle.getEleJson(pageIndex, eleIndex);

    elem['data-elem'].viewBox = v;
  },
  setFontSize(v, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json['data-elem']['font-size'] = v;
  },
  setMaterialId(v, pageIndex, eleIndex) {
    let elem = dataHandle.getEleJson(pageIndex, eleIndex);

    elem['data-elem'].id = v;
  },
  /**
   * 设置element透明度的一个方法
   * @param {*当前元素所在页面索引} pageIndex 
   * @param {*当前元素索引} eleIndex 
   * @param {*需要设置的透明度的值 默认1} val 
   */
  setOpacity(val = 1, pageIndex, eleIndex) {
 
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    if (json != undefined) {
      json['data-elem']['opacity'] = val;
    }
    return json['data-elem']['opacity'];
  },

	setReverseStr(val,pageIndex,eleIndex){
		let json = dataHandle.getEleJson(pageIndex, eleIndex);
		if(json){
			json.reverse=val
    }
  },
  getReverse(pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    return json['reverse'];
  },
  /**
   * 设置元素反转属性啊
   * @param {*当前元素所在页面索引} pageIndex 
   * @param {*当前元素索引} eleIndex 
   * @param {*需要设置的反转的值} val （1上下反转 2 左右翻转 3恢复原状）
   */
  setReverse(val, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);

    let matrix = getTransformAttr(json['reverse'], "matrix");
    let translate = getTransformAttr(json['reverse'], "translate");
    let reverseType = json.reverseType || [0,0];
    // 设置横向
    if (val == 1) {
      if (matrix[0] == 0) {
        matrix = [-1, 0, 0, 1, 0, 0];
        reverseType[0] = 1 ;
        translate[0] = -json['data-elem']['width'];
      } else if (matrix[0] == "-1") {

        matrix[0] = 1;
        translate[0] = 0;
        reverseType[0] = 0;
      } else {
        reverseType[0] = 1 ;
        matrix[0] = -1;
        translate[0] = -json['data-elem']['width'];
      }
      
    } else if (val == 2) {
      //设置纵向
      if (matrix[0] == 0) {

        matrix = [1, 0, 0, -1, 0, 0];
        translate[1] = -json['data-elem']['height'];
        reverseType[1] = 1 ;
      } else if (matrix[3] == "-1") {

        matrix[3] = 1;
        translate[1] = 0;
        reverseType[1] = 0;
      } else {

        matrix[3] = -1;
        translate[1] = -json['data-elem']['height'];
        reverseType[1] = 1 ;
      }
     
    }
    json.reverse = 'rotate(0,0,0) matrix(' + matrix[0] + ',0,0,' + matrix[3] + ',0,0) translate(' + translate[0] + ',' + translate[1] + ')';
    json.reverseType = reverseType;
    return json.reverse ;
  },
  /**
   * 通过字符串的方式设置反转属性
   * s
   * @param {any} str 
   * @param {any} pageIndex s
   * @param {any} eleIndex 
   * @returns 
   */
  setReverseStr(str,pageIndex,eleIndex){
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    json.reverse = str;
    return str;
  },
  setLock(val, pageIndex, eleIndex) {
    dataHandle.getEleJson(pageIndex, eleIndex)['data-elem'].lock = val;
  },
  /**
   * 设置锁定状态
   * @param {*当前元素所在页面索引} pageIndex 
   * @param {*当前元素索引} eleIndex 
   * @param {*需要设置的值} val 
   */
  setLockForEdit(val, pageIndex, eleIndex) {
    let vuexGetters = dataHandle.vuexGetters(),
        vStore = dataHandle.$vue.$store,
        groupFlag = vuexGetters.getGroupFlag,
        type = vuexGetters.getToolsBarType;

    pageIndex = pageIndex !== undefined ? pageIndex : vuexGetters.getFocusPageIndex;
    eleIndex = eleIndex !== undefined ? eleIndex : vuexGetters.getFocusElemIndex;

    //框选或者组合
    if(type === 'selects' || groupFlag) {
      //组合
      if(groupFlag) {
        let groupId = vuexGetters.getGroupId,
            pageJson = dataHandle.getPageJson();

        pageJson.elegroups[groupId].lock = val;

        groupBus.dispatchCommit('lock').push();
      } 
      //框选
      else {
        let transform = editorBus.getEditorTransform(),
            pageJson = dataHandle.getPageJson(),
            elems = pageJson.elems,
            selectArr = vuexGetters.getCircleSelectElements,
            newGroupId = 'element_group_' + new Date().getTime();

        pageJson.elegroups[newGroupId] = {
          transform,
          lock: true
        }

        selectArr.forEach(item => {
          elems[item].group = newGroupId;
          elems[item]['group-transform'] = transform;

          dataHandle.commit('element',{
            pageIndex,
            eleIndex: item,
            key: 'group',
            value: newGroupId,
            eventType: 1
          })

          dataHandle.commit('element',{
            pageIndex,
            eleIndex: item,
            key: 'group-transform',
            value: transform,
            eventType: 1
          })

        })

        dataHandle.commit('group', {
          pageIndex,
          eleIndex: newGroupId,
          key: null,
          value: pageJson.elegroups[newGroupId],
          eventType: 0
        }).push();

        vStore.dispatch('setGroupFlag', true);
        vStore.dispatch('setGroupId', newGroupId);
      }
    }
    //单个
    else {
      let json = dataHandle.getEleJson(pageIndex, eleIndex);

      if (json != undefined) {
        json['data-elem'].lock = val;
      }
      dataHandle.commit('element', {
        pageIndex,
        eleIndex,
        key:'lock',
        value:val,
        eventType:1
      }).push();
    }
  },
  /**
   * 设置阴影状态
   * @param {*当前元素所在页面索引} pageIndex 
   * @param {*当前元素索引} eleIndex 
   * @param {*需要设置的值} val 
   */
  setShadow(val, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    if (json != undefined) {
      json['data-elem'].shadow = val;
    }
    return val ;
  },
  /**
   * 设置颜色 ps 只有svg和文字能设置颜色吧？
   * @param {*颜色的索引 设置对象颜色的时候请设置为null} key 
   * @param {*需要设置的值 string/object} val 
   * @param {*当前元素所在页面索引} pageIndex 
   * @param {*当前元素索引} eleIndex 
   */
  setColor(key , val, pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    if (json != undefined) {
     
     if(key == null && typeof(val) =='object'  ){
      json['data-elem']['data-colors'] = val;
     }else{
      json['data-elem']['data-colors'][key] = val;
     }
     
    }
    return json['data-elem']['data-colors'];
  },
  setLoading(val,pageId,eleIndex){
    let elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    if(elem == undefined) return;
    elem.loading = val;
  },
  setIsCut(val, pageIndex, eleIndex) {
    let elem = dataHandle.getEleJson(pageIndex, eleIndex);

    elem['data-elem'].isCut = val;
  },
  setImgWidth(val, pageIndex, eleIndex) {
    let elem = dataHandle.getEleJson(pageIndex, eleIndex);

    elem['data-elem'].imgWidth = val;
  },
  setImgHeight(val, pageIndex, eleIndex) {
    let elem = dataHandle.getEleJson(pageIndex, eleIndex);

    elem['data-elem'].imgHeight = val;
  },

  setGroup(v,pageIndex, eleIndex){
	  let json = dataHandle.getEleJson(pageIndex, eleIndex);
	  if (json != undefined) {
	    json.group=v
	  }
  },

  setGroupTransform(v,pageIndex, eleIndex){
	  let json = dataHandle.getEleJson(pageIndex, eleIndex);
	  if (json != undefined) {
	    json['group-transform']=v
	  }
  },

  /**
   * 添加收藏素材
   */
  // addToCollection() {
  //   let json = dataHandle.getEleJson();
  //   userMethods.addCollectedMaterialId(json['data-elem'].id);
  // },

  /**
   * 设置焦点elem
   * @param {int} index 
   * @param {Node} eleNode 
   */
  setFocusElemIndex(opts) {
    let index = opts.index,
      eleNode = opts.eleNode,
      vuexActions = dataHandle.vuexActions();

    let json = dataHandle.getEleJson(undefined, index);
  
    let eleType = json && json['data-type'];

    // 如果是svg情况下必须要有eleNode
    if(eleType == 'svgImage' && eleNode == undefined) {

      eleNode = document.getElementById('svgNode' + json.eleid); 
   
    }

    // console.log(eleNode);
    vuexActions.setFocusElemIndex[0]({
      index: index,
      eleNode: eleNode,
      eleType: eleType
    })

  },

  /**
   * [setSelectElementInfo description] 设置框选元素位置和大小
   * @param {[Object]} option [配置属性]
   *                   {
   *                     leftDis,   //左边变化量
   *                     topDis,    //右边变化量
   *                     widthScale,//宽度缩放比
   *                     heightScale //高度缩放比
   *                   }
   */
  setSelectElementInfo(option, type) {
    let vuexGetters = dataHandle.vuexGetters(),
        pageIndex = vuexGetters.getFocusPageIndex,
        pageScale = vuexGetters.getPageScale,
        selectArr = vuexGetters.getCircleSelectElements;

    for(let i = 0, l = selectArr.length; i < l; i++) {
      let elem = dataHandle.getEleJson(pageIndex, selectArr[i]),
          width = elem['data-elem'].width * option.widthScale,    //改变后的宽度
          height = elem['data-elem'].height * option.heightScale,  //改变后的高度
          rect = _getElemRect(elem),                            //获取之前的left
          translate = getTransformAttr(elem.transform, 'translate').map( item => parseFloat(item) ),
          left = option.leftDis / pageScale + translate[0],
          top = option.topDis / pageScale + translate[1];

      if(option.widthScale !== 1 || option.heightScale !== 1) {
        let leftDistance = (rect.left - option.left  / pageScale) * option.widthScale,
            topDistance = (rect.top - option.top / pageScale) * option.heightScale,
            rotate = getTransformAttr(elem.transform, 'rotate');

        let result = _calcElemPosByRect({
              left: leftDistance + (option.left+option.leftDis) / pageScale,
              top: topDistance + (option.top+option.topDis) / pageScale,
              width: width,
              height: height,
              rotate: parseFloat(rotate[0])
            });

        left = result.left ;
        top = result.top ;

        this.setElemInfo({
          left: left * pageScale,
          top: top * pageScale,
          width: width*pageScale,
          height: height*pageScale,
          rotate: parseFloat(rotate[0]),
          resizeType: 3
        }, pageIndex, selectArr[i]);
      }
      else {
        elem['data-elem'].width = width;
        elem['data-elem'].height = height;
        if(type) {
          elem['data-elem'].opacity = 0.5;
        }
        elem.transform = elem.transform.replace(/translate\(.+?\)/, `translate(${left},${top})`);
      }
    }
  },

  calcElemPosByRect(rect) {
    let reto = {},
      rotate = rect.rotate,
      width = rect.width,
      height = rect.height,
      left = rect.left,
      top = rect.top,
      angle = Math.atan( height / width ) * 180 / Math.PI,
      r = Math.sqrt( width * width + height * height, 2) / 2,
      cos1 = Math.abs(Math.cos( (180 - angle - rotate) / 180 * Math.PI)),
      sin1 = Math.abs(Math.sin( (180 - angle - rotate) / 180 * Math.PI)),
      cos2 = Math.abs(Math.cos( (angle - rotate) / 180 * Math.PI)),
      sin2 = Math.abs(Math.sin( (angle - rotate) / 180 * Math.PI)),
      cos = Math.max(cos1, cos2),
      sin = Math.max(sin1, sin2);

    reto = {
      left: left + r * cos - width / 2,
      top: top + r * sin - height / 2
    }
    return reto;
  },
  /**
   * [getFocusElemRect 获取当前操作元素在画布的矩形，可能是组合素材]
   * @param  {[type]} pageIndex [description]
   * @param  {[type]} elemIndex [description]
   * @return {[type]}           [description]
   */
  getFocusElemRect(pageIndex, elemIndex) {
    let vuexGetters = dataHandle.vuexGetters(),
        toolsBarType = vuexGetters.getToolsBarType;

    if(toolsBarType === 'selects') {
      return _getSelectElemRect();
    }

    pageIndex = pageIndex !== undefined ? pageIndex : vuexGetters.getFocusPageIndex;
    elemIndex = elemIndex !== undefined ? elemIndex : vuexGetters.getFocusElemIndex;

    return _getElemRect(dataHandle.getEleJson(pageIndex, elemIndex));
  },

  /**
   * [getTransform 获取指定元素transform属性]
   * @param  {[Number]} pageIndex [画布索引]
   * @param  {[Number]} elemIndex [素材索引]
   * @return {[String]}           [指定素材transform]
   */
  getTransform(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);

    return elem.transform;
  },
  getTransformByPageId(pageId, elemIndex) {
    let elem = dataHandle.getEleJsonByPageId(pageId, elemIndex);

    return elem.transform;
  },
  getMaterialIdByPageId(pageId, elemIndex) {
    let elem = dataHandle.getEleJsonByPageId(pageId, elemIndex);
    
    return elem['data-elem'].id;
  },
  /**
   * 取得指定元素的type
   * @param  {Number} pageIndex 
   * @param  {Number} eleIndex 
   * @return {String} type
   */
  getEleType(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);

    return elem['data-type'];
  },
  /**
   * [getWidth 获取指定元素width属性]
   * @param  {[Number]} pageIndex [画布索引]
   * @param  {[Number]} elemIndex [素材索引]
   * @return {[Number]}           [指定素材width]
   */
  getWidth(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);

    return parseFloat(elem['data-elem'].width);
  },
  /**
   * [getHeight 获取指定元素Height属性]
   * @param  {[Number]} pageIndex [画布索引]
   * @param  {[Number]} elemIndex [素材索引]
   * @return {[Number]}           [指定素材Height]
   */
  getHeight(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);

    return parseFloat(elem['data-elem'].height);
  },
  /**
   * [getViewBox 获取指定元素viewBox属性]
   * @param  {[Number]} pageIndex [画布索引]
   * @param  {[Number]} elemIndex [素材索引]
   * @return {[String]}           [指定素材viewBox]
   */
  getViewBox(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);

    return elem['data-elem'].viewBox;
  },
  /**
   * [getOpacity 获取指定元素Opacity属性]
   * @param  {[Number]} pageIndex [画布索引]
   * @param  {[Number]} elemIndex [素材索引]
   * @return {[String]}           [指定素材Opacity]
   */
  getOpacity(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);

    return elem['data-elem'].opacity;
  },

  getIsCut(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);

    return elem['data-elem'].isCut || false;
  },
  getImgWidth(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);

    return elem['data-elem'].imgWidth;
  },
  getImgHeight(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);

    return elem['data-elem'].imgHeight;
  },
  /**
   * 隐藏元素
   * @param pageIndex
   * @param elemIndex
   */
  hideElement(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);

    elem['data-elem'].hide = true;
  },
  /**
   * 显示元素
   * @param pageIndex
   * @param elemIndex
   */
  showElement(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);

    elem['data-elem'].hide = false;
  },
  getVary(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);
    if(elem){
      return  elem['data-elem']['vary'];
    }
  },
  getReapeatWidth(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);
    if(elem){
      return  elem['data-elem']['repeat-width'];
    }
  },
  /**
   * 设置保存
   * @param {Object} opts
   * type: 更改类型, 1为resize，2为rotate，3为move 
   */
  dispatchCommit(opts) {
    let vuex = dataHandle.vuexGetters();
    let type = opts.type;
    let resizeType = opts.resizeType;
    let pageIndex=opts.pageIndex!==undefined?opts.pageIndex:vuex.getFocusPageIndex,
     eleIndex=opts.eleIndex!==undefined?opts.eleIndex:vuex.getFocusElemIndex;

    let elem_type = this.getEleType(pageIndex, eleIndex);

    // commit数据
    let saveCommit = {};
    switch(type) {
      case 1: 
        saveCommit.width = this.getWidth(pageIndex, eleIndex);
        saveCommit.height = this.getHeight(pageIndex, eleIndex);
        saveCommit.reverse = this.getReverse(pageIndex, eleIndex);
        if(elem_type == 'text') {
          saveCommit['font-size'] = textBus.getFontSize(pageIndex, eleIndex);
        }
        if(resizeType !=3 && resizeType != 0){
            if(this.getVary(pageIndex, eleIndex)){
              saveCommit.vary = this.getVary(pageIndex, eleIndex);
              saveCommit.viewBox = this.getViewBox(pageIndex, eleIndex);
            }
            if(this.getReapeatWidth(pageIndex, eleIndex)){
              saveCommit['repeat-width'] = this.getReapeatWidth(pageIndex, eleIndex);
            }
        }
      case 2:
      case 3:
        saveCommit.transform = this.getTransform(pageIndex, eleIndex);
    }

    // commit
    for(let key in saveCommit) {
      if( saveCommit.hasOwnProperty(key) ) {
        dataHandle.commit('element', {
          pageIndex,
          eleIndex,
          key,
          value: saveCommit[key],
          eventType: 1
        })
      }
    }

    return dataHandle;
  }
  
}

function _getSelectElemRect() {
  let vuexGetters = dataHandle.vuexGetters(),
        selects = vuexGetters.getCircleSelectElements,
        elems = dataHandle.getPageJson().elems,
        pageScale = vuexGetters.getPageScale;

    //初始化返回值
    let info = _getElemRect(elems[selects[0]]);

    for(let i = 1, l = selects.length; i < l; i++) {
      let rect = _getElemRect(elems[selects[i]]);
      if(rect.left < info.left) {
        info.left = rect.left;
      }
      if(rect.top < info.top) {
        info.top = rect.top;
      }
      if(rect.right > info.right) {
        info.right = rect.right;
      }
      if(rect.bottom > info.bottom) {
        info.bottom = rect.bottom;
      }
    }

    info.width = (info.right - info.left);
    info.height = (info.bottom - info.top);
    info.left = info.left;
    info.top = info.top;

    return info;
}

function _getElemRect(elem) {
  let reto = {},
      translate = getTransformAttr(elem.transform, 'translate'),
      rotate = getTransformAttr(elem.transform, 'rotate')[0],
      width = elem['data-elem'].width,
      height = elem['data-elem'].height,
      angle = Math.atan( height / width ) * 180 / Math.PI,
      r = Math.sqrt( width * width + height * height, 2) / 2,
      cos1 = Math.abs(Math.cos( (180 - angle - rotate) / 180 * Math.PI)),
      sin1 = Math.abs(Math.sin( (180 - angle - rotate) / 180 * Math.PI)),
      cos2 = Math.abs(Math.cos( (angle - rotate) / 180 * Math.PI)),
      sin2 = Math.abs(Math.sin( (angle - rotate) / 180 * Math.PI)),
      cos = Math.max(cos1, cos2),
      sin = Math.max(sin1, sin2),
      origin = {
        x: parseFloat(translate[0]) + width / 2,
        y: parseFloat(translate[1]) + height / 2
      };

  let l1 = origin.x + cos * r,
      l2 = origin.x - cos * r,
      t1 = origin.y + sin * r,
      t2 = origin.y - sin * r;

      

  reto.left = l1 < l2 ? l1 : l2; 
  reto.top = t1 < t2 ? t1 : t2;
  reto.width = Math.abs(l1 - l2);
  reto.height = Math.abs(t1 - t2);
  reto.right = reto.left + reto.width;
  reto.bottom = reto.top + reto.height;

  return reto;
}
//left, top, width, height, rotate
function _calcElemPosByRect(rect) {
  let reto = {},
      rotate = rect.rotate,
      width = rect.width,
      height = rect.height,
      left = rect.left,
      top = rect.top,
      angle = Math.atan( height / width ) * 180 / Math.PI,
      r = Math.sqrt( width * width + height * height, 2) / 2,
      cos1 = Math.abs(Math.cos( (180 - angle - rotate) / 180 * Math.PI)),
      sin1 = Math.abs(Math.sin( (180 - angle - rotate) / 180 * Math.PI)),
      cos2 = Math.abs(Math.cos( (angle - rotate) / 180 * Math.PI)),
      sin2 = Math.abs(Math.sin( (angle - rotate) / 180 * Math.PI)),
      cos = Math.max(cos1, cos2),
      sin = Math.max(sin1, sin2);

  reto = {
    left: left + r * cos - width / 2,
    top: top + r * sin - height / 2
  }
  return reto;
}


export default element;