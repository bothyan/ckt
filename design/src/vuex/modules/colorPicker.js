import * as types from '../mutation-types'

const state = {
	isShow: false,
	invoke:'',
	colorData:'#ffffff',
	status: 0,
	position:{
		top:'0px',
		left:'0px'
	},
  defaultColor:'#ffffff'
}

const getters = {
	getColorPickerIsShow: state => state.isShow,
	getColorPickerInvoke: state => state.invoke,
	getColorPickerColorData: state => state.colorData,
	getColorPickerDefaultColor: state => state.defaultColor,
	getColorPickerColorStatus: state => state.status,
	getColorPickerPosition: state => state.position
}

const mutations =function () {
	let colorTemp='#ffffff'
	return {
		[types.SET_COLORPICKER_STATUS] (state, data) {
			if(data){
				state.colorData = data.colorData
				state.status = 1
				// console.log(colorTemp)
			}
		},
		[types.SET_COLORPICKER_SHOW] (state,data){
			if(data&&data.isShow){
				state.isShow = data.isShow
				state.invoke = data.invoke
				state.position = data.position
				colorTemp = data.DefaultColor
				state.defaultColor=colorTemp
			}else {
				state.isShow=false
				// state.invoke = ''
				data.cancel&&(state.colorData=colorTemp)
				// state.colorData = '#ffffff'
				// console.log(colorTemp,data.cancel,state.colorData)
				state.status = 0
				state.position = {
					top:'0px',
					left:'0px'
				}
			}
		}
	}
}

const actions = {
	setColorPickerStatus({commit}, data) {
		commit(types.SET_COLORPICKER_STATUS, data)
	},
	setColorPickerShow({commit},data) {
		commit(types.SET_COLORPICKER_SHOW, data)
	}
}

export default {
	state,
	getters,
	mutations:mutations(),
	actions
}
