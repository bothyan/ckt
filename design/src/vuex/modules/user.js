/**
 * Created by Chuanfeng on 2017/8/23.
 */

import * as types from '../mutation-types'

const state = {
	userInfo: {},
	isLogin: false,
	isVip: 1, // 1：普通用户； 2：会员用户
	teamId: 0, // 用户当前使用中的团队ID(0表示个人版;其他数值则表示团队ID)
	teams: [],
	collectedMaterials: [],
	teamStamp:null
}

const getters = {
	getUserInfo: state => state.userInfo,
	getIsLogin: state => state.isLogin,
	getIsVip: state => state.isVip,
	getTeamId: state => state.teamId,
	getTeams: state => state.teams,
	getTeamStamp: state => state.teamStamp,
	getCollectedMaterials: state => state.collectedMaterials
}

const actions = {
	setTeamStamp({commit},data){
		commit(types.SET_TEAMSTAMP,data)
	},
	setUserInfo ({commit}, userInfo) {
		commit(types.SET_USERINFO, userInfo)
	},
	setIsLogin ({commit}, isLogin) {
		commit(types.SET_ISLOGIN, isLogin)
		if (!isLogin) {
			commit(types.SET_USERINFO, null)
		}
	},
	setTeamId ({commit}, teamId) {
		commit(types.SET_TEAMID, teamId)
	},
	setCollectedMaterials ({commit}, ids) {
		commit(types.SET_COLLECTEDMATERIALS, ids);
	},
	addCollectedMaterialId ({commit}, id) {
		commit(types.SET_ADDCOLLECTEDMATERIALID, id);
	},
	removeCollectedMaterialId({commit}, id) {
		commit(types.SET_REMOVECOLLECTEDMATERIALID, id);
	}
}

const mutations = {
	[types.SET_USERINFO] (state, userInfo) {
		if (userInfo === null) {
			state.userInfo = {}
			state.userInfo.LoginTimeOut = true
			state.isLogin = false
			state.isVip = 1
			state.teamId = 0
			state.teams = []
		} else {
			state.userInfo = userInfo
			state.isLogin = true
			state.isVip =  (userInfo.mem || userInfo.designerCheckStatus === 2) ? 2 : 1
			state.teamId = userInfo.curTid
			state.teams = userInfo.teams !== 0 ? userInfo.teams : []
		}
	},
	[types.SET_ISLOGIN] (state, isLogin) {
		state.isLogin = isLogin
	},
	[types.SET_TEAMID] (state, teamId) {
		state.teamId = teamId
	},
	[types.SET_COLLECTEDMATERIALS] (state, ids) {
		state.collectedMaterials = ids;
	},
	[types.SET_ADDCOLLECTEDMATERIALID] (state, id) {
		state.collectedMaterials.push(id);
	},
	[types.SET_REMOVECOLLECTEDMATERIALID] (state, id) {
		let length = state.collectedMaterials.length;
		for(let i = 0;i < length;i++) {
			if(id == state.collectedMaterials[i]) {
				state.collectedMaterials.splice(i, 1);
				break;
			}
		}
	},
	[types.SET_TEAMSTAMP] (state,data){
		state.teamStamp=data
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
