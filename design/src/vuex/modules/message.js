import * as types from '../mutation-types'

const state = {
  messageShow: false,
  placeHolder: '',
  kind: 'error',
  hideTime: 1500
}

const getters = {
  getMessageShow: state => state.messageShow,
  getPlaceHolder: state => state.placeHolder,
  getKind: state => state.kind,
  getHideTime: state => state.hideTime
}

const mutations = {
  [types.SET_MESSAGE_SHOW] (state, message) {
    // 新{placeHolder:'', kind:''}
    // 旧{'promptText': '', 'promptKind': ''}
    if (message.hasOwnProperty('promptText')) {
      // 兼容处理
      message.placeHolder = message.promptText;
      message.kind = message.promptKind;
    }
    state.messageShow = typeof message === Object ? message !== {} : message;
    state.placeHolder = message.placeHolder;
    state.kind = message.kind || 'error';
    state.hideTime = message.hideTime ? message.hideTime : 1500;
  }
}

const actions = {
  setMessageShow({commit}, messageShow) {
    commit(types.SET_MESSAGE_SHOW, messageShow)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
