
/**
 * huyuangang 创建于 2017/8/29
 * 电话：15280907093
 */

const state = {
  type: 'default',
  show: false,
  common: {

  },
  special: {

  },
  resizeToolShow: false,
  resizeFlag: false,   //用来判断是否确定修改
  colorBoardShow: false,
  closeChild: false, //子框显示隐藏
  layerIndex: -1,    //图层位置
  layerArr: [],      //图层数组
  layerLen: 0       //图层层数
}

const getters = {
  getToolsBarState: state => {
    return  {
      type: state.type,
      common: state.common,
      special: state.special
    }
  },
  getToolsBarShow: state => state.show,
  getResizeToolShow: state => state.resizeToolShow,
  getColorBoardShow: state => state.colorBoardShow,
  getResizeFlag: state => state.resizeFlag,
  getToolsBarType: state => state.type,
  getToolsBarCloseChild: state => state.closeChild,
  getLayerIndex: state => state.layerIndex,
  getLayerArr: state => state.layerArr,
  getLayerLen: state => state.layerLen,
  getImgIsCut: state => state.special.isCut
}

const mutations = {
  setToolsBarState(state, info) {
    Object.assign(state, info);
  },
  setToolsBarShow(state, boolV) {
    state.show = boolV;
  },
  setResizeToolShow(state, boolV) {
    state.resizeToolShow = boolV;
  },
  setColorBoardShow(state, boolV) {
    state.colorBoardShow = boolV;
  },
  setResizeFlag(state, boolV) {
    state.resizeFlag = boolV;
  },
  setToolsBarType(state, type) {
    state.type = type;
  },
  setToolsBarCloseChild(state, v) {
    state.closeChild = v;
  },
  setLayerInfo(state, info) {
    Object.assign(state, info);
  }
}

const actions = {
  setToolsBarState({ commit }, info) {
    commit('setToolsBarState', info);
  },
  setToolsBarShow({ commit }, boolV) {
    commit('setToolsBarShow', boolV);
  },
  setResizeToolShow({ commit }, boolV) {
    commit('setResizeToolShow', boolV);
  },
  setColorBoardShow({ commit }, boolV) {
    commit('setColorBoardShow', boolV);
  },
  setResizeFlag({ commit }, boolV) {
    commit('setResizeFlag', boolV);
  },
  setToolsBarType({ commit }, type) {
    commit('setToolsBarType', type);
  },
  setToolsBarCloseChild({ commit }, v) {
    commit('setToolsBarCloseChild', v);
  },
  setLayerInfo({ commit }, info) {
    commit('setLayerInfo', info);
  }
}

export default {
	state,
	getters,
	mutations,
	actions
}