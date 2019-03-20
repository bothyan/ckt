import * as types from '../mutation-types'

const state = {
  pageWrapRect: {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
}

const getters = {
  getPageWrapRect: state => state.pageWrapRect
}

const mutations = {
  [types.SET_PAGE_WRAP_RECT] (state, pageWrapRect) {
    state.pageWrapRect = pageWrapRect
  }
}

const actions = {
  setPageWrapRect({commit}, pageWrapRect) {
    commit(types.SET_PAGE_WRAP_RECT, pageWrapRect)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
