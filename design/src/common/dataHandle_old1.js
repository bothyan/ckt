/**
 * created by suti
 */
import dataDispatch from './dataDispatch'
import ws from 'dataBus/webSocket'

const someKey=['html','data-type','data-img-kind','transform','reverse','group','group-transform'] //这些key值不在elem-data层
let testIsThisKeyNotInElem=(key)=>{
	let is=false
	someKey.forEach(e=>{
		if(e===key)
			is=true
	})
	return is
}

class DataHandle{
	constructor(){

	}

	init(vue){
		this.$vue=vue
		this.store={
			jsonCopy:JSON.stringify(vue.$store.getters.getPagesJson),   //.init()及.push()时会将当前JSON进行copy
			commitQueue:[],                                             //commit队列，在.push()会被清空
			pushQueue:[],                                               //上传队列，在.push()时会将commitQueue里的全部数据转换成eJson追加到该队列等待上传
			undoQueue:[],                                               //撤销队列，每一次.push()会将commitQueue转换后全部数据追加到该队列
			redoQueue:[],                                               //重做队列，每次.undo()会将undoQueue最后一项转换后追加到该队列
			designCopy:{
				bleed:vue.$store.getters.getIsBleed,
				title:vue.$store.getters.getDesignTitle,
				pageIdList:vue.$store.getters.getPageIdList
			},

		}
		this.getJson=()=>{
			return vue.$store.getters.getPagesJson
		}

		this.uploading=false
		this.uploadStatus=0
		this.pushQueueLength=0
		this.uploadStatusCallBackQueue=[]
		this.uploadingCallBackQueue=[]
		this.pushQueueLengthCallBackQueue=[]

		this._define(this,'uploadStatus',val=>{
			this.uploadStatusCallBackQueue.forEach(cb=>{
				cb&&typeof cb === 'function'&&cb(val)
			})
		})
		this._define(this,'uploading',val=>{
			this.uploadingCallBackQueue.forEach(cb=>{
				cb&&typeof cb === 'function'&&cb(val)
			})
		})
		this._define(this,'pushQueueLength',val=>{
			this.pushQueueLengthCallBackQueue.forEach(cb=>{
				cb&&typeof cb === 'function'&&cb(val)
			})
		})

	}

	update(){
		console.warn('error:: 没有初始化保存')
	}

	saveDesign(){
		console.warn('error:: 没有初始化保存')
	}

	updateDesignJson(){
		this.store.jsonCopy=JSON.stringify(this.$vue.$store.getters.getPagesJson)
	}

	// 初始化保存需要值
	initDesignInfo(designInfo) {
		let info = {
				d: designInfo.d,
				dt: designInfo.dt,
				k: designInfo.k,
				kt: designInfo.kt,
				t: designInfo.t,
				ow: designInfo.ow,
				oh: designInfo.oh,
				mp: designInfo.mp,
				tid: designInfo.tid,
				tt: designInfo.tt,
				c: designInfo.c,
				stamp: designInfo.stamp,
				dspk: designInfo.dspk,
				sec: designInfo.sec,
			},
			pushQueue=this.store.pushQueue,vue=this.$vue,_this=this
		this.store.jsonCopy=JSON.stringify(vue.$store.getters.getPagesJson)
		this.store.designCopy={
			bleed:vue.$store.getters.getIsBleed,
			title:vue.$store.getters.getDesignTitle,
			pageIdList:JSON.parse(JSON.stringify(vue.$store.getters.getPageIdList))
		}

		for(let k in info) {

			if(info[k] == undefined) {
				delete info[k]
			}
		}
		this.designInfo=info
		let saveImmediately=null


		this.update=(cb)=>{
			if(this.uploading)
				return (saveImmediately=typeof cb==='function'?cb:true)
			if(pushQueue.length>0)
				_saveDesign.call(this,cb)
		}

		let eJson=[] //准备要保存的数据
		let isCreateDesign=false
		let timeOut=null
		let elemCallBackQueue=[]
		let pageCallBackQueue=[]

		this.setInElemCallBackQueue=(cb)=>{
			if(cb&&typeof cb==='function')
				elemCallBackQueue.push(cb)
		}

		this.setInPageCallBackQueue=(cb)=>{
			if(cb&&typeof cb==='function')
				pageCallBackQueue.push(cb)
		}

		//保存元素级操作
		ws.addCallBack(4,res=>{
			if(res&&res.code!==null){
				switch (res.code){
					case 1:
						this.uploadStatus=1
						this.uploading=false
						eJson=[]
						this.pushQueueLength=this.store.pushQueue.length
						//判断是否为初次保存
						if(isCreateDesign){
							let arr=[]
							for(let k in res.pageJsonIds){
								arr[k|0]=res.pageJsonIds[k]
							}
							this.vuexActions().setPageIdList[0](arr)
							this.store.designCopy.pageIdList=arr
							isCreateDesign=false
						}
						let callBack=elemCallBackQueue.shift()
						if(callBack&&typeof callBack==='function')
							callBack()
						if(saveImmediately&&typeof saveImmediately==='function'){
							_saveDesign(saveImmediately)
						}else if(saveImmediately){
							_saveDesign()
						}
						saveImmediately=null
						break
					case -403:
						if(this.vuexGetters().getUserInfo) {
							this.vuexActions().setErrorShow[0](8)
						}
						break
					default:
						//失败后重新加入队列
						let Json=[]
						eJson=JSON.parse(JSON.stringify(eJson))
						eJson.forEach(j=>{
							Json.push({type:1,j})
						})
						eJson=[]
						this.store.pushQueue.unshift(Json)
						this.uploadStatus=res.code
						this.uploading=false
				}
			}
			setTimeoutToSave()
		})

		//保存page级操作
		ws.addCallBack(5,res=>{
			if(res&&res.code!==null){
				switch (res.code){
					case 1:
						let pageIds=[]
						for(let i in res.pageJsonIds){
							pageIds[i|0]=res.pageJsonIds[i]
						}
						this.vuexActions().setPageIdList[0](pageIds)
						this.store.designCopy.pageIdList=pageIds
						this.uploadStatus=1
						this.uploading=false
						eJson=[]
						this.pushQueueLength=this.store.pushQueue.length
						let callBack=pageCallBackQueue.shift()
						if(callBack&&typeof callBack==='function')
							callBack()
						if(saveImmediately&&typeof saveImmediately==='function'){
							_saveDesign(saveImmediately)
						}else if(saveImmediately){
							_saveDesign()
						}
						saveImmediately=null
						break
					case -1:
					case -2:
					case -3:
					default:
						//失败后重新加入队列
						let Json=[]
						eJson=JSON.parse(JSON.stringify(eJson))
						eJson.forEach(j=>{
							Json.push({type:2,j})
						})
						eJson=[]
						this.store.pushQueue.unshift(Json)
						this.uploadStatus=res.code
						this.uploading=false
				}
			}
			setTimeoutToSave()
		})
		//保存设计（用于初级创建设计
		this.saveDesign=(f)=>{
			isCreateDesign=true
			if(f){
				ws.send({
					reqtype:4,
					params:{
						dt:info.dt,
						ow:info.ow,
						oh:info.oh,
						mp:info.mp,
						k:info.k,
						kt:info.kt,
						sec:info.sec,
						dspk:info.dspk,
						ob:this.store.designCopy.bleed?1:0,
						t:info.t,
						tt:info.tt,
						stamp:info.stamp
					}
				})
			}else {
				this.isLogin=false
				this.setIsLogin=(v)=>{
					this.isLogin=v
				}
				// dataHandle.setIsLogin&&dataHandle.setIsLogin(v)
				this._define(this,'isLogin',isLogin=>{
					if(isLogin===true){
						setTimeout(()=>{
							ws.send({
								reqtype:4,
								params:{
									dt:info.dt,
									ow:info.ow,
									oh:info.oh,
									mp:info.mp,
									k:info.k,
									kt:info.kt,
									sec:info.sec,
									dspk:info.dspk,
									ob:this.store.designCopy.bleed?1:0
								}
							})
						},2000)
					}
				})
			}
		}

		setTimeoutToSave()

		function testPushQueue(eJson){
			eJson.map(j=>{
				if(j['page_id']===0){
					j['page_id']=_this.store.designCopy.pageIdList[0]
				}
			})
		}
		/**
		 * 保存请求
		 * @param pushQueue
		 */
		function _saveDesign(callback) {
			if(_this.store.pushQueue.length===0)
				return
			_this.uploadStatus=0
			_this.uploading=true

			for (let i=0;i<_this.store.pushQueue.length;){
				if(_this.store.pushQueue[0].type===1){
					eJson.push(..._this.store.pushQueue.shift().j)
				}else {
					break
				}
			}
			if(eJson.length>0){
				testPushQueue(eJson)
				ws.send({
					reqtype:4,
					params:{
						dspk:info.dspk,
						eJson
					}
				})
			}else {
				let eJson = [_this.store.pushQueue.shift()]
				switch (eJson[0].type){
					case 2:
						let data={}
						data={
							reqtype:5,
							params:{
								...eJson[0].j[0],
								width:parseFloat(_this.designInfo.ow),
								height:parseFloat(_this.designInfo.oh)
							}
						}
						ws.send(data)
						break
					case 3:
						_this.$vue.$http.post('/design/modifyDesignBasicInfo',{d:info.d,...eJson[0].j[0]})
							.then(res=>{
								switch (res.data.body.code){
									case 1:
										_this.uploadStatus=1
										_this.uploading=false
										_this.pushQueueLength=_this.store.pushQueue.length
										if(eJson[0].j[0].hasOwnProperty('ow')||eJson[0].j[0].hasOwnProperty('oh')){
											_this.store.undoQueue=[]
											_this.store.redoQueue=[]
											console.log('clear undo&&redo Queue!')
										}
										eJson=[]
										if(saveImmediately&&typeof saveImmediately==='function'){
											_saveDesign(saveImmediately)
										}else if(saveImmediately){
											_saveDesign()
										}
										saveImmediately=null
										break
									case -1:
									case -2:
									case -3:
									default:
										//失败后重新加入队列
										let Json=[]
										eJson=JSON.parse(JSON.stringify(eJson))
										eJson.forEach(j=>{
											Json.push({type:3,j})
										})
										eJson=[]
										_this.store.pushQueue.unshift(Json)
										_this.uploadStatus=res.code
										_this.uploading=false
								}
								setTimeoutToSave()
							},err=>{

							})
						break
				}
			}
			callback&&pageCallBackQueue.push(callback)
			if(_this.store.pushQueue.length!==0)
				pageCallBackQueue.push(_saveDesign)
		}

		/**
		 * 设定每5秒上传一次，上传队列中所有更改
		 */
		function setTimeoutToSave() {
			if(timeOut===null)
				timeOut=window.setTimeout(()=>{
					// return                          //暂时关闭
					//判断是否登录
					timeOut=null
					if(isCreateDesign)
						return setTimeoutToSave()
					if(!_this.vuexGetters().getIsLogin)
						return setTimeoutToSave()

					if(_this.uploading)
						return setTimeoutToSave()
					// setTimeoutToSave()

					if(_this.store.pushQueue.length>0){
						_saveDesign()
					}else {
						setTimeoutToSave()
					}

				},5000)
		}

	}

	addIsUploadCallBack(cb){
		if(cb&&typeof cb === 'function'){
			this.uploadingCallBackQueue.push(cb)
		}else {
			console.warn('cb is not function')
		}
	}
	addUploadStatusCallBack(cb){
		if(cb&&typeof cb === 'function'){
			this.uploadStatusCallBackQueue.push(cb)
		}else {
			console.warn('cb is not function')
		}
	}
	addPushQueueLengthCallBack(cb){
		if(cb&&typeof cb === 'function'){
			this.pushQueueLengthCallBackQueue.push(cb)
		}else {
			console.warn('cb is not function')
		}
	}
	//
	// /**
	//  * 绑定上传状态回调
	//  * @param cb
	//  */
	// isUploadCallBack(cb){
	// 	// cb&&this._define(this,'uploading',cb)
	// 	if(cb&&typeof cb ==='function'){
	//
	// 	}
	// }
	//
	// /**
	//  * 绑定上传状态回调
	//  * @param cb
	//  */
	// uploadStatusCallBack(cb){
	// 	// cb&&this._define(this,'uploadStatus',cb)
	// }
	//
	// /**
	//  * 绑定上传队列回调
	//  * @param cb
	//  */
	// pushQueueLengthCallBack(cb){
	// 	// cb&&this._define(this,'pushQueueLength',cb)
	// }

	/**
	 * commit
	 * @param {String} type
	 * @param {Object}event
	 *        event:{
   *          pageIndex:[String],
   *          eleIndex:[String],
   *          key:[String],
   *          value:[String,Object]
   *          eventType:[String]
   *        }
	 */
	commit(type,event){
		let {commitQueue} = this.store,
			{pageIndex,eleIndex,key,value,eventType,pageId}=event
		let reIndex=_find(commitQueue,{type,pageIndex,eleIndex,key})
		let pageList=JSON.parse(JSON.stringify(this.store.designCopy.pageIdList))
		if(reIndex>=0)
			_dereplicate(reIndex)
		console.log({type,pageIndex,eleIndex,key,value,eventType,pageId,pageList})
		commitQueue.push({type,pageIndex,eleIndex,key,value,eventType,pageId,pageList})
		if(key!=='material_id'&&eventType!==5&&key!=='id')
			this.vuexActions().setTemplateChange[0](true)
		return this
		/**
		 * 数组去重
		 * @param i
		 * @private
		 */
		function _dereplicate(i) {
			commitQueue.splice(i,1)
			i=_find(commitQueue,{type,pageIndex,eleIndex,key})
			if(i>=0){
				_dereplicate(i)
			}
		}

		/**
		 * 查询数组中重复项的索引，每次查询只返回一个索引最大的项索引
		 * @param {Array} arr
		 * @param {Object} limit
		 * @return {number}
		 */
		function _find(arr,limit){
			let index=-1
			arr.forEach((e,i)=>{
				let flag=true
				Object.keys(limit).forEach(k=>{
					if(e[k]!==limit[k])
						flag=false
				})
				if(flag)
					index=i
			})
			return index
		}
	}

	/**
	 * 生成一步操作，清空commit队列并推到上传和撤销队列中
	 */
	push(disable=false){
		let {commitQueue,undoQueue,pushQueue,jsonCopy,redoQueue} = this.store
		if(!disable)
			commitQueue.map(this._getOldJson.bind(this))

		let commitsStr=this._push(commitQueue)

		this.store.commitQueue=[]

		this.store.jsonCopy=JSON.stringify(this.getJson())
		this.store.designCopy={
			bleed:this.$vue.$store.getters.getIsBleed,
			title:this.$vue.$store.getters.getDesignTitle,
			pageIdList:JSON.parse(JSON.stringify(this.$vue.$store.getters.getPageIdList))
		}
		if(!disable)
			undoQueue.push(commitsStr)
		this.store.redoQueue=[]
	}

	/**
	 * 内部方法_push
	 * @param commits
	 * @private
	 */
	_push(commits){
		let {pushQueue} = this.store,_this=this
		let  commitsStr=JSON.stringify(commits)

		let pushData=this._transformJson(JSON.parse(commitsStr))

		// pushQueue.push(JSON.stringify(pushData))
		pushQueue.push(...pushData)
		// console.log(pushData)
		this.pushQueueLength=pushQueue.length

		setDesignSaveTime(commits)
		return commitsStr

		function setDesignSaveTime(commits) {
			commits.forEach(v=>{
				if(v.type==='page'&&(v.eventType===2||v.eventType===3||v.eventType===0))
					return
				_this.vuexActions().setDesignSaveTime[0](Date.now())
			})
		}
	}

	/**
	 * 撤销
	 * @return {number}
	 */
	undo(){
		let {undoQueue,redoQueue} = this.store
		if(undoQueue.length===0) return 0
		let something = JSON.parse(undoQueue.pop()).reverse(),redos=[]

		something.forEach(e=>{
			redos.push(this._reverseCommit(e))
		})

		//dosomething
		dataDispatch(JSON.stringify(redos))

		this.store.jsonCopy=JSON.stringify(this.getJson())
		this.store.designCopy={
			bleed:this.$vue.$store.getters.getIsBleed,
			title:this.$vue.$store.getters.getDesignTitle,
			pageIdList:JSON.parse(JSON.stringify(this.$vue.$store.getters.getPageIdList))
		}

		this._push(redos)
		redoQueue.push(JSON.stringify(redos))
		return undoQueue.length
	}

	/**
	 * 重做
	 * @return {number}
	 */
	redo(){
		let {undoQueue,redoQueue} = this.store
		if(redoQueue.length===0) return 0
		let something = [...JSON.parse(redoQueue.pop())].reverse(),undos=[]

		something.forEach(e=>{
			undos.push(this._reverseCommit(e))
		})

		//dosomething
		dataDispatch(JSON.stringify(undos))

		this.store.jsonCopy=JSON.stringify(this.getJson())
		this.store.designCopy={
			bleed:this.$vue.$store.getters.getIsBleed,
			title:this.$vue.$store.getters.getDesignTitle,
			pageIdList:JSON.parse(JSON.stringify(this.$vue.$store.getters.getPageIdList))
		}

		this._push(undos)
		undoQueue.push(JSON.stringify(undos))
		return redoQueue.length
	}

	/**
	 * 将每一次细粒度操作的状态相互调换（即：value oldValue 相互调换）
	 * 每种不同类型操作置换都不同
	 * @param type
	 * @param pageIndex
	 * @param eleIndex
	 * @param value
	 * @param oldValue
	 * @param key
	 * @param eventType
	 * @return {{type: *, eventType: *, key: *}}
	 * @private
	 */
	_reverseCommit({type,pageIndex,eleIndex,value,oldValue,key,eventType,pageId,oldPageId}){
		let data={}
		switch (type){
			case 'element':data=_reverseElement(pageIndex,eleIndex,value,oldValue,eventType);break
			case 'page':data=_reversePage(pageIndex,value,oldValue,eventType,pageId,oldPageId);break
			case 'group':data=_reverseGroup(pageIndex,eleIndex,value,oldValue,eventType);break
			case 'design':data=_reverseDesign(key,value,oldValue,eventType);break
		}
		return {
			type,
			eventType,
			key,
			...data
		}

		/**
		 * 将Design调换状态
		 * @param key
		 * @param value
		 * @param oldValue
		 * @param eventType
		 * @return {{key: *, value: *, oldValue: *, eventType: *}}
		 * @private
		 */
		function _reverseDesign(key,value,oldValue,eventType){
			return {
				key,
				value:oldValue,
				oldValue:value,
				eventType
			}
		}

		/**
		 * 将Element调换状态
		 * @param pageIndex
		 * @param e:eleIndex
		 * @param v:value
		 * @param o:oldValue
		 * @param t:eventType
		 * @return {{pageIndex: *, eleIndex: *, value: *, oldValue: *, eventType: *}}
		 * @private
		 */
		function _reverseElement(pageIndex,e,v,o,t) {
			let eleIndex,value,oldValue,eventType
			switch (t){
				case 0:
					eleIndex=e
					value=null
					oldValue=v
					eventType=3
					break
				case 1:
					eleIndex=e
					value=o
					oldValue=v
					eventType=1
					break
				case 2:
					eleIndex=e
					value=o
					oldValue=v
					eventType=2
					break
				case 3:
					eleIndex=e
					value=o
					oldValue=null
					eventType=0
					break
				case 4:
					eleIndex=v
					value=o
					oldValue=v
					eventType=4
					break
				case 5:
					value=o
					oldValue=v
					eventType=5
					break
			}
			return{pageIndex,eleIndex,value,oldValue,eventType}
		}

		/**
		 * 将Page调换状态
		 * @param p:pageIndex
		 * @param v:value
		 * @param o:oldValue
		 * @param t:eventType
		 * @return {{pageIndex: *, eleIndex: *, value: *, oldValue: *, eventType: *, pageId: *,oldPageId: *}}
		 * @private
		 */
		function _reversePage(p,v,o,t,pi,op) {
			let pageIndex,eleIndex,value,oldValue,eventType,pageId,oldPageId
			switch (t){
				case 0:
					pageIndex=p
					value=null
					oldValue=v
					eventType=3
					pageId=op
					oldPageId=pi
					break
				case 1:
					pageIndex=p
					value=o
					oldValue=v
					eventType=1
					pageId=op
					oldPageId=pi
					break
				case 2:
					pageIndex=v
					value=o
					oldValue=v
					eventType=2
					break
				case 3:
					pageIndex=p
					value=o
					oldValue=null
					eventType=0
					pageId=op
					oldPageId=pi
					break
			}
			return{pageIndex,eleIndex,value,oldValue,eventType,pageId,oldPageId}
		}

		/**
		 * 将Group调换状态
		 * @param pageIndex
		 * @param eleIndex
		 * @param v:value
		 * @param o:oldValue
		 * @param t:eventType
		 * @return {{pageIndex: *, eleIndex: *, value: *, oldValue: *, eventType: *}}
		 * @private
		 */
		function _reverseGroup(pageIndex,eleIndex,v,o,t) {
			let value,oldValue,eventType
			switch (t){
				case 0:
					value=o
					oldValue=v
					eventType=3
					break
				case 1:
					value=o
					oldValue=v
					eventType=1
					break
				case 3:
					value=o
					oldValue=v
					eventType=0
					break
			}
			return{pageIndex,eleIndex,value,oldValue,eventType}
		}

	}

	/**
	 *
	 * @return {DataHandle}
	 */
	test(){
		return this
	}

	/**
	 * 获取pageJson 无参时默认焦点页
	 * @param p
	 */
	getPageJson(p){
		let pageIndex=p!==undefined?p:this.$vue.$store.getters.getFocusPageIndex
		return this.getJson()[pageIndex]
	}

	/**
	 * 获取所有画布的pageJson
	 */
	getPagesJson(p){
		return this.getJson()
	}

	/**
	 * 获取elementJson 无参时默认焦点元素
	 * @param p
	 * @param e
	 * @return {*}
	 */
	getEleJson(p,e){
		let pageIndex=p!==undefined?p:this.$vue.$store.getters.getFocusPageIndex,
			eleIndex=e!==undefined?e:this.$vue.$store.getters.getFocusElemIndex
		return this.getJson()[pageIndex].elems[eleIndex]
	}

	/**
	 * @return vuex.getters 返回getters
	 */
	vuexGetters(){
		return this.$vue.$store.getters
	}

	/**
	 * @return vuex.actions 返回actions
	 */
	vuexActions(){
		return this.$vue.$store._actions
	}

	/**
	 * 获取旧的状态
	 * @param e
	 * @private
	 */
	_getOldJson(e){
		let {type,pageIndex,eleIndex,key,value,eventType,pageId}=e,
			oldValue=null,{jsonCopy}=this.store,jsonCopyd=JSON.parse(jsonCopy),oldPageId=null
		switch (type){
			case 'element':oldValue=this._getElementOldValue({pageIndex,eleIndex,key,eventType,jsonCopyd});break
			case 'page':
				let oldPage=this._getPageOldValue({pageIndex,key,eventType,jsonCopyd,pageId})
				oldValue=oldPage.oldValue
				oldPageId=oldPage.oldPageId
				break
			case 'group':oldValue=this._getGroupOldValue({pageIndex,value,eleIndex,key,eventType,jsonCopyd});break
			case 'design':oldValue=this._getDesignOldValue(key);break
		}

		let data={type,pageIndex,eleIndex,key,value,eventType,oldValue,pageId,oldPageId}
		Object.keys(data).forEach(k=>{
			e[k]=data[k]
		})
	}

	_getDesignOldValue(key){
		if(key==='wh'){
			return null
		}
		return this.store.designCopy[key]
	}

	/**
	 * 获取Element旧的状态
	 * @param pageIndex
	 * @param eleIndex
	 * @param key
	 * @param eventType
	 * @param jsonCopyd
	 * @return {{}}
	 * @private
	 */
	_getElementOldValue({pageIndex,eleIndex,key,eventType,jsonCopyd}){
		let oldValue={}
		switch (eventType){
			case 0:oldValue=null;break
			case 1:

			case 2:
				if(eleIndex!==undefined){
					if(testIsThisKeyNotInElem(key)){
						oldValue=jsonCopyd[pageIndex].elems[eleIndex][key]
					}else {
						oldValue=jsonCopyd[pageIndex].elems[eleIndex]['data-elem'][key]
					}
				}else {
					oldValue=jsonCopyd[pageIndex].elems[key]
				}
				break
			case 3:oldValue=jsonCopyd[pageIndex].elems[eleIndex];break
			case 4:oldValue=eleIndex;break
			case 5:
				oldValue=jsonCopyd[pageIndex]
				break
		}
		// console.log()
		return oldValue
	}

	/**
	 * 获取Page旧的状态
	 * @param pageIndex
	 * @param key
	 * @param eventType
	 * @param jsonCopyd
	 * @return {{}}
	 * @private
	 */
	_getPageOldValue({pageIndex,key,eventType,jsonCopyd,pageId}){
		let oldValue={},oldPageId
		switch (eventType){
			case 0:
				oldValue=null;
				oldPageId=0
				break
			case 1:
				if(pageIndex!==undefined){
					oldValue=jsonCopyd[pageIndex][key]
				}else {
					oldValue=jsonCopyd[key]
					oldPageId=this.store.designCopy.pageIdList[pageIndex]
				}
				break
			case 2:oldValue=pageIndex;break
			case 3:
				oldValue=jsonCopyd[pageIndex]
				oldPageId=pageId
				break
		}
		return {oldValue,oldPageId}
	}

	/**
	 * 获取Group旧的状态
	 * @param pageIndex
	 * @param eleIndex
	 * @param key
	 * @param eventType
	 * @param jsonCopyd
	 * @return {{}} OldValue groupValue
	 * @private
	 */
	_getGroupOldValue({pageIndex,eleIndex,key,eventType,jsonCopyd}){
		let oldValue={},newJson=this.getJson()
		switch (eventType){
			case 0:
				oldValue = null
				break
			case 1:
			case 2:
				oldValue = jsonCopyd[pageIndex].elegroups[eleIndex][key]
				break
			case 3:
				oldValue = jsonCopyd[pageIndex].elegroups[eleIndex]
				break
		}

		return oldValue

		/**
		 * 获取当前group的element索引及其内容，已搁置(传入数据会有)
		 * @param j
		 * @return {Array}
		 * @private
		 */
		function _getGroupEleValue(j) {
			let eleArray=[]
			j[pageIndex].elems.forEach((e,i)=>{
				if(e.group===eleIndex){
					eleArray.push({eleIndex:i,groupData:{"group-transform":e["transform"],"group":e.group}})
				}
			})
			return eleArray
		}
	}

	/**
	 * 转换操作步骤为eJson
	 * @param arr
	 * @private
	 */
	_transformJson(arr){
		let json=[],{pageIdList}=this.store.designCopy,_this=this
		arr.forEach(e=>{
			let {type}=e
			switch (type){
				case 'element':json.push({type:1,j:_transformElement(e)});break
				case 'page':json.push({type:2,j:_transformPage(e)});break
				case 'group':json.push({type:1,j:_transformGroup(e)});break
				case 'design':json.push({type:3,j:_transformDesign(e)});break
			}
		})

		return json

		function _transformDesign({key,value}){
			let eJson={}
			switch (key){
				case 'title':
					eJson.dt=value
					break
				case 'wh':
					eJson.ow=value.ow
					eJson.oh=value.oh
					break
				// case 'height':
				// 	eJson.oh=value
				// 	break
				case 'bleed':
					eJson.bleed=value
					break
			}
			return[eJson]
		}

		/**
		 * 将Element的变动数据转换成eJson
		 * @param pageIndex
		 * @param eleIndex
		 * @param key
		 * @param value
		 * @param eventType
		 * @return {[null]}
		 * @private
		 */
		function _transformElement({pageIndex,eleIndex,key,value,eventType}) {
			let eJson={'page_id':pageIdList[pageIndex],'loc':'','cont':[]}
			switch (eventType){
				case 0:
					eJson['loc']=`elems]`
					eJson['cont'].push({
						type:0,
						key:eleIndex,
						val:value
					})
					break
				case 1:
				case 2:
					if(eleIndex!==undefined){
						eJson['loc']=`elems]${eleIndex}]`
						eJson['cont'].push({
							type:(value!==undefined&&value!==null)?0:3,
							key:key,
							val:value,
							cLoc:testIsThisKeyNotInElem(key)?"":"data-elem]"
						})
					}else {
						eJson['loc']=`elems]`
						eJson['cont'].push({
							type:1,
							key:key,
							val:value,
						})
					}
					break
				case 3:
					eJson['loc']=`elems]`
					eJson['cont'].push({
						type:3,
						key:eleIndex,
						cLoc:""
					})
					break
				case 4:
					eJson['loc']=`elems]`
					eJson['cont'].push({
						type:2,
						key:eleIndex,
						cLoc:"",
						tidx:value
					})
					break
				case 5:
					console.log(pageIndex)
					eJson['loc']=''
					eJson['cont'].push({
						type:1,
						key:'elems',
						val:value['elems']
					},{
						type:1,
						key:'elegroups',
						val:value['elegroups']
					})
					break
			}
			return [eJson]
		}

		/**
		 * 将Page的变动数据转换成eJson
		 * @param pageIndex
		 * @param key
		 * @param value
		 * @param eventType
		 * @return {[null]}
		 * @private
		 */
		function _transformPage({pageIndex,key,value,eventType,pageId}) {
			let eJson
			let arr,obj,cover_detail=[]
			switch (eventType){
				case 0:
					obj={}
					arr=pageIdList
					console.log(pageIdList)
					if(indexOfArray(arr,0)>-1){
						if(indexOfArray(arr,0)===pageIndex){
							// break
						}else{

						}
					}else {
						arr.splice(pageIndex,0,0)
					}
					arr.forEach((e,i)=>{
						obj[i]=e
					})
					obj=arr.join(',')
					console.log(pageId)
					if(pageId!==0){
						cover_detail=[
							{
								"id":pageId,
								"page_no":pageIndex,
								"type":1
							}
						]
					}else{
						cover_detail=[]
					}
					eJson={
						page_ids:obj,
						cover_detail
					}
					console.log(JSON.parse(JSON.stringify(eJson)))
					break
				case 1:
					obj={}
					arr=pageIdList
					arr.forEach((e,i)=>{
						obj[i]=e
					})
					obj=arr.join(',')
					if(pageId!==0){
						cover_detail=[
							{
								"id":pageId,
								"page_no":pageIndex,
								"type":1
							}
						]
					}else{
						cover_detail=[]
					}
					eJson={
						page_ids:obj,
						cover_detail
					}
					break
				case 2:
					// eJson['loc']=`pages]`
					// eJson['cont'].push({
					// 	type:2,
					// 	key:pageIndex,
					// 	cLoc:"",
					// 	tidx:value
					// })
					arr=pageIdList
					obj={}
					let ids=arr.splice(pageIndex,1)
					arr.splice(value,0,...ids)
					arr.forEach((e,i)=>{
						obj[i]=e
					})
					obj=arr.join(',')
					eJson={
						page_ids:obj,
						cover_detail:[]
					}
					break
				case 3:
					// eJson['loc']=`pages]`
					// eJson['cont'].push({
					// 	type:3,
					// 	key:pageIndex,
					// 	cLoc:""
					// })
					arr=pageIdList
					obj={}
					arr.splice(pageIndex,1)
					// arr.splice(value,0,...ids)
					arr.forEach((e,i)=>{
						obj[i]=e
					})
					obj=arr.join(',')
					eJson={
						page_ids:obj,
						cover_detail:[]
					}
					break
			}
			if(Object.prototype.toString.call(eJson)==='[object Array]'){
				return eJson
			}else {
				return [eJson]
			}
		}

		/**
		 * 将Group的变动数据转换成eJson
		 * @param pageIndex
		 * @param eleIndex
		 * @param key
		 * @param value
		 * @param eventType
		 * @param oldValue
		 * @return {Array}
		 * @private
		 */
		function _transformGroup({pageIndex,eleIndex,key,value,eventType,oldValue}) {
			let eArr=[]
			switch (eventType){
				case 0:
					eArr.push({
							'page_id':pageIdList[pageIndex],
							'loc':`elegroups]`,
							'cont':[
								{
									type:0,
									key:eleIndex,
									val:value
								}
							]
						}
					)

					break
				case 1:
				case 2:
					eArr.push({
						'page_id':pageIdList[pageIndex],
						'loc':`elegroups]${eleIndex}]`,
						'cont':[
							{
								type:1,
								key:key,
								val:value
							}
						]
					})
					break
				case 3:
					eArr.push({
						'page_id':pageIdList[pageIndex],
						'loc':`elegroups]`,
						'cont':[
							{
								type:3,
								key:eleIndex,
								// val:{
								// 	"transform":"translate(0,0)"
								// }
							}
						]
					})

					break
			}
			return eArr
		}
	}

	/**
	 * object监听
	 * @param obj
	 * @param key
	 * @param fc
	 * @private
	 */
	_define(obj,key,fc){
		let val,_this=this
		Object.defineProperty(obj,key,{
			enumerable: true,
			configurable: true,
			get: ()=>val,
			set:newVal=> {
				var value =  val
				if (newVal === value) {
					return
				}
				val = newVal
				fc.call(_this,newVal)
			}
		})
	}

}

function indexOfArray(arr,value) {
	let index=-1
	arr.forEach((val,i)=>{
		if(val===value)
			index=i
	})
	return index
}

const dataHandle=new DataHandle()
// dataHandle.__proto__=DataHandle

export default dataHandle
