/**
 * Created by Chuanfeng on 2017/10/25.
 */

import * as types from '../mutation-types'

const state = {
  show: false,
  url: ''
}

const getters = {
  getIframeShow: state => state.show,
  getIframeUrl: state => state.url
}

const actions = {
  setIframeShow ({commit}, show) {
    commit(types.SET_IFRAME_SHOW, show)
  },
  setIframeUrl ({commit}, url) {
    commit(types.SET_IFRAME_URL, url)
  }
}

const mutations = {
  [types.SET_IFRAME_SHOW] (state, show) {
    state.show = show
  },
  [types.SET_IFRAME_URL] (state, url) {
    state.url = url
    state.show = url != ''
    console.log(1231231321233);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
