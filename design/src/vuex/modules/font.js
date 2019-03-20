/*
 * 文字相关属性
 * create by Chuanfeng on 2017/9/18
 */

import * as types from '../mutation-types'

const state = {
  color: ''
}

const getters = {
  getFontColor: state => state.color
}

const mutations = {
  [types.SET_FONT_COLOR] (state, color) {
    state.color = color;
  }
}

const actions = {
  setFontColor({commit}, color) {
    commit(types.SET_FONT_COLOR, color)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
