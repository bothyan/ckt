
const state = {
  hoverArr: [],
  hoverShow: false
}

const getters = {
  getHoverArr: state => state.hoverArr,
  getHoverShow: state => state.hoverShow
}

const mutations = {
  setHoverArr(state, arr) {
    state.hoverArr = arr;
  },
  setHoverShow(state, boolV) {
    state.hoverShow = boolV;
  },
}

const actions = {
  setHoverArr({ commit }, arr) {
    commit('setHoverArr', arr);
  },
  setHoverShow({ commit }, boolV) {
    commit('setHoverShow', boolV);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

