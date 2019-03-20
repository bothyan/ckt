/*
 * 画布相关操作
 * @Author: zhangdi
 * @Date: 2017-09-05 11:26:00 
 * @Last Modified by: bianhao
 * @Last Modified time: 2017-11-23 14:56:29
 */

import dataHandle from 'common/dataHandle';
import designHandle from 'dataBus/design';
import elementHandle from 'dataBus/element';
import editorHandle from 'dataBus/editor';
import pageEleHandle from 'dataBus/pageEle';
import groupHandle from 'dataBus/group';
import { elementJsonHandle, getTransformAttr, getBaseLineFromTop, getLineHeightOld } from 'common/common';

const page = {

initPageJson(opts) {
  let vuexGetters = dataHandle.vuexGetters(),
      pageSum = vuexGetters.getPageSum,
      json = [];

  if(opts.json) {
    json[0] = page.resetBaseLine(JSON.parse(opts.json), opts.firstPageId);
  } else {
    json[0] = page.getBlankPageJson();
  }

  // json[0] = opts.json ? JSON.parse(opts.json) : page.getBlankPageJson();

  for (let i = 0; i < json.length; i++) {
    if(!json[i].elegroups) json[i].elegroups = {};
  }
  // 处理json
  json = _handleJson(json);

  for (let i = 1; i < pageSum; i++) {
    json[i] = '';
  }

  let vuexAcitons = dataHandle.vuexActions();
  vuexAcitons.setPagesJson[0](json);

},

/**
 * 获取一个新的Id
 */
getNewPageId(i) {
  let vuexGetters = dataHandle.vuexGetters(),
      designId = vuexGetters.getDesignInfo.designId,
      userId = vuexGetters.getUserInfo.userId,
      time = new Date().getTime().toString().slice(-7),
      newPageId;
  designId = designId.toString().replace(/-/g, '').slice(-8);
  if(i) {
    i = i.toString();
    time = time.slice(i.length) + i;
  }
  time = '0000000' + time;
  time = time.slice(-7);
  if(userId) {
    userId = '00000000' + userId;
    userId = userId.toString().slice(-8);
  } else {
    userId = '';
  }
  // if(window.api) {
  //   // 用户ID 后八位为api access的后八位
  //   let access = vuexGetters.getApiInfo['data-access'].toString();
  //   access = '00000000' + access;
  //   userId = access.slice(-8);
  // }
  newPageId = '0' + designId + time + userId;
  return newPageId;
},

/**
 * 获取一个空白画布json
 */
getBlankPageJson() {
  let vuexGetters = dataHandle.vuexGetters(),
      pageWidth = vuexGetters.getPageWidth,
      pageHeight = vuexGetters.getPageHeight;
  let page = {
    "elems": [{
      "data-type": "background",
      "data-elem": {
        "width": pageWidth,
        "height": pageHeight,
        "opacity": 1,
        "lock": true,
        "data-key":"false",
        "data-colors":{
          "0":"rgb(255, 255, 255)"
        },
        'filter': {
          "brightness": 0,
          "contrast": 0,
          "crossProcess": 0,
          "gaussianBlur": 0,
          "saturation": 0,
          "tint": 0
        },
        'shadow': {
          "blur":30,
          "offset":50,
          "opacity":0.25,
          "show":false
        }
      },
      "transform": "translate(0,0)"
    }],
    "elegroups":{},
    "v":"2.0.0"
  }
  return JSON.parse(JSON.stringify(page));
},

/**
 * 获取画布带单位的宽高
 */
getPageWHWithUnit() {
  let unit = designHandle.getDesignInfo().unit,
      pageW = dataHandle.vuexGetters().getPageWidth,
      pageH = dataHandle.vuexGetters().getPageHeight,
      newWidth,
      newHeight;
  if(unit == 'cm') {
    newWidth = (pageW / 300 / 0.3937008).toFixed(8).toString() + unit;
    newHeight = (pageH / 300 / 0.3937008).toFixed(8).toString() + unit;
  } else if(unit == 'mm') {
    newWidth = (pageW / 30 / 0.3937008).toFixed(8).toString() + unit;
    newHeight = (pageH / 30 / 0.3937008).toFixed(8).toString() + unit;
  } else {
    newWidth = pageW.toString() + unit;
    newHeight = pageH.toString() + unit;
  }
  return {
    pageWidth: newWidth,
    pageHeight: newHeight
  }
},

/**
 * 添加画布
 * @param {String} newJson 画布的Json
 * @param {String} pageIndex 新画布所属page的下标
 */
addPage(newJson, pageIndex,newPageId) {
  let pagesJson = dataHandle.getPagesJson(),
      pageIdList = dataHandle.vuexGetters().getPageIdList;
  pageIndex = pageIndex === null || pageIndex === undefined ? dataHandle.vuexGetters().getFocusPageIndex + 1 : pageIndex;
  pagesJson.splice(pageIndex, 0, newJson);
  pageIdList.splice(pageIndex, 0, newPageId);
  dataHandle.update();
  return JSON.parse(JSON.stringify(newJson));
},

/**
 * 删除画布
 * @param {String} pageIndex 画布所属page的下标
 */
delPage(pageIndex) {
  let vuexGetters = dataHandle.vuexGetters(),
      vuexActions = dataHandle.vuexActions(),
      pagesJson = dataHandle.getPagesJson(),
      pageIdList = vuexGetters.getPageIdList;
  pageIndex = pageIndex === null || pageIndex === undefined ? dataHandle.vuexGetters().getFocusPageIndex : pageIndex;
  if(vuexGetters.getFocusPageIndex + 1 >= pagesJson.length) {
    vuexActions.setFocusPageIndex[0](vuexGetters.getFocusPageIndex - 1);
  }
  pagesJson.splice(pageIndex, 1);
  pageIdList.splice(pageIndex, 1);
},

/**
 * 复制画布
 * @param {String} pageIndex 被复制画布所属page的下标
 */
copyPage(pageIndex,newPageId) {
  pageIndex = pageIndex === null || pageIndex === undefined ? dataHandle.vuexGetters().getFocusPageIndex : pageIndex;
  let vuexGetters = dataHandle.vuexGetters(),
      pagesJson = dataHandle.getPagesJson(),
      pageIdList = vuexGetters.getPageIdList,
      pageJson = pagesJson[pageIndex];
  pageJson = JSON.parse(JSON.stringify(pageJson));
  pagesJson.splice(pageIndex + 1, 0, pageJson);
  pageIdList.splice(pageIndex + 1, 0, newPageId);
  return JSON.parse(JSON.stringify(pageJson));
},

/**
 * 更改画布index
 * @param {String} oldIndex 要移动的画布的index
 * @param {String} newIndex 画布移动到新的位置的index
 */
setPageIndex(oldIndex, newIndex) {
  oldIndex = oldIndex === null || oldIndex === undefined ? dataHandle.vuexGetters().getFocusPageIndex : oldIndex;
  let vuexGetters = dataHandle.vuexGetters(),
      pagesJson = dataHandle.getPagesJson(),
      pageIdList = vuexGetters.getPageIdList,
      pageJson = pagesJson.splice(oldIndex, 1)[0],
      pageId = pageIdList.splice(oldIndex, 1)[0];
  pageJson = JSON.parse(JSON.stringify(pageJson));
  pagesJson.splice(newIndex, 0, pageJson);
  pageIdList.splice(newIndex, 0, pageId);
  dataHandle.vuexActions().setFocusPageIndex[0](newIndex);
},

/**
 * 更改画布Json
 * @param {String} newJson 画布的Json
 * @param {String} pageIndex 要替换的画布的index
 */
setPageJson(newJson, pageIndex) {
  // 处理老json
  newJson = _convertJson(newJson);
  newJson = _handleJson(newJson);
  let elesJson = newJson.elems,
      ele;
  for (let i = 0; i < elesJson.length; i++) {
    ele = elesJson[i];
    //ele.eleid = 'eleid' + new Date().getTime() + parseInt(100000 * Math.random());
  }
  let pagesJson = dataHandle.getPagesJson();
  pageIndex = pageIndex === null || pageIndex === undefined ? dataHandle.vuexGetters().getFocusPageIndex : pageIndex;
  newJson = JSON.parse(JSON.stringify(newJson));
  pagesJson.splice(pageIndex, 1, newJson);
  // let pageThumbList = dataHandle.vuexGetters()getPageThumbList;
  // if(pageThumbList[pageIndex].taskId === 0) {

  // }
},

/**
 * 请求画布json
 */
queryPageJson(pageNoList, callback, opt) {
  let vuexGetters = dataHandle.vuexGetters(),
      vuexActions = dataHandle.vuexActions(),
      teamId = vuexGetters.getTeamId,
      pageIdList = vuexGetters.getPageIdList,
      pageReady = vuexGetters.getPageReady,
      setPageReady = vuexActions.setPageReady[0],
      idList = [];

  if(pageNoList.length === 0) {
    // 如果数组为空 查询所有未获取的画布
    let pagesJson = vuexGetters.getPagesJson;
    for (let i = 0; i < pagesJson.length; i++) {
      if(!pagesJson[i]) {
        pageNoList.push(i);
        idList.push(pageIdList[i]);
      }
    }
  } else {
    for (let i = 0; i < pageNoList.length; i++) {
      idList.push(pageIdList[pageNoList[i]])

    }
  }

  if(idList.length === 0) {
    if(callback) callback(opt);
    return;
  }

  dataHandle.$vue.$http.post(
    '/design/getPartialJsonById',
    {
      type: 1,
      page_ids: idList.join(','),
      tid: teamId ? teamId : 0
    }).then((data)=>{
      // 操作状态码（-1参数错误；-2未登录；-3权限不足；1获取成功）
      let code = data.body.code;
      if(code == -2) {
        vuexActions.setLogregShow[0](1);
      } else if(code <= 0) {
        vuexActions.setMessageShow[0]({
          placeHolder:'获取画布内容出错！'
        });
      } else if(code == 1) {
        // pageHandle.setPageJson(JSON.parse(data.body.partialJson), pageNo);
        let pagesJson = data.body.partialJsonMap,
            pageJson,
            pageNo,
            pageId,
            arr=pageReady
        for (let i = 0; i < idList.length; i++) {
          pageId = idList[i];
          pageNo = pageNoList[i];
          pageJson = JSON.parse(pagesJson[pageId]);
          pageJson = page.resetBaseLine(pageJson, pageId);
          page.setPageJson(pageJson, pageNo);
	        arr[pageNo]=true
        }
        //给成功加载的页加上标记
        setPageReady(arr)
        vuexActions.setIndexPageSaving[0](-1);
        dataHandle.updateDesignJson();
        if(callback) callback(opt);
      }
    }).catch((error)=>{
      console.log('获取画布内容出错！');
    });

},

/**
 * 请求模板json
 */
queryTemplateJson(pageNo) {
  let vuexGetters = dataHandle.vuexGetters(),
      vuexActions = dataHandle.vuexActions(),
      teamId = vuexGetters.getTeamId,
      templateInfo = vuexGetters.getTemplateInfo,
      templateId = templateInfo.ids[pageNo],
      pageIdList = dataHandle.vuexGetters().getPageIdList,
      isBleed = dataHandle.vuexGetters().getIsBleed;

  dataHandle.$vue.$http.post(
    '/design/getPartialJsonById',
    {
      type: 2,
      page_ids: templateId,
      tid: teamId ? teamId : 0
    }).then((data)=>{
      // 操作状态码（-1参数错误；-2未登录；-3权限不足；1获取成功）
      let code = data.body.code;
      if(code == -2) {
        vuexActions.setLogregShow[0](1);
      } else if(code <= 0) {
        vuexActions.setMessageShow[0]({
          placeHolder:'获取画布内容出错！'
        });
      } else if(code == 1) {
        let pagesJson = data.body.partialJsonMap,
        pageJson = JSON.parse(pagesJson[templateId]);
        if(isBleed && !templateInfo.bleed) {
          pageJson = page.singlePageBleedOn(pageJson);
        }
        pageJson = page.resetBaseLine(pageJson, pageIdList[pageNo]);
        page.setPageJson(pageJson, pageNo);
        vuexActions.setIndexPageSaving[0](-1);
        dataHandle.updateDesignJson();
      }
    }).catch((error)=>{
      console.log('获取画布内容出错！');
    });

},

/**
 * 更改画布宽高
 * @param {String} newWidth 画布新的宽度
 * @param {String} newHeight 画布新的高度
 * @param {String} newHeight 画布宽高的单位
 */
setPageWH(opt) {
  // if(!page.isAllPageLoad()){
  //   page.queryPageJson([], page.setPageWH, opt);
  //   return;
  // };
  let newWidth = opt.newWidth,
      newHeight = opt.newHeight,
      unit = opt.unit,
      resetBackground = opt.resetBackground;
  designHandle.setDesignWHWithUnit(newWidth.toString() + unit, newHeight.toString() + unit);
  let pagesJson = dataHandle.getPagesJson(),
      pageSum = pagesJson.length;
  if(unit == 'cm') {
    newWidth = newWidth ? (newWidth * 0.3937008 * 300).toFixed(8) : pagesJson[0].width;
    newHeight = newHeight ? (newHeight * 0.3937008 * 300).toFixed(8) : pagesJson[0].height;
  } else if(unit == 'mm') {
    newWidth = newWidth ? (newWidth * 0.3937008 * 30).toFixed(8) : pagesJson[0].width;
    newHeight = newHeight ? (newHeight * 0.3937008 * 30).toFixed(8) : pagesJson[0].height;
  } else {
    newWidth = newWidth ? newWidth : pagesJson[0].width;
    newHeight = newHeight ? newHeight : pagesJson[0].height;
  }
  let vuexActions = dataHandle.vuexActions();
  vuexActions.setPageWidth[0](newWidth);
  vuexActions.setPageHeight[0](newHeight);
  if(resetBackground) {
    if(!page.isAllPageLoad()){
      page.queryPageJson([], pageEleHandle.resetBackground);
    } else {
      pageEleHandle.resetBackground();
    }
  }
  // if(resetBackground) {
  //   pageEleHandle.resetBackground();
  // }
},

/**
 * 更改画布宽高但不更改画布原始宽高
 * @param {String} newWidth 画布新的宽度
 * @param {String} newHeight 画布新的高度
 */
setPageWHWithoutUnit(newWidth, newHeight) {
  let vuexActions = dataHandle.vuexActions();
  vuexActions.setPageWidth[0](newWidth);
  vuexActions.setPageHeight[0](newHeight);
},

/**
 * 开启出血设置画布宽高
 */
pageBleedOnSetPageWH() {
  let vuexGetters = dataHandle.vuexGetters(),
      pageW = vuexGetters.getPageWidth,
      pageH = vuexGetters.getPageHeight,
      bleedValue = vuexGetters.getDesignInfo.bleedValue,
      newPageW = pageW + 2 * bleedValue,
      newPageH = pageH + 2 * bleedValue;
  page.setPageWHWithoutUnit(newPageW, newPageH);
},

/**
 * 关闭出血设置画布宽高
 */
pageBleedOffSetPageWH() {
  let vuexGetters = dataHandle.vuexGetters(),
      pageW = vuexGetters.getPageWidth,
      pageH = vuexGetters.getPageHeight,
      bleedValue = vuexGetters.getDesignInfo.bleedValue,
      newPageW = pageW - 2 * bleedValue,
      newPageH = pageH - 2 * bleedValue;
  page.setPageWHWithoutUnit(newPageW, newPageH);
},

/**
 * 模板重置文字基线
 */
resetBaseLine(json, pageId) {
  let drag = false,
      backgroundDrag = false,
      elem,
      length,
      vuexGetters = dataHandle.vuexGetters(),
      focusPageIndex = vuexGetters.getFocusPageIndex;
  
  if(json['elems']) {
    length = json['elems'].length;
  } else {
    alert('json错误');
    /*
    json = convertJson(JSON.stringify(json));
    dataHandle.commit('element', {
      eventType: 5,
      pageId: pageId,
      value: json
    }).push(true);*/
  }

  json['elems'].map((elem, index)=>{
    if(elem['data-type']==='text'){
	    let translate=getTransformAttr(elem['transform'],'translate'),
		    rotate=[]
	    if(elem['transform'].indexOf('rotate') >= 0) {
        rotate=getTransformAttr(elem['transform'],'rotate')
        if(rotate[1]==undefined){
          rotate[1] = elem['data-elem'].width / 2
          rotate[2] = elem['data-elem'].height / 2
        }
      } else {
        rotate[0]=0
        rotate[1]=elem['data-elem'].width / 2
        rotate[2]=elem['data-elem'].height / 2
        
      }
      if(elem['data-elem']['id']===undefined||elem['data-elem']['id']===''){
        drag = true;
        let h=getBaseLineFromTop(elem['data-elem']['font-size'],elem['data-elem']['font-family'])
        elem['transform']=`translate(${translate[0]},${Number.parseFloat(translate[1])+h})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`
        elem['data-elem']['vspace'] = getLineHeightOld(elem);
        dataHandle.commit('element', {
          pageId: pageId,
          eleIndex: index,
          key: 'transform',
          value: elem['transform'],
          eventType: 2
        });
        dataHandle.commit('element', {
          pageId: pageId,
          eleIndex: index,
          key: 'vspace',
          value: elem['data-elem']['vspace'],
          eventType: 1
        });
      }
      // let h=getBaseLineFromTop(elem['data-elem']['font-size'],elem['data-elem']['font-family'])
      // elem['transform']=`translate(${translate[0]},${Number.parseFloat(translate[1])+h})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`
    }
    if(elem['data-type']==='background') {
      backgroundDrag = true;
      if(index > 0) {
        drag = true;
        // json 重置
        let background = json['elems'].splice(index, 1)[0];
        json['elems'].unshift(background);
        /*打个commit 把background移动到首层*/
        dataHandle.commit('element', {
          pageId: pageId,
          eleIndex: index,
          key: null,
          value: 0,
          eventType: 4
        });
      }
    }
    if(elem['data-type'] === 'svgFrame') {
      let xhref_imgs = elem['data-elem']['data-xhref-imgs'];
      let commit_drag = false;
      for(let i in xhref_imgs) {
        if(xhref_imgs[i]['imgUrl']) {
          delete xhref_imgs[i]['imgUrl'];
          commit_drag = true;
        }
        if(xhref_imgs[i]['fromLeft']) {
          delete xhref_imgs[i]['fromLeft'];
          commit_drag = true;
        }
        if(xhref_imgs[i]['drop'] != undefined) {
          delete xhref_imgs[i]['drop'];
          commit_drag = true;
        }
      }
      console.log(elem['data-elem']['data-xhref-imgs']);
      if(commit_drag) {
        drag = true;
        dataHandle.commit('element', {
          pageId: pageId,
          eleIndex: index,
          key: 'data-xhref-imgs',
          value: elem['data-elem']['data-xhref-imgs'],
          eventType: 1
        });
      }
    }
    if(drag) dataHandle.push(true);
  });
  if(!backgroundDrag) {
    let background = {
      "data-type":"background",
      "data-elem":{
          "filter":{
              "brightness":0,
              "contrast":0,
              "crossProcess":0,
              "gaussianBlur":0,
              "saturation":0,
              "tint":0
          },
          "data-key":"false",
          "width":5031.496224,
          "height":3437.007984,
          "opacity":"1",
          "data-colors":{
              "0":"rgb(255, 255, 255)"
          }
      },
      "transform":"translate(0,0)rotate(0,0,0)",
      "reverse":"translate(0,0)rotate(0,0,0)"
    }
    json['elems'].unshift(background);
    dataHandle.commit('element', {
      pageIndex: page.getPageIndexById(pageId),
      eleIndex: 0,
      value: background,
      eventType: 0
    }).push(true);
  }
  return json;

},

/**
 * 通过画布id获取画布Index
 */
getPageIndexById(pageId) {
  let pageIdList = dataHandle.vuexGetters().getPageIdList,
      pageIndex;
  pageIdList.map((id, index)=>{
    if(pageId === id) pageIndex = index;
  });
  return pageIndex;
},

/**
 * 对画布Json开启画布出血
 * @param {Json} pageJson 要出血的画布的Json
 */
singlePageBleedOn(pageJson) {
  let vuexGetters = dataHandle.vuexGetters(),
      vuexActions = dataHandle.vuexActions(),
      bleedValue = vuexGetters.getDesignInfo.bleedValue || 0,
      pageWidth = vuexGetters.getPageWidth,
      pageHeight = vuexGetters.getPageHeight,
      elesJson,
      eleJson,
      rotate,
      translate,
      eleRect,
      background;

  pageWidth = pageWidth + 2 * bleedValue;
  pageHeight = pageHeight + 2 * bleedValue;
  // pageJson.width = pageWidth;
  // pageJson.height = pageHeight;
  elesJson = pageJson.elems;
  for (let i = 1; i < elesJson.length; i++) {
    eleJson = elesJson[i]
    rotate = getTransformAttr(eleJson['transform'],'rotate');
    translate = getTransformAttr(eleJson['transform'],'translate');
    translate[0] = parseFloat(translate[0]) + bleedValue;
    translate[1] =  parseFloat(translate[1]) + bleedValue;
    eleJson['transform']  = `translate(${translate[0]},${translate[1]})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`;
  }

  background = elesJson[0];
  let backWidth = parseFloat(background['data-elem'].width),
      backHeight = parseFloat(background['data-elem'].height);
  if(background['data-elem']['data-colors']) {
    background.width = backWidth + 2 * bleedValue;
    background.height = backHeight + 2 * bleedValue;
  } else {
    let r = backWidth / backHeight;
    if(r === pageWidth / pageHeight) {
      let width = r * bleedValue;
      background.width = backWidth + 2 * width;
      background.height = backHeight + 2 * bleedValue;
    } else if(r > pageWidth / pageHeight) {
      let width = r * bleedValue;
      background.width = backWidth + 2 * width;
      background.height = backHeight + 2 * bleedValue;
    } else {
      let height = bleedValue / r;
      background.width = backWidth + 2 * bleedValue;
      background.height = backHeight + 2 * height;
    }
  }
  return JSON.parse(JSON.stringify(pageJson));
},

/**
 * 检查是否已加载所有的画布Json
 */
isAllPageLoad() {
  let vuexGetters = dataHandle.vuexGetters(),
      pagesJson = vuexGetters.getPagesJson,
      drag = true;
  for (let i = 0; i < pagesJson.length; i++) {
    if(!pagesJson[i]) {
      drag = false;
      break;
    }
  }
  return drag;
},

/**
 * 开启画布出血
 */
// pageBleedOn() {
//   if(!page.isAllPageLoad()){
//     page.queryPageJson([], page.pageBleedOn);
//     return;
//   };
//   let vuexGetters = dataHandle.vuexGetters(),
//       vuexActions = dataHandle.vuexActions(),
//       bleedValue = vuexGetters.getDesignInfo.bleedValue || 0,
//       pageWidth = vuexGetters.getPageWidth,
//       pageHeight = vuexGetters.getPageHeight,
//       pageSum,
//       pageJson,
//       elesJson,
//       eleRect,
//       background;
//   bleedValue = parseFloat(bleedValue);
//   pageWidth = pageWidth + 2 * bleedValue;
//   pageHeight = pageHeight + 2 * bleedValue;
//   page.setPageWHWithoutUnit(pageWidth, pageHeight);
//   pageSum = vuexGetters.getPageSum;
//   dataHandle.commit('design',
//     {
//       key: 'wh',
//       value: {
//         ow: page.getPageWHWithUnit().pageWidth,
//         oh: page.getPageWHWithUnit().pageHeight
//       },
//       eventType: 1
//     }
//   );
//   for (let i = 0; i < pageSum; i++) {
//     pageJson = dataHandle.getPageJson(i);
//     elesJson = pageJson.elems;
//     for (let j = 1; j < elesJson.length; j++) {
//       eleRect = elementHandle.getElemRect(i, j);
//       elementHandle.setLeft(eleRect.left + bleedValue, i, j);
//       elementHandle.setTop(eleRect.top + bleedValue, i, j);
//       dataHandle.commit('element',
//         {
//           pageIndex: i,
//           eleIndex: j,
//           key: 'transform',
//           value: elementHandle.getTransform(i, j),
//           eventType: 1
//         }
//       );
//     }

//     background = elesJson[0];
//     let backWidth = parseFloat(background['data-elem'].width),
//         backHeight = parseFloat(background['data-elem'].height),
//         eleRect = elementHandle.getElemRect(i, 0);
//     if(elementHandle.isFillColorBackground(i) === 'rect') {
//       elementHandle.setWidth(backWidth + 2 * bleedValue, i, 0);
//       elementHandle.setHeight(backHeight + 2 * bleedValue, i, 0);
//       elementHandle.setTop(0, i, 0);
//       elementHandle.setLeft(0, i, 0);
//     } else {
//       let r = backWidth / backHeight;
//       if(r === pageWidth / pageHeight) {
//         let width = r * bleedValue;
//         elementHandle.setWidth(backWidth + 2 * width, i, 0);
//         elementHandle.setHeight(backHeight + 2 * bleedValue, i, 0);
//       } else if(r > pageWidth / pageHeight) {
//         let width = r * bleedValue;
//         elementHandle.setWidth(backWidth + 2 * width, i, 0);
//         elementHandle.setHeight(backHeight + 2 * bleedValue, i, 0);
//         // elementHandle.setLeft(eleRect.left - width, i, 0);
//       } else {
//         let height = bleedValue / r;
//         elementHandle.setWidth(backWidth + 2 * bleedValue, i, 0);
//         elementHandle.setHeight(backHeight + 2 * height, i, 0);
//         // elementHandle.setTop(eleRect.top - height, i, 0);
//       }
//     }
//     dataHandle.commit('element',
//       {
//         pageIndex: i,
//         eleIndex: 0,
//         key: 'width',
//         value: elementHandle.getWidth(i, 0),
//         eventType: 1
//       }
//     );
//     dataHandle.commit('element',
//       {
//         pageIndex: i,
//         eleIndex: 0,
//         key: 'height',
//         value: elementHandle.getHeight(i, 0),
//         eventType: 1
//       }
//     );

//   }
// },

/**
 * 关闭画布出血
 */
// pageBleedOff() {
//   if(!page.isAllPageLoad()){
//     page.queryPageJson([], page.pageBleedOn);
//     return;
//   };
//   let vuexGetters = dataHandle.vuexGetters(),
//       vuexActions = dataHandle.vuexActions(),
//       bleedValue = vuexGetters.getDesignInfo.bleedValue || 0,
//       pageWidth = vuexGetters.getPageWidth,
//       pageHeight = vuexGetters.getPageHeight,
//       pageSum,
//       pageJson,
//       elesJson,
//       eleRect,
//       background;

//   bleedValue = parseFloat(bleedValue);
//   pageSum = vuexGetters.getPageSum;
//   for (let i = 0; i < pageSum; i++) {

//     pageJson = dataHandle.getPageJson(i);
//     elesJson = pageJson.elems;
//     for (let j = 1; j < elesJson.length; j++) {
//       eleRect = elementHandle.getElemRect(i, j);
//       elementHandle.setLeft(eleRect.left - bleedValue, i, j);
//       elementHandle.setTop(eleRect.top - bleedValue, i, j);
//       dataHandle.commit('element',
//         {
//           pageIndex: i,
//           eleIndex: j,
//           key: 'transform',
//           value: elementHandle.getTransform(i, j),
//           eventType: 1
//         }
//       );
//     }

//     background = elesJson[0];
//     let backWidth = parseFloat(background['data-elem'].width),
//         backHeight = parseFloat(background['data-elem'].height),
//         eleRect = elementHandle.getElemRect(i, 0);
//     if(elementHandle.isFillColorBackground(i) === 'rect') {
//       elementHandle.setWidth(backWidth - 2 * bleedValue, i, 0);
//       elementHandle.setHeight(backHeight - 2 * bleedValue, i, 0);
//       elementHandle.setTop(0, i, 0);
//       elementHandle.setLeft(0, i, 0);
//     } else {
//       let r = backWidth / backHeight;
//       if(r === pageWidth / pageHeight) {
//         let width = r * bleedValue;
//         elementHandle.setWidth(backWidth - 2 * width, i, 0);
//         elementHandle.setHeight(backHeight - 2 * bleedValue, i, 0);
//       } else if(r > pageWidth / pageHeight) {
//         let width = r * bleedValue;
//         elementHandle.setWidth(backWidth - 2 * width, i, 0);
//         elementHandle.setHeight(backHeight - 2 * bleedValue, i, 0);
//         // elementHandle.setLeft(eleRect.left + width, i, 0);
//       } else {
//         let height = bleedValue / r;
//         elementHandle.setWidth(backWidth - 2 * bleedValue, i, 0);
//         elementHandle.setHeight(backHeight - 2 * height, i, 0);
//         // elementHandle.setTop(eleRect.top + height, i, 0);
//       }
//     }
//     dataHandle.commit('element',
//       {
//         pageIndex: i,
//         eleIndex: 0,
//         key: 'width',
//         value: elementHandle.getWidth(i, 0),
//         eventType: 1
//       }
//     );
//     dataHandle.commit('element',
//       {
//         pageIndex: i,
//         eleIndex: 0,
//         key: 'height',
//         value: elementHandle.getHeight(i, 0),
//         eventType: 1
//       }
//     );
//   }

//   pageWidth = pageWidth - 2 * bleedValue;
//   pageHeight = pageHeight - 2 * bleedValue;
//   page.setPageWHWithoutUnit(pageWidth, pageHeight);
//   dataHandle.commit('design',
//     {
//       key: 'wh',
//       value: {
//         ow: page.getPageWHWithUnit().pageWidth,
//         oh: page.getPageWHWithUnit().pageHeight
//       },
//       eventType: 1
//     }
//   );
// },

/**
 * 智能变换场景
 * @param {Array} newSenceList 新场景列表
 */
changeSence(newSenceList) {
  for (let i = 0; i < newSenceList.length; i++) {
    window.open('');
  }
},

/**
 * 画布失去焦点
 */
elementBlur() {
  let vuexActions = dataHandle.vuexActions();
  vuexActions.setFocusElemIndex[0]({index: -1});
  vuexActions.setCircleSelectElements[0]([]);
  vuexActions.setCircleSelectElementsNow[0]([]);
  vuexActions.setEditorShow[0](false);
  vuexActions.setToolsBarType[0]('');
  vuexActions.setToolsBarShow[0](false);
  vuexActions.setClipFlag[0](false);
  vuexActions.setGroupFlag[0](false);
  vuexActions.setFrameClip[0](false);
  vuexActions.setTextEdit[0](false);
  vuexActions.setSelectHaveGroup[0](false);
},

cloneFocusPageToMove(enterFun, leaveFun) {
  if(document.getElementById('page-clone') != null) return;
  let pageSvg = document.getElementById('pageSvg');
  let pageRect = pageSvg.getBoundingClientRect();
  let pageClone = pageSvg.cloneNode(true);
  pageClone.id = 'page-clone';
  pageClone.style.opacity = 0;
  document.body.appendChild(pageClone);
  pageClone.style.top = pageRect.top;
  pageClone.style.left = pageRect.left;
  pageClone.style.zIndex = 10011;

  if(pageClone.addEventListener) {
    pageClone.addEventListener('mouseover', function(eve) {
      _layoutImgFun(eve, enterFun);
    });
    pageClone.addEventListener('mouseout', function(eve) {
      _layoutImgFun(eve, leaveFun);
    });
  } else {
    pageClone.attachEvent('onmouseover', function(eve) {
      _layoutImgFun(eve, enterFun);
    });
    pageClone.attachEvent('onmouseout', function(eve) {
      _layoutImgFun(eve, leaveFun);
    });
  }
},

removePageClone() {
  if(document.getElementById('page-clone') != null) document.body.removeChild(document.getElementById('page-clone'));
},

/**
 * 根据元素id返回元素index
 * @param {Array} idList 元素id列表
 */
getElementIndexbyId(elemid) {
  let pageJson = dataHandle.vuexGetters().getFocusPage,
      elems = pageJson.elems;
    for (let j = 0; j< elems.length; j++) {
      if(elemid === elems[j].eleid) {
        return j;
        break;
      }

    }
  return false;
},

/**
 * 获取colorPicker要用的画布缩略图
 * @param {Number} pageIndex 要获取的画布Index
 */
getPageThumbForColorPicker(pageIndex) {
  let pageThumbList = dataHandle.vuexGetters().getPageThumbList,
      pageThumb = pageThumbList[pageIndex];
  return pageThumb + '?v=' + new Date().getTime();
},

/**
 * 框选左对齐是否超出画布
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignLeftOutPage() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      length = eleIndex.length;
  if(length <= 1) return;
  let outPage = false,
      editorRect = editorHandle.getEditorPostion(),
      eleRect;
  if(editorRect.left < 0) {
    for (let i = 0; i < length; i++) {
      eleRect = elementHandle.getElemRect(undefined, eleIndex[i]);
      if(eleRect.width + 10 < Math.abs(editorRect.left)) {
        outPage = true;
        break;
      }
    }
    return outPage;
  } else {
    return outPage;
  }
},

/**
 * 框选左对齐
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignLeft() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      selectHaveGroup = dataHandle.vuexGetters().getSelectHaveGroup,
      selectGroup = dataHandle.vuexGetters().getSelectGroup,
      elegroups = dataHandle.getPageJson().elegroups,
      length = eleIndex.length;
  if(length <= 1) return;
  let eleRect,
      dis,
      editorRect = editorHandle.getEditorPostion();

  for (let i = 0; i < length; i++) {
    if(pageEleHandle.getElementGroupDrag(undefined, eleIndex[i])) continue;
    eleRect = elementHandle.getElemRect(undefined, eleIndex[i]);
    dis = editorRect.left - eleRect.left;
    elementHandle.setLeftDis(dis, undefined, eleIndex[i]);
  }

  if(selectHaveGroup) {
    let groupId,
        groupRect,
        xDis;
    for (let i = 0; i < selectGroup.length; i++) {
      groupId = selectGroup[i];
      groupRect = groupHandle.getGroupRectById(groupId);
      xDis = editorRect.left - groupRect.left ;
      groupHandle.setGroupTransformById(groupId, {left: xDis, top: 0});
      groupHandle.dispatchCommit('transform', groupId);
    }
  }

  for (let i = 0; i < length; i++) {
    dataHandle.commit(
      'element',
      {
        pageIndex: dataHandle.vuexGetters().getFocusPageIndex,
        eleIndex: eleIndex[i],
        key: 'transform',
        value: elementHandle.getTransform(undefined, eleIndex[i]),
        eventType: 1
      });
  }
  dataHandle.push();
},

/**
 * 框选水平居中对齐是否超出画布
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignXMidOutPage() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      length = eleIndex.length;
  if(length <= 1) return;
  let pageWidth = dataHandle.vuexGetters().getPageWidth,
      outPage = false,
      eleRect,
      xDis = 0,
      editorRect = editorHandle.getEditorPostion();
  editorRect.xMid = editorRect.left + editorRect.width / 2;
  if(editorRect.xMid < 0) {
    xDis = - editorRect.xMid;
  } else if(editorRect.xMid > pageWidth) {
    xDis = editorRect.xMid - pageWidth;
  }
  if(xDis > 0) {
    for (let i = 0; i < length; i++) {
      eleRect = elementHandle.getElemRect(undefined, eleIndex[i]);
      if(xDis > eleRect.width / 2 + 10) {
        outPage = true;
        break;
      }
    }
    return outPage;
  } else {
    return outPage;
  }
},

/**
 * 框选水平居中对齐
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignXMid() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      selectHaveGroup = dataHandle.vuexGetters().getSelectHaveGroup,
      selectGroup = dataHandle.vuexGetters().getSelectGroup,
      elegroups = dataHandle.getPageJson().elegroups,
      length = eleIndex.length;
  if(length <= 1) return;
  let eleRect,
      left,
      leftDis,
      editorRect = editorHandle.getEditorPostion();
  editorRect.xMid = editorRect.left + editorRect.width / 2;

  for (let i = 0; i < length; i++) {
    if(pageEleHandle.getElementGroupDrag(undefined, eleIndex[i])) continue;
    eleRect = elementHandle.getElemRect(undefined, eleIndex[i]);
    eleRect.xMid = eleRect.left + eleRect.width / 2;
    leftDis = editorRect.xMid - eleRect.xMid;
    elementHandle.setLeftDis(leftDis, undefined, eleIndex[i]);
  }

  if(selectHaveGroup) {
    let groupId,
        groupRect,
        xDis;
    for (let i = 0; i < selectGroup.length; i++) {
      groupId = selectGroup[i];
      groupRect = groupHandle.getGroupRectById(groupId);
      groupRect.xMid =  groupRect.left + groupRect.width / 2;
      xDis = editorRect.xMid - groupRect.xMid;
      groupHandle.setGroupTransformById(groupId, {left: xDis, top: 0});
      groupHandle.dispatchCommit('transform', groupId);
    }
  }

  for (let i = 0; i < length; i++) {
    dataHandle.commit(
      'element',
      {
        pageIndex: dataHandle.vuexGetters().getFocusPageIndex,
        eleIndex: eleIndex[i],
        key: 'transform',
        value: elementHandle.getTransform(undefined, eleIndex[i]),
        eventType: 1
      });
  }
  dataHandle.push();
},

/**
 * 框选右对齐是否超出画布
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignRightOutPage() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      length = eleIndex.length;
  if(length <= 1) return;
  let outPage = false,
      pageWidth = dataHandle.vuexGetters().getPageWidth,
      editorRect = editorHandle.getEditorPostion(),
      eleRect,
      xDis = editorRect.right - pageWidth;
  if(xDis > 0) {
    for (let i = 0; i < length; i++) {
      eleRect = elementHandle.getElemRect(undefined, eleIndex[i]);
      if(xDis > eleRect.width - 10) {
        outPage = true;
        break;
      }
    }
    return outPage;
  } else {
    return outPage;
  }
},

/**
 * 框选右对齐
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignRight() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      selectHaveGroup = dataHandle.vuexGetters().getSelectHaveGroup,
      selectGroup = dataHandle.vuexGetters().getSelectGroup,
      elegroups = dataHandle.getPageJson().elegroups,
      length = eleIndex.length;
  if(length <= 1) return;
  let eleRect,
      left,
      leftDis,
      editorRect = editorHandle.getEditorPostion();

  for (let i = 0; i < length; i++) {
    if(pageEleHandle.getElementGroupDrag(undefined, eleIndex[i])) continue;
    eleRect = elementHandle.getElemRect(undefined, eleIndex[i]);
    leftDis = editorRect.right - eleRect.right;
    elementHandle.setLeftDis(leftDis, undefined, eleIndex[i]);
  }

  if(selectHaveGroup) {
    let groupId,
        groupRect,
        xDis;
    for (let i = 0; i < selectGroup.length; i++) {
      groupId = selectGroup[i];
      groupRect = groupHandle.getGroupRectById(groupId);
      xDis = editorRect.right - groupRect.right ;
      groupHandle.setGroupTransformById(groupId, {left: xDis, top: 0});
      groupHandle.dispatchCommit('transform', groupId);
    }
  }

  for (let i = 0; i < length; i++) {
    dataHandle.commit(
      'element',
      {
        pageIndex: dataHandle.vuexGetters().getFocusPageIndex,
        eleIndex: eleIndex[i],
        key: 'transform',
        value: elementHandle.getTransform(undefined, eleIndex[i]),
        eventType: 1
      });
  }

  dataHandle.push();
},

/**
 * 框选上对齐是否超出画布
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignTopOutPage() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      length = eleIndex.length;
  if(length <= 1) return;
  let outPage = false,
      pageHeight = dataHandle.vuexGetters().getPageHeight,
      editorRect = editorHandle.getEditorPostion(),
      eleRect;
  if(editorRect.top < 0) {
    for (let i = 0; i < length; i++) {
      eleRect = elementHandle.getElemRect(undefined, eleIndex[i]);
      if(-editorRect.top > eleRect.height - 10) {
        outPage = true;
        break;
      }
    }
    return outPage;
  } else {
    return outPage;
  }
},

/**
 * 框选上对齐
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignTop() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      selectHaveGroup = dataHandle.vuexGetters().getSelectHaveGroup,
      selectGroup = dataHandle.vuexGetters().getSelectGroup,
      elegroups = dataHandle.getPageJson().elegroups,
      length = eleIndex.length;
  if(length <= 1) return;
  let eleRect,
      dis,
      editorRect = editorHandle.getEditorPostion();

  for (let i = 0; i < length; i++) {
    if(pageEleHandle.getElementGroupDrag(undefined, eleIndex[i])) continue;
    eleRect = elementHandle.getElemRect(undefined, eleIndex[i]);
    dis = editorRect.top - eleRect.top;
    elementHandle.setTopDis(dis, undefined, eleIndex[i]);
  }

  if(selectHaveGroup) {
    let groupId,
        groupRect,
        yDis;
    for (let i = 0; i < selectGroup.length; i++) {
      groupId = selectGroup[i];
      groupRect = groupHandle.getGroupRectById(groupId);
      yDis = editorRect.top - groupRect.top ;
      groupHandle.setGroupTransformById(groupId, {left: 0, top: yDis});
      groupHandle.dispatchCommit('transform', groupId);
    }
  }

  for (let i = 0; i < length; i++) {
    dataHandle.commit(
      'element',
      {
        pageIndex: dataHandle.vuexGetters().getFocusPageIndex,
        eleIndex: eleIndex[i],
        key: 'transform',
        value: elementHandle.getTransform(undefined, eleIndex[i]),
        eventType: 1
      });
  }

  dataHandle.push();
},

/**
 * 框选垂直居中对齐是否超出画布
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignYMidOutPage() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      length = eleIndex.length;
  if(length <= 1) return;
  let outPage = false,
      pageHeight = dataHandle.vuexGetters().getPageHeight,
      editorRect = editorHandle.getEditorPostion(),
      eleRect,
      yDis = 0;
  editorRect.yMid = editorRect.top + editorRect.height / 2;
  if(editorRect.yMid < 0) {
    yDis = - editorRect.yMid;
  } else if(editorRect.yMid > pageHeight) {
    yDis = editorRect.yMid - pageHeight;
  }
  if(yDis > 0) {
    for (let i = 0; i < length; i++) {
      eleRect = elementHandle.getElemRect(undefined, eleIndex[i]);
      if(yDis > (eleRect.height - 10) / 2) {
        outPage = true;
        break;
      }
    }
    return outPage;
  } else {
    return outPage;
  }
},

/**
 * 框选垂直居中对齐
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignYMid() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      selectHaveGroup = dataHandle.vuexGetters().getSelectHaveGroup,
      selectGroup = dataHandle.vuexGetters().getSelectGroup,
      elegroups = dataHandle.getPageJson().elegroups,
      length = eleIndex.length;
  if(length <= 1) return;
  let eleRect,
      topDis,
      editorRect = editorHandle.getEditorPostion();
  editorRect.yMid = editorRect.top + editorRect.height / 2;

  for (let i = 0; i < length; i++) {
    if(pageEleHandle.getElementGroupDrag(undefined, eleIndex[i])) continue;
    eleRect = elementHandle.getElemRect(undefined, eleIndex[i]);
    eleRect.yMid = eleRect.top + eleRect.height / 2;
    topDis = editorRect.yMid - eleRect.yMid;
    elementHandle.setTopDis(topDis, undefined, eleIndex[i]);
  }

  if(selectHaveGroup) {
    let groupId,
        groupRect,
        yDis;
    for (let i = 0; i < selectGroup.length; i++) {
      groupId = selectGroup[i];
      groupRect = groupHandle.getGroupRectById(groupId);
      groupRect.yMid = groupRect.top + groupRect.height / 2;
      yDis = editorRect.yMid - groupRect.yMid ;
      groupHandle.setGroupTransformById(groupId, {left: 0, top: yDis});
      groupHandle.dispatchCommit('transform', groupId);
    }
  }

  for (let i = 0; i < length; i++) {
    dataHandle.commit(
      'element',
      {
        pageIndex: dataHandle.vuexGetters().getFocusPageIndex,
        eleIndex: eleIndex[i],
        key: 'transform',
        value: elementHandle.getTransform(undefined, eleIndex[i]),
        eventType: 1
      });
  }
  dataHandle.push();
},

/**
 * 框选下对齐是否超出画布
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignBottomOutPage() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      length = eleIndex.length;
  if(length <= 1) return;
  let outPage = false,
      pageHeight = dataHandle.vuexGetters().getPageHeight,
      editorRect = editorHandle.getEditorPostion(),
      eleRect,
      yDis;
  if(editorRect.bottom > pageHeight) {
    yDis = editorRect.bottom - pageHeight;
    for (let i = 0; i < length; i++) {
      eleRect = elementHandle.getElemRect(undefined, eleIndex[i]);
      if(yDis > eleRect.height - 10) {
        outPage = true;
        break;
      }
    }
    return outPage;
  } else {
    return outPage;
  }
},

/**
 * 框选下对齐
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignBottom() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      selectHaveGroup = dataHandle.vuexGetters().getSelectHaveGroup,
      selectGroup = dataHandle.vuexGetters().getSelectGroup,
      elegroups = dataHandle.getPageJson().elegroups,
      length = eleIndex.length;
  if(length <= 1) return;
  let eleRect,
      top,
      bottomDis,
      editorRect = editorHandle.getEditorPostion();
      console.log(JSON.parse(JSON.stringify(editorRect)))
  for (let i = 0; i < length; i++) {
    if(pageEleHandle.getElementGroupDrag(undefined, eleIndex[i])) continue;
    eleRect = elementHandle.getElemRect(undefined, eleIndex[i]);
    bottomDis = editorRect.bottom - eleRect.bottom;
    elementHandle.setTopDis(bottomDis, undefined, eleIndex[i]);
  }

  if(selectHaveGroup) {
    let groupId,
        groupRect,
        yDis;
    for (let i = 0; i < selectGroup.length; i++) {
      groupId = selectGroup[i];
      groupRect = groupHandle.getGroupRectById(groupId);
      yDis = editorRect.bottom - groupRect.bottom ;
      groupHandle.setGroupTransformById(groupId, {left: 0, top: yDis});
      groupHandle.dispatchCommit('transform', groupId);
    }
  }

  for (let i = 0; i < length; i++) {
    dataHandle.commit(
      'element',
      {
        pageIndex: dataHandle.vuexGetters().getFocusPageIndex,
        eleIndex: eleIndex[i],
        key: 'transform',
        value: elementHandle.getTransform(undefined, eleIndex[i]),
        eventType: 1
      });
  }

  dataHandle.push();
},

/**
 * 框选水平分布对齐
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignXAuto() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      selectHaveGroup = dataHandle.vuexGetters().getSelectHaveGroup,
      selectGroup = dataHandle.vuexGetters().getSelectGroup,
      elegroups = dataHandle.getPageJson().elegroups,
      length = eleIndex.length;
  eleIndex = JSON.parse(JSON.stringify(eleIndex));
  if(length <= 1) return;

  let rectList = [];
  for (let i = 0; i < length; i++) {
    if(pageEleHandle.getElementGroupDrag(undefined, eleIndex[i])) continue;
    rectList.push({
      id: eleIndex[i],
      groupDrag: false,
      rect: elementHandle.getElemRect(undefined, eleIndex[i])
    });
  }

  if(selectHaveGroup) {
    for (let i = 0; i < selectGroup.length; i++) {
      rectList.push({
        id: selectGroup[i],
        groupDrag: true,
        rect: groupHandle.getGroupRectById(selectGroup[i])
      });
    }
  }

  let eleRect,
      behindRect,
      temp;
  for (let i = rectList.length; i > 0; i--) {
    for (let j = 0; j < i - 1; j++) {
      eleRect = rectList[j].rect;
      eleRect.xMid = eleRect.left + eleRect.width / 2;
      behindRect = rectList[j + 1].rect;
      behindRect.xMid = behindRect.left + behindRect.width / 2;
      if(eleRect.xMid > behindRect.xMid) {
        temp = rectList[j];
        rectList[j] = rectList[j + 1];
        rectList[j + 1] = temp;
      }
    }
  }

  let left,
      leftDis,
      firstRect = rectList[0].rect,
      lastRect = rectList[rectList.length - 1].rect,
      center,
      editorRect = {};
  editorRect.left = firstRect.left + firstRect.width / 2;
  editorRect.right = lastRect.left + lastRect.width / 2;
  editorRect.width = editorRect.right - editorRect.left;
  let ava = editorRect.width / (rectList.length - 1);

  for (let i = 0; i < rectList.length; i++) {
    center = editorRect.left + ava * i;
    eleRect = rectList[i];
    eleRect.xMid = eleRect.rect.left + eleRect.rect.width / 2;
    leftDis = center - eleRect.rect.xMid;
    left = eleRect.rect.left + leftDis;
    if(eleRect.groupDrag) {
      groupHandle.setGroupTransformById(eleRect.id, {left: leftDis, top: 0});
      groupHandle.dispatchCommit('transform', eleRect.id);
    } else {
      elementHandle.setLeftDis(leftDis, undefined, eleRect.id);
    }
  }

  for (let i = 0; i < length; i++) {
    dataHandle.commit(
      'element',
      {
        pageIndex: dataHandle.vuexGetters().getFocusPageIndex,
        eleIndex: eleIndex[i],
        key: 'transform',
        value: elementHandle.getTransform(undefined, eleIndex[i]),
        eventType: 1
      });
  }

  dataHandle.push();
},

/**
 * 框选垂直分布对齐
 * @param {Array} eleIndex 要对齐的元素的index的列表
 */
alignYAuto() {
  let eleIndex = dataHandle.vuexGetters().getCircleSelectElements,
      selectHaveGroup = dataHandle.vuexGetters().getSelectHaveGroup,
      selectGroup = dataHandle.vuexGetters().getSelectGroup,
      elegroups = dataHandle.getPageJson().elegroups,
      length = eleIndex.length;
  if(length <= 1) return;

  let rectList = [];
  for (let i = 0; i < length; i++) {
    if(pageEleHandle.getElementGroupDrag(undefined, eleIndex[i])) continue;
    rectList.push({
      id: eleIndex[i],
      groupDrag: false,
      rect: elementHandle.getElemRect(undefined, eleIndex[i])
    });
  }

  if(selectHaveGroup) {
    for (let i = 0; i < selectGroup.length; i++) {
      rectList.push({
        id: selectGroup[i],
        groupDrag: true,
        rect: groupHandle.getGroupRectById(selectGroup[i])
      });
    }
  }

  let eleRect,
      behindRect,
      temp;
  for (let i = rectList.length; i > 0; i--) {
    for (let j = 0; j < i - 1; j++) {
      eleRect = rectList[j].rect;
      eleRect.yMid = eleRect.top + eleRect.height / 2;
      behindRect = rectList[j + 1].rect;
      behindRect.yMid = behindRect.top + behindRect.height / 2;
      if(eleRect.yMid > behindRect.yMid) {
        temp = rectList[j];
        rectList[j] = rectList[j + 1];
        rectList[j + 1] = temp;
      }
    }
  }

  let top,
      topDis,
      firstRect = rectList[0].rect,
      lastRect = rectList[rectList.length - 1].rect,
      center,
      editorRect = {};
  editorRect.top = firstRect.top + firstRect.height / 2;
  editorRect.bottom = lastRect.top + lastRect.height / 2;
  editorRect.height = editorRect.bottom - editorRect.top;
  let ava = editorRect.height / (rectList.length - 1);

  for (let i = 1; i < rectList.length - 1; i++) {
    center = editorRect.top + ava * i;
    eleRect = rectList[i];
    eleRect.yMid = eleRect.rect.top + eleRect.rect.height / 2;
    topDis = center - eleRect.rect.yMid;
    top = eleRect.rect.top + topDis;
    if(eleRect.groupDrag) {
      groupHandle.setGroupTransformById(eleRect.id, {left: 0, top: topDis});
      groupHandle.dispatchCommit('transform', eleRect.id);
    } else {
      elementHandle.setTopDis(topDis, undefined, eleRect.id);
    }
  }

  for (let i = 0; i < length; i++) {
    dataHandle.commit(
      'element',
      {
        pageIndex: dataHandle.vuexGetters().getFocusPageIndex,
        eleIndex: eleIndex[i],
        key: 'transform',
        value: elementHandle.getTransform(undefined, eleIndex[i]),
        eventType: 1
      });
  }

  dataHandle.push();
}

}

/**
 * 处理老json
 * @param {String} oldJson 画布的Json
 */
function _convertJson(oldJson) {
  // 处理老json
  if(oldJson.elems == undefined) {
    oldJson.elems = oldJson.elements;
    delete oldJson.elements;
  }
  return oldJson;
}


/**
 * json处理
 * @param {Json} json
 */
function _handleJson(json) {
  let length = json.length;
  let eles_json;
  if(length == undefined) {
    eles_json = json.elems;
    for(var j in eles_json) {
      let ele_json = eles_json[j];
      eles_json[j] = elementJsonHandle(ele_json);
    }
  } else {
    for(let i = 0;i < length;i++) {
      eles_json = json[i].elems;
      for(var j in eles_json) {
        let ele_json = eles_json[j];
        eles_json[j] = elementJsonHandle(ele_json);
      }
    }
  }
  return json;
}

function _layoutImgFun(eve, callback) {
  let target = eve.target;
  let className=target.getAttribute('class')||"";
  if(target.parentNode.className.baseVal == "layoutImgWrap") {
    let sorbIndex = 1;
    let elementIndex = 1;
    let searchElement = target;

    if(className.indexOf('sorb')>-1){

      sorbIndex = parseInt(className.split("_")[1]);
    }
    //简单往便利查找 父级节点

    let getElementId =  function (elemnt){
    let id = elemnt.getAttribute('id')||"";
      if(id.indexOf('ele')>-1){
        return true;
      }
      return  false;
    }
    while(!getElementId(searchElement)){
      searchElement = searchElement.parentElement;
    }
    let id = searchElement.id.replace('svgNode', '');
    callback(sorbIndex,id,event);
  }
}

 // v1之前json转换
function convertJson(oldJsonStr) {
  let oldJson = JSON.parse(oldJsonStr),
    newElems = [],
    newElem,
    newPage = {},
    oldElems = oldJson.elements;
  for (var eKey in oldElems) {
    newElem = convertJsonElem(oldElems[eKey]);
    if (newElem == null || newElem == undefined) {
      continue;
    }
    newElems.push(newElem);
  }
  
  newPage.elems = newElems;
  newPage.elegroups = {};
  newPage.v = '2.0.0';

  let newJsonStr = JSON.parse(JSON.stringify(newPage));
  return newJsonStr;
}

function convertJsonElem(elemJson) {
  var newElemJson = null;
  if (elemJson == null || elemJson == undefined || typeof elemJson != 'object') {
      return newElemJson;
  }
  if (elemJson.type == 'text') {
      newElemJson = convertJsonTextElem(elemJson);
  } else if (elemJson.type == 'svg') {

      newElemJson = convertJsonSvgElem(elemJson);
  } else if (elemJson.type == 'img' || elemJson.type == 'background') {

      newElemJson = convertJsonImgElem(elemJson);
  }
  return newElemJson;
}

function convertJsonTextElem(elemJson) {
  var newElemJson = {
      "data-elem": {}
  };
  var width = elemJson.width;
  var height = elemJson.height;
  var top = elemJson.top;
  var left = elemJson.left;
  var rotate = elemJson.scale;
  var rotateX = elemJson.rotateX;
  var rotateY = elemJson.rotateY;
  var flipX = parseInt(elemJson.rotate_x);
  var flipY = parseInt(elemJson.rotate_y);
  //12,字号,字体，颜色,斜体，透明度,对齐方式，字间距，位置,旋转，翻转,宽高,html
  var fontSize = elemJson.fontSize["0"];
  top = top + fontSize;
  var color = elemJson.fillColors["0"];
  var fontFamily = elemJson.fontFamily["0"];
  var isItalic = parseInt(elemJson.italic) == 1;
  var opacity = elemJson.opacity;
  var wspace = parseFloat(elemJson.fontLetter["0"]) * 100 + "";
  var align = elemJson.fontPosition["0"];
  var reverseType = 0;//0.不翻转;1.水平翻转;2.垂直翻转;3.水平垂直翻转
  if (align == "end") {
      align = "right";
      left = left - width;
  } else if (align == "middle") {
      align = "center";
      left = left - width / 2;
  } else {
      align = "left";
  }

  var reverse = "";//0.不翻转;1.水平翻转;2.垂直翻转;3.水平垂直翻转
  if (flipX == 180 && flipY == 180) {
      reverse = "matrix(-1,0,0,-1,0,0)translate(-" + elemJson.width + ",-" + elemJson.height + ")";
  } else if (flipX == 180) {
      reverse = "matrix(-1,0,0,1,0,0)translate(-" + elemJson.width + ",0)";

  } else if (flipY == 180) {
      reverse = "matrix(1,0,0,-1,0,0)translate(0,-" + elemJson.height + ")";
  }
  newElemJson["reverse"] = reverse;

  var strHtml = "";
  var objContent = elemJson.content;
  if (typeof elemJson == 'object') {
      for (var cKey in objContent) {
          strHtml += objContent[cKey] + "\n";
      }
  }

  strHtml = strHtml.substring(0, strHtml.length - 1);
  newElemJson['data-type'] = "text";
  newElemJson.transform = "translate(" + left + "," + top + ")rotate(" + rotate + ")";
  newElemJson["html"] = strHtml;
  newElemJson['data-elem']["font-size"] = fontSize;
  newElemJson['data-elem']["fill"] = color;
  newElemJson['data-elem']["font-family"] = fontFamily;
  newElemJson['data-elem']["data-italic"] = isItalic + "";
  newElemJson['data-elem']["opacity"] = opacity;
  newElemJson['data-elem']["data-align"] = align;
  newElemJson['data-elem']["wspace"] = wspace;
  newElemJson['data-elem']["width"] = width;
  newElemJson['data-elem']["height"] = height;

  return newElemJson;

}

function convertJsonSvgElem(elemJson) {
  //颜色,透明度,位置,旋转,宽高，翻转,缩放，viewbox，content-type,id,data-key,滤镜,吸附
  var newElemJson = {
      "data-elem": {}
  };
  //颜色
  if (typeof elemJson.fillColors == 'object') {
      newElemJson['data-elem']["data-colors"] = elemJson.fillColors;
  }

  //透明度
  newElemJson['data-elem']["opacity"] = elemJson.opacity;

  //位置,旋转
  var top = elemJson.top;
  var left = elemJson.left;
  var rotate = elemJson.scale;
  var rotateX = parseFloat(elemJson.width) / 2;
  var rotateY = parseFloat(elemJson.height) / 2;
  newElemJson.transform = "translate(" + left + "," + top + ")rotate(" + rotate + "," + rotateX + "," + rotateY + ")";

  //宽高
  newElemJson['data-elem']["width"] = elemJson.width;
  newElemJson['data-elem']["height"] = elemJson.height;

  //翻转
  var flipX = parseInt(elemJson.rotate_x);
  var flipY = parseInt(elemJson.rotate_y);
  var reverse = "";//0.不翻转;1.水平翻转;2.垂直翻转;3.水平垂直翻转
  if (flipX == 180 && flipY == 180) {
      reverse = "matrix(-1,0,0,-1,0,0)translate(-" + elemJson.width + ",-" + elemJson.height + ")";
  } else if (flipX == 180) {
      reverse = "matrix(-1,0,0,1,0,0)translate(-" + elemJson.width + ",0)";

  } else if (flipY == 180) {
      reverse = "matrix(1,0,0,-1,0,0)translate(0,-" + elemJson.height + ")";
  }
  newElemJson["reverse"] = reverse;

  //缩放
  if (typeof elemJson.transform == 'object') {
      var vary = {};
      var varyItemValue = null;
      for (var key in elemJson.transform) {
          varyItemValue = elemJson.transform[key];
          vary[key] = "translate(" + varyItemValue.translate_x + "," + varyItemValue.translate_y + ")scale(" + varyItemValue.scale_x + "," + varyItemValue.scale_y + ")";
      }
      newElemJson['data-elem']["vary"] = vary;
  }

  //viewbox

  if (typeof elemJson.viewbox == 'object') {
      newElemJson["data-elem"]["viewBox"] = elemJson.viewbox.x + " " + elemJson.viewbox.y + " " + elemJson.viewbox.width + " " + elemJson.viewbox.height;
  }

  //content-type
  newElemJson["data-img-kind"] = elemJson.content_type;

  //id
  newElemJson['data-elem']["id"] = elemJson.id;

  //data-key
  newElemJson['data-elem']["data-key"] = elemJson.img_key;

  //data-type ,吸附,滤镜
  var isFrame = Object.keys(elemJson.svgHref).length > 0;
  if (isFrame) {
      newElemJson['data-type'] = "svgFrame";
      var xhref = {};
      for (var key in elemJson.svgHref) {
          var item = {};
          item["x"] = elemJson.svgHref[key]["x"];
          item.y = elemJson.svgHref[key].y;
          item.width = elemJson.svgHref[key].width;
          item.height = elemJson.svgHref[key].height;
          item["data-img-key"] = elemJson.svgHref[key]["img_key"];
          item["data-class"] = key;
          newElemJson['data-elem']["filter"] = elemJson.svgHref[key]["filter"];
          xhref[key] = item;
      }
      newElemJson['data-elem']["data-xhref-imgs"] = xhref;

  } else {
      newElemJson['data-type'] = "svgImage";
  }

  return newElemJson;
}

function convertJsonImgElem(elemJson) {
  //位置，旋转，宽高，透明度，id,key，content-type，滤镜，翻转
  var newElemJson = {
      "data-elem": {}
  };


  //位置，旋转
  var top = elemJson.top;
  var left = elemJson.left;
  var rotate = elemJson.scale;
  var rotateX = parseFloat(elemJson.width) / 2;
  var rotateY = parseFloat(elemJson.height) / 2;
  newElemJson.transform = "translate(" + left + "," + top + ")rotate(" + rotate + "," + rotateX + "," + rotateY + ")";

  //宽高
  newElemJson['data-elem']["width"] = elemJson.width;
  newElemJson['data-elem']["height"] = elemJson.height;

  //透明度
  newElemJson['data-elem']["opacity"] = elemJson.opacity;

  //id
  newElemJson['data-elem']["id"] = elemJson.id;

  //data-key
  newElemJson['data-elem']["data-key"] = elemJson.img_key;

  //content-type
  newElemJson["data-img-kind"] = elemJson.content_type;

  //滤镜
  newElemJson['data-elem']["filter"] = elemJson.filter;

  //翻转
  var flipX = parseInt(elemJson.rotate_x);
  var flipY = parseInt(elemJson.rotate_y);
  var reverse = "";//0.不翻转;1.水平翻转;2.垂直翻转;3.水平垂直翻转
  if (flipX == 180 && flipY == 180) {
      reverse = "matrix(-1,0,0,-1,0,0)translate(-" + elemJson.width + ",-" + elemJson.height + ")";
  } else if (flipX == 180) {
      reverse = "matrix(-1,0,0,1,0,0)translate(-" + elemJson.width + ",0)";

  } else if (flipY == 180) {
      reverse = "matrix(1,0,0,-1,0,0)translate(0,-" + elemJson.height + ")";
  }
  newElemJson["reverse"] = reverse;

  if (elemJson.backgroundColor != null && elemJson.backgroundColor != undefined) {
      var bgColors = {};
      bgColors["0"] = elemJson.backgroundColor;
      newElemJson['data-elem']["data-colors"] = bgColors;
      newElemJson['data-type'] = "background";
  } else {
      newElemJson['data-type'] = "img";
  }


  return newElemJson;

}

export default page;

