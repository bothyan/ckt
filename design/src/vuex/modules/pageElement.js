import * as types from '../mutation-types'

const state = {
  elements: [],
  currentIndex:0,
  groupFlag: false,
  groupId: '',
  selectHaveGroup: false,
  selectGroup: [],
  newAddEleId: ''
}

const getters = {
  getElmenets: state => state.elements,
  getcurrentIndex: state=>state.currentIndex,
  getcurrentEle :state => state.elements[state.currentIndex],
  getGroupFlag: state => state.groupFlag,
  getGroupId: state => state.groupId,
  getSelectHaveGroup: state => state.selectHaveGroup,
  getSelectGroup: state => state.selectGroup,
  getNewAddEleId: state => state.newAddEleId

}

const mutations = {
  [types.SET_ELEMENTS] (state, ele) {
    state.elements.push(ele);
  },
  [types.SET_SVG_INIT](state,val){

  },
  setGroupFlag(state, boolV) {
    state.groupFlag = boolV;
  },
  setGroupId(state, id) {
    state.groupId = id;
  },
  setSelectHaveGroup(state, boolV) {
    state.selectHaveGroup = boolV;
  },
  setSelectGroup(state, arr) {
    state.selectGroup = arr;
  },
  [types.SET_NEW_ADD_ELE_ID] (state, newAddEleId) {
    state.newAddEleId = newAddEleId;
  }
}

const actions = {
  setElements({commit}, ele) {
    commit(types.SET_ELEMENTS, ele)
  },
  setSvgInit({commit},val){
    commit(types.SET_SVG_INIT,val)
  },
  setGroupFlag({ commit }, boolV) {
    commit('setGroupFlag', boolV);
  },
  setGroupId({ commit }, id) {
    commit('setGroupId', id);
  },
  setSelectHaveGroup({ commit }, boolV) {
    commit('setSelectHaveGroup', boolV);
  },
  setSelectGroup({ commit }, arr) {
    commit('setSelectGroup', arr);
  },
  setNewAddEleId({ commit }, newAddEleId) {
    commit(types.SET_NEW_ADD_ELE_ID, newAddEleId);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

