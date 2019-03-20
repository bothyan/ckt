import * as types from '../mutation-types'

const state = {
  pageListClose: false,
  pageThumbList: [],
  widePageStyleList: [],
  straitPageStyleList: [],
  designSaveTime: null,
  allPageSaving: false,
  indexPageSaving: -1,
  widePageHeight: 0
}

const getters = {
  getPageListClose: state => state.pageListClose,
  getPageThumbList: state => state.pageThumbList,
  getWidePageStyleList: state => state.widePageStyleList,
  getStraitPageStyleList: state => state.straitPageStyleList,
  getDesignSaveTime: state => state.designSaveTime,
  getAllPageSaving: state => state.allPageSaving,
  getIndexPageSaving: state => state.indexPageSaving,
  getWidePageHeight: state => state.widePageHeight,
}

const mutations = {
  [types.SET_PAGELIST_CLOSE] (state, pageListClose) {
    state.pageListClose = pageListClose
  },
  [types.SET_PAGE_THUMB_LIST] (state, pageThumbList) {
    state.pageThumbList = pageThumbList
  },
  [types.SET_WIDE_PAGE_STYLE_LIST] (state, widePageStyleList) {
    state.widePageStyleList = widePageStyleList
  },
  [types.SET_STRAIT_PAGE_STYLE_LIST] (state, straitPageStyleList) {
    state.straitPageStyleList = straitPageStyleList
  },
  [types.SET_DESIGN_SAVE_TIME] (state, designSaveTime) {
    state.designSaveTime = designSaveTime
  },
  [types.SET_ALL_PAGE_SAVING] (state, allPageSaving) {
    state.allPageSaving = allPageSaving
  },
  [types.SET_INDEX_PAGE_SAVING] (state, indexPageSaving) {
    state.indexPageSaving = indexPageSaving
  },
  [types.SET_WIDE_PAGE_HEIGHT] (state, widePageHeight) {
    state.widePageHeight = widePageHeight
  }
}

const actions = {
  setPageListClose({commit}, pageListClose) {
    commit(types.SET_PAGELIST_CLOSE, pageListClose)
  },
  setPageThumbList({commit}, pageThumbList) {
    commit(types.SET_PAGE_THUMB_LIST, pageThumbList)
  },
  setWidePageStyleList({commit}, widePageStyleList) {
    commit(types.SET_WIDE_PAGE_STYLE_LIST, widePageStyleList)
  },
  setStraitPageStyleList({commit}, straitPageStyleList) {
    commit(types.SET_STRAIT_PAGE_STYLE_LIST, straitPageStyleList)
  },
  setDesignSaveTime({commit}, designSaveTime) {
    commit(types.SET_DESIGN_SAVE_TIME, designSaveTime)
  },
  setAllPageSaving({commit}, allPageSaving) {
    commit(types.SET_ALL_PAGE_SAVING, allPageSaving)
  },
  setIndexPageSaving({commit}, indexPageSaving) {
    commit(types.SET_INDEX_PAGE_SAVING, indexPageSaving)
  },
  setWidePageHeight({commit}, widePageHeight) {
    commit(types.SET_WIDE_PAGE_HEIGHT, widePageHeight)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
