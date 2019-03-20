import * as types from '../mutation-types'

const state = {
  notFocusEleRectList: [],
  guideLineShow: true,
  guideLineFocusEle: -1
}

const getters = {
  getNotFocusEleRectList: state => state.notFocusEleRectList,
  getGuideLineShow: state => state.guideLineShow,
  getGuideLineFocusEle: state => state.guideLineFocusEle
}

const mutations = {
  [types.SET_NOT_FOCUS_ELE_RECT_LIST] (state, notFocusEleRectList) {
    state.notFocusEleRectList = notFocusEleRectList;
  },
  [types.SET_GUIDE_LINE_SHOW] (state, guideLineShow) {
    state.guideLineShow = guideLineShow;
  },
  [types.SET_GUIDE_LINE_FOCUS_ELE] (state, guideLineFocusEle) {
    state.guideLineFocusEle = guideLineFocusEle;
  }
}

const actions = {
  setNotFocusEleRectList({commit}, notFocusEleRectList) {
    commit(types.SET_NOT_FOCUS_ELE_RECT_LIST, notFocusEleRectList)
  },
  setGuideLineShow({commit}, guideLineShow) {
    commit(types.SET_GUIDE_LINE_SHOW, guideLineShow)
  },
  setGuideLineFocusEle({commit}, guideLineFocusEle) {
    commit(types.SET_GUIDE_LINE_FOCUS_ELE, guideLineFocusEle)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

