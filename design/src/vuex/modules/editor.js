
const state = {
	editorShow: false,
	varyType: 'db',
	left: 0,
	top: 0,
	width: 0,
	height: 0,
	rotate: 0,
	opacity: 1,
	lock: false,
  tableEditorShow: false,
	tableScale: 1,
	colWidths: [],
	rowHeights: [],
	cells: [],
	lw: 0,
	elementData: {},
	clipFlag: false,
	textEdit: false,
	frameClip: false,
	frameClipInfo: {},
	layerAnimationShow: false,
	layerAnimationInfo: {},
	textAreaValue: '' 
}

const getters = {
	getEditorShow: state => state.editorShow,
  getTableEditorShow: state => state.tableEditorShow,
	getEditorInfo: state => {
		return {
			left: state.left,
			top: state.top,
			width: state.width,
			height: state.height,
			rotate: state.rotate,
			type: state.varyType,
			lock: state.lock
		}
	},
	getEditorPosition: state => {
		return {
			left: state.left,
			top: state.top,
			width: state.width,
			height: state.height,
			right: state.left + state.width,
			bottom: state.top + state.height
		}
	},
	getTableEditorInfo: state => {
		return {
			left: state.left,
			top: state.top,
      width: state.width,
      height: state.height,
      lw: state.lw,
			colWidths: state.colWidths,
			rowHeights: state.rowHeights,
			cells: state.cells,
			tableScale: state.tableScale,
      lock: state.lock
		}
	},
	getElementData: state => state.elementData,
	getClipFlag: state => state.clipFlag,
	getTextEdit: state => state.textEdit,
	getFrameClip: state => state.frameClip,
	getFrameClipInfo: state => state.frameClipInfo,
	getEditorLock: state => state.lock,
	getLayerAnimationShow: state => state.layerAnimationShow,
	getLayerAnimationInfo: state => state.layerAnimationInfo,
	getEditorLock: state => state.lock,
	getTextareaValue: state => state.textAreaValue
}

const mutations = {
	setEditorShow(state, boolV) {
		state.editorShow = boolV;
	},
  setTableEditorShow(state, boolV) {
	  state.tableEditorShow = boolV
  },
	setEditorInfo(state, info) {
		Object.assign(state, info);
	},
	setEditorLock(state, boolV) {
		state.lock = boolV;
	},
	setElementData(state, data) {
		state.elementData = data;
	},
	setClipFlag(state, boolV) {
		state.clipFlag = boolV;
	},
	setTextEdit(state, boolV) {
		state.textEdit = boolV;
	},
	setFrameClip(state, boolV) {
		state.frameClip = boolV;
	},
	setFrameClipInfo(state, obj) {
		state.frameClipInfo = obj;
	},
	setLayerAnimationShow(state, boolV) {
		state.layerAnimationShow = boolV;
	},
	setLayerAnimationInfo(state, info) {
		Object.assign(state.layerAnimationInfo, info);
	},
	setTextareaValue(state, v) {
		state.textAreaValue = v;
	}
}

const actions = {
	setEditorShow({ commit }, boolV) {
		commit('setEditorShow', boolV);
	},
  setTableEditorShow({ commit }, boolV) {
    commit('setTableEditorShow', boolV);
  },
	setEditorInfo({ commit }, info) {
		commit('setEditorInfo', info);
		// if(info.varyType === 'table'){
    //   commit('setEditorShow', false);
    //   commit('setTableEditorShow', true);
    // } else {
    //   commit('setEditorShow', true);
    //   commit('setTableEditorShow', false);
    // }
	},
	setElementData({ commit }, data) {
		commit('setElementData', data);
	},
	setClipFlag({ commit }, boolV) {
		commit('setClipFlag' , boolV)
	},
	setClipInfo({ commit }, info) {
		commit('setClipInfo', info);
	},
	setTextEdit({ commit }, boolV) {
		commit('setTextEdit', boolV);
	},
	setFrameClip({ commit }, boolV) {
		commit('setFrameClip', boolV);
	},
	setFrameClipInfo({ commit }, obj) {
		commit('setFrameClipInfo', obj);
	},
	setEditorLock({ commit }, boolV) {
		commit('setEditorLock', boolV);
	},
	setLayerAnimationShow({ commit }, boolV) {
		commit('setLayerAnimationShow', boolV);
	},
	setLayerAnimationInfo({ commit }, info) {
		commit('setLayerAnimationInfo', info);
		commit('setLayerAnimationShow', true);
	},
	setTextareaValue({ commit }, v) {
		commit('setTextareaValue', v);
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}