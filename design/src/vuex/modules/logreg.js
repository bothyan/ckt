/*
 * 登录注册组件显示状态
 * create by Chuanfeng on 2017/8/25
 */
import * as types from '../mutation-types'

const state = {
  show: false // 1：登录；2：注册；3：找回密码
}

const getters = {
  getLogregShow: state => state.show
}

const mutations = {
  [types.SET_LOGREG_SHOW] (state, show) {
    state.show = show
  }
}

const actions = {
  setLogregShow({commit}, show) {
    commit(types.SET_LOGREG_SHOW, show)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

