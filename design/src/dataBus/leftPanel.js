/*
 * @Author: bianhao 
 * @Date: 2017-09-08 17:49:54 
 * @Last Modified by: bianhao
 * @Last Modified time: 2017-09-08 17:52:15
 */

import dataHandle from 'common/dataHandle'

/**
 * 缓存拖拽添加元素预览图的地址
 * @return {Function}
 * @constructor
 */
function DragElementPreviewImg() {
	let imgUrl=''
	return function () {
		return{
			getImgUrl:()=>{
				return imgUrl
			},
			setImgUrl:v=>{
				imgUrl=v
			}
		}
	}
}

function DragElementImgInfo() {
	let info={
		width:0,
		height:0,
		id:null,
		'data-key':null
	}
	return function () {
		return{
			getImgInfo:()=>{
				return info
			},
			setImgInfo:v=>{
				info=v
			}
		}
	}
}

let elementPreviewImgCache=DragElementPreviewImg()
let elementImgInfoCache=DragElementImgInfo()

const leftPanel = {
	setShowFilter(drag) {
		let {setShowFilter,setLeftPanelClose} = dataHandle.vuexActions()
		setShowFilter[0](drag)
		setLeftPanelClose[0](false)
	},
	dragElementPreviewImg:elementPreviewImgCache(),
	dragElementImgInfo:elementImgInfoCache(),
}

export default leftPanel