<template>
  <div id="leftPanel-font">
    <div class="leftPanel-font-content" v-ss-scroll="scrolling" ref="dom">
      <div class="leftPanel-font-showType" v-if="teamId>0">
        <span class="selectTextBlock" :class="{active:fontType===0}" @click="fontType=0">默认文字</span>
        <span class="selectTextBlock" :class="{active:fontType===1}" @click="fontType=1">团队文字</span>
      </div>
      <div class="leftPanel-font-default" v-show="fontType===0">
        <div class="leftPanel-font-default-c">
          <span class="large" @click="addText($event,25)">添加标题文字</span>
        </div>
        <div class="leftPanel-font-default-c">
          <span class="middle" @click="addText($event,19)">添加副标题文字</span>
        </div>
        <div class="leftPanel-font-default-c">
          <span class="small" @click="addText($event,13)">添加正文文字</span>
        </div>
      </div>
      <div class="leftPanel-font-team" v-if="fontType===1">
        <span v-for="(f,i) in teamFonts" :key="i" @click="addText($event,19,f.fn)">{{f.in}}</span>
        <div class="nothing" v-if="fontType===1&&teamFonts.length===0">
          <span>当前没有预设文字可前往团队设置进行添加</span><br/>
          <a href="/teammanage" target="_blank">点击前往团队设置</a>
        </div>
      </div>
      <div class="leftPanel-font-fonts" :style="{paddingBottom:loading?'120px':'0'}">
        <waterfall
          waterfallWidth="280"
          :propData="propData"
        >
          <template scope="waterfall">
            <item
              :data="waterfall.listData"
              @select="e=>{showMoreCtrl(e,waterfall.listData)}"
              :showMore="waterfall.listData.sourceData.showMore"
              type="font"
            ></item>
          </template>
        </waterfall>
        <div class="leftPanel-result-loading"
             v-show="loading"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
	import {searchAllMaterialsByKind} from '../searchAllMaterialsByKind'
	import waterfall from 'ss-waterfall'
	import item from '../material/comp/resultsBlock.vue'
	import {_throttle} from 'common/common'
	import {mapGetters, mapActions} from 'vuex'
	import pageEle from 'dataBus/pageEle'
	import pageHandle from 'dataBus/page'
	import dataHandle from 'common/dataHandle'

	let {addElement, setElementJson}=pageEle

	export default{
		name:'leftPanel-font',
		data(){
			return{
				resultData:[],
				pageNo:1,
				pageTotal:1,
				loading:false,
				throttled:{},
				propData:[],
				fontType:0,
				teamFonts:[]
			}
		},
		methods:{
			...mapActions({
				setElementDataReady:'setLeftPanelElementReady',
				setElementData:'setLeftPanelElementData',
				setMessageShow:'setMessageShow'
			}),
			getData(f,s,n){
				this.loading=true
				searchAllMaterialsByKind({firstKindId:f,secondKindId:s,pageNo:n,pageSize:10})
					.then(res=>{
						if(res.data.body&&res.data.body.cacheUrl){
							this.$http.get(res.data.body.cacheUrl).then(({data})=>{
								let result=data.body.result
								this.pageTotal=result.pageTotal
								this.loading=false
								this.resultData.push(...(result.recordData))
							},err=>{
								this.setMessageShow({placeHolder:'网络出错',kind:'error'})
								console.log('网络出错')
							})
						}
					},err=>{
						this.setMessageShow({placeHolder:'网络出错',kind:'error'})
						console.log('网络出错')
					})
			},
			getTeamFonts(){
				this.$http.post('/team/getTeamFonts',{tid:this.teamId})
					.then(res=>{
						if(res.data.body){
							this.teamFonts=res.data.body.fonts
						}
					},err=>{
						console.log('获取团队文字失败，网络出错')
					})
			},
			addText(e,size,f="Microsoft YaHei"){
				let data={
					"data-type": "text",
					"data-elem": {
						"opacity": 1,
						"shadow":{
							"blur":30,
							"offset":50,
							"opacity":0.25,
							"show":false
						},
						"width": e.target.offsetWidth / this.pageScale,
						"w": e.target.offsetWidth / this.pageScale,
						"height": e.target.offsetHeight / this.pageScale,
						"font-size": size / this.pageScale,
						"fs": size / this.pageScale,
						"font-family": f,
						"fill": "#000",
						"wspace": "0",
						"wsp": "0",
						"data-align": "center",
						"vspace": "200",
						"vsp": "200",
						"data-decoration": "false",
						"data-bold": 0,
						"data-italic": "false"
					},
					"html": "双击修改",
					"transform": `translate(${this.pageCenter.left-e.target.offsetWidth/this.pageScale/2},${this.pageCenter.top-e.target.offsetHeight/this.pageScale/2})`,
					"group": '',
					"group-transform": '',
					"reverse": "",
					"v": "1.0.1"
				};
				switch (size) {
					case 25:
						data["data-elem"].id = "-1";
						break;
					case 19:
						data["data-elem"].id = "-2";
						break;
					case 13:
						data["data-elem"].id = "-3";
						break;
				}
				pageHandle.elementBlur()
				this.$nextTick(()=>{
					let event = addElement(data,undefined,undefined,undefined,true);
					dataHandle.commit('element',event).push();
				})
//				this.setElementData({data,imgUrl:null})
//				this.setElementDataReady({t:Date.now(),flag:true})
			},
			scrolling(e,p){
				this.throttled.apply(this,[e,p])
			},
			scrollExec(e,p){
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
		},
		beforeMount(){
			this.throttled=_throttle(this.scrollExec,200)
			if(this.teamId>0)
				this.getTeamFonts()
		},
		mounted(){
			if(this.getLeftPanelIndex===3)
				this.getData(null,133,this.pageNo)
		},
		computed:{
			...mapGetters({
				pageScale:'getPageScale',
				pageWidth:'getPageWidth',
				pageHeight:'getPageHeight',
				teamId:'getTeamId',
				leftPanelIndex:'getLeftPanelIndex',
        pageCenter:'getPageCenter'
			})
		},
		components:{
			waterfall,item
		},
		watch:{
			leftPanelIndex(){
				if(this.leftPanelIndex===3&&this.resultData.length===0)
					this.getData(null,133,this.pageNo)
      },
			fontType(){
				if(this.fontType===1)
					this.getTeamFonts()
			},
			pageNo(v,o){
				if(v>0&&o>0)
					this.getData(null,133,this.pageNo)
			},
			resultData(){
				let array=[]
				this.resultData.forEach((e,i)=>{
					array[i]={...e,width:e.img_ori_width,height:e.img_ori_height,index:i,showMore:false}
				})
				this.propData=array
			},
			propData(){
				this.$nextTick(()=>{
					if(this.$refs.dom.lastChild.offsetHeight===0) return
					let T=this.$refs.dom.lastChild.offsetHeight+this.$refs.dom.lastChild.offsetTop-this.$refs.dom.offsetHeight
					if(T<=0&&this.pageNo<this.pageTotal){
						this.pageNo+=1
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
  @import '../common';

  #leftPanel-font{
    overflow: hidden;

    .leftPanel-font-content{
      width: 312px;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      padding: 72px 16px 0 16px;
      margin: 0;
      overflow-y: auto;
      overflow-x: hidden;
      text-align: center;

      .leftPanel-font-showType{
        width: 312px;
        height: 32px;
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

      .leftPanel-font-default{
        width: 100%;
        text-align: center;
        height: 116px;
        margin-bottom: 40px;

        .leftPanel-font-default-c{
          width: 100%;

          span{
            margin-top: 16px;
            color: #626262;
            display: inline-block;
            /*width: 100%;*/
            cursor: pointer;

            &:hover{
              color: #07AEFC;
            }
            &[class~='large']{
              font-size: 28px;
            }
            &[class~='middle']{
              font-size: 18px;
            }
            &[class~='small']{
              font-size: 12px;
            }
          }
        }

      }

      .leftPanel-font-team{
        width: 100%;
        text-align: center;
        height: 116px;
        margin-bottom: 40px;
        overflow-y: auto;

        &>span{
          margin-top: 16px;
          color: #626262;
          display: inline-block;
          width: 100%;
          cursor: pointer;
          font-size: 18px;

          &:hover{
            color: #07AEFC;
          }
        }

        .nothing{
          width: 100%;
          text-align: center;
          font-size: 14px;
          color: #626262;
          margin: 32px 0 0 0;

          &>span{
            line-height: 28px;
          }

          &>a{
            cursor: pointer;
            color: #07AEFC;
            text-decoration: blink;
          }
        }

      }

      .leftPanel-font-fonts{
        position: relative;
        transform: translate(0,0);

        /*.leftPanel-font-fonts-item{*/
        /*position: absolute;*/
        /*display: block;*/
        /*overflow: hidden;*/
        /*transition: all .3s ease;*/
        /*cursor: pointer;*/

        /*!*&:hover{*!*/
        /*!*box-shadow: 0 4px 8px 0 rgba(0,0,0,.16);*!*/
        /*!*}*!*/

        /*&>img{*/
        /*display: block;*/
        /*width: 100%;*/
        /*height: 100%;*/
        /*}*/
        /*}*/

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
</style>