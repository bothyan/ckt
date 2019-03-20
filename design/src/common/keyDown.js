import dataHandle from 'common/dataHandle'
import toolsBar from 'dataBus/toolsBar'
import pageScaleSet from 'dataBus/pageScaleSet'
import pageEleBus from 'dataBus/pageEle'
import pageBus from 'dataBus/page'
import editorBus from 'dataBus/editor'
import headerSaveTime   from 'dataBus/savetime'

export default function () {
	// console.log(navigator.platform)
	let sys,
	save = headerSaveTime();
	switch (true){
		case navigator.platform.indexOf('Mac')===0:
			sys='mac';break
		case navigator.platform.indexOf('Win')===0:
			sys='win';break
		case navigator.platform.indexOf('Linux')===0:
			sys='linux';break
	}
	window.addEventListener('beforeunload',function(){
		let nowWords = dataHandle.vuexGetters().getSaveTimes
		if((nowWords!== '保存完成!'&&nowWords.indexOf('更新') == -1&&nowWords!=='') && dataHandle.vuexGetters().getIsLogin==true)

		event.returnValue = "我在这写点东西...";
	})
	window.addEventListener('keydown', e => {

		let getters = dataHandle.vuexGetters(),
			  editStatus = getters.getClipFlag || getters.getFrameClip;

		let keyCode = e.keyCode || e.which || e.charCode
		// let ctrlKey = e.ctrlKey || e.metaKey   //altKey shiftKey
		if(dataHandle&&dataHandle.vuexActions&&dataHandle.vuexActions().setCtrlKeyDown)
		if(sys==='mac'){
			if(e.metaKey){
				dataHandle.vuexActions().setMetaKeyDown[0](true)
				switch (keyCode){
					case 67:
						// cmd c
						if (editStatus) {
							pageBus.elementBlur();
						} else {
							editorBus.copyEleByKey();
						}
						break
					case 86:
						// cmd v
						if (editStatus) {
							pageBus.elementBlur();
						} else {
							editorBus.pasteEleByKey(e);
						}
						break
					case 90:
						if (editStatus) {
							pageBus.elementBlur();
						}
						else {
							if(e.shiftKey){
								// console.log('shift cmd z')
								dataHandle.redo()
							}else {
								// console.log('cmd z')
								dataHandle.undo()
								e.preventDefault();
							}
						}
						break
					case 83:
					e.preventDefault()
						if(dataHandle.vuexGetters().getIsLogin==false){
							dataHandle.vuexActions().setLogregShow[0](1)
						}else{
							save()
						}
						break;
					case 82:
						dataHandle.vuexActions().setMetaKeyDown[0](false)
						dataHandle.vuexActions().setCtrlKeyDown[0](false)
					break;
				}
			} else if(e.ctrlKey) {
				dataHandle.vuexActions().setCtrlKeyDown[0](true)
			} else if(e.shiftKey) {
				dataHandle.vuexActions().setShiftKeyDown[0](true)
			} else {
				switch (keyCode){
					case 8:
						// 后退 ←
						// console.log('delete')
						toolsBar.delElement()
						// e.preventDefault();
						// dataHandle.commit()
						banBackSpace(e);
						break
					case 32:
						// 空格
						if(!dataHandle.vuexGetters().getTextEdit) {
							pageBus.elementBlur();
						}
						dataHandle.vuexActions().setSpaceKeyDown[0](true)
						break
					case 37:
						// console.log('left')
						break
					case 38:
						// console.log('up')
						break
					case 39:
						// console.log('right')
						break
					case 40:
						// console.log('down')
						break
					case 46:
						toolsBar.delElement()
						break
				}
			}
		}else {
			if(e.ctrlKey){
				dataHandle.vuexActions().setCtrlKeyDown[0](true)
				switch (keyCode){
					case 67:
						// cmd c
						if (editStatus) {
							pageBus.elementBlur();
						} else {
							editorBus.copyEleByKey();
						}
						break
					case 86:
						// cmd v
						if (editStatus) {
							pageBus.elementBlur();
						} else {
							editorBus.pasteEleByKey(e);
						}
						break
					case 90:
						// console.log('ctrl z')
						if (editStatus) {
							pageBus.elementBlur();
						} else {
							dataHandle.undo();
						}
						break
					case 89:
						// console.log('ctrl y')
						if (editStatus) {
							pageBus.elementBlur();
						} else {
							dataHandle.redo()
						}
						break
					case 187:
						// +
						pageScaleSet.pageScaleAdd()
						e.preventDefault()
						break
					case 189:
						// -
						pageScaleSet.pageScaleSub()
						e.preventDefault()
						break
					case 83:
					e.preventDefault()
					// console.log(dataHandle.vuexGetters())
						window.flag = true
						if(dataHandle.vuexGetters().getIsLogin==false){
							dataHandle.vuexActions().setLogregShow[0](1)
						}else{
							save()
						}
						break
						//ctrl+f5||r
						case 116:
						case 82:
							dataHandle.vuexActions().setCtrlKeyDown[0](false)

						break;
				}
			} else if(e.shiftKey) {
				dataHandle.vuexActions().setShiftKeyDown[0](true)
			} else if(e.metaKey) {
				dataHandle.vuexActions().setMetaKeyDown[0](true)
			} else {
				switch (keyCode){
					case 8:
						// 后退 ←
						// console.log('delete')
						toolsBar.delElement()
						// e.preventDefault();
						banBackSpace(e);
						break
					case 32:
						// 空格
						if(!dataHandle.vuexGetters().getTextEdit) {
							pageBus.elementBlur();
						}
						dataHandle.vuexActions().setSpaceKeyDown[0](true)
						break
					case 37:
						// console.log('left')
						break
					case 38:
						// console.log('up')
						break
					case 39:
						// console.log('right')
						break
					case 40:
						// console.log('down')
						break
					case 46:
						toolsBar.delElement()
						break
					//f5
					case 116:

					break;

				}
			}
		}

	},false)

	window.addEventListener('keyup',e=>{
		let keyCode = e.keyCode || e.which || e.charCode
		// let ctrlKey = e.ctrlKey || e.metaKey   //altKey shiftKey
		if(dataHandle&&dataHandle.vuexActions&&dataHandle.vuexActions().setCtrlKeyDown)
		if(sys==='mac'){
			if(e.metaKey){
				dataHandle.vuexActions().setMetaKeyDown[0](false)
			}else {
				switch (keyCode){
					case 16:
						// shift
						dataHandle.vuexActions().setShiftKeyDown[0](false)
						break
					case 17:
						// ctrl
						dataHandle.vuexActions().setCtrlKeyDown[0](false)
						break
					case 32:
						// 空格
						if(!dataHandle.vuexGetters().getTextEdit) {
							pageBus.elementBlur();
						}
						dataHandle.vuexActions().setSpaceKeyDown[0](false)
						break
					case 91:
						// commond
						dataHandle.vuexActions().setMetaKeyDown[0](false)
						break
				}
			}
		}else {
			if(e.ctrlKey){

			}else {
				switch (keyCode){
					case 16:
						// shift
						dataHandle.vuexActions().setShiftKeyDown[0](false)
						break
					case 17:
						// ctrl
						dataHandle.vuexActions().setCtrlKeyDown[0](false)
						break
					case 32:
						// 空格
						if(!dataHandle.vuexGetters().getTextEdit) {
							pageBus.elementBlur();
						}
						dataHandle.vuexActions().setSpaceKeyDown[0](false)
						break
					case 91:
						// commond
						dataHandle.vuexActions().setMetaKeyDown[0](false)
						break
				}
			}
		}

	},false)

	function banBackSpace(e) {
	  let ev = e || window.event;//获取event对象
	  let obj = ev.target || ev.srcElement;//获取事件
	  let t = obj.type || obj.getAttribute('type');//获取事件源类型
	  //获取作为判断条件的事件类型
	  let vReadOnly = obj.getAttribute('readonly');
	  let vEnabled = obj.getAttribute('enabled');
	  //处理null值情况
	  vReadOnly = (vReadOnly == null) ? false : true;
	  vEnabled = (vEnabled == null) ? true : vEnabled;
	  //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
	  //并且readonly属性为true或enabled属性为false的，则退格键失效
	  let flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea")&& (vReadOnly || vEnabled!=true))?true:false;
	  //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
	  let flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")?true:false;
	  //判断
	  if(flag2){
	    ev.preventDefault();
	    return false;
	  }
	  if(flag1){
	    ev.preventDefault();
	    return false;
	  }
	}
}
