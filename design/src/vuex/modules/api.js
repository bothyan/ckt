/*
 * api信息
 * create by zhangdi on 2017/7/28
 */
import * as types from '../mutation-types'

const state = {
  apiType: -1, // 1代表新版api,需要apiToken 2代表老版api,不需要apiToken
  apiInfo: null,
  apiToken: null,
  apiHref: '' // api打开ifream的href
}

const getters = {
  getApiType: state => state.apiType,
  getApiInfo: state => state.apiInfo,
  getApiToken: state => state.apiToken,
  getApiHref: state => state.apiHref
}

const mutations = {
  [types.SET_API_TYPE] (state, apiType) {
    state.apiType = apiType
  },
  [types.SET_API_INFO] (state, apiInfo) {
    state.apiInfo = apiInfo
  },
  [types.SET_API_TOKEN] (state, apiToken) {
    state.apiToken = apiToken
  },
  [types.SET_API_HREF] (state, apiHref) {
    state.apiHref = apiHref
  }
}

const actions = {
  setApiType({commit}, apiType) {
    commit(types.SET_API_TYPE, apiType)
  },
  setApiInfo({commit}, apiInfo) {
    commit(types.SET_API_INFO, apiInfo)
  },
  setApiToken({commit}, apiToken) {
    commit(types.SET_API_TOKEN, apiToken)
  },
  setApiHref({commit}, apiHref) {
    commit(types.SET_API_HREF, apiHref)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

