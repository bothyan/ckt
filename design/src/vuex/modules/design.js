/*
 * design vuex
 * @Author: bianhao 
 * @Date: 2017-09-05 12:05:17 
 * @Last Modified by: bianhao
 * @Last Modified time: 2017-09-22 14:32:04
 */

import * as types from '../mutation-types'

const state = {
	designInfo: {},
	isBleed: false,
  designTitle: '',
  blankClick: null,
  windowResize: null,
  shareUrl: '',
  // 通过模板创建的的设计的模板的信息
  templateInfo: null,
	doStop:false
}

const getters = {
  getDesignInfo: state => state.designInfo,
  getIsBleed: state => state.isBleed,
  getDesignTitle: state => state.designTitle,
  getBlankClick: state => state.blankClick,
  getWindowResize: state => state.windowResize,
  getDesignUnit: state => state.designInfo.unit,
  getShareUrl: state => state.shareUrl,
  getTemplateInfo: state => state.templateInfo,
	getDoStop:state => state.doStop
}

const actions = {
  setDesignInfo ({commit}, designInfo) {
		commit(types.SET_DESIGNINFO, designInfo)
	},
	setDesignWHWithUnit({commit}, wh) {
		commit(types.SET_DESIGNWHWITHUNIT, wh);
	},
  setDesignShareState({commit}, s) {
    commit(types.SET_DESIGNSHARESTATE, s);
	},
  setIsBleed({commit}, b) {
    commit(types.SET_ISBLEED, b);
  },
  setDesignTitle({commit}, designTitle) {
    commit(types.SET_DESIGN_TITLE, designTitle);
  },
  setBlankClick({commit}, blankClick) {
    commit(types.SET_BLANK_CLICK, blankClick);
  },
  setWindowResize({commit}, windowResize) {
    commit(types.SET_WINDOW_RESIZE, windowResize);
  },
  setTemplateInfo({ commit }, templateInfo) {
    commit(types.SET_TEMPLATE_INFO, templateInfo);
  },
  setShareUrl({ commit }, url) {
    commit('setShareUrl', url);
  },
	setDoStop({commit},f){
  	commit('setDoStop',f)
	}
}

const mutations = {
  [types.SET_DESIGNINFO] (state, designInfo) {
		state.designInfo = designInfo
	},
	[types.SET_DESIGNWHWITHUNIT] (state, wh) {
		state.designInfo.designWidthWithUnit = wh.width;
		state.designInfo.designHeightWithUnit = wh.height;
	},
  [types.SET_DESIGNSHARESTATE] (state, s) {
    state.designInfo.shareState = s;
	},
  [types.SET_ISBLEED] (state, b) {
    state.isBleed = b;
  },
  [types.SET_DESIGN_TITLE] (state, designTitle) {
    state.designTitle = designTitle;
  },
  [types.SET_BLANK_CLICK] (state, blankClick) {
    state.blankClick = blankClick;
  },
  [types.SET_WINDOW_RESIZE] (state, windowResize) {
    state.windowResize = windowResize;
  },
  [types.SET_TEMPLATE_INFO] (state, templateInfo) {
    state.templateInfo = templateInfo;
  },
  setShareUrl(state, url) {
    state.shareUrl = url;
  },
	setDoStop(state,f){
  	state.doStop=f
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
