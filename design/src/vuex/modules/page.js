import * as types from '../mutation-types'
import { getEditorInfoByElement, cEleInfo } from '../../dataBus/element.js'
import {getEditorClickTarget} from '../../dataBus/editor.js'

const state = {
	pagesJson: [
		{
			elems:[]
		}
	],
	pageWidth: 0,
	pageHeight: 0,
	// 当前正在操作的画布
	focusPageIndex: 0,
	pageIdList: [],
	pageReady:[true],        //检测是否需要重新加载标志
	// 画布缩放比例
	pageScale: 1,
	// 画布默认的缩放比例
	defaultPageScale: 1,
	maxPage: 20,
	pageBlank: {
		left : 50,
		right : 50,
		top: 50,
		bottom : 50
	},
	// 画布默认定位
	defaultPagePosition: {
		top: 0,
		lef: 0
	},
	// 画布定位
	pagePosition: {
		top: 0,
		lef: 0
	},
	pageRect: {
		top: 0,
		left: 0
	},
	//当前操作element索引
	focusElemIndex: -1,
	hoveredElemIndex: -1,
	// 当前操作的element组件
	focusElemNode: null,
	// 当前操作的element的type
	focusElemType: null,
	// 当前画布的缩略图列表
	// pageThumbList: [],
	circleSelectElements: [],
	// 框选过程中正在被全选中的素材Index
	circleSelectElementsNow: [],
	eleDragging: false,
	pagePreview: false,
	pageMoveMousedown: false,
	pageCenter: {
		top: 0,
		left: 0
	},
	transparentBack:false

}

const getters = {
	getPagesJson: state => state.pagesJson,
	getPageSum: state => state.pageIdList.length,
	getFocusPage: state => state.pagesJson[state.focusPageIndex],
	getFocusPageElemSum: state => {
		return state.pagesJson[state.focusPageIndex] ? state.pagesJson[state.focusPageIndex].elems.length : 0
	},
	getPageWidth: state => parseFloat(state.pageWidth),
	getPageHeight: state => parseFloat(state.pageHeight),
	getPageShowWidth: state => parseFloat(state.pageWidth) * state.pageScale,
	getPageShowHeight: state => parseFloat(state.pageHeight) * state.pageScale,
	getFocusPageIndex: state => state.focusPageIndex,
	getFocusPageId: state => state.pageIdList[state.focusPageIndex],
	getPageIdList: state => state.pageIdList,
	getPageReady: state => state.pageReady,
	getPageScale: state => state.pageScale,
	getDefaultPageScale: state => state.defaultPageScale,
	getMaxPage: state => state.maxPage,
	getPageBlank: state => state.pageBlank,
	getPagePosition: state => state.pagePosition,
	getDefaultPagePosition: state => state.defaultPagePosition,
	getPageRect: state => state.pageRect,
	getFocusElemIndex: state => state.focusElemIndex,
	getFocusElemNode: state => state.focusElemNode,
	getFocusElemType: state => state.focusElemType,
	getFocusElemJson: state => {
		return state.pagesJson[state.focusPageIndex] ? state.pagesJson[state.focusPageIndex].elems[state.focusElemIndex] : ''
	},
	// getPageThumbList: state => state.pageThumbList,
	getCircleSelectElements: state => state.circleSelectElements,
	getCircleSelectElementsNow: state => state.circleSelectElementsNow,
	getEleDragging: state => state.eleDragging,
	getPagePreview: state => state.pagePreview,
	getPageCenter: state => state.pageCenter,
	getHoveredElemIndex: state => state.hoveredElemIndex,
	getPageMoveMousedown: state => state.pageMoveMousedown,
	getTransparentBack : state=>state.transparentBack
}

const mutations = {
	[types.SET_PAGESJSON] (state, pagesJson) {
		state.pagesJson = pagesJson
	},
	[types.SET_PAGE_WIDTH] (state, pageWidth) {
		state.pageWidth = pageWidth
	},
	[types.SET_PAGE_HEIGHT] (state, pageHeight) {
		state.pageHeight = pageHeight
	},
	[types.SET_FOCUS_PAGE_INDEX] (state, focusPageIndex) {
		state.focusPageIndex = focusPageIndex
	},
	[types.SET_PAGE_ID_LIST] (state, pageIdList) {
		state.pageIdList = pageIdList
		//每次更新pageId，同时更新pageReady
		let arr=[]
		for(let i=0;i<pageIdList.length;i++){
			arr[i]=true
		}
		state.pageReady=arr
	},
	[types.SET_PAGE_READY] (state, pageReadyList) {
		state.pageReady=pageReadyList
	},
	[types.SET_PAGE_SCALE] (state, pageScale) {
		state.pageScale = pageScale
	},
	[types.SET_DEFAULT_PAGE_SCALE] (state, defaultPageScale) {
		state.defaultPageScale = defaultPageScale
	},
	[types.SET_MAX_PAGE] (state, maxPage) {
		state.maxPage = maxPage
	},
	[types.SET_PAGE_BLANK] (state, pageBlank) {
		state.pageBlank = pageBlank
	},
	[types.SET_PAGE_POSITION] (state, pagePosition) {
		state.pagePosition = pagePosition
	},
	[types.SET_DEFAULT_PAGE_POSITION] (state, defaultPagePosition) {
		state.defaultPagePosition = defaultPagePosition
	},
	[types.SET_PAGE_RECT] (state, pageRect) {
		state.pageRect = pageRect
	},
	// [types.SET_PAGE_THUMB_LIST] (state, pageThumbList) {
	//   state.pageThumbList = pageThumbList
	// },
	[types.SET_CIRCLE_SELECT_ELEMENTS] (state, circleSelectElements) {
		state.circleSelectElements = circleSelectElements
	},
	[types.SET_CIRCLE_SELECT_ELEMENTS_NOW] (state, circleSelectElementsNow) {
		state.circleSelectElementsNow = circleSelectElementsNow
	},
	[types.SET_ELE_DRAGGING] (state, eleDragging) {
		state.eleDragging = eleDragging
	},
	[types.SET_PAGE_PREVIEW] (state, pagePreview) {
		state.pagePreview = pagePreview
	},
	[types.SET_PAGE_CENTER] (state, pageCenter) {
		state.pageCenter = pageCenter
	},
	[types.SET_PAGE_MOVE_MOUSEDOWN] (state, pageMoveMousedown) {
		state.pageMoveMousedown = pageMoveMousedown
	},
	setFocusElemIndex(state, opts) {
		state.focusElemType = opts.eleType;
		state.focusElemIndex = opts.index;
		if(opts.eleNode) state.focusElemNode = opts.eleNode;
		if(opts.index == -1) state.focusElemNode = null;
	},
	setHoverElemIndex(state,v){
		state.hoveredElemIndex = v;
	},
	setTransparentBack(state, v) {
		state.transparentBack = v;
	}
}

const actions = {
	setPagesJson({commit}, pagesJson) {
		commit(types.SET_PAGESJSON, pagesJson)
	},
	setPageWidth({commit}, pageWidth) {
		commit(types.SET_PAGE_WIDTH, pageWidth)
	},
	setPageHeight({commit}, pageHeight) {
		commit(types.SET_PAGE_HEIGHT, pageHeight)
	},
	setFocusPageIndex({commit}, focusPageIndex) {
		commit(types.SET_FOCUS_PAGE_INDEX, focusPageIndex)
	},
	setPageIdList({commit}, pageIdList) {
		commit(types.SET_PAGE_ID_LIST, pageIdList)
	},
	setPageReady({commit}, pageReadyList){
		commit(types.SET_PAGE_READY,pageReadyList)
	},
	setPageScale({commit}, pageScale) {
		commit(types.SET_PAGE_SCALE, pageScale)
	},
	setDefaultPageScale({commit}, defaultPageScale) {
		commit(types.SET_DEFAULT_PAGE_SCALE, defaultPageScale)
	},
	setMaxPage({commit}, maxPage) {
		commit(types.SET_MAX_PAGE, maxPage)
	},
	setPageBlank({commit}, pageBlank) {
		commit(types.SET_PAGE_BLANK, pageBlank)
	},
	setPagePosition({commit}, pagePosition) {
		commit(types.SET_PAGE_POSITION, pagePosition)
	},
	setDefaultPagePosition({commit}, defaultPagePosition) {
		commit(types.SET_DEFAULT_PAGE_POSITION, defaultPagePosition)
	},
	setPageRect({commit}, pageRect) {
		commit(types.SET_PAGE_RECT, pageRect)
	},
	setEleDragging({commit}, eleDragging) {
		commit(types.SET_ELE_DRAGGING, eleDragging)
	},
	setPagePreview({commit}, pagePreview) {
		commit(types.SET_PAGE_PREVIEW, pagePreview)
	},
	// setPageThumbList({commit}, pageThumbList) {
	//   commit(types.SET_PAGE_THUMB_LIST, pageThumbList);
	// },
	setCircleSelectElements({commit}, circleSelectElements) {
		commit(types.SET_CIRCLE_SELECT_ELEMENTS, circleSelectElements);
	},
	setCircleSelectElementsNow({commit}, circleSelectElementsNow) {
		commit(types.SET_CIRCLE_SELECT_ELEMENTS_NOW, circleSelectElementsNow);
	},
	setPageCenter({commit}, pageCenter) {
		commit(types.SET_PAGE_CENTER, pageCenter);
	},
	setPageMoveMousedown({commit},pageMoveMousedown){
		commit(types.SET_PAGE_MOVE_MOUSEDOWN, pageMoveMousedown);
	},
	setFocusElemIndex({commit}, opts) {
		commit('setFocusElemIndex', opts);
	},
	setHoverElemIndex({commit},val){
		commit('setHoverElemIndex', val);
	},
	setTransparentBack({ commit }, val) {
		commit('setTransparentBack', val);
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
