/*
 * @Author: bianhao 
 * @Date: 2017-09-07 11:46:53 
 * @Last Modified by: bianhao
 * @Last Modified time: 2017-09-22 10:35:04
 */

import dataHandle from 'common/dataHandle';
import designHandle from 'dataBus/design';
import global_config from 'config/global_config'

const webSocket = {

  /**
   * 初始化
   */
  init(tid) {
    this.ws=null
    this.reconnectCount=0
    this._define(this,this,'reconnectCount',v=>{
      if(v>3){
        if(dataHandle.vuexGetters().getMessageShow.placeHolder&&
          dataHandle.vuexGetters().getMessageShow.placeHolder.indexOf('连接不上服务器')>-1){
          return
        }
        dataHandle.vuexActions().setMessageShow[0]({placeHolder:`连接不上服务器，正在重试`,kind:'error',hideTime:6000})
        dataHandle.vuexActions().setDoStop[0](true)
      }
    })
    if(tid===0)
      tid=dataHandle.vuexGetters().getTeamId
    let api = window.api ? '&api=1' : '',
      apiToken = window.api ? '&api_token=' + dataHandle.vuexGetters().getApiToken : '';
    let ws = new WebSocket(global_config.WSDOMAIN + '/ws/design.ws?d=' + designHandle.getDesignInfo().designId + '&tid=' + tid + api + apiToken);

    this.ws = ws
    this.callBackList = []
    this.sendDataQueue = []
    this.sendFontDataQueue = []  //文字转曲队列
    this.waitDataQueue = []
    this.timeInterval=null
    this.timeOut30min=null      //30分钟延时
    this.closeFlag=false

    this.wsEvent={}

    this.wsEvent.onopen = event=> {
      console.log('websocket open!',event)
      dataHandle.vuexActions().setDoStop[0](false)
      dataHandle.vuexActions().setMessageShow[0](false)
      this.reconnecting=0
      this.reconnectCount=0
      this.timeInterval=setInterval(()=> {
        try{
          this.ws.send('ckt')
        }catch (err){
          console.error(err)
          // (!this.reconnecting)&&this.reconnect()
        }

      }, 10000);
    };

    this.wsEvent.onmessage = (event)=> {
      //ws接收信息
      let data = JSON.parse(event.data)
      switch (data.reptype){
        case 1:
          for(let i=0;i<this.waitDataQueue.length;i++){
            let waitData=JSON.parse(this.waitDataQueue[i])
            if(waitData.reqtype===1&&waitData.params.pid===data.params.pageId){
              this.waitDataQueue.splice(i,1)
              break
            }
          }
          break
        case 3:
          for(let i=0;i<this.waitDataQueue.length;i++){
            let waitData=JSON.parse(this.waitDataQueue[i])
            if(waitData.reqtype===3&&waitData.params.ele_id===data.params.ele_id){
              this.waitDataQueue.splice(i,1)
              break
            }
          }
          break
        case 4:
          for(let i=0;i<this.waitDataQueue.length;i++){
            let waitData=JSON.parse(this.waitDataQueue[i])
            if(waitData.reqtype===4){
              this.waitDataQueue.splice(i,1)
              break
            }
          }
          break
        case 5:
          for(let i=0;i<this.waitDataQueue.length;i++){
            let waitData=JSON.parse(this.waitDataQueue[i])
            if(waitData.reqtype===5){
              this.waitDataQueue.splice(i,1)
              break
            }
          }
      }

      for (let i = 0; i < this.callBackList.length; i++) {
        if(data.reptype === ~~this.callBackList[i].reptType) {
          this.callBackList[i].callBack(data.params)
        }
      }

    };

    this.wsEvent.onerror = err=>{
      //如果正在重连 return
      if(this.ws&&this.ws.readyState===0) return
      this.reconnect()
      this.sendDataQueue.unshift(...this.waitDataQueue)
      this.waitDataQueue=[]
      console.error('websocket onerror! try reconnect::',err)
    };

    this.wsEvent.onclose  = err=>{
      //如果当前状态不是open return
      if(this.reconnecting!==0||this.closeFlag) return
      this.reconnect()
      this.sendDataQueue.unshift(...this.waitDataQueue)
      this.waitDataQueue=[]
      console.error('websocket onclose! try reconnect::',err)
    };

    for(let k in this.wsEvent){
      this.ws[k]=this.wsEvent[k]
    }
    let _this=this

    setTimeoutToSend()
    //防止阻塞
    function setTimeoutToSend() {
      setTimeout(()=>{
        //文字队列去重
        _this.sendFontDataQueue=testQueue(_this.sendFontDataQueue)
        let fontData=_this.sendFontDataQueue.shift()
        //拿出一个文字，比一下发送队列里有没有
        if(
          fontData&&
          !hasFontReq(_this.waitDataQueue,JSON.parse(fontData).params.ele_id) &&
          !hasFontReq(_this.sendDataQueue,JSON.parse(fontData).params.ele_id)
        ){
          _this.sendDataQueue.push(fontData)
        }else if(fontData){
          _this.sendFontDataQueue.unshift(fontData)
        }
        if(_this.ws&&_this.ws.OPEN === 1&&_this.ws.readyState === 1){
          for(let i=0;i<_this.sendDataQueue.length;){
            let data=_this.sendDataQueue.shift()
            _this.waitDataQueue.push(data)
            try{
              _this.ws.send(data)
            }catch (err){
              console.error(err)
              break
            }
          }
        }
        setTimeoutToSend()
      },10)
    }

    function hasFontReq(arr,ele_id) {
      let has=false
      arr.forEach(f=>{
        let e=JSON.parse(f)
        if(e.reqtype===3&&e.params.ele_id===ele_id)
          has=true
      })
      return has
    }

    //整理文字请求，剔除相同的
    function testQueue(queue) {
      let array=JSON.parse(JSON.stringify(queue))
      let anotherArray=JSON.parse(JSON.stringify(queue))
      let fontArray=[]
      array.forEach((data,index)=>{
        let e=JSON.parse(data)
        if(e.reqtype===3){
          let has=false
          fontArray.map(f=>{
            if(f.ele_id===e.params.ele_id){
              has=true
              anotherArray.splice(f.index,1,null)
              f.index=index
            }
          })
          if(!has){
            fontArray.push({
              ele_id:e.params.ele_id,
              index
            })
          }
        }
      })
      let sendDataQueue=[]
      anotherArray.forEach(e=>{
        if(e!==null)
          sendDataQueue.push(e)
      })
      return sendDataQueue
    }
  },

  reconnect(f=false){
    clearInterval(this.timeInterval)
    this.reconnecting=1
    //延时3秒重发
    let reconnect=()=>{
      if(this.ws!==null&&(this.ws.readyState===0||this.ws.readyState===2))
        return
      this.ws&&this.ws.close()
      this.ws=null
      let api = window.api ? '&api=1' : '';
      let tid=dataHandle.vuexGetters().getTeamId
      let ws = new WebSocket(global_config.WSDOMAIN + '/ws/design.ws?d=' + designHandle.getDesignInfo().designId + '&tid=' + tid + api);
      this.reconnectCount+=1
      this.ws=ws
      for(let k in this.wsEvent){
        this.ws[k]=this.wsEvent[k]
      }
      console.warn('websocket reconnecting!')
    }
    if(f){
      reconnect()
    }else {
      setTimeout(reconnect,3000)
    }
  },

  /**
   * 发送数据
   * @param {String} data data
   */
  send(data){
    if(typeof data === 'object'){
      data = JSON.stringify(data)
    }
    // console.log('wsWaitingtosenddata:',data)
    if(JSON.parse(data).reqtype===3){
      this.sendFontDataQueue.push(data)
    }else {
      this.sendDataQueue.push(data)
    }
    clearTimeout(this.timeOut30min)
    if(!window.api)
      this.timeOut30min=setTimeout(()=>{
        if(this.sendDataQueue.length===0&&this.waitDataQueue.length===0){
          this.closeFlag=true
          clearInterval(this.timeInterval)
          this.ws&&this.ws.close()
          alert('您已长时间未操作页面，为了保证您的数据安全，本页面即将刷新')
          location.reload()
        }
      },30*60*1000)
  },

  /**
   * 设置回调函数
   * @param {String} reptType reptType
   * @param {fun} function 回调函数
   */
  addCallBack(reptType, callBack) {
    this.callBackList.push({
      reptType: reptType,
      callBack: callBack
    })
  },

  /**
   * 去除回调函数
   * @param {String} reptType reptType
   */
  removeCallBack(reptType) {
    let length = this.callBackList.length;
    for (let i = 0; i < length; i++) {
      if(this.callBackList[i].reptType === reptType) {
        this.callBackList.splice(i, 1)
        break
      }
    }
  },

  state() {
    return {
      OPEN: this.ws.OPEN,
      readyState: this.ws.readyState
    }
  },

  _define(_this,obj,key,fc){
    let val
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

export default webSocket;