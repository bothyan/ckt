import * as types from '../mutation-types'

const state = {
  elements: [],
  event: null
}

const getters = {
  // getElmenets: state => state.elements,
  getElementEvent: state => state.event
}

const mutations = {
  // [types.SET_ELEMENTS] (state, ele) {
  //   state.elements.push(ele);
  // },
  setElementEvent(state, evt) {
    state.event = evt;
  }
}

const actions = {
  // setElements({commit}, ele) {
  //   commit(types.SET_ELEMENTS, ele)
  // },
  setElementEvent({ commit }, evt) {
    commit('setElementEvent', evt);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

