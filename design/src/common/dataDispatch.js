import pageHandle from 'dataBus/page'
import pageEleHandle from 'dataBus/pageEle'
import elementHandle from 'dataBus/element'
import pageListHandle from 'dataBus/pageList'
import imgHandle from 'dataBus/img'
import textHandle from 'dataBus/text'
import svgFrameHandle from 'dataBus/svgFrame'
import svgHandle from 'dataBus/svg'
import {
	setTitleFlag,setTitleColor,setTitlePosition,
	setTitleName,setXAxisTitle,setYAxisTitle,
	setAxisFlag,setAxisTitleShow,setGridFlag,
	setChartColorList,setChartData,setChartKind,
	setLegendFlag
} from 'dataBus/chart'
import dataHandle from './dataHandle'


export default function (str) {
	let json=JSON.parse(str)


	pageHandle.elementBlur()

	json.forEach(j=>{
		_jsonCtrl(j)
	})

	function _jsonCtrl(j) {
		let {type}=j
		console.log('undo',j)

		switch (type){
			case 'element':
				_element(j)
				break
			case 'page':
				_page(j)
				break
			case 'group':
				_group(j)
				break
			case 'design':
				_design(j)
				break
		}
	}

	function _design(j) {
		let {key,oldValue,type,value} = j
		switch (key){
			case 'title':
				dataHandle.vuexActions().setDesignTitle[0](value)
				break
			case 'bleed':
				dataHandle.vuexActions().setIsBleed[0](!!value)
				break
		}
	}

	function _element(j) {
		let {eventType,eleIndex,key,oldValue,pageIndex,type,value} = j
		let {addElement,delElement,copyElement,setElementIndex,setElementJson} = pageEleHandle
		let {setLock,setOpacity,setShadow,setReverseStr,setWidth,setW,setHeight,setTransform,
			setViewBox,setColor,setGroupTransform,setGroup,setIsCut,setImgWidth,setImgHeight} = elementHandle
		let {setFilter} = imgHandle
		let {setTextHtml,setFontColor,setFontFamily,setFontSize,setFontBold,setFontItalic,
			setFontDecoration,setFontAlign,setTextWspace,setTextVspace} = textHandle
		let {setSorb} = svgFrameHandle
		let {setSvgVary} = svgHandle
		let {setPageJson}=pageHandle

		if(pageIndex!==dataHandle.vuexGetters().getFocusPageIndex)
			dataHandle.vuexActions().setFocusPageIndex[0](pageIndex)
		switch (eventType){
			case 0:
				// if(value['data-type']==='text'){
         //  delete value.loading
				// 	value['data-elem'].opacity===0
        // }
				// console.log(value)
				addElement(value,pageIndex,eleIndex)
				break
			case 1:
			case 2:
				if(eleIndex!==undefined){
					dataHandle.vuexActions().setFocusPageIndex[0](pageIndex)
					switch (key){
						case 'lock':
							setLock(value,pageIndex,eleIndex)
							break
						case 'opacity':
							setOpacity(value,pageIndex,eleIndex)
							break
						case 'shadow':
							setShadow(value,pageIndex,eleIndex)
							break
						case 'reverse':
							setReverseStr(value,pageIndex,eleIndex)
							break
						case 'width':
							setWidth(value,pageIndex,eleIndex)
							break
						case 'w':
							setW(value,pageIndex,eleIndex)
							break
						case 'height':
							setHeight(value,pageIndex,eleIndex)
							break
						case 'vary':
							setSvgVary(pageIndex,eleIndex,value)
							break
						case 'transform':
							setTransform(value,pageIndex,eleIndex)
							break
						case 'chart-kind':
							setChartKind(value,pageIndex,eleIndex)
							break
						case 'chart-data':
							setChartData(value,pageIndex,eleIndex)
							break
						case 'chart-axisShow':
							setAxisFlag(value,pageIndex,eleIndex)
							break
						case 'chart-axisTitleShow':
							setAxisTitleShow(value,pageIndex,eleIndex)
							break
						case 'chart-colors':
							setChartColorList(value,pageIndex,eleIndex)
							break
						case 'chart-gridShow':
							setGridFlag(value,pageIndex,eleIndex)
							break
						case 'chart-legendShow':
							setLegendFlag(value,pageIndex,eleIndex)
							break
						case 'chart-title':
							setTitleName(value,pageIndex,eleIndex)
							break
						case 'chart-titleColor':
							setTitleColor(value,pageIndex,eleIndex)
							break
						case 'chart-titlePosition':
							setTitlePosition(value,pageIndex,eleIndex)
							break
						case 'chart-titleShow':
							setTitleFlag(value,pageIndex,eleIndex)
							break
						case 'chart-xAxisTitle':
							setXAxisTitle(value,pageIndex,eleIndex)
							break
						case 'chart-yAxisTitle':
							setYAxisTitle(value,pageIndex,eleIndex)
							break
						case 'filter':
							setFilter(value,pageIndex,eleIndex)
							break
						case 'data-colors':
							setColor(null,value,pageIndex,eleIndex)
							break
						case 'html':
							setTextHtml(value,pageIndex,eleIndex)
							break
						case 'font-size':
							setFontSize(value,pageIndex,eleIndex)
							break
						case 'font-family':
							setFontFamily(value,pageIndex,eleIndex)
							break
						case 'wspace':
							setTextWspace(value,pageIndex,eleIndex)
							break
						case 'vspace':
							setTextVspace(value,pageIndex,eleIndex)
							break
						case 'data-align':
							setFontAlign(value,pageIndex,eleIndex)
							break
						case 'data-bold':
							setFontBold(value,pageIndex,eleIndex)
							break
						case 'data-italic':
							setFontItalic(value,pageIndex,eleIndex)
							break
						case 'data-decoration':
							setFontDecoration(value,pageIndex,eleIndex)
							break
						case 'fill':
							setFontColor(value,pageIndex,eleIndex)
							break
						case 'viewBox':
							setViewBox(value,pageIndex,eleIndex)
							break
						case 'group-transform':
							setGroupTransform(value,pageIndex,eleIndex)
							break
						case 'group':
							setGroup(value,pageIndex,eleIndex)
							break
						case 'data-xhref-imgs':
							setSorb(value,pageIndex,eleIndex)
							break
						case 'isCut':
							setIsCut(value,pageIndex,eleIndex)
							break
						case 'imgWidth':
							setImgWidth(value,pageIndex,eleIndex)
							break
						case 'imgHeight':
							setImgHeight(value,pageIndex,eleIndex)
							break
					}
				}else {
					setElementJson(value,pageIndex,key)
				}
				break
			case 3:
				delElement(pageIndex,eleIndex)
				break
			case 4:
				setElementIndex('index',pageIndex,eleIndex,value)
				break
			case 5:
				console.log(pageIndex,value)
				setPageJson(value,pageIndex)
				dataHandle.update()
				break
		}
	}
	function _page(j) {
		//page操作

		let {addPage,delPage,setPageIndex,setPageJson,setPageWH,getBlankPageJson,
			queryPageJson
		}=pageHandle
		let {addPageThumb,delPageThumb,movePageThumb,savePageThumb}=pageListHandle
		let {setEleGroups,delEleGroups}=pageEleHandle

		let {eventType,eleIndex,key,oldValue,pageIndex,type,value,pageId} = j

		function testEJson() {
			let userId=dataHandle.vuexGetters().getUserInfo.userId
			userId = userId.toString()
			while(userId.length <= 7) {
				userId = '0' + userId
			}
			if(pageId.length<24){
				pageId=pageId+userId
			}
		}
		if(dataHandle.vuexGetters().getIsLogin)
			testEJson()
		let fi=dataHandle.vuexGetters().getFocusPageIndex
		switch (eventType){
			case 0:
			case 4:
				if(value===null)
					value=getBlankPageJson()
				addPage(value,pageIndex,pageId)
				addPageThumb('',pageIndex)
				if(!dataHandle.vuexGetters().getPagesJson[fi])
					queryPageJson([fi])
				savePageThumb(pageIndex,()=>{
					dataHandle.vuexActions().setDesignSaveTime[0](Date.now())
				})
				break
			case 1:
				if(pageIndex!==undefined){


					switch(key){
						case 'width':
						case 'height':
							let w,h,
								num=value.substring(0,value.length-2),
								unit=value.substring(value.length-2)
							key==='width'?w=num:h=num
							setPageWH({
								newWidth: w,
								newHeight: h,
								unit: unit
							})
							break
						case 'elegroups':
							setEleGroups(value,pageIndex)
					}

				}else {
					setPageJson(value,key)
				}
				break
			case 2:
				setPageIndex(pageIndex,value)
				movePageThumb(pageIndex,value)
				break
			case 3:
				delPage(pageIndex)
				delPageThumb(pageIndex)
				fi=dataHandle.vuexGetters().getFocusPageIndex
				if(!dataHandle.vuexGetters().getPagesJson[fi])
					queryPageJson([fi])
				break
		}

		dataHandle.update()
	}
	function _group(j) {
		let {eventType,pageIndex,eleIndex,value,key} = j
		console.log(j)
		let pageJson=dataHandle.getPageJson(pageIndex)
		switch (eventType){
			case 0:
				pageJson.elegroups[eleIndex]=value
				break
			case 1:
				pageJson.elegroups[eleIndex][key]=value
				break
			case 3:
				if(pageJson.elegroups[eleIndex])
					delete pageJson.elegroups[eleIndex]
				break
		}
	}

	// switch ()
}