/*
 * 页面的加载状态
 * create by bianhao on 2017/7/28
 */
import * as types from '../mutation-types'

const state = {
  layoutOnload: false,
  layoutSes:{}
}

const getters = {
  getLayoutOnload: state => state.layoutOnload,
  getLayoutSes: state=> state.layoutSes
}

const mutations = {
  [types.SET_LAYOUT_ONLOAD] (state, layout_onload) {
    state.layoutOnload = layout_onload
  },
  setLayoutSes (state,obj){
    state.layoutSes = obj
  }
}

const actions = {
  setLayoutOnload({commit}, layout_onload) {
    commit(types.SET_LAYOUT_ONLOAD, layout_onload)
  },
  setLayoutSes({commit},obj){
    commit('setLayoutSes',obj)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

