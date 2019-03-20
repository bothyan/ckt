/**
 * created by suti
 */
import dataDispatch from './dataDispatch'

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
				title:vue.$store.getters.getDesignTitle
			},

		}
		this.getJson=()=>{
			return vue.$store.getters.getPagesJson
		}

	}

	update(){
		console.log('error:: 没有初始化保存')
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
				sec: designInfo.sec
			},
			pushQueue=this.store.pushQueue,vue=this.$vue,_this=this
		this.store.jsonCopy=JSON.stringify(vue.$store.getters.getPagesJson)
		this.store.designCopy={
			bleed:vue.$store.getters.getIsBleed,
			title:vue.$store.getters.getDesignTitle
		}

		for(let k in info) {
			if(info[k] == undefined)
				delete info[k];
		}
		this.uploading=false
		this.uploadStatus=0
		this.pushQueueLength=pushQueue.length

		this.update=()=>{
			if(!this.uploading) return
			if(pushQueue.length>0)
				saveDesignV4.call(this,pushQueue)
		}

		setTimeoutToSave()

		/**
		 * 保存请求
		 * @param pushQueue
		 */
		function saveDesignV4(pushQueue) {
			_this.uploading=true
			let eJson=[]
			pushQueue.forEach(j=>{
				eJson.push(...JSON.parse(j))
			})
			//判断是否为修改标题，如果是修改标题，给info.dt赋值
			eJson.forEach(j=>{
				if(j['loc']===''){
					j['cont'].forEach(c=>{
						if(c['key']==='title'){
							info.dt=c['val']
						}
						if(c['key']==='width'){
							info.ow=c['val']+info.ow.slice(-2)
						}
						if(c['key']==='height'){
							info.oh=c['val']+info.oh.slice(-2)
						}
					})
				}
			})
			console.log(info)
			info.eJson = JSON.stringify(eJson)
			vue.$http.post('/design/saveDesignV4',info)
				.then(({data})=>{
					if(data.body){
						switch (data.body.code){
							case 1:
								// if(pushQueue.length>0){
								// 	saveDesignV4(pushQueue)
								// 	_this.pushQueueLength=pushQueue.length
								// }else {
								_this.uploadStatus=1
								_this.uploading=false
								_this.store.pushQueue=[]
								_this.pushQueueLength=_this.store.pushQueue.length
								// }
								break
							case -1:
							case -101:
							case -102:
							case -104:
							case -4:
							case -106:
							case -108:
							case -110:
							case -403:
							default:
								_this.uploadStatus=data.body.code
								_this.uploading=false
							// pushQueue.unshift(eJson)
							// saveDesignV4(pushQueue)
						}
						setTimeoutToSave()            //全部上传完成后隔5秒再调用一次
					}
				},err=>{
					//上传失败打回来上传一次
					// pushQueue.unshift(eJson)
					saveDesignV4(_this.store.pushQueue)
					_this.uploadStatus=0
				})
		}

		/**
		 * 设定每5秒上传一次，上传队列中所有更改
		 */
		function setTimeoutToSave() {

			window.setTimeout(()=>{
				// return                          //暂时关闭
				//判断是否登录
				if(!_this.vuexGetters().getIsLogin)
					return setTimeoutToSave()

				if(_this.uploading)
					return setTimeoutToSave()
				// setTimeoutToSave()

				if(_this.store.pushQueue.length>0){
					saveDesignV4(_this.store.pushQueue)
				}else {
					setTimeoutToSave()
				}

			},5000)
		}

	}

	/**
	 * 绑定上传状态回调
	 * @param cb
	 */
	isUploadCallBack(cb){
		cb&&this._define(this,'uploading',cb)
	}

	/**
	 * 绑定上传状态回调
	 * @param cb
	 */
	uploadStatusCallBack(cb){
		cb&&this._define(this,'uploadStatus',cb)
	}

	/**
	 * 绑定上传队列回调
	 * @param cb
	 */
	pushQueueLengthCallBack(cb){
		cb&&this._define(this,'pushQueueLength',cb)
	}

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
			{pageIndex,eleIndex,key,value,eventType}=event
		let reIndex=_find(commitQueue,{type,pageIndex,eleIndex,key})
		if(reIndex>=0)
			_dereplicate(reIndex)

		commitQueue.push({type,pageIndex,eleIndex,key,value,eventType})
		if(key!=='material_id')
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
	push(){
		let {commitQueue,undoQueue,pushQueue,jsonCopy,redoQueue} = this.store
		commitQueue.map(this._getOldJson.bind(this))

		let commitsStr=this._push(commitQueue)

		this.store.commitQueue=[]

		this.store.jsonCopy=JSON.stringify(this.getJson())
		this.store.designCopy={
			bleed:this.$vue.$store.getters.getIsBleed,
			title:this.$vue.$store.getters.getDesignTitle
		}

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

		pushQueue.push(JSON.stringify(pushData))
		this.pushQueueLength=pushQueue.length
		// this.vuexActions().setDesignSaveTime[0](Date.now())

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
			title:this.$vue.$store.getters.getDesignTitle
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
			title:this.$vue.$store.getters.getDesignTitle
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
	_reverseCommit({type,pageIndex,eleIndex,value,oldValue,key,eventType}){
		let data={}
		switch (type){
			case 'element':data=_reverseElement(pageIndex,eleIndex,value,oldValue,eventType);break
			case 'page':data=_reversePage(pageIndex,value,oldValue,eventType);break
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
			}
			return{pageIndex,eleIndex,value,oldValue,eventType}
		}

		/**
		 * 将Page调换状态
		 * @param p:pageIndex
		 * @param v:value
		 * @param o:oldValue
		 * @param t:eventType
		 * @return {{pageIndex: *, eleIndex: *, value: *, oldValue: *, eventType: *}}
		 * @private
		 */
		function _reversePage(p,v,o,t) {
			let pageIndex,eleIndex,value,oldValue,eventType
			switch (t){
				case 0:
					pageIndex=p
					value=null
					oldValue=v
					eventType=3
					break
				case 1:
					pageIndex=p
					value=o
					oldValue=v
					eventType=1
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
					break
			}
			return{pageIndex,eleIndex,value,oldValue,eventType}
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
		let {type,pageIndex,eleIndex,key,value,eventType}=e,
			oldValue=null,{jsonCopy}=this.store,jsonCopyd=JSON.parse(jsonCopy)
		switch (type){
			case 'element':oldValue=this._getElementOldValue({pageIndex,eleIndex,key,eventType,jsonCopyd});break
			case 'page':oldValue=this._getPageOldValue({pageIndex,key,eventType,jsonCopyd});break
			case 'group':oldValue=this._getGroupOldValue({pageIndex,value,eleIndex,key,eventType,jsonCopyd});break
			case 'design':oldValue=this._getDesignOldValue(key);break
		}

		let data={type,pageIndex,eleIndex,key,value,eventType,oldValue}
		Object.keys(data).forEach(k=>{
			e[k]=data[k]
		})
	}

	_getDesignOldValue(key){
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
	_getPageOldValue({pageIndex,key,eventType,jsonCopyd}){
		let oldValue={}
		switch (eventType){
			case 0:oldValue=null;break
			case 1:
				if(pageIndex!==undefined){
					oldValue=jsonCopyd[pageIndex][key]
				}else {
					oldValue=jsonCopyd[key]
				}
				break
			case 2:oldValue=pageIndex;break
			case 3:oldValue=jsonCopyd[pageIndex];break
		}
		return oldValue
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
		let json=[]
		arr.forEach(e=>{
			let {type,pageIndex,eleIndex,key,value,eventType}=e
			switch (type){
				case 'element':json.push(..._transformElement(e));break
				case 'page':json.push(..._transformPage(e));break
				case 'group':json.push(..._transformGroup(e));break
				case 'design':json.push(..._transformDesign(e));break
			}
		})

		return json

		function _transformDesign({key,value}){
			return[
				{
					loc:'',
					cont:[
						{
							type:1,
							key,
							val:value
						}
					]
				}
			]
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
			let eJson={'loc':'','cont':[]}
			switch (eventType){
				case 0:
					eJson['loc']=`pages]${pageIndex}]elems]`
					eJson['cont'].push({
						type:0,
						key:eleIndex,
						val:value
					})
					break
				case 1:
				// if(eleIndex!==undefined){
				// 	eJson['loc']=`pages]${pageIndex}]elems]${eleIndex}]`
				// 	eJson['cont'].push({
				// 		type:1,
				// 		key:key,
				// 		val:value,
				// 		cLoc:testIsThisKeyNotInElem(key)?"":"data-elem]"
				// 	})
				// }else {
				// 	eJson['loc']=`pages]${pageIndex}]elems]`
				// 	eJson['cont'].push({
				// 		type:1,
				// 		key:key,
				// 		val:value,
				// 	})
				// }
				// break
				//warning!!! 修改element的translate，rotate同属于类型2移动元素
				case 2:
					if(eleIndex!==undefined){
						eJson['loc']=`pages]${pageIndex}]elems]${eleIndex}]`
						eJson['cont'].push({
							type:value?0:3,
							key:key,
							val:value,
							cLoc:testIsThisKeyNotInElem(key)?"":"data-elem]"
						})
					}else {
						eJson['loc']=`pages]${pageIndex}]elems]`
						eJson['cont'].push({
							type:1,
							key:key,
							val:value,
						})
					}
					break
				case 3:
					eJson['loc']=`pages]${pageIndex}]elems]`
					eJson['cont'].push({
						type:3,
						key:eleIndex,
						cLoc:""
					})
					break
				case 4:
					eJson['loc']=`pages]${pageIndex}]elems]`
					eJson['cont'].push({
						type:2,
						key:eleIndex,
						cLoc:"",
						tidx:value
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
		function _transformPage({pageIndex,key,value,eventType}) {
			let eJson={'loc':'','cont':[]}
			switch (eventType){
				case 0:
					eJson['loc']=`pages]`
					eJson['cont'].push({
						type:0,
						key:pageIndex,
						val:value
					})
					break
				case 1:
					if(pageIndex!==undefined){
						eJson['loc']=`pages]${pageIndex}]`
						eJson['cont'].push({
							type:1,
							key,
							val:value,
							// cLoc:"data-elem]"
						})
					}else {
						eJson['loc']=`pages]`
						eJson['cont'].push({
							type:1,
							key,
							val:value,
						})
					}
					break
				case 2:
					eJson['loc']=`pages]`
					eJson['cont'].push({
						type:2,
						key:pageIndex,
						cLoc:"",
						tidx:value
					})
					break
				case 3:
					eJson['loc']=`pages]`
					eJson['cont'].push({
						type:3,
						key:pageIndex,
						cLoc:""
					})
					break
			}
			return [eJson]
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
							'loc':`pages]${pageIndex}]elegroups]`,
							'cont':[
								{
									type:0,
									key:eleIndex,
									val:value
								}
							]
						}
						// ,{
						// 	'loc':`pages]${pageIndex}]elegroups]${eleIndex}]`,
						// 	'cont':[
						// 		{
						// 			type:1,
						// 			key,
						// 			val:value.groupValue
						// 		}
						// 	]
						// },..._listElementInGroup(value,false)
					)

					break
				case 1:
				case 2:
					eArr.push({
						'loc':`pages]${pageIndex}]elegroups]${eleIndex}]`,
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
						'loc':`pages]${pageIndex}]elegroups]`,
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

			/**
			 * 修改Group时要同时修改Group内的相关数据，所以需要这个
			 * @param va
			 * @param del
			 * @return {Array}
			 * @private
			 */
			function _listElementInGroup(va,del) {
				let arr=[]
				va.groupElem.forEach(e=>{
					if(del){
						arr.push({
							'loc':`pages]${pageIndex}]elegroups]${e.eleIndex}]`,
							'cont':[
								{
									type:3,
									key:'group',
								},
								{
									type:3,
									key:'group-transform',
								}
							]
						})
					}else {
						arr.push({
							'loc':`pages]${pageIndex}]elegroups]${e.eleIndex}]`,
							'cont':[
								{
									type:0,
									key:'group',
									val:e.groupData.group
								},
								{
									type:0,
									key:'group-transform',
									val:e.groupData['group-transform']
								}
							]
						})
					}

				})
				return arr
			}
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


const dataHandle=new DataHandle()
// dataHandle.__proto__=DataHandle

export default dataHandle
