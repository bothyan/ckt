import * as types from '../mutation-types'

const state = {
  spaceKeyDown: false,
  ctrlKeyDown: false,
  shiftKeyDown: false,
  metaKeyDown: false
}

const getters = {
  getSpaceKeyDown: state => state.spaceKeyDown,
  getCtrlKeyDown: state => state.ctrlKeyDown,
  getShiftKeyDown: state => state.shiftKeyDown,
  getMetaKeyDown: state => state.metaKeyDown
}

const mutations = {
  [types.SET_SPACE_KEY_DOWN] (state, spaceKeyDown) {
    state.spaceKeyDown = spaceKeyDown
  },
  [types.SET_CTRL_KEY_DOWN] (state, ctrlKeyDown) {
    state.ctrlKeyDown = ctrlKeyDown
  },
  [types.SET_SHIFT_KEY_DOWN] (state, shiftKeyDown) {
    state.shiftKeyDown = shiftKeyDown
  },
  [types.SET_META_KEY_DOWN] (state, metaKeyDown) {
    state.metaKeyDown = metaKeyDown
  }
}

const actions = {
  setSpaceKeyDown({commit}, spaceKeyDown) {
    commit(types.SET_SPACE_KEY_DOWN, spaceKeyDown);
  },
  setCtrlKeyDown({commit}, ctrlKeyDown) {
    commit(types.SET_CTRL_KEY_DOWN, ctrlKeyDown);
  },
  setShiftKeyDown({commit}, shiftKeyDown) {
    commit(types.SET_SHIFT_KEY_DOWN, shiftKeyDown);
  },
  setMetaKeyDown({commit}, metaKeyDown) {
    commit(types.SET_META_KEY_DOWN, metaKeyDown);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

