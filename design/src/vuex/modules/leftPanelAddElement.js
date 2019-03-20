import * as types from '../mutation-types'

const state = {
  target:{disable:true},
  result:{},
  template:{},
	isDone:Date.now()
}

const getters = {
  getPreparedElementData: state => state.result,
  getPreparedTemplate: state => state.template,
  getTargetElementData: state => state.target,
	getAddElementDone: state=>state.isDone
}

const mutations = {
  [types.SET_LEFTPANEL_ADDELEMENT_TEMP] (state, data) {
    state.template=data
  },
  [types.SET_LEFTPANEL_ADDELEMENT_DATA] (state, data) {
    state.target=data
  },
  [types.SET_LEFTPANEL_ADDELEMENT_FLOG] (state,{flag}){
    if(flag){
      state.result=state.target
      state.target={disable:true}
    }else {
      state.target={disable:true}
    }
    state.isDone=Date.now()
  }

}

const actions = {
  setLeftPanelElementData({commit}, data) {
    commit(types.SET_LEFTPANEL_ADDELEMENT_DATA, data)
  },
  setLeftPanelElementReady({commit},data) {
    commit(types.SET_LEFTPANEL_ADDELEMENT_FLOG, data)
  },
  setLeftPanelTemplate({commit},data) {
    commit(types.SET_LEFTPANEL_ADDELEMENT_TEMP, data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
