
/*
 * 画布素材相关操作
 * @Author: zhangdi
 * @Date: 2017-09-04 11:26:00 
 * @Last Modified by: bianhao
 * @Last Modified time: 2017-11-16 22:05:22
 */

import dataHandle from 'common/dataHandle';
import {getTransformAttr, setTransformAttr} from 'common/common';
import eleEvent from 'dataBus/element';
import editorBus from 'dataBus/editor.js';
import toolsBarBus from 'dataBus/toolsBar.js';
import elementBus from 'dataBus/element';
import pageBus from 'dataBus/page';
import groupBus from 'dataBus/group.js';
import { elementJsonHandle } from 'common/common';

const pageEle = {

/**
 * 画布新增素材
 * @param {json} eleJson 新增素材的json
 * @param {String} pageIndex 素材所属page的下标
 * @param {String} eleIndex 新增素材下标
 * @param {} doNotFocus 添加后不设置焦点
 */
addElement(eleJson, pageIndex, eleIndex, doNotFocus, newEleDrag) {
  pageIndex = pageIndex === null || pageIndex === undefined ? dataHandle.vuexGetters().getFocusPageIndex : pageIndex;
  let pageJson = dataHandle.getPageJson(pageIndex),
      elesJson = pageJson.elems;

  let eleJsonNew = JSON.parse(JSON.stringify(eleJson));
  eleJsonNew = elementJsonHandle(eleJsonNew);

  
  if(eleIndex) {
    elesJson.splice(eleIndex, 0, eleJsonNew);
  } else {
    elesJson.push(eleJsonNew);
  }

  pageBus.elementBlur();

  let newEleIndex = eleIndex || elesJson.length - 1;
  // 判断是否是新添加的素材
  if(newEleDrag && eleJson['data-type'] != 'background') {
    if(eleJsonNew.group && eleJsonNew.group.length > 0) {
      dataHandle.vuexActions().setNewAddEleId[0](eleJsonNew.group);
    } else {
      dataHandle.vuexActions().setNewAddEleId[0](eleJsonNew.eleid);
    }
    if(!doNotFocus && (!eleJsonNew.group || eleJsonNew.group === '')) {
      setTimeout(() => {
        eleEvent.setFocusElemIndex({
          index: newEleIndex
        });
        dataHandle.$vue.$store.dispatch('setEditorShow', true);
      }, 300);
    }
  } else if (!doNotFocus) {
    if (!eleJsonNew.group || eleJsonNew.group === '') {
      eleEvent.setFocusElemIndex({
        index: newEleIndex
      });
      dataHandle.$vue.$store.dispatch('setEditorShow', true);
    }
  }

  return {
    pageIndex: pageIndex,
    eleIndex: newEleIndex,
    value: JSON.parse(JSON.stringify(eleJsonNew)),
    eventType: 0
  }
  /*
  dataHandle.commit(
    'element',
    {
      pageIndex: pageIndex,
      eleIndex: newEleIndex,
      value: JSON.parse(JSON.stringify(eleJson)),
      eventType: 0
    }).push();*/
},

/**
 * 画布删除素材
 * @param {String} pageIndex 素材所属page的下标
 * @param {String} eleIndex 操作素材下标
 */
delElement(pageIndex, eleIndex) {
  let pageJson = dataHandle.getPageJson(pageIndex),
      elesJson = pageJson.elems;
  eleIndex = eleIndex === null || eleIndex === undefined ? dataHandle.vuexGetters().getFocusElemIndex : eleIndex;
  elesJson.splice(eleIndex, 1);
},

/**
 * 画布复制素材
 * @param {String} pageIndex 素材所属page的下标
 * @param {String} eleIndex 操作素材下标
 */
copyElement(pageIndex, eleIndex) {
  let pageJson = dataHandle.getPageJson(pageIndex),
      eleJson = dataHandle.getEleJson(pageIndex, eleIndex),
      pageScale = dataHandle.vuexGetters().getPageScale;

  eleJson = JSON.parse(JSON.stringify(eleJson));
  let transform = getTransformAttr(eleJson.transform, 'translate');
  transform[0] = parseFloat(transform[0]) + 20 / pageScale;
  transform[1] = parseFloat(transform[1]) + 20 / pageScale;

  let translate = `translate(${transform[0]},${transform[1]})`;
  eleJson.transform = eleJson.transform.replace(/translate\(.+?\)/, translate);
  eleJson['data-elem'].lock = false;
  eleJson.eleid = 'ele' + new Date().getTime() + parseInt(100000 * Math.random()) + '_' + window.material_id_index++;
  if(eleJson['data-type'] === 'background') {
    eleJson['data-type'] = 'img';
  }
  if(eleJson['data-type'] === 'text') {
    delete eleJson['data-elem'].id;
  }
  if(eleJson['data-type'] === 'svgChart') {
    delete eleJson['data-elem'].id;
  }
  pageJson.elems.push(eleJson);
  return eleJson;
},

/**
 * 改变素材图层
 * @param {String} type top:置顶 bottom:置底 up:上移 down:下移 index:指定下标
 * @param {Number} pageIndex 素材所属page的下标
 * @param {Number} eleIndex 素材下标
 * @param {Number} newIndex 素材新的下标
 */
setElementIndex(type, pageIndex, eleIndex, newIndex) {
  let pageJson = dataHandle.getPageJson(pageIndex),
      elesJson = pageJson.elems;
  eleIndex = eleIndex === null || eleIndex === undefined ? dataHandle.vuexGetters().getFocusElemIndex : eleIndex;
  let eleJson = JSON.parse(JSON.stringify(elesJson.splice(eleIndex, 1)[0]));
  switch(type) {
    case 'top':
    elesJson.push(eleJson);
    eleIndex = elesJson.length - 1;
    break;
    case 'bottom':
      elesJson.splice(1, 0, eleJson);
      eleIndex = 1;
      break;
    case 'up':
      elesJson.splice(eleIndex + 1, 0, eleJson);
      eleIndex++;
      break;
    case 'down':
      elesJson.splice(eleIndex - 1, 0, eleJson);
      eleIndex--;
      break;
    case 'index':
      elesJson.splice(newIndex, 0, eleJson);
      break;
  }
  return newIndex || eleIndex;
},

/**
 * 改变素材Json
 * @param {json} eleJson 替换素材的json
 * @param {String} pageIndex 素材所属page的下标
 * @param {String} eleIndex 素材下标
 */
setElementJson(eleJson, pageIndex, eleIndex) {
  let pageJson = dataHandle.getPageJson(pageIndex),
      editorShow = dataHandle.vuexGetters().getEditorShow,
      elesJson = pageJson.elems;
  eleIndex = eleIndex === null || eleIndex === undefined ? dataHandle.vuexGetters().getFocusElemIndex : eleIndex;
  eleJson = JSON.parse(JSON.stringify(eleJson));
  //eleJson.eleid = 'element_' + new Date().getTime() + parseInt(10000 * Math.random());
  elesJson.splice(eleIndex, 1, eleJson);
  if(eleIndex !== 0&&editorShow) editorBus.setEditorState();
},

/**
 * 添加素材到框选列表
 */
addElementToCircleSelect(eleIndex) {
  let vuexGetters = dataHandle.vuexGetters(),
      vuexActions = dataHandle.vuexActions(),
      circle = [],
      find = false;
  if(vuexGetters.getFocusElemIndex > 0) {
    circle[0] = vuexGetters.getFocusElemIndex;
  } else {
    circle = vuexGetters.getCircleSelectElements
  }
  for (let i = 0; i < circle.length; i++) {
    if(circle[i] === eleIndex) {
      find = true;
      break;
    }
  }
  if(!find) {
    circle.push(eleIndex);
  }
  pageBus.elementBlur();
  this.setCircleSelectElements(circle);
},

/**
 * 重置画布背景
 */
resetBackground() {
  if(!pageBus.isAllPageLoad()) pageBus.queryPageJson([], this.resetBackground);
  let pagesJson = dataHandle.getPagesJson(),
      vuexGetters = dataHandle.vuexGetters(),
      pageWidth = vuexGetters.getPageWidth,
      pageHeight = vuexGetters.getPageHeight,
      background,
      backgroundW,
      backgroundH,
      r;
  for (let i = 0; i < pagesJson.length; i++) {
    background = pagesJson[i].elems[0];
    if(background['data-elem']['data-colors']) {
      eleEvent.setWidth(pageWidth, i, 0);
      eleEvent.setHeight(pageHeight, i, 0);
      eleEvent.setTop(0, i, 0);
      eleEvent.setLeft(0, i, 0);
    } else {
      backgroundW = background['data-elem'].width;
      backgroundH = background['data-elem'].height;
      r = backgroundW / backgroundH;
      if(r === pageWidth / pageHeight) {
        backgroundW = pageWidth;
        backgroundH = pageHeight;
        elementBus.setWidth(backgroundW, i, 0);
        elementBus.setHeight(backgroundH, i, 0);
        eleEvent.setTop(0, i, 0);
        eleEvent.setLeft(0, i, 0);
      } else if(r < pageWidth / pageHeight) {
        backgroundW = pageWidth;
        backgroundH = backgroundW / r;
        elementBus.setWidth(backgroundW, i, 0);
        elementBus.setHeight(backgroundH, i, 0);
        eleEvent.setTop((pageHeight - backgroundH) / 2, i, 0);
        eleEvent.setLeft(0, i, 0);
      } else {
        backgroundH = pageHeight;
        backgroundW = backgroundH * r;
        elementBus.setWidth(backgroundW, i, 0);
        elementBus.setHeight(backgroundH, i, 0);
        eleEvent.setTop(0, i, 0);
        eleEvent.setLeft((pageWidth - backgroundW) / 2, i, 0);
      }
    }
    dataHandle.commit('element',
      {
        pageIndex: i,
        eleIndex: 0,
        key: 'width',
        value: backgroundW,
        eventType: 1
      }
    );
    dataHandle.commit('element',
      {
        pageIndex: i,
        eleIndex: 0,
        key: 'height',
        value: backgroundH,
        eventType: 1
      }
    );
    dataHandle.commit('element',
      {
        pageIndex: i,
        eleIndex: 0,
        key: 'transform',
        value: elementBus.getTransform(i, 0),
        eventType: 1
      }
    );

  }
},

/**
 * 获取焦点素材
 */
getFocusElement() {
  let vuexGetters = dataHandle.vuexGetters(),
      eles = [];
  if(vuexGetters.getFocusElemIndex >= 0) {
    eles.push(vuexGetters.getFocusElemIndex);
  } else if(vuexGetters.getCircleSelectElements.length > 0) {
    eles = vuexGetters.getCircleSelectElements;
  }
  return eles;
},

/**
 * 获取素材Json
 * @param {String} pageIndex 素材所属page的下标
 * @param {String} eleIndex 素材下标
 */
getElementJson(pageIndex, eleIndex) {
  let pageJson = dataHandle.getPageJson(pageIndex),
      elesJson = pageJson.elems;
  eleIndex = eleIndex === null || eleIndex === undefined ? dataHandle.vuexGetters().getFocusElemIndex : eleIndex;
  let eleJson = JSON.parse(JSON.stringify(elesJson[eleIndex]));
  return eleJson;
},

/**
 * 获取素材Json是否是组合素材
 * @param {String} pageIndex 素材所属page的下标
 * @param {String} eleIndex 素材下标
 */
getElementGroupDrag(pageIndex, eleIndex) {
  let eleJson = pageEle.getElementJson(pageIndex, eleIndex);
  if(eleJson.group) {
    return true;
  } else {
    return false;
  }
},

/**
 * 获取素材Json用于保存
 * @param {String} pageIndex 素材所属page的下标
 * @param {String} eleIndex 素材下标
 */
getEleJsonForSave(pageIndex, eleIndex) {
  let eleJson = pageEle.getElementJson(pageIndex, eleIndex);
  eleJson = JSON.parse(JSON.stringify(eleJson));
  delete eleJson['eleid']
  if(eleJson['data-elem']['data-key'] === '') {
    delete eleJson['data-elem']['data-key']
  }
  return eleJson;
},

getNotFocusEleRectList(notId) {

  let vuexGetters = dataHandle.vuexGetters(),
      vuexAcitons = dataHandle.vuexActions(),
      focusElemIndex = vuexGetters.getFocusElemIndex,
      circleSelectElements = vuexGetters.getCircleSelectElements,
      focusEle,
      length = vuexGetters.getFocusPageElemSum,
      rectList = [];

  focusEle = circleSelectElements.concat(focusElemIndex);
  focusEle = notId ? focusEle.concat(notId) : focusEle;

  let rect;
  for (let i = 1; i < length; i++) {
    if(focusEle.indexOf(i) < 0) {
      rect = eleEvent.getElemRect(undefined, i);
      rect.eleIndex = i;
      rectList.push(rect);
    }
  }

  rectList.push({
    top: 0,
    right: parseFloat(vuexGetters.getPageWidth),
    bottom: parseFloat(vuexGetters.getPageHeight),
    left: 0,
    width: parseFloat(vuexGetters.getPageWidth),
    height: parseFloat(vuexGetters.getPageHeight),
    background: true,
    eleIndex: 0
  });

  vuexAcitons.setNotFocusEleRectList[0](rectList);

  return rectList;

},

/**
 * 设置组合素材内容
 * @param {String} group 组合内容
 * @param {Number} pageIndex 画布下标
 * @param {String} groupId 组合id
 */
setEleGroups(group, pageIndex,groupId, newGroupDrag) {
  pageIndex = pageIndex === null || pageIndex === undefined ? dataHandle.vuexGetters().getFocusPageIndex : pageIndex;
  let pagesJson = dataHandle.getPageJson();
	pagesJson.elegroups = group;
  if(groupId){
    if(newGroupDrag) {
      setTimeout(() => {
        this.setGroupByGroupId(groupId);
      }, 400);
    } else {
      this.setGroupByGroupId(groupId);
    }
  }
},
  // /**
  //  * 删除组合素材内容
	 // * @param groupId groupId 组合Id
	 // * @param pageIndex pageIndex 画布下标
	 // */
  // delEleGroups(groupId,pageIndex){
  //   pageIndex = pageIndex === null || pageIndex === undefined ? dataHandle.vuexGetters().getFocusPageIndex : pageIndex;
  //   let pagesJson = dataHandle.getPageJson();
  //   if(pagesJson.elegroups[groupId]){
  //     delete pagesJson.elegroups[groupId]
  //   }
  // },

 /**
  * [setElementGroup 设置组合素材]
  * @param {[String]} transform [组合素材transform]
  */
setElementGroup(transform) {
  let vuexGetters = dataHandle.vuexGetters(),
      pageJson = dataHandle.getPageJson(),
      vStore = dataHandle.$vue.$store,
      focusPageIndex = dataHandle.vuexGetters().getFocusPageIndex,
      elems = pageJson.elems,
      groups = pageJson.elegroups,
      selectArr = vuexGetters.getCircleSelectElements;

  let dataHandleEvent={},elemsEvents=[]

  let newGroupKey = 'element_group_' + new Date().getTime();
  groups[newGroupKey] = { transform };

  dataHandleEvent.groupIndex=newGroupKey
   dataHandleEvent.groupValue={transform}

  selectArr.forEach(item => {
    elems[item].group = newGroupKey;
    elems[item]['group-transform'] = transform;
    
	  elemsEvents.push({
      pageIndex:focusPageIndex,
      eleIndex:item,
      key:'group',
      value:newGroupKey,
      eventType:1
    },{
		  pageIndex:focusPageIndex,
		  eleIndex:item,
		  key:'group-transform',
		  value:transform,
		  eventType:1
    })
  })

  vStore.dispatch('setGroupFlag', true);
  vStore.dispatch('setGroupId', newGroupKey);

  return {elemsEvents, dataHandleEvent}
},

/**
 * [splitElementGroup 拆分组合]
 * @return {[type]} [无返回值]
 */
splitElementGroup() {
  let vuexGetters = dataHandle.vuexGetters(),
      pageIndex = vuexGetters.getPageIndex,
	    focusPageIndex = dataHandle.vuexGetters().getFocusPageIndex,
      selectArr = vuexGetters.getCircleSelectElements;

	let dataHandleEvent={groupElem:[]},elemsEvents=[]

  selectArr.forEach(item => {
    let elem = dataHandle.getEleJson(pageIndex, item);
	  dataHandleEvent.groupIndex=elem.group
	  dataHandleEvent.groupElem.push({
		  eleIndex:item,
		  groupData:{
			  group:elem.group,
			  'group-transform':elem['group-transform']
		  }
    })
	  elem.group = '';
	  elem['group-transform'] = '';
	  elemsEvents.push({
		  pageIndex:focusPageIndex,
		  eleIndex:item,
		  key:'group',
		  value:'',
		  eventType:1
	  },{
		  pageIndex:focusPageIndex,
		  eleIndex:item,
		  key:'group-transform',
		  value:'',
		  eventType:1
	  })
  })

	dataHandleEvent.groupValue=dataHandle.getPageJson(pageIndex).elegroups[dataHandleEvent.groupIndex]

  dataHandle.$vue.$store.dispatch('setGroupFlag', false);
	return {elemsEvents,dataHandleEvent}
},

/**
 * [getGroupArrById 通过groupid取到该组合素材所有索引]
 * @param  {[String]} groupId [description]
 * @return {[Array]}         [索引数组]
 */
getGroupArrById(groupId) {
  let vuexGetters = dataHandle.vuexGetters(),
      focusPageIndex = vuexGetters.getFocusPageIndex,
      pageJson = dataHandle.getPageJson(),
      elems = pageJson.elems,
      arr = [];

  elems.forEach((item, index) => {
      if(item.group === groupId) {
        arr.push(index);
      }
      
    })
  return arr;
},

/**
 * [getSelectByGroupOne 通过groupid取到该组合素材所有索引]
 * @param  {[String]} groupId [description]
 * @return {[Array]}         [索引数组]
 */
setGroupByGroupId(groupId) {
  let vuexGetters = dataHandle.vuexGetters(),
      vStore = dataHandle.$vue.$store,
      focusPageIndex = vuexGetters.getFocusPageIndex,
      pageJson = dataHandle.getPageJson(),
      elems = pageJson.elems,
      arr = [];

  elems.forEach((item, index) => {
    if(item.group === groupId) {
      arr.push(index);
    }
  });
  vStore.dispatch('setFocusElemIndex', {index: -1});
  vStore.dispatch('setGroupFlag', true);
  vStore.dispatch('setGroupId', groupId);
  vStore.dispatch('setCircleSelectElements', arr);
  vStore.dispatch('setEditorShow', true);
  vStore.dispatch('setToolsBarShow', true);
  editorBus.setEditorState();
  toolsBarBus.setToolsBarState();
},

 /**
 * [setCircleSelectElements 通过框选的索引数组设置所有信息]
 * @param {[Array]} arr 
 */
setCircleSelectElements(arr) {
  let vuexGetters = dataHandle.vuexGetters(),
      vStore = dataHandle.$vue.$store,
      elems = dataHandle.getPageJson().elems;
  // debugger
  if(arr.length === 0) return;
  //框选的是单个元素
  if(arr.length === 1) {
    //该元素为组合元素
    if(elems[arr[0]].group && groupBus.getGroupValueById(elems[arr[0]].group)) {
      this.setGroupByGroupId(elems[arr[0]].group);
    } 
    //非组合元素
    else {
      vStore.dispatch('setFocusElemIndex', { index: arr[0], eleType: elems[arr[0]]['data-type'] });
      vStore.dispatch('setEditorShow', true);
    }
  }
  //框选到多个
  else {
    // vStore.dispatch('setFocusElemIndex', -1);
    //判断所有框选的素材都是非组合素材
    let allNoGroup = arr.every(item => !elems[item].group);
    if(allNoGroup) {
      vStore.dispatch('setCircleSelectElements', arr);
      vStore.dispatch('setToolsBarType', 'selects');
      toolsBarBus.setToolsBarState();
      editorBus.setEditorState();
      vStore.dispatch('setEditorShow', true);
      vStore.dispatch('setToolsBarShow', true);
      return ;
    }
    //如果所有素材都是组合
    let allIsGroup = arr.every(item => elems[item].group);
    if(allIsGroup) {
      let groupId = elems[arr[0]].group;
      let allIsOneGroup = arr.every(item => elems[item].group === groupId);
      //如果所有素材都是同一个组合
      if(allIsOneGroup && groupBus.getGroupValueById(groupId)) {
        let nArr = this.getGroupArrById(groupId);
        vStore.dispatch('setToolsBarType', 'selects');
        vStore.dispatch('setGroupFlag', true);
        vStore.dispatch('setGroupId', groupId);
        vStore.dispatch('setCircleSelectElements', nArr);
        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        vStore.dispatch('setEditorShow', true);
        vStore.dispatch('setToolsBarShow', true);
      }
      //如果素材不属于同一个组合
      else {
        let newArr = [],
            groupArr = [];
        //遍历框选素材索引将所有属于组合的索引找出来
        arr.forEach(item => {
          if(groupBus.getGroupValueById(elems[item].group)) {
            newArr = newArr.concat(this.getGroupArrById(elems[item].group));
            groupArr.push(elems[item].group);
          }
          else {
            newArr.push(item);
          }
        })
        //去重
        newArr = Array.from(new Set(newArr));
        groupArr = Array.from(new Set(groupArr));
        vStore.dispatch('setToolsBarType', 'selects');
        vStore.dispatch('setCircleSelectElements', newArr);
        vStore.dispatch('setSelectGroup', groupArr);
        vStore.dispatch('setSelectHaveGroup', true);
        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        vStore.dispatch('setEditorShow', true);
        vStore.dispatch('setToolsBarShow', true);
      }
    }
    //框选的有单个的也有组合的
    else{
      let newArr = [],
          groupArr = [];
        //遍历框选素材索引将所有属于组合的索引找出来
        arr.forEach(item => {
          if(elems[item].group && groupBus.getGroupValueById(elems[item].group)){
            newArr = newArr.concat(this.getGroupArrById(elems[item].group));
            groupArr.push(elems[item].group);
          } else {
            newArr.push(item);
          }
        })
        //去重
        newArr = Array.from(new Set(newArr));
        groupArr = Array.from(new Set(groupArr));
        vStore.dispatch('setToolsBarType', 'selects');
        vStore.dispatch('setCircleSelectElements', newArr);
        vStore.dispatch('setSelectHaveGroup', true);
        vStore.dispatch('setSelectGroup', groupArr);
        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        vStore.dispatch('setEditorShow', true);
        vStore.dispatch('setToolsBarShow', true);
    }
  }
  
},

 /**
 * 根据素材的id获取素材的index
 * @param {String} eleId 素材Id
 * @param {Number} pageId 画布id
 */
getEleIndexById(eleId, pageId) {
  let vuexGetters = dataHandle.vuexGetters(),
      pageIdList = vuexGetters.getPageIdList,
      pageIndex = -1;
  pageIdList.forEach((id, i)=>{
    if(id === pageId)
      pageIndex = i;
  });
  if(pageIndex === -1) return undefined;
  let pageJson = dataHandle.getPageJson(pageIndex),
      elems = pageJson['elems'],
      index = -1;
  elems.forEach((ele, i)=>{
    if(ele['eleid'] === eleId)
      index = i;
  });
  if(index === -1) {
    return undefined;
  }
  return index;
}

}

export default pageEle;

