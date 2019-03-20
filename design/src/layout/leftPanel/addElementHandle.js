import pageEle from 'dataBus/pageEle'
import _ from 'common/dataHandle'
import {getBaseLineFromTop,getLineHeightOld} from 'common/common'
// import test from './test.json'

export function addElementHandle({data,imgUrl,elemPos,width,height,animation=false}) {
	let vuexGetters=_.vuexGetters()
	let pageScale = vuexGetters.getPageScale
	let pageWidth = vuexGetters.getPageWidth
	let pageHeight = vuexGetters.getPageHeight
	let focusPageIndex = vuexGetters.getFocusPageIndex
	let pageCenter = vuexGetters.getPageCenter
	let _width=width,_height=height
	if(data['data-type']==='font'){
		_.$vue.$http.get(data['fileUrl'])
			.then(e=>{
				if(e.data.pages[0]){
					let {elems,width,height} = e.data.pages[0]
					// console.log(_width,width)
					let scale = _width/width
					addGroupElement(elems,scale,pageScale,elemPos,width,height,animation)
				}
			})
	}else {
		data['data-elem'].width = data['data-elem'].width / pageScale
		data['data-elem'].height = data['data-elem'].height / pageScale

		// if (data['data-elem'].viewBox == undefined) {
		// 	data['data-elem'].viewBox = `0 0 ${width} ${height}`
		// 	data['data-elem'].imgWidth = width
		// 	data['data-elem'].imgHeight = height
		// }

		data.transform=elemPos?
			`translate(${elemPos.left/pageScale},${elemPos.top/pageScale})rotate(0,${data['data-elem'].width/2},${data['data-elem'].height/2})`:
			`translate(${pageCenter.left-data['data-elem'].width/2},${pageCenter.top-data['data-elem'].height/2})rotate(0,${data['data-elem'].width/2},${data['data-elem'].height/2})`

		let commitData = pageEle.addElement(data, focusPageIndex,undefined,false,animation)
		_.commit('element',commitData).push();
	}
}

function addGroupElement(elems,scale,pageScale,elemPos,w,h,animation) {
	let vuexGetters=_.vuexGetters()
	let pageWidth = vuexGetters.getPageWidth
	let pageHeight = vuexGetters.getPageHeight
	let focusPageIndex = vuexGetters.getFocusPageIndex
	let pageCenter = vuexGetters.getPageCenter
	let focusPageJson = _.getPageJson()
	let element_group='element_group_'+Date.now()
	elems.map(elem=>{
		elem.group=element_group
		elem['group-transform']=elem.transform
		let translate=elem['group-transform'].split(')')[0].split('(')[1].split(','),
			rotate=elem['group-transform'].split(')')[1].split('(')[1].split(',')
		if(elemPos){
			translate=[
				((Number.parseFloat(translate[0])*scale+elemPos.left)/pageScale),
				((Number.parseFloat(translate[1])*scale+elemPos.top)/pageScale),
			]
		}else {
			translate=[
				Number.parseFloat(translate[0])*scale/pageScale+pageCenter.left-w*scale/pageScale/2,
				Number.parseFloat(translate[1])*scale/pageScale+pageCenter.top-h*scale/pageScale/2,
			]
		}
		if(elem.reverse&&elem.reverse!==''&&elem.reverse!==' ') {
			let translate1=[
				elem.reverse.split('translate')[1].split(',')[0].split('(')[1],
				elem.reverse.split('translate')[1].split(',')[1].split(')')[0],
			]
			elem.reverse =
				elem.reverse.split('translate')[0] +
				`translate(${parseFloat(translate1[0])*scale/pageScale},${parseFloat(translate1[1])*scale/pageScale})`
		}
		elem['transform']=`translate(${translate[0]},${translate[1]})rotate(${rotate[0]},${rotate[1]*scale/pageScale},${rotate[2]*scale/pageScale})`
		elem['data-elem'].width=elem['data-elem'].width*scale/pageScale
		elem['data-elem'].height=elem['data-elem'].height*scale/pageScale
		// console.log(elem['data-elem'].width,scale,pageScale)
		if(elem['data-type']==='text'){
			elem['data-elem']['font-size']=elem['data-elem']['font-size']*scale/pageScale
			if(elem['data-elem']['id']===undefined||elem['data-elem']['id']===''){
				let h=getBaseLineFromTop(elem['data-elem']['font-size'],elem['data-elem']['font-family'])
				elem['transform']=`translate(${translate[0]},${translate[1]+h})rotate(${rotate[0]},${elem['data-elem'].width/2},${elem['data-elem'].height/2})`
			}
			// let vspace=elem['data-elem']['vspace']|0
			// elem['data-elem']['height']=elem['data-elem']['height']*(vspace+1200)/(vspace+1000)
			elem['data-elem']['vspace']=getLineHeightOld(elem)
			// if(elem['data-elem']['vspace']===undefined||(elem['data-elem']['vspace']|0)===0){
			// }
		}

		// console.log(elem['transform'])
		let event=pageEle.addElement(elem,null,null,true,animation)

		_.commit('element',event)
	})
	let transform=elemPos?
		`translate(${elemPos.left/pageScale}, ${elemPos.top/pageScale})rotate(0,${w*scale/pageScale/2},${h*scale/pageScale/2})`:
		`translate(${pageCenter.left-w*scale/pageScale/2}, ${pageCenter.top-h*scale/pageScale/2})rotate(0,${w*scale/pageScale/2},${h*scale/pageScale/2})`
	let {elegroups}=JSON.parse(JSON.stringify(focusPageJson))
	elegroups[element_group]={transform}
	pageEle.setEleGroups(elegroups,focusPageIndex,element_group,true)
	_.commit('group',{
		eventType:0,
		pageIndex:focusPageIndex,
		eleIndex:element_group,
		value:{transform}
	})
	_.push()
}
