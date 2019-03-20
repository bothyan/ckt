<template>
  <div id="leftPanel-background">
    <div class="leftPanel-background-content" v-ss-scroll="scrolling" ref="dom">
      <div class="leftPanel-background-showType" v-if="teamId>0">
        <span class="selectTextBlock" :class="{active:colorsPanelType===0}" @click="colorsPanelType=0">默认色板</span>
        <span class="selectTextBlock" :class="{active:colorsPanelType===1}" @click="colorsPanelType=1">团队色板</span>
      </div>
      <div
        class="leftPanel-background-colors"
        ref="color"
      >
        <!--@mouseenter="colorPanelEnter"-->
        <!--@mouseleave="colorPanelLeave"-->
        <span
          class="leftPanel-background-colors-items add-color"
          @click="showColorPicker"
          v-if="colorsPanelType===0"
          title="取色器"
        ></span>
        <span
          class="leftPanel-background-colors-items transparent"
          @click="setBackgroundColor('transparent')"
          v-if="colorsPanelType===0"
          title="透明"
        ></span>
        <span
          class="leftPanel-background-colors-items"
          v-for="e in (colorsPanelType===0?colors:teamColors)"
          :style="{background:e}"
          :title="e"
          @click="setBackgroundColor(e)"
        >
           <!--@mouseenter="setBackgroundColorOnce(e)"-->
        </span>
        <div class="nothing" v-if="colorsPanelType===1&&teamColors.length===0">
          <span>当前没有预设颜色可前往团队设置进行添加</span><br/>
          <a href="/teammanage" target="_blank">点击前往团队设置</a>
        </div>
      </div>
      <div class="leftPanel-background-custom">
        <div class="leftPanel-background-custom-top">
          <upload
            :ctrl="uploadBackgroundCtrl"
            :multiple="false"
            id="uploadBackground"
            @progress="uploadImageProgressCtrl"
            @uploadSuccess="uploadImageSuccess"
            @uploadFail=""
            @uploadStart="uploadStart"
            @uploadEnd="uploading=false"
          ></upload>
          <span @click="uploadFunc">
            {{uploading?uploadStr:'自定义背景'}}
          </span>
          <p>点击色块或素材即可更改背景。若无发生变化，请检查是否被上层图片所遮盖。</p>
        </div>
        <div class="leftPanel-background-custom-con" :style="{paddingBottom:loading?'120px':'0'}">
          <waterfall
            waterfallWidth="280"
            :propData="propData"
          >
            <template scope="waterfall">
              <item
                :data="waterfall.listData"
                @select="e=>{showMoreCtrl(e,waterfall.listData)}"
                :showMore="waterfall.listData.sourceData.showMore"
                type="background"
                @postData="setBackgroundImage"
              ></item>
            </template>
          </waterfall>
          <div class="leftPanel-result-loading"
               v-show="loading"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
	import waterfall from 'ss-waterfall'
	import item from '../material/comp/resultsBlock.vue'
	import upload from '../upload/comp/uploadFunc.vue'
	import {searchAllMaterialsByKind} from '../searchAllMaterialsByKind'
	import {_throttle} from 'common/common'
	import {mapGetters,mapActions} from 'vuex'
	import {colorTranform} from 'components/colorPicker/comp/colorTranform'
	import pageEle from 'dataBus/pageEle'
	import pageHandle from 'dataBus/page'
	import dataHandle from 'common/dataHandle'
	import {elementJsonHandle} from 'common/common'
	import leftPanel from 'dataBus/leftPanel'

	const defaultColors=[
		'#000000','#242424','#484848','#6C6C6C','#909090','#B4B4B4','#D8D8D8','#FFFFFF',
		'#FF7768','#FFEE00','#DBFF58','#A0FFB1','#9FE0FF','#8AAAE0','#B39CFF','#FFCED0',
		'#E60112','#FFCD00','#8CC319','#09E51E','#1CADBA','#00A1EC','#8957A1','#FB9C9F',
		'#D6340D','#F39800','#4C8E00','#009B00','#00489E','#0568B7','#5F1985','#E4004E',
		'#A40001','#EC6100','#475B00','#015420','#001C57','#1F005D','#510047','#800043',
	]

	const _ct=colorTranform()

	let {setElementJson}=pageEle
	let {dragElementPreviewImg,dragElementImgInfo}=leftPanel

	export default{
		name:'leftPanel-background',
		data(){
			return{
				colors:[],
				colorsPanelType:0,
				resultData:[],
				pageNo:1,
				pageTotal:1,
				loading:false,
				throttled:{},
				propData:[],
				uploadBackgroundCtrl:false,
				uploading:false,
				uploadProgress:0,
				isChange:false,
				oldValue:null
//        uploadStr:''
			}
		},
		components:{
			waterfall,item,upload
		},
		methods:{
			uploadFunc(){
				if(this.isLogin&&!this.uploading){
					document.getElementById('uploadBackground').click()
				}
			},
			getData(n,p){
				this.loading=true
				searchAllMaterialsByKind({secondKindId:2,pageNo:n,pageSize:10})
					.then(res=>{
						if(res.data.body&&res.data.body.cacheUrl){
							this.$http.get(res.data.body.cacheUrl).then(({data})=>{
								let result=data.body.result
								this.pageTotal=result.pageTotal
								this.loading=false
								if(p){
									this.resultData.push(...(result.recordData))
								}else {
									this.resultData=result.recordData
								}
							},err=>{
								this.setMessageShow({placeHolder:'网络出错',kind:'error'})
								console.log('网络出错,get:',res.data.body.cacheUrl)
							})
						}
					},err=>{
						this.setMessageShow({placeHolder:'网络出错',kind:'error'})
						console.log('网络出错,post')
					})
			},
			scrolling(e,p){
				this.throttled.apply(this,[e,p])
			},
			scrollExec(e,p){
				if(this.colorPickerIsShow){
					this.setColorPickerShow({cancel:true})
				}
				let sT=p.scrollTop,
					T=this.$refs.dom.lastChild.offsetHeight+this.$refs.dom.lastChild.offsetTop-this.$refs.dom.offsetHeight
				if(sT>16){
					this.$emit('searchBlock',{s:1,d:[]})
				}else {
					this.$emit('searchBlock',{s:0,d:[]})
				}
				if(sT+5>=T&&!this.loading&&this.pageNo<this.pageTotal){
					this.pageNo+=1
				}
			},
			showMoreCtrl(el,{index}){
				let array=[]
				this.resultData.forEach((e,i)=>{
					array[i]={...e,width:e.img_ori_width,height:e.img_ori_height,index:i,showMore:(index===i?el:false)}
				})
				this.propData=array
			},
			showColorPicker(e){
				pageHandle.elementBlur()
				this.$nextTick(()=>{
					let _this=this
					let colorHex='ffffff'
					if(dataHandle.getEleJson(this.focusPageIndex,0)['data-elem']['data-colors']){
						let colorRGB=dataHandle.getEleJson(this.focusPageIndex,0)['data-elem']['data-colors'][0]
						if(colorRGB.indexOf('#')>-1){
							colorHex=colorRGB
						}else {
							let colorRGBarr=colorRGB.split('(')[1].split(')')[0].split(',')
							let colorRGBobj={r:colorRGBarr[0]|0,g:colorRGBarr[1]|0,b:colorRGBarr[2]|0}
							colorHex=_ct.RGBToHex(_ct.fixRGB(colorRGBobj))
						}
					}
					this.colorPickerIsShow||this.setColorPickerShow({
						isShow:true,
						DefaultColor:colorHex,
						invoke:'background',
						position:{left:'370px',top:this.$refs.color.offsetTop+'px'}
					})
				})

			},
			colorPanelEnter(){
				this.oldValue=dataHandle.getEleJson(this.focusPageIndex,0)
			},
			colorPanelLeave(){
				setElementJson(this.oldValue,this.focusPageIndex,0)
			},
			setBackgroundColor(c){
				let rgb={},rgbArr=[],opacity=1,data={}
				if(c==='transparent'){
					if(this.isVip!==2){
						this.setErrorShow(4)
						return
					}
					opacity=0
					rgbArr={0:`rgb(${rgb.r},${rgb.g},${rgb.b})`}
				}else {
					rgb=_ct.HexToRGB(c)
					opacity=1
					rgbArr={0:`rgb(${rgb.r},${rgb.g},${rgb.b})`}
				}
				data={
					'data-type':'background',
					'data-elem':{
						'data-colors':rgbArr,
						opacity,
						'data-key':'false',
						'width':this.pageWidth,
						'height':this.pageHeight,
					},
          'transform':'translate(0,0)'
				}
				pageHandle.elementBlur()
				setElementJson(data,this.focusPageIndex,0)
				dataHandle.commit('element',{
					eventType:1,
					pageIndex:this.focusPageIndex,
					key:0,
					value:data
				}).push()
			},
			setBackgroundColorOnce(c){
				this.isChange=false
				let rgb={},rgbArr=[],opacity=1,data={}
				if(c==='transparent'){
					opacity=0
					rgbArr={0:`rgb(${rgb.r},${rgb.g},${rgb.b})`}
				}else {
					rgb=_ct.HexToRGB(c)
					opacity=1
					rgbArr={0:`rgb(${rgb.r},${rgb.g},${rgb.b})`}
				}
				data={
					'data-type':'background',
					'data-elem':{
						'data-colors':rgbArr,
						opacity,
						'data-key':'false',
						'width':this.pageWidth,
						'height':this.pageHeight,
					},
          'transform':'translate(0,0)'
				}
				pageHandle.elementBlur()
				setElementJson(data,this.focusPageIndex,0)
			},
			setBackgroundImage({data,imgUrl}){
				let scale=data["data-elem"].width/data["data-elem"].height,jscale=this.pageWidth/this.pageHeight,
					bgW=this.pageWidth,bgH=this.pageHeight
				if(jscale>scale){
					bgW=this.pageWidth
					bgH=this.pageWidth/scale
				}else {
					bgH=this.pageHeight
					bgW=this.pageHeight*scale
				}
				dragElementPreviewImg.setImgUrl(imgUrl)
				dragElementImgInfo={
					width:data['imgWidth'],
					height:data['imgHeight'],
					id:data['id'],
					'data-key':data['data-key']
				}
				data['data-elem']['lock']=true
				data['data-elem']['width']=bgW
				data['data-elem']['height']=bgH
				data['viewBox']=`0 0 ${data["data-elem"].width} ,${data["data-elem"].height}`
				data.transform=`translate(${-(bgW-this.pageWidth)/2},${-(bgH-this.pageHeight)/2})`
				data['data-elem']['filter']={brightness:0,contrast:0,saturation:0,tint:0,gaussianBlur:0,crossProcess:0}
				data=elementJsonHandle(data)
				pageHandle.elementBlur()
//				console.log(JSON.stringify(data))
				setElementJson(data,this.focusPageIndex,0)
				dataHandle.commit('element',{
					eventType:1,
					pageIndex:this.focusPageIndex,
					key:0,
					value:data
				}).push()
			},
			uploadStart(){
				this.uploading=true
				this.uploadProgress=0
			},
			uploadImageSuccess({dt,mid,w,h,fid,ik,url,id}){
				this.uploading=false
				console.log(w,h)
				let scale=w/h,jscale=this.pageWidth/this.pageHeight,
					bgW=this.pageWidth,bgH=this.pageHeight
				if(jscale>scale){
					bgW=this.pageWidth
					bgH=this.pageWidth/scale
				}else {
					bgH=this.pageHeight
					bgW=this.pageHeight*scale
				}
				let data={
					'data-type':'background',
					'data-img-kind':dt,
					'data-elem':{
						'id':mid,
//						'data-key':ik,
						'width':bgW,
						'height':bgH,
						'imgWidth':w,
						'imgHeight':h,
//            'dataImgUrl':url,
						'opacity':1,
						'viewBox':`0 0 ${w} ${h}`,
						'lock':true,
						'filter':{brightness:0,contrast:0,saturation:0,tint:0,gaussianBlur:0,crossProcess:0}
					},
					transform:`translate(${-(bgW-this.pageWidth)/2},${-(bgH-this.pageHeight)/2})`
				}
				data=elementJsonHandle(data)
				setElementJson(data,this.focusPageIndex,0)
				dataHandle.commit('element',{
					eventType:1,
					pageIndex:this.focusPageIndex,
					key:0,
					value:data
				}).push()
			},
			uploadImageProgressCtrl({progress,id}){
				this.uploadProgress=progress
			},
			...mapActions({
				setColorPickerShow:'setColorPickerShow',
				setElementData:'setLeftPanelElementData',
				setElementDataReady:'setLeftPanelElementReady',
				setMessageShow:'setMessageShow',
				setErrorShow:'setErrorShow'
			}),
		},
		beforeMount(){
			this.throttled=_throttle(this.scrollExec,200)
			let str=window.localStorage.getItem('search_background_color'),colors=[]
			str&&(colors=str.split(','))
			for(let i=0;i<6;i++){
				colors[i]?'':colors[i]='#ffffff'
			}
			let arr=[...colors,...defaultColors]
			this.colors=arr
		},
		mounted(){
			if(this.leftPanelIndex===4)
				this.getData(this.pageNo,true)
		},
		computed:{
			...mapGetters({
				colorPickerIsShow:'getColorPickerIsShow',
				colorPickerInvoke:'getColorPickerInvoke',
				colorPickerColorData:'getColorPickerColorData',
				colorPickerColorStatus:'getColorPickerColorStatus',
				isLogin:'getIsLogin',
				focusPageIndex:'getFocusPageIndex',
				pageWidth:'getPageWidth',
				pageHeight:'getPageHeight',
				pageScale:'getPageScale',
				teamId:'getTeamId',
				teams:'getTeams',
				isVip:'getIsVip',
				leftPanelIndex:'getLeftPanelIndex'
			}),
			uploadStr(){
				return `正在生成 ${this.uploadProgress}%`
			},
			teamInfo(){
				if(this.teamId>0){
					let obj=null
					this.teams.forEach(e=>{
						if(e.teamId==this.teamId){
							obj=e
						}
					})
					return obj
				}
				return null
			},
			teamColors(){
				if(this.teamInfo){
					let str=this.teamInfo.colorValue.replace(/\s*/,''),arr=[]
					str.split(',').forEach((e,i)=>{
						if(e!==''){
							arr.push(e)
						}
					})
					return arr
				}
				return []
			}
		},
		watch:{
			leftPanelIndex(){
				if(this.leftPanelIndex===4&&this.resultData.length===0)
					this.getData(this.pageNo,true)
      },
			pageNo(v,f){
				if(v>f&&f>0){
					this.getData(this.pageNo,true)
				}
			},
			resultData(){
				let array=[]
				this.resultData.forEach((e,i)=>{
					array[i]={...e,width:e.img_ori_width,height:e.img_ori_height,index:i,showMore:false}
				})
				this.propData=array
			},
			propData(){
				this.$nextTick(()=> {
					if(this.$refs.dom.lastChild.offsetHeight===0) return
					let T = this.$refs.dom.lastChild.offsetHeight + this.$refs.dom.lastChild.offsetTop - this.$refs.dom.offsetHeight
					if (T <= 0 && !this.loading && this.pageNo < this.pageTotal) {
						this.pageNo += 1
					}
				})
			},
			colorPickerColorStatus(v){
				let str=window.localStorage.getItem('search_background_color'),colors=[]
				str&&(colors=str.split(','))
				for(let i=0;i<6;i++){
					colors[i]?'':colors[i]='#ffffff'
				}
				let arr=[...colors,...defaultColors]
				this.colors=arr
				if(v===0&&this.colorPickerInvoke==='background'){
					let color=this.colorPickerColorData,colors=this.colors.slice(0,6)
					this.setBackgroundColor(color)
					colors.unshift(color)
					colors.pop()
					this.colors=[...colors,...defaultColors]
					window.localStorage.setItem('search_background_color',colors)
				}
			},
			colorPickerColorData(color){
				if(this.colorPickerInvoke==='background'&&this.colorPickerColorStatus===1)
					this.setBackgroundColorOnce(color)
			},
			uploadBackgroundCtrl(){
				pageHandle.elementBlur()
			}
		}
	}
</script>
<style lang="less" scoped>
  @import '../common';

  #leftPanel-background{
    overflow: hidden;

    .leftPanel-background-content{
      width: 312px;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      padding-top: 72px;
      overflow-y: auto;
      overflow-x: hidden;

      .leftPanel-background-showType{
        width: 100%;
        height: 32px;
        padding-left: 16px;
        box-sizing: border-box;
        margin-bottom: 16px;

        .selectTextBlock{
          width: 132px;
          margin-right: 16px;
          float: left;

          &:nth-child(2){
            margin-right: 0;
          }
        }
      }

      .nothing{
        width: 100%;
        text-align: center;
        font-size: 14px;
        color: #626262;
        margin: 32px 0;

        &>span{
          line-height: 28px;
        }

        &>a{
          cursor: pointer;
          color: #07AEFC;
          text-decoration: blink;
        }
      }

      .leftPanel-background-colors{
        width: 100%;
        padding-left: 16px;
        padding-top: 8px;
        box-sizing: border-box;
        &:after{
          content: '';
          display: block;
          clear: both;
        }
        .leftPanel-background-colors-items{
          width: 27px;
          height:27px;
          display: block;
          margin:0 9px 10px 0;
          float: left;
          box-shadow: 0 1px 4px 0 rgba(0,0,0,.16);
          cursor: pointer;
          transition: all .1s ease;

          &[class~='add-color']{
            background: url("./img/addcolor.png");
            background-size: 27px 27px;

            &:after{
              content: '';
              display: block;
              margin: 8px;
              width: 11px;
              height:11px;
              background: url("./img/addcolor-+.svg") no-repeat;
            }
          }

          &[class~='transparent']{
            background: url("./img/leftPanel-transparent.svg") no-repeat;
            background-size: 27px 27px;
          }

          &:hover{
            transform: scale(1.2);
            box-shadow: 0 2px 8px 0 rgba(0,0,0,.32);
          }

          &:nth-child(8n){
            margin: 0 0 10px 0;
          }
        }
      }

      .leftPanel-background-custom{
        margin-top: 16px;
        width: 100%;
        padding:0 12px;

        .leftPanel-background-custom-top{
          text-align: center;
          height: 82px;
          margin-bottom: 16px;

          span{
            display: inline-block;
            width: 218px;
            height: 32px;
            background: #07AEFC;
            color: #ffffff;
            font-size: 12px;
            line-height: 32px;
            text-align: center;
            margin-bottom: 16px;
            cursor: pointer;

            &:hover{
              background: linears-gradient(to bottom right, #5EA2FF, #00E3FF);
            }
          }

          p{
            margin: 0;
            padding: 0;
            color: #626262;
            font-size: 12px;
            line-height: 17px;
            text-align: left;
          }
        }

        .leftPanel-background-custom-con{
          position: relative;
          transform: translate(0,0);

          .leftPanel-result-loading{
            width: 48px;
            height:60px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 2px;
            background: url("../img/onloadMaterial.gif") no-repeat;
            background-size: 48px 60px;
          }
        }
      }

    }

  }
</style>