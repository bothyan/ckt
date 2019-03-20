/*
 * 错误弹窗
 * create by Chuanfeng on 2017/9/18
 */

import * as types from '../mutation-types'

const state = {
  errorShow: false // 1：保存遇到问题；2：网络连接失败；3：禁止操作；4：会员提醒；5：升级会员；6：VIP模板；7：浏览器兼容性，8：设计多次被打开，9：设计被移动到回收站
}

const getters = {
  getErrorShow: state => state.errorShow
}

const mutations = {
  [types.SET_ERROR_SHOW] (state, error) {
    state.errorShow = error;
  }
}

const actions = {
  setErrorShow({commit}, error) {
    commit(types.SET_ERROR_SHOW, error)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
