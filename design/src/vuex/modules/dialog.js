/*
 * 确认框
 * create by Chuanfeng on 2017/9/18
 */

import * as types from '../mutation-types'

const state = {
  show: false, // 对话框显示隐藏
  title: '提示', // 对话框标题
  content: '', // 对话框内容
  btnTexts: [], // 按钮文字
  funcs: null,
}

const getters = {
  getDialogShow: state => state.show,
  getDialogTitle: state => state.title,
  getDialogContent: state => state.content,
  getDialogBtnTexts: state => state.btnTexts,
  getDialogFuncs: state => state.funcs
}

const mutations = {
  [types.SET_DIALOG_SHOW] (state, options) {
    if (typeof options === 'boolean') {
      state.show = false
      state.content = ''
      state.btnTexts = []
      state.funcs = null
    } else if (typeof options === 'object') {
      if (Object.keys(options).length > 0) {
        state.show = true
        state.title = options.title || '提示'
        state.content = options.content
        state.btnTexts = options.btnTexts || ['取消', '确认']
        state.funcs = options.funcs
      }
    }
  }
}

const actions = {
  setDialogShow({commit}, options) {
    commit(types.SET_DIALOG_SHOW, options)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
