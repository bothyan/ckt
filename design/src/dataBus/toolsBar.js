
import dataHandle from '../common/dataHandle';
import userMethods from 'dataBus/user.js';
import pageEleMethods from 'dataBus/pageEle.js';
import pageBus from 'dataBus/page.js';
import pageEleBus from 'dataBus/pageEle.js';
import eleBus from 'dataBus/element.js';
import { getTransformAttr } from 'common/common.js';

const toolsBarBus = {

  /**
   * 组合提交
   */
  groupPut() {
    
    let str = prompt('关键字');

    if(str) {

      let vuexGetters = dataHandle.vuexGetters(),
          groupId = vuexGetters.getGroupId,
          pageJson = vuexGetters.getFocusPage,
          transform = pageJson['elegroups'][groupId].transform,
          translate = getTransformAttr(transform, 'translate'),
          rotate = getTransformAttr(transform, 'rotate'),
          left = - parseFloat(translate[0]),
          top = - parseFloat(translate[1]);
      // pageJson = JSON.parse(JSON.stringify(pageJson));

      if(!groupId) {
        dataHandle.vuexActions().setMessageShow[0]({placeHolder:'获取组合素材失败！'});
        return;
      }

      var page_json = {
        'width' : parseFloat(rotate[1]) * 2,
        'height' : parseFloat(rotate[2]) * 2,
        'elems' : []
      }

      var json = {
        'title' : groupId,
        'v' : '1.0.0',
        'pages' : [page_json]
      };

      let eles = pageEleBus.getGroupArrById(groupId),
          eles_length = eles.length,
          ele,
          eleRotate,
          eleTranslate;

      for(var i = 0;i < eles_length;i++) {
        // ele = pageJson['elems'][eles[i]];
        ele = pageEleBus.getEleJsonForSave(undefined, eles[i]);
        eleTranslate = getTransformAttr(ele['transform'], 'translate');
        eleRotate = getTransformAttr(ele['transform'], 'rotate');
        ele['transform']=`translate(${Number.parseFloat(eleTranslate[0])+left},${Number.parseFloat(eleTranslate[1])+top})rotate(${eleRotate[0]},${eleRotate[1]},${eleRotate[2]})`
        page_json.elems[i] = ele;
      }

      dataHandle.$vue.$http.post(
        '/material/saveCombMaterial',
        {
          'json' : JSON.stringify(json),
          't' : json.title,
          'k' : str
        }).then((data)=>{
          // 操作状态码（-1参数错误；-2未登录；-3权限不足；1获取成功）
          let code = data.body.code;
          if(code === 1) {
            dataHandle.vuexActions().setMessageShow[0]({placeHolder:'提交成功！',kind:'success'})
          } else {
            dataHandle.vuexActions().setMessageShow[0]({placeHolder:'提交失败！'})
          }
        }).catch((error)=>{
          dataHandle.vuexActions().setMessageShow[0]({placeHolder:'提交失败！'})
          console.log('保存组合素材出错！');
        });

    }

  },

	setToolsBarState() {
    let vuexGetters = dataHandle.vuexGetters(),
        vStore = dataHandle.$vue.$store,
        pageJson = dataHandle.getPageJson(),
        groupFlag = vuexGetters.getGroupFlag,
        focusElemIndex = vuexGetters.getFocusElemIndex,
        groupId = vuexGetters.getGroupId;

    // if(groupFlag) {
    //   let lock = pageJson.elegroups[groupId].lock || false;
    //   vStore.dispatch('setToolsBarState', {
    //     special: {},
    //     type: 'selects',
    //     common: {
    //       lock
    //     }
    //   })
    // }
    if(focusElemIndex !== -1) {
		  dataHandle.$vue.$store.dispatch('setToolsBarState', _getToolsBarStateByElement());
    }
    else if(groupFlag) {
      let lock = pageJson.elegroups[groupId].lock || false;
      vStore.dispatch('setToolsBarState', {
        special: {},
        type: 'selects',
        common: {
          lock
        }
      })
    }
    else {
      vStore.dispatch('setToolsBarState', {
        special: {},
        type: 'selects',
        common: {
          lock: false
        }
      })
    }

	},
  closeChild() {
    let vuexGetters = dataHandle.vuexGetters(),
        closeChild = vuexGetters.getToolsBarCloseChild;
    dataHandle.$vue.$store.dispatch('setToolsBarCloseChild', !closeChild);
  },
  delElement() {
    let vuexGetters = dataHandle.vuexGetters(),
        focusPageIndex = vuexGetters.getFocusPageIndex,
        focusElemIndex = vuexGetters.getFocusElemIndex,
        textEdit = vuexGetters.getTextEdit,
        toolsBarShow = vuexGetters.getToolsBarShow,
        editorShow = vuexGetters.getEditorShow,
        type = vuexGetters.getToolsBarType,
        lock = vuexGetters.getEditorLock,
        groupFlag = vuexGetters.getGroupFlag,
        groupId = vuexGetters.getGroupId,
        haveGroup = vuexGetters.getSelectHaveGroup,
        selectGroup = vuexGetters.getSelectGroup,
        elegroups = dataHandle.getPageJson().elegroups,
        selectsArr = vuexGetters.getCircleSelectElements;

    if(textEdit || !editorShow) {
      dataHandle.vuexActions().setGuideLineShow[0](false);
      return;
    }

    if(groupFlag && focusElemIndex > 0) {
      pageBus.elementBlur();
      return;
    }

    if(type === 'selects') {
      let arr = selectsArr.sort((a, b) => b - a);

      arr.forEach(item => {
        pageEleMethods.delElement(focusPageIndex, item);
        dataHandle.commit('element',{
          pageIndex: focusPageIndex,
          eleIndex:item,
          key:null,
          value:null,
          eventType:3
        });
      })
      //如果框选的是组合
      if(groupFlag) {
        dataHandle.commit('group', {
          pageIndex: focusPageIndex,
          eleIndex: groupId,
          key: null,
          value: null,
          eventType: 3
        })
      }

      //如果框选中存在组合
      if(haveGroup) {
        selectGroup.forEach(item => {

          delete elegroups[item];

          dataHandle.commit('group', {
            pageIndex: focusPageIndex,
            eleIndex: item,
            key: null,
            value: null,
            eventType: 3
          })
        })
      }

      dataHandle.push();

    }else{
      if(focusElemIndex === 0) {
        let data={
	        'data-type':'background',
	        'data-elem':{
		        'data-colors':['rgb(255,255,255)'],
		        opacity:1,
		        'data-key':'false',
		        'width': vuexGetters.getPageWidth,
		        'height': vuexGetters.getPageHeight,
	        }
        }
	      pageEleMethods.setElementJson(data,focusPageIndex,0)
	      dataHandle.commit('element',{
		      pageIndex: focusPageIndex,
		      key:0,
		      value:data,
		      eventType:1
	      }).push()
      }else {
	      pageEleMethods.delElement();
	      dataHandle.commit('element',{
		      pageIndex: focusPageIndex,
		      eleIndex: focusElemIndex,
		      key:null,
		      value:null,
		      eventType:3
	      });
	      dataHandle.push();
      }

    }
    pageBus.elementBlur();
  },
  /**
   * [getLayerInfo 获取图层信息]
   * @return {[Object]} [图层信息]
   *       {
   *         layerIndex,
   *         layerArr,
   *         layerLen
   *       }
   */
  getLayerInfo() {
    let vuexGetters = dataHandle.vuexGetters(),
        elems = dataHandle.getPageJson().elems,
        focusElemIndex = vuexGetters.getFocusElemIndex,
        focusElemRect = eleBus.getElemRect(undefined, focusElemIndex),
        layerArr = [];

    
    elems.forEach((item, index) => {
      let rect = eleBus.getElemRect(undefined, index);
      if(index === focusElemIndex) {
        layerArr.push(index);
      }
      //判断相交
      else if(index!==0 && !(focusElemRect.top > rect.bottom || focusElemRect.right < rect.left || 
        focusElemRect.bottom < rect.top || focusElemRect.left > rect.right)) {
        layerArr.push(index);
      }

    })

    let layerIndex = layerArr.indexOf(focusElemIndex);

    return {
      layerIndex,
      layerArr,
      layerLen: layerArr.length,
    }

  },

  setToolsBarLayerInfo() {
    dataHandle.$vue.$store.dispatch('setLayerInfo', this.getLayerInfo());
  }

}


/**
 * [getToolsBarStateByElement description] 通过当前操作素材数据获取toolsBar相关数据
 * @return {[type]} [description]
 */
function _getToolsBarStateByElement() {

  let elem = dataHandle.getEleJson(),
    getters = dataHandle.vuexGetters(),
    pageScale = getters.getPageScale,
    state = {
      common: {},
      special: {
        width: elem['data-elem'].width,
        height: elem['data-elem'].height,
        isCollection: userMethods.isCollectedById(elem['data-elem'].id),
        isUpload: !elem['data-elem']['data-key'] || !elem['data-elem'].id
      }
    };

  state.type = elem['data-type'];
  Object.assign(state.common, _common(elem['data-elem']));

  switch (state.type) {
    case 'svgImage': Object.assign(state.special, _svg(elem['data-elem']));
      break;
    case 'svgFrame': Object.assign(state.special, _layout(elem['data-elem']));
      break;
    case 'img': Object.assign(state.special, _img(elem));
      break;
    case 'text': Object.assign(state.special, _text(elem['data-elem']));
      break;
    // case 'background': Object.assign(state.special, _background(elem));
    //                     break;
    case 'table': Object.assign(state.special, _table(elem['data-elem']));
      break;
  }

  function _common(data) {
    let reto = {
      opacity: 1,
      shadow: {
        blur: 0,
        offset: 0,
        opacity: 0,
        show: false
      },
      lock: false
    };
    if (data.opacity !== undefined) {
      reto.opacity = parseFloat(data.opacity);
    }
    if (data.shadow !== undefined) {
      Object.assign(reto.shadow, data.shadow);
    }
    if (data.lock !== undefined) {
      reto.lock = (data.lock === 'true' || data.lock === true) ? true : false;
    }
    return reto;
  }


  function _svg(element) {
    let reto = {
      colors: [],
      isBack: false,
    },
      eleColors = element['data-colors'];
    for (let key in eleColors) {
      let i = parseInt(key.substr(-1, 1));
      reto.colors[i - 1] = eleColors[key];
    }
    return reto;
  }

  function _layout(element) {
    let reto = {
      hasImg: false
    }

    if(element['data-xhref-imgs']){
      let keys = Object.keys(element['data-xhref-imgs']);
      if(keys.length > 0) {
        for(let i=0,l=keys.length; i<l; i++) {
          let check = element['data-xhref-imgs'][keys[i]];
          if(check.id || (check['data-img-key'] && check['data-img-key'] != 'false')) {
            reto.hasImg = true;
            break;
          }
        }
      }
    }

    if(element['data-colors']) {
      reto.colors = [];
      for (let key in element['data-colors']) {
        let i = parseInt(key.substr(-1, 1));
        reto.colors[i - 1] = element['data-colors'][key];
      }
    }

    return reto;
  }

  function _img(element) {
    let reto = {
      isCut: element['data-elem'].isCut || false,
      isPng: true
    };
    if(element['data-img-kind'] && element['data-img-kind'].indexOf('png') === -1) {
      reto.isPng = false;
    }

    return reto;
  }

  function _text(element) {
    let json = typeof element === 'object' ? element : JSON.parse(element);
    let reto = {
      color: json['fill'],
      family: json['font-family'],
      size: parseFloat(json['font-size']),
      align: json['data-align'],
      italic: _isTrue(json['data-italic']),
      bold: json['data-bold'] * 100,
      underline: _isTrue(json['data-decoration']),
      wspace: parseInt(json['wspace']) || 0,
      vspace: parseInt(json['vspace']) || 0
    }
    if (dataHandle.vuexGetters().getDesignUnit !== 'px') {
      reto.size = reto.size / 300 * 72;
    }
    return reto;
  }

  function _background(element) {
    let reto = {
      isPng: element['data-img-kind'].indexOf('png') > -1
    };
    return reto;
  }

  function _table(data) {
    let reto = {};
    reto.colors = [...data.colors];
    return reto;
  }

  return state;
}


function _isTrue(v) {
  return v === true || v === 'true';
}

export default toolsBarBus;