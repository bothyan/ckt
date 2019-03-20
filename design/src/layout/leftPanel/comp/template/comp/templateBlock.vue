<template>
  <div
    class="leftPanel-template-block"
    :class="[
    	{single:data.designTemplatePageCount===1},
    	{mult:data.designTemplatePageCount>1},
    	{active:state===1},
    	{large}
    	]"
    @click="clickFunc()"
    :title="data.templateTitle"
    :style="{height:blockHeight+'px',transform,opacity}"
  >
    <div class="leftPanel-template-block-pop1">
      <img :src="data.designTemplateImageUrl?data.designTemplateImageUrl+'@272w':''">
    </div>
    <div class="leftPanel-template-block-pop2"></div>
    <div class="leftPanel-template-block-pop3"></div>
    <div
      class="leftPanel-template-block-pop1-hover"
      :class="{active:state===1}"
    >
      <div
        class="leftPanel-template-block-pop1-hover-button"
        @click.stop="state>0?$emit('cancel'):$emit('click')"
      ></div>
      <div
        class="leftPanel-template-block-pop1-hover-vip"
        v-show="data.forVipFree===1"
      >会员免费</div>
    </div>
  </div>
</template>
<script>
	import {mapActions,mapGetters} from 'vuex'
	import {getBaseLineFromTop,getTransformAttr,getLineHeightOld} from 'common/common'
	import pageCtrl from 'dataBus/page'
	import dataHandle from 'common/dataHandle'
	import pageList from 'dataBus/pageList'

	let {setPageJson,elementBlur} =pageCtrl
	let {updatePageThumb} = pageList

	export default{
		name:'leftPanel-template-block',
		data(){
			return{
//				status:0,
//				blockHeight:75
        transform:'',
        opacity:1
			}
		},
		props:{
			data:{},
			state:{},
			large:{
				default:false
			},
      index:{}
		},
		computed:{
			blockHeight(){
				if(this.data.height){
					let w=this.large?280:136
					let h=
						parseFloat(this.data.height)/parseFloat(this.data.width)*w
					return h
				}
				return 75
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
			clickFunc(){

				if(this.data.designTemplatePageCount===1){
          if(this.getAllPageSaving){
	          this.setMessageShow({placeHolder:'画布保存中，请稍后',kind:'error'})
            return
          }
					if(this.data.price===0||this.data.hasOwnProperty('teamTemplateId')){
						this.getTemplateContent()
					}else {
						if(this.isLogin){
							if(this.isVip===2&&this.data.forVipFree===1){
								this.getTemplateContent()
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
													this.setTemplateImgUrl([this.data.designTemplateImageUrl])
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
				}else {
					this.state>0?this.$emit('cancel'):this.$emit('click')
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
									updatePageThumb(_this.data.designTemplateImageUrl,_this.focusPageIndex)
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
    mounted(){
      this.transform='translateY(-50%)'
      this.opacity=0
      setTimeout(()=>{
        this.transform=''
        this.opacity=1
        this.$emit('updateMountedIndex',this.index)
      },60*(this.index-this.data.hasMountedIndex))
    },
	}
</script>
<style lang="less" scoped>
  .leftPanel-template-block{
    width: 136px;
    height: 75px;
    position: relative;
    cursor: pointer;
    transition: all .4s ease;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);

    &[class~='large']{
      width:280px;
    }

    &[class~='single']{
      &[class~='active']{
        box-shadow: 0 4px 8px 0 rgba(0,0,0,.16);
        .leftPanel-template-block-pop1-hover{
          display: block;
        }
      }
      &:hover{
        box-shadow: 0 4px 8px 0 rgba(0,0,0,.16);
        .leftPanel-template-block-pop1-hover{
          display: block;
        }
      }
    }

    &[class~='mult']{
      &:hover{
        .leftPanel-template-block-pop1{
          top:-3px;
          left:-3px;
          box-shadow: 0 4px 8px 0 rgba(0,0,0,.16);
        }
        .leftPanel-template-block-pop2{
          box-shadow: 0 4px 8px 0 rgba(0,0,0,.16);
        }
        .leftPanel-template-block-pop1-hover{
          display: block;
          .leftPanel-template-block-pop1-hover-button{
            display: none;
          }
        }

      }
      &[class~='active']{
        .leftPanel-template-block-pop1{
          top:-3px;
          left:-3px;
          box-shadow: 0 4px 8px 0 rgba(0,0,0,.16);
        }
        .leftPanel-template-block-pop2{
          box-shadow: 0 4px 8px 0 rgba(0,0,0,.16);
        }
        .leftPanel-template-block-pop3{
          top:3px;
          left:3px;
          box-shadow: 0 4px 8px 0 rgba(0,0,0,.16);
        }
      }
    }

    &>div[class*='leftPanel-template-block-pop']{
      position: absolute;
      width: 100%;
      height: 100%;
      top:0;
      left:0;
      transition: all .3s ease;
    }

    .leftPanel-template-block-pop1{
      z-index: 9;
      background: #ffffff;

      img{
        width: 100%;
        height: 100%;
      }
    }
    .leftPanel-template-block-pop2{
      z-index: 8;
      background: #F9F9F9;
    }
    .leftPanel-template-block-pop3{
      z-index: 7;
      background: #f6f6f6;
    }
    .leftPanel-template-block-pop1-hover{
      z-index: 11;
      display: none;
      position: relative;
      cursor: pointer;

      &[class~='active']{

        .leftPanel-template-block-pop1-hover-button{
          background: linear-gradient(90deg,#5EA2FF,#00E3FF);

          &:after{
            top: 4px;
            left: 4px;
            width: 8px;
            height:8px;
            background: url("../img/designtemplateexit.svg") no-repeat;
          }
        }

      }

      .leftPanel-template-block-pop1-hover-button{
        width: 16px;
        height: 16px;
        position: absolute;
        left:6px;
        bottom:6px;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,.16);
        transition: all .2s ease;
        &:after{
          content:'';
          position: absolute;
          top: 1px;
          left: 1px;
          width: 14px;
          height:14px;
          background: url("../../img/LeftPanel3dot.svg") no-repeat;
        }
      }
      .leftPanel-template-block-pop1-hover-vip{
        height: 16px;
        position: absolute;
        right: 6px;
        bottom:6px;
        background: #F6F6F6;
        border-radius: 8px;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,.16);
        padding: 0 4px 0 16px;
        line-height: 16px;
        font-size: 12px;
        color: #626262;
        &:after{
          content:'';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 12px;
          height:12px;
          background: url("../img/designtemplatevip.svg") no-repeat;
        }
      }

    }
  }
</style>