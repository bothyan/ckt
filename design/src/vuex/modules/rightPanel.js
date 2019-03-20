import * as types from '../mutation-types'

const state = {
  rightPanelWidth: 0

}

const getters = {
  getRightPanelWidth: state => state.rightPanelWidth
}

const mutations = {
  [types.SET_RIGHT_PANEL_WIDTH] (state, rightPanelWidth) {
    state.rightPanelWidth = rightPanelWidth
  },
}

const actions = {
  setRightPanelWidth({commit}, rightPanelWidth) {
    commit(types.SET_RIGHT_PANEL_WIDTH, rightPanelWidth)
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}
