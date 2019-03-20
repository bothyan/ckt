/**
 * editor 公共方法
 * created by huyg in 2017/8/16
 * phone：15280907093
 */

 import { getTransformAttr, setTransformAttr } from 'common/common.js';
 import dataHandle from 'common/dataHandle';
 import pageBus from 'dataBus/page';
 import pageEleBus from 'dataBus/pageEle.js';
 import eleBus from 'dataBus/element.js';
 import groupBus from  'dataBus/group.js';
 import toolsBarBus from 'dataBus/toolsBar.js';


 const editorBus = {
  /**
   * 
   * @export 获取穿透素材索引
   * @param {option} option：{
   *                    top       鼠标点击点离画布上边的距离
   *                    left      鼠标点击点离画布左边的距离
   *                 }
   * @return {Number} 如果穿透成功，返回新的素材索引，否则返回 -1
   */
  getEditorClickTarget( option ) {

    let getters = dataHandle.vuexGetters(),
        vStore = dataHandle.$vue.$store,
        elems = getters.getFocusPage.elems,
        elemIndex = getters.getFocusElemIndex,
        scale = getters.getPageScale,
        selectElems = getters.getCircleSelectElements,
        checkArr = [],
        target = -1;

    if(elemIndex > -1) {
      for(let i = elemIndex + 1, l = elems.length; i < l ; i++) {
        checkArr.push(i);
      }
      
    } else {
      elems.forEach((item, index) => {
        if(selectElems.indexOf(index) === -1 && index !== 0){
          checkArr.push(index);
        }
      })
    }
    checkArr.reverse();

    for(let i = 0, l = checkArr.length; i < l; i++) {
      let elem = elems[checkArr[i]],
      data = elem['data-elem'],
      w = data.width * scale,
      h = data.height * scale,
      position = getTransformAttr(elem.transform, 'translate'),
      rotate = getTransformAttr(elem.transform, 'rotate');

      position = position.map(item => parseFloat(item));

      let origin = {
        x: position[0] * scale + w / 2,
        y: position[1] * scale + h / 2
      },
      r = Math.sqrt(Math.pow(option.left - origin.x, 2) + Math.pow(option.top - origin.y, 2), 2),
      x = option.left - origin.x,
      y = option.top - origin.y,
      targetAngle = Math.atan(x / y) * 180 / Math.PI;

      if (y < 0) {
        targetAngle = 180 - targetAngle;
      } else if (x < 0) {
        targetAngle = -targetAngle;
      } else {
        targetAngle = 360 - targetAngle;
      }
      targetAngle = (targetAngle + 90) % 360;

      let originAngle = (targetAngle - rotate[0] + 360) % 360,
      originPos = {
        x: Math.cos(originAngle / 180 * Math.PI) * r,
        y: Math.sin(originAngle / 180 * Math.PI) * r
      };

      if(Math.abs(originPos.x) <= w / 2 && Math.abs(originPos.y) <= h / 2){
        target = checkArr[i];
        break;
      }
    }
    //如果没有找到
    if(target === -1) {
      return;
    }
    pageBus.elementBlur();
    //找到组合素材
    if(elems[target].group && groupBus.getGroupValueById(elems[target].group)) {
      let groupId = elems[target].group;
      pageEleBus.setGroupByGroupId(groupId);
    }
    //找到单个素材
    else {
      vStore.dispatch('setFocusElemIndex', { index: target, eleType: elems[target]['data-type'] });
    }
    vStore.dispatch('setEditorShow', true);
  },

  /**
   * [getEditorDblClickTarget 组合素材]
   * @param  {[type]} option [description]
   * @return {[type]}        [description]
   */
  getEditorDblClickTarget( option ) {
    let getters = dataHandle.vuexGetters(),
        selectElems = getters.getCircleSelectElements,
        vStore = dataHandle.$vue.$store,
        elems = getters.getFocusPage.elems,
        scale = getters.getPageScale,
        target = -1;

    for(let i=selectElems.length - 1; i >= 0; i--) {
      let elem = elems[selectElems[i]],
          data = elem['data-elem'],
          w = data.width * scale,
          h = data.height * scale,
          position = getTransformAttr(elem.transform, 'translate').map(item => parseFloat(item)),
          rotate = getTransformAttr(elem.transform, 'rotate').map(item => parseFloat(item));


      let origin = {
        x: position[0] * scale + w / 2,
        y: position[1] * scale + h / 2
      },
      r = Math.sqrt(Math.pow(option.left - origin.x, 2) + Math.pow(option.top - origin.y, 2), 2),
      x = option.left - origin.x,
      y = option.top - origin.y,
      targetAngle = Math.atan(x / y) * 180 / Math.PI;

      if (y < 0) {
        targetAngle = 180 - targetAngle;
      } else if (x < 0) {
        targetAngle = -targetAngle;
      } else {
        targetAngle = 360 - targetAngle;
      }
      targetAngle = (targetAngle + 90) % 360;

      let originAngle = (targetAngle - rotate[0] + 360) % 360,
      originPos = {
        x: Math.cos(originAngle / 180 * Math.PI) * r,
        y: Math.sin(originAngle / 180 * Math.PI) * r
      };

      if(Math.abs(originPos.x) <= w / 2 && Math.abs(originPos.y) <= h / 2){
        target = selectElems[i];
        break;
      }
    }

    if(target === -1) {
      return;
    }

    vStore.dispatch('setFocusElemIndex', { index: target, eleType: elems[target]['data-type'] });


  },

  /**
   * [setEditorState description] 通过单个element，设置editor属性
   */
  setEditorState() {
    let vuexGetters = dataHandle.vuexGetters(),
        clipFlag = vuexGetters.getClipFlag,
        vStore = dataHandle.$vue.$store,
        pageJson = dataHandle.getPageJson(),
        pageScale = vuexGetters.getPageScale,
        groupFlag = vuexGetters.getGroupFlag,
        toolsBarType = vuexGetters.getToolsBarType;

    if(clipFlag){
      this._setEditorStateByCut();
    } 
    else if(groupFlag) {
      let groupId = vuexGetters.getGroupId,
          lock = pageJson.elegroups[groupId].lock || false;
      vStore.dispatch('setEditorInfo', {lock, varyType: 'selects', ..._getEditorInfoByGroup(pageJson.elegroups[groupId].transform, pageScale)});
      
    } 
    else {
      if(toolsBarType === 'selects'){
        vStore.dispatch('setEditorInfo', { varyType: 'selects', lock: false, rotate: 0, ...this._setEditorStateBySelect()});
      } else {
        vStore.dispatch('setEditorInfo', _getFocusElemInfoForEditor());
      }
    }
  },

  setLayerAnimationInfo(type) {
    let vuexGetters = dataHandle.vuexGetters(),
        pageScale = vuexGetters.getPageScale,
        rect = eleBus.getElemRect(),
        reto = {
          left: rect.right * pageScale + 16,
          top: rect.top * pageScale
        },
        layerIndex = vuexGetters.getLayerIndex,
        layerLen = vuexGetters.getLayerLen;
    //上移
    if(type === 'up') {
      reto.len = layerLen;
      reto.from = layerIndex;
      reto.to = layerIndex + 1;
    }
    //下移
    else {
      reto.len = layerLen;
      reto.from = layerIndex;
      reto.to = layerIndex - 1;
    }
    dataHandle.$vue.$store.dispatch('setLayerAnimationInfo', reto);
  },

  _setEditorStateByCut() {
    dataHandle.$vue.$store.dispatch('setEditorInfo', _getEditorInfoByCut());
  },

  /**
   * [setEditorStateByGrounp description] 通过框选素材数组，设置editor属性
   */
  _setEditorStateBySelect() {
    //素材数组、框选数组
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

    info.width = (info.right - info.left) * pageScale;
    info.height = (info.bottom - info.top) * pageScale;
    info.left = info.left * pageScale;
    info.top = info.top * pageScale;

    return info;

    //获取素材位置、大小信息，返回对象包含left、top、width、height；
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
  },
  /**
   * [getEditorPostion ]
   * @return {[type]} [description]
   */
  getEditorPostion() {
    let vuexGetters = dataHandle.vuexGetters(),
        pageScale = vuexGetters.getPageScale,
        reto = JSON.parse(JSON.stringify(vuexGetters.getEditorPosition));

    reto.left = reto.left / pageScale;
    reto.top = reto.top / pageScale;
    reto.width = reto.width / pageScale;
    reto.height = reto.height / pageScale;
    reto.right = reto.right / pageScale;
    reto.bottom = reto.bottom / pageScale;

    return reto;
  },

  getEditorTransform() {
    let vuexGetters = dataHandle.vuexGetters(),
        pageScale = vuexGetters.getPageScale,
        editorPostion = vuexGetters.getEditorPosition;

    return `translate(${editorPostion.left / pageScale},${editorPostion.top / pageScale})rotate(0,${editorPostion.width / 2 / pageScale},${editorPostion.height / 2 / pageScale})`;
  },

  
  /**
   * [getInitOpacity 获取移动之前所有素材的透明度]
   * @return {[type]} [description]
   */
  _getInitOpacity() {
    let vuexGetters = dataHandle.vuexGetters(),
        pageIndex = vuexGetters.getFocusPageIndex,
        focusElemIndex = vuexGetters.getFocusElemIndex,
        elems = [],
        opacitys = []

    if(focusElemIndex > -1) {
      elems.push(focusElemIndex);
    } else {
      elems = vuexGetters.getCircleSelectElements;
    }

    elems.forEach( item => {
      let elem = dataHandle.getEleJson(pageIndex, item);
      opacitys.push({ 
        pageIndex,
        eleIndex: item,
        value: elem['data-elem'].opacity
      });
    })

    return opacitys;
  },
  /**
   * [setInitOpacity 移动完成后重置opacity]
   * @param {[type]} opacitys [description]
   */
  _setInitOpacity(opacitys) {

    opacitys.forEach(item => {
      let elem = dataHandle.getEleJson(item.pageIndex, item.eleIndex);
      elem['data-elem'].opacity = item.value;
      dataHandle.commit('element', {
        pageIndex: item.pageIndex,
        eleIndex: item.eleIndex,
        key: 'opacity',
        value: item.value,
        eventType: 1
      })
    })
    dataHandle.push(true)
  },

  /**
   * [getInitColor 获取修改之前所有元素的初始颜色]
   * @return {[Array]} [所有的颜色数组]
   */
  _getInitColors() {
    let vuexGetters = dataHandle.vuexGetters(),
        pageIndex = vuexGetters.getFocusPageIndex,
        elems = dataHandle.getPageJson().elems,
        selectArr = vuexGetters.getCircleSelectElements;

    let reto = [];

    selectArr.forEach(item => {
      //文字
      if(elems[item]['data-type'] === 'text') {
        reto.push({
          pageIndex,
          eleIndex: item,
          value: elems[item]['data-elem'].fill
        })
      }
      //其他
      else {
        if(elems[item]['data-elem']['data-colors']) {
          reto.push({
            pageIndex,
            eleIndex: item,
            value: JSON.parse(JSON.stringify(elems[item]['data-elem']['data-colors']))
          })
        }
      }
    })

    return reto;
  },

  /**
   * [setInitColors 重置初始颜色 ]
   * @param {[type]} colors [description]
   */
  _resetInitColors(colors) {
    colors.forEach(item => {
      let elem = dataHandle.getEleJson(item.pageIndex, item.eleIndex);
      if(elem['data-type'] === 'text'){
        elem['data-elem'].fill = item.value;
      }
      else {
        elem['data-elem']['data-colors'] = item.value;
      }
    })
  },

  //设置组合颜色
  _setColors(color, click) {
    let vuexGetters = dataHandle.vuexGetters(),
      pageIndex = vuexGetters.getFocusPageIndex,
      selectArr = vuexGetters.getCircleSelectElements;

    selectArr.forEach(item => {
      let elem = dataHandle.getEleJson(pageIndex, item);

      if(elem['data-type'] === 'text' && click) {
        elem['data-elem'].fill = color;
      }
      else {
        if(elem['data-elem']['data-colors']) {
          let keys = Object.keys(elem['data-elem']['data-colors']);

          keys.forEach(item => {
            elem['data-elem']['data-colors'][item] = color;
          })
        }
      }
    })
  },

  //触发保存
  dispatchCommit(obj, pageIndex, eleIndex) {
    let vuexGetters = dataHandle.vuexGetters();
    
    pageIndex = pageIndex !== undefined ? pageIndex : vuexGetters.getFocusPageIndex;
    eleIndex = eleIndex !== undefined ? eleIndex : vuexGetters.getFocusElemIndex;

    for(let key in obj) {
      if( obj.hasOwnProperty(key) ) {
        dataHandle.commit('element', {
          pageIndex,
          eleIndex,
          key,
          value: obj[key],
          eventType: 1
        })
      }
    }
    return dataHandle;
  },

  /**
   * 快捷键复制素材
   */
  copyEleByKey() {
    let eles = pageEleBus.getFocusElement(),
        elesJson = [],
        eleJson,
        groupList = [];
    if(eles.length === 0) return;
    for (let i = 0; i < eles.length; i++) {
      eleJson = pageEleBus.getElementJson(undefined, eles[i]);
      elesJson.push(eleJson);
      // 判断复制的素材中是否有组合
      if(eleJson.group) {
        let notFind = groupList.every(item => item != eleJson.group);
        if(notFind) groupList.push(eleJson.group);
      }
    }
    elesJson = JSON.stringify(elesJson);

    let newGroupList = [],
        pageJson = dataHandle.getPageJson();
    for (let j = 0; j < groupList.length; j++) {
      // 先将组合的id和transfrom处理并储存
      newGroupList.push({
        groupId: groupList[j],
        transform: pageJson['elegroups'][groupList[j]].transform
      });
    }

    if(!window.localStorage) {
      console.log('浏览器不支持localStorage！')
    } else {
      window.localStorage.setItem('elesJsonForCopy', elesJson);
      if(newGroupList.length > 0) window.localStorage.setItem('groupsJsonForCopy', JSON.stringify(newGroupList));
    }
  },

  /**
   * 快捷键粘贴素材
   */
  pasteEleByKey(eve) {
    if(!window.localStorage) {
      console.log('浏览器不支持localStorage！')
      return;
    }
    let elesJson = window.localStorage.getItem('elesJsonForCopy');
    if(!elesJson) return;
    eve.preventDefault();
    let pageScale = dataHandle.vuexGetters().getPageScale,
        eleJson,
        newEles = [],
        groupList = [],
        commitData,
        newGroup = parseInt(10000 * Math.random());
    elesJson = JSON.parse(elesJson);
    for (let i = 0; i < elesJson.length; i++) {
      eleJson = elesJson[i];
      let transform = getTransformAttr(eleJson.transform, 'translate');
      transform[0] = parseFloat(transform[0]) + 20 / pageScale;
      transform[1] = parseFloat(transform[1]) + 20 / pageScale;
      let translate = `translate(${transform[0]}, ${transform[1]})`;
      eleJson.transform = eleJson.transform.replace(/translate\(.+?\)/, translate);
      //eleJson.eleid = 'ele' + new Date().getTime() + parseInt(100000 * Math.random());
      eleJson['data-elem'].lock = false;
      if(eleJson.group) {
        // 组合素材处理下组合id
        groupList.push(eleJson.group);
        eleJson.group = eleJson.group + newGroup;
      }
      if(eleJson['data-type'] === 'background') {
        eleJson['data-type'] = 'img';
      }
      if(eleJson['data-type'] === 'text') {
        delete eleJson['data-elem'].id;
      }
      if(eleJson['data-type'] === 'svgChart') {
        delete eleJson['data-elem'].id;
      }
      commitData = pageEleBus.addElement(eleJson);
      newEles.push(commitData.eleIndex);
      dataHandle.commit('element',commitData);
    }

    let groupsJson = window.localStorage.getItem('groupsJsonForCopy');
    if(groupsJson) {
      // 画布json中设置组合素材的信息
      groupsJson = JSON.parse(groupsJson);
      let groupId,
          transform,
          translate,
          pageJson = dataHandle.getPageJson();
      for (let j = 0; j < groupsJson.length; j++) {
        groupId = groupsJson[j].groupId + newGroup;
        transform = groupsJson[j].transform;
        translate = getTransformAttr(transform, 'translate');
        translate[0] = parseFloat(translate[0])  + 20 / pageScale;
        translate[1] = parseFloat(translate[1]) + 20 / pageScale;
        transform = setTransformAttr(transform, 'translate', translate);
        pageJson['elegroups'][groupId] = {transform: transform};
        dataHandle.commit('group',{
          eventType :0,
          pageIndex: dataHandle.vuexGetters().getFocusPageIndex,
          eleIndex: groupId,
          value:{transform}
        });
      }
    }

    dataHandle.push();
    pageBus.elementBlur();
    pageEleBus.setCircleSelectElements(newEles);
    window.localStorage.setItem('elesJsonForCopy', '');
    window.localStorage.setItem('pageIndexForCopy', '');
  },

  setElementData(pageIndex, elemIndex) {
    let elem = dataHandle.getEleJson(pageIndex, elemIndex),
        data = elem['data-elem'],
        translate = getTransformAttr(elem.transform, 'translate').map(item => parseFloat(item)),
        rotate = getTransformAttr(elem.transform, 'rotate').map(item => parseFloat(item))[0],
        scale = dataHandle.vuexGetters().getPageScale;

    dataHandle.$vue.$store.dispatch('setElementData', {
      text: elem.html,
      italic: _isTrue(data['data-italic']),
      align: data['data-align'],
      bold: data['data-bold'],
      underline: _isTrue(data['data-decoration']),
      color: data.fill,
      vspace: data.vspace || 0,
      wspace: data.wspace || 0,
      size: data['font-size'],
      ff: data['font-family'],
      opacity: data.opacity,
      left: translate[0] * scale,
      top: translate[1] * scale,
      width: data.width * scale,
      height: data.height * scale,
      rotate
    })
  },

  cancelEditState() {
    let store = dataHandle.$vue.$store;

    store.dispatch('setEditorShow', false);
    store.dispatch('setClipFlag', false);
    store.dispatch('setFrameClip', false);
    store.dispatch('setTextEdit', false);
    store.dispatch('setGroupFlag', false);
    store.dispatch('setFocusElemIndex', {index: -1});
    store.dispatch('setCircleSelectElements', []);
    store.dispatch('setCircleSelectElementsNow', []);
  },

  /**
   * [selectCanChangeColor 框选素材是否包含可修改颜色的素材]
   * @return {[Boolean]} [包含返回true，否则返回false]
   */
  selectCanChangeColor() {
    let elems = dataHandle.vuexGetters().getCircleSelectElements,
        canChangeArr = ['svg', 'text', 'svgImage'];

    for(let i = 0, l = elems.length; i < l; i++) {
      let type = eleBus.getEleType(undefined, elems[i]);
      if(canChangeArr.indexOf(type) > -1) {
        return true;
      }
    }

    return false;
  }

}

/**
 * 获取当前元素的一些信息
 * @param state 当前操作的元素索引信息
 * @param info 点击的元素一些内部信息
 * @param json 当前元素的json
 */
function _getFocusElemInfoForEditor() {
  const elem = dataHandle.getEleJson();
  const vuex = dataHandle.vuexGetters();
  const pageScale = parseFloat(vuex.getPageScale);
  let editorInfo = {
    width: parseFloat(elem['data-elem'].width) * pageScale,
    height: parseFloat(elem['data-elem'].height) * pageScale
  },

  translate = getTransformAttr(elem.transform, 'translate').map(item => parseFloat(item));

  editorInfo.left = translate[0] * pageScale;
  editorInfo.top = translate[1] * pageScale;

  let rotate = getTransformAttr(elem.transform, 'rotate');

  editorInfo.rotate = parseFloat(rotate[0])
  editorInfo.lock = elem['data-elem']['lock'] || false;

  if(elem['data-type'] === 'text') {
    let data = elem['data-elem'];

    editorInfo.varyType = 'text';
    editorInfo.elementData = {
      text: elem.html,
      italic: _isTrue(data['data-italic']),
      align: data['data-align'],
      bold: data['data-bold'],
      underline: _isTrue(data['data-decoration']),
      color: data.fill,
      vspace: data.vspace,
      wspace: data.wspace,
      size: data['font-size'],
      ff: data['font-family'],
      opacity: data.opacity,
      width: data.width * pageScale,
      height: data.height * pageScale
    };
  } else {

    editorInfo.varyType = elem['varyType'] || 'db';
  }

  // if (elem['data-type'] === "table") {
  //   editorInfo.colWidths = elem['data-elem']['col-widths'].map(item => item * pageScale);
  //   editorInfo.rowHeights = elem['data-elem']['row-heights'].map(item => item * pageScale);
  //   editorInfo.lw = elem['data-elem']['line-width'] * pageScale;
  //   editorInfo.cells = elem['data-elem'].cells;
  //   let numbers = elem['data-elem'].viewBox.split(' '),
  //   w = parseFloat(numbers[2]),
  //   h = parseFloat(numbers[3]);
  //   editorInfo.tableScale = w / elem['data-elem'].width;

  //   editorInfo.varyType = 'table';
  // }
  return editorInfo;
}

/**
 * [_getEditorInfoByCut 通过裁剪素材获取editor信息，包括位置，宽高]
 * @return {[Object]} [description]
 */
function _getEditorInfoByCut() {

  let reto = {},
      vuexGetters = dataHandle.vuexGetters(),
      elem = dataHandle.getEleJson(),
      data = elem['data-elem'],
      pageScale = vuexGetters.getPageScale;

  if(!data.isCut) {
    return _getFocusElemInfoForEditor();
  }

  let reverseType = elem.reverseType || [0, 0];

  let viewBoxs = data.viewBox.split(' ').map( item => parseFloat(item) ),
      clipLeft = viewBoxs[0],
      clipTop = viewBoxs[1],
      clipWidth = viewBoxs[2],
      clipHeight = viewBoxs[3],
      translate = getTransformAttr(elem.transform, 'translate').map( item => parseFloat(item) ),
      rotate = parseFloat(getTransformAttr(elem.transform, 'rotate')[0]);

  let scale = data.width / clipWidth;

  reto.width = data.imgWidth * scale * pageScale;
  reto.height = data.imgHeight * scale * pageScale;

  let x =  clipLeft + clipWidth / 2 - data.imgWidth / 2,
      y = clipTop + clipHeight / 2 - data.imgHeight / 2,
      r = Math.sqrt(x*x + y*y, 2),
      disX, disY;
  
  if(reverseType[0]) {
    x = -x;
  }
  if(reverseType[1]) {
    y = -y;
  }

  if(x === 0 || y === 0) {
    disX = x;
    disY = y;
  } else {
    let angle = Math.atan( x / y) * 180 / Math.PI;

    if (y < 0) {
      angle = 270 - angle;
    } else {
      angle =  90 - angle;
    }

    disX = r * Math.cos((angle + rotate) / 180 * Math.PI);
    disY = r * Math.sin((angle + rotate) / 180 * Math.PI);
  }
  disX += (data.imgWidth - clipWidth)  / 2;
  disY += (data.imgHeight - clipHeight)  / 2;

  reto.left = (translate[0] - disX * scale) * pageScale;
  reto.top = (translate[1] - disY * scale) * pageScale;

  reto.rotate = rotate;
  reto.lock = false;
  reto.varyType = 'db';

  return reto;

}

function _getEditorInfoByGroup(transform, scale) {
  let rotate = getTransformAttr(transform, 'rotate').map(item => parseFloat(item)),
    translate = getTransformAttr(transform, 'translate').map(item => parseFloat(item));
  
  if (rotate[1] && rotate[2]) {
    return {
      rotate: rotate[0],
      left: translate[0] * scale,
      top: translate[1] * scale,
      width: rotate[1] * 2 * scale,
      height: rotate[2] * 2 * scale
    }
  } else {
    return { rotate: 0, ...editorBus._setEditorStateBySelect() };
  }

}



function _isTrue(v) {
  return v === "true" || v === true;
}

export default editorBus;
