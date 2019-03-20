import * as types from '../mutation-types'

const state = {
  pageNavigatorThumb: '',
  pageNavigatorTime: 0
}

const getters = {
  getPageNavigatorThumb: state => state.pageNavigatorThumb,
  getPageNavigatorTime: state => state.pageNavigatorTime
}

const mutations = {
  [types.SET_PAGE_NAVIGATOR_THUMB] (state, pageNavigatorThumb) {
    state.pageNavigatorThumb = pageNavigatorThumb
    state.pageNavigatorTime = new Date().getTime()
  }
}

const actions = {
  setPageNavigatorThumb({commit}, pageNavigatorThumb) {
    commit(types.SET_PAGE_NAVIGATOR_THUMB, pageNavigatorThumb)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
