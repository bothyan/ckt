import * as types from '../mutation-types'


const state ={
  saveTimes:'',
	saveSuccessMessageFlag:false
}

const getters ={
  getSaveTimes : state=> state.saveTimes,
	getSaveSuccessMessageFlag: state=>state.saveSuccessMessageFlag
}

const mutations = {
  [types.SET_SAVETIMES](state,saveTimes){
    state.saveTimes = saveTimes
  },
	[types.SET_SAVESUCCESSMESSAGEFLAG](state,e){
  	state.saveSuccessMessageFlag=e
	}
}
const actions = {
  setSaveTimes({commit},saveTimes){
    commit(types.SET_SAVETIMES,saveTimes)
  },
	setSaveSuccessMessageFlag({commit},e){
  	commit(types.SET_SAVESUCCESSMESSAGEFLAG,e)
	}
}


export default {
	state,
	getters,
	mutations,
	actions
}