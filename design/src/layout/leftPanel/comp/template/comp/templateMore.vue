<template>
  <div class="leftPanel-template-more">
    <div class="leftPanel-template-more-top">
      <div class="leftPanel-template-more-top-line1">
        <span class="leftPanel-template-more-top-title">{{data.templateTitle}}</span>
        <span
          class="leftPanel-template-more-top-like"
          :class="{active:isCollected}"
          @click="doCollect"
        ></span>
      </div>
      <div class="leftPanel-template-more-top-line2">
        <span class="leftPanel-template-more-top-kind">{{data.kindTitle}}</span>
        <span class="leftPanel-template-more-top-cost" v-if="!data.hasOwnProperty('teamTemplateId')">{{data.price===0?'免费':('￥'+data.price/100)}}</span>
      </div>
    </div>
    <div class="leftPanel-template-more-mult" v-if="data.designTemplatePageCount>1">
      <img v-for="(e,i) in imgUrl" :src="e+'@272w'"
           :key="i"
           alt="" @dragstart.prevent="()=>false"
           @click="clickFunc(i)"
           :class="{large}"
      >
      <!--<span>缩略图未生成</span>-->
    </div>
  </div>
</template>
<script>
	import {mapActions,mapGetters} from 'vuex'
	import pageCtrl from 'dataBus/page'
	import dataHandle from 'common/dataHandle'
	import pageList from 'dataBus/pageList'
	import {getBaseLineFromTop,getTransformAttr,getLineHeightOld} from 'common/common'

	let {setPageJson,elementBlur} = pageCtrl
	let {updatePageThumb} = pageList

	export  default{
		data(){
			return{
				isCollected:false
			}
		},
		props:{
			data:{},
			collectedTemplateIdsStr:{
				default:','
			},
			showCollectedTemplates:{
				default:''
			},
			large:{}
		},
		computed:{
			imgUrl(){
				let imgUrl=[]
				if(this.data.designTemplatePageCount>1){
					for(let i=0;i<this.data.designTemplatePageCount;i++){
						imgUrl.push(this.data.designTemplateImageUrl+(i===0?'':'_'+i))
					}
				}
				return imgUrl
			},
			...mapGetters({
				focusPageIndex:'getFocusPageIndex',
				pagesJson:'getPagesJson',
				isVip:'getIsVip',
				isLogin:'getIsLogin',
				getIsBleed:'getIsBleed',
				getTemplateChange:'getTemplateChange',
				designInfo:'getDesignInfo',
				pageWidth:'getPageWidth',
				pageHeight:'getPageHeight',
				teamId:'getTeamId',
				getAllPageSaving:'getAllPageSaving'
			})
		},
		methods:{
			clickFunc(i){
				if(this.getAllPageSaving){
					this.setMessageShow({placeHolder:'画布保存中，请稍后',kind:'error'})
					return
				}
				if(this.data.price===0||this.data.hasOwnProperty('teamTemplateId')){
					this.getTemplateContent(i)
				}else {
					if(this.isLogin){
						if(this.isVip===2&&this.data.forVipFree===1){
							this.getTemplateContent(i)
						}else {
							this.$http.post('/designtemplate/hasBoughtTemplate',{t:this.data.designTemplateId})
								.then(res=>{
									if(res.data.body){
										switch (res.data.body.code){
											case 2:
											case 1:
												this.getTemplateContent()
												break
											case 0:
												this.setTemplateImgUrl([...this.imgUrl])
												this.setErrorShow(6)
												break
											case -1:
												this.setMessageShow({placeHolder:'网络出错',kind:'error'})
												break
											case -2:
												this.setMessageShow({placeHolder:'请登录',kind:'error'})
												this.showLogreg(1)
												break
										}
									}
								},err=>{
									this.setMessageShow({placeHolder:'网络出错',kind:'error'})
								})
						}
					}else {
						this.showLogreg(1)
					}
				}
			},
			getTemplateContent(i=0){
				let _this=this
				if(this.data.tempIdList&&this.data.tempIdList.length>0){
					setTempInPage(this.data.tempIdList[i])
				}else {
					let data={t:this.data.designTemplateId,tt:this.data.designTemplateId,tid:this.teamId}
					if(this.data.hasOwnProperty('teamTemplateId')){
						delete data.t
					}else{
						delete data.tt
            delete data.tid
					}
					this.$http.post('/designtemplate/listPartialJsonId',data)
						.then(res=>{
							let {code,pageJsonIds}=res.data.body,arr=[]
							switch (code){
								case 1:
									for(let key in pageJsonIds){
										arr[key|0]=pageJsonIds[key]
									}
									this.$emit('tempIdList',arr)
									break
								case -1:
									this.setMessageShow({placeHolder:'参数错误',kind:'error'})
									break
								case -2:
									this.setMessageShow({placeHolder:'权限不足',kind:'error'})
									break
							}
							if(arr.length>0){
								let _this=this
								//如果当前画布没有内容，不弹框，直接换
								console.log(this.getTemplateChange)
								setTempInPage(arr[i])
							}
						},err=>{
							this.setMessageShow({placeHolder:'网络出错',kind:'error'})
							console.log('网络出错')
						})
				}
				function setTempInPage(pageId) {
					let type=2
					if(_this.data.hasOwnProperty('teamTemplateId')){
						type=3
          }
					_this.$http.post('/design/getPartialJsonById',{type,page_ids:pageId,tid:_this.teamId})
						.then(res=>{
							if(res.data.body&&res.data.body.code==1){
								let json=JSON.parse(res.data.body.partialJsonMap[pageId])

								if(_this.pagesJson[_this.focusPageIndex].elems.length===1||!_this.getTemplateChange){
									changePageJson()
									return
								}

								_this.setDialogShow({
									title: '提示',
									content:'使用模板后，将会覆盖掉此画布上的所有现有内容哦',
									funcs: {
										confirm:changePageJson,
									}
								})

								function changePageJson() {
									elementBlur()
//							    if(_this.data.bleed&&_this.getIsBleed!==_this.data.bleed){
//								    _this.setIsBleed(_this.data.bleed)
//								    dataHandle.commit('design',{
//									    eventType:1,
//									    key:'bleed',
//									    value:_this.data.bleed,
//									    pageId:pageId
//								    })
//							    }
									let bv=0
									if(!!_this.data.bleed!==!!_this.getIsBleed){
										if(!!_this.data.bleed){
											bv=-_this.designInfo.bleedValue
										}else if(!!_this.getIsBleed){
											bv=_this.designInfo.bleedValue
										}
									}
									let hasBg=false
									json['elems'].forEach(elem=>{
										if(elem['data-type']==='background')
											hasBg=true
									})
									if(!hasBg)
										json['elems'].unshift({
											"data-type": "background",
											"data-elem": {
												"width": _this.pageWidth,
												"height": _this.pageHeight,
												"opacity": 1,
												"lock": true,
												"data-key": "false",
												"data-colors": {
													"0": "rgb(255, 255, 255)"
												},
												'filter': {
													"brightness": 0,
													"contrast": 0,
													"crossProcess": 0,
													"gaussianBlur": 0,
													"saturation": 0,
													"tint": 0
												},
												'shadow': {
													"blur": 30,
													"offset": 50,
													"opacity": 0.25,
													"show": false
												}
											}
										})
									json['elems'].map(elem=>{
										if(elem['data-type']==='background'&&elem['data-elem'].hasOwnProperty('data-colors')){
											elem['data-elem']['width']=_this.pageWidth
											elem['data-elem']['height']=_this.pageHeight
										}
										if(elem['data-type']==='text'){
											let translate=getTransformAttr(elem['transform'],'translate'),
												rotate=[]
											if(elem['transform'].indexOf('rotate') >= 0) {
												rotate=getTransformAttr(elem['transform'],'rotate')
											} else {
												rotate[0]=0
												rotate[1]=elem['data-elem'].width / 2
												rotate[2]=elem['data-elem'].height / 2
											}
											if(elem['data-elem']['id']===undefined||elem['data-elem']['id']===''){
												let h=getBaseLineFromTop(elem['data-elem']['font-size'],elem['data-elem']['font-family'])
												elem['transform']=`translate(${translate[0]},${Number.parseFloat(translate[1])+h})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`
											}
//											let vspace=elem['data-elem']['vspace']|0
//											elem['data-elem']['height']=elem['data-elem']['height']*(vspace+1200)/(vspace+1000)

											elem['data-elem']['vspace']=getLineHeightOld(elem)
										}
										if(elem['data-type']!=='background'&&bv!==0){
											let translate=getTransformAttr(elem['transform'],'translate'),
												rotate=[]
											if(elem['transform'].indexOf('rotate') >= 0) {
												rotate=getTransformAttr(elem['transform'],'rotate')
											} else {
												rotate[0]=0
												rotate[1]=elem['data-elem'].width / 2
												rotate[2]=elem['data-elem'].height / 2
											}
											elem['transform']=`translate(${Number.parseFloat(translate[0])+bv},${Number.parseFloat(translate[1])+bv})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`
										}
									})
									let correctBackground=-1
									json['elems'].map((elem,index)=>{
										if(elem['data-type']==='background'&&index!==0){
											correctBackground=index
										}
									})
									if(correctBackground>-1){
										let background=json['elems'].splice(correctBackground,1)
										json['elems'].unshift(...background)
									}
									setPageJson(json,_this.focusPageIndex)
									updatePageThumb(_this.imgUrl[i],_this.focusPageIndex)
									dataHandle.commit('element',{
										eventType:5,
										pageIndex:_this.focusPageIndex,
										value:json
									}).push()
									if(correctBackground>-1){
										dataHandle.commit('element',{
											eventType:4,
											pageIndex:_this.focusPageIndex,
											eleIndex:correctBackground,
											value:0
										}).push(true)
									}
									_this.setTemplateChange(false)
									dataHandle.update()
								}
							}
						})
				}
			},
			doCollect(){
				if(this.isCollected){
					this.$http.post('/designtemplate/cancelCollectTemplate',{ids:this.data.designTemplateId+''})
						.then(res=>{
							if(res.data.body){
								switch (res.data.body.code){
									case 1:
										this.isCollected=false
										this.setMessageShow({placeHolder:'取消收藏成功',kind:'success'})
										if(this.showCollectedTemplates===2){
											this.$emit('refresh')
										}else {
											this.$emit('refreshCollected')
										}
										break
									case 0:
										this.setMessageShow({placeHolder:'取消收藏失败',kind:'error'})
										break
									case -1:
										this.setMessageShow({placeHolder:'取消收藏失败',kind:'error'})
										break
									case -2:
										this.setMessageShow({placeHolder:'请登录',kind:'error'})
										this.showLogreg(1)
										break
								}
							}
						})
				}else {
					this.$http.post('/designtemplate/collectTemplate',{id:this.data.designTemplateId})
						.then(res=>{
							if(res.data.body){
								switch (res.data.body.code){
									case 1:
										this.isCollected=true
										this.setMessageShow({placeHolder:'收藏成功',kind:'success'})
										this.$emit('refreshCollected')
										break
									case 0:
										this.setMessageShow({placeHolder:'收藏失败',kind:'error'})
										break
									case -1:
										this.setMessageShow({placeHolder:'收藏失败',kind:'error'})
										console.log('参数有误')
										break
									case -2:
										this.setMessageShow({placeHolder:'请登录',kind:'error'})
										this.showLogreg(1)
										break
								}
							}
						})
				}
			},
			...mapActions({
				setTemplate:'setLeftPanelTemplate',
				showLogreg:'setLogregShow',
				setIndex:'setLeftPanelIndex',
				setMessageShow:'setMessageShow',
				setDialogShow:'setDialogShow',
				setIsBleed:'setIsBleed',
				setTemplateImgUrl:'setTemplateImgUrl',
				setErrorShow:"setErrorShow",
				setTemplateChange:'setTemplateChange'
			})
		},
		watch:{
			data(){
//			  this.isCollected=this.data.isCollected
			},
			collectedTemplateIdsStr(str){
				let isCollected=false
				str.split(',').forEach(v=>{
					if(v==this.data.designTemplateId)
						isCollected=true
				})
				this.isCollected=isCollected
			}
		},
		beforeMount(){
//  		this.$http.post('/designtemplate/getTemplateIdsStr',{type:2})
//        .then(res=>{
//        	let {collectedTemplateIdsStr}=res.data.body
//	        collectedTemplateIdsStr.split(',').forEach(str=>{
//	        	if(str===this.data.designTemplateId){
//              this.isCollected=true
//            }else {
//			        this.isCollected=false
//            }
//          })
//        })
			let isCollected=false
			this.collectedTemplateIdsStr.split(',').forEach(v=>{
				if(v==this.data.designTemplateId)
					isCollected=true
			})
			this.isCollected=isCollected
		}
	}
</script>
<style lang="less" scoped>
  .leftPanel-template-more{
    width: 312px;
    background: #ECECEC;
    min-height: 74px;
    box-sizing: border-box;
    padding: 16px;

    .leftPanel-template-more-top{
      width: 100%;
      height: 42px;

      .leftPanel-template-more-top-line1{
        height: 17px;
        width: 100%;

        .leftPanel-template-more-top-title{
          color: #4A4A4A;
          font-size: 12px;
          line-height: 17px;
          float: left;
        }
        .leftPanel-template-more-top-like{
          float: right;
          display: block;
          width: 14px;
          height:14px;
          background: url("../../../img/islike.svg") no-repeat 0 0;
          background-size: 14px auto;
          cursor: pointer;

          &[class~='active']{
            background: url("../../../img/islike.svg") no-repeat 0 -14px;
            background-size: 14px auto;
          }
        }
      }
      .leftPanel-template-more-top-line2{
        height: 17px;
        width: 100%;
        margin-top: 8px;

        span{
          color: #9B9B9B;
          font-size: 12px;
          line-height: 17px;
        }

        .leftPanel-template-more-top-kind{
          float: left;
        }
        .leftPanel-template-more-top-cost{
          float: right;;
        }
      }
    }

    .leftPanel-template-more-mult{
      width: 100%;

      &:after{
        content: '';
        display: block;
        clear: both;
      }

      img{
        display: block;
        width: 136px;
        float: left;
        margin-top: 8px;
        transition: all .3s ease;
        cursor: pointer;
        box-shadow:0 2px 4px 0 rgba(0,0,0,.16);

        &:hover{
          box-shadow:0 2px 4px 0 rgba(0,0,0,.32);
        }

        &:nth-child(2n-1){
          margin-right: 8px;
        }

        &[class~='large']{
          width: 280px;
          margin-right: 0 !important;
        }
      }
    }
  }
</style>