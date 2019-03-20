<template>
  <div class="leftPanel-material-results" ref="dom">
    <div class="leftPanel-material-results-types" :style="{height:typesHeight+'px',paddingBottom:(row<2?0:24)+'px'}">
      <!--<span class="selectTextBlock">全部</span>-->
      <span
        class="selectTextBlock"
        v-for="(e,i) in types"
        :class="{active:e.active}"
        @click="$emit('selectType',i)"
      >{{e.kindTitle}}</span>
      <div class="leftPanel-material-results-types-showMore" v-show="types.length>8"
           @click="showMore=!showMore"
      >
        <span class="selectTextBlock">{{showMore?'收起更多分类':'展开更多分类'}}</span>
      </div>
    </div>
    <div
      class="leftPanel-material-results-tips"
      v-if="firstId==2"
    >
      <span>
        吸附框怎么用？
        <a href="http://bbs.chuangkit.com/forum.php?mod=viewthread&amp;tid=107" target="_blank">20s技能get√</a>
      </span>
    </div>
    <div class="leftPanel-material-results-results" ref="result">
      <waterfall
        waterfallWidth="280"
        :propData="propData"
        :maxDiff="20"
        :boxRect="boxRect"
      >
        <template scope="waterfall">
          <!---->
          <item
            :data="waterfall.listData"
            @select="e=>{showMoreCtrl(e,waterfall.listData)}"
            :showMore="waterfall.listData.sourceData.showMore"
            :type="firstId==2?'svgFrame':'material'"
            :isLine="firstId==3"
            :collectedMaterialIds="collectedMaterialIds"
            :specialItem="waterfall.listData.sourceData.specialItem"
            :hasMountedIndex="hasMountedIndex"
            @updateCollectedMaterialIds="getCollectedMaterialIds"
            @updateMountedIndex="updateMountedIndex"
          ></item>
        </template>
      </waterfall>
      <div class="leftPanel-result-nomore" v-show="pageNo===pageTotal||pageTotal===0">
        <span>素材库正在完善，敬请期待</span>
      </div>
      <div class="leftPanel-result-loading"
           v-show="loading"
      ></div>
    </div>
  </div>
</template>
<script>
	import {searchAllMaterialsByKind} from '../../searchAllMaterialsByKind'
	import waterfall from 'ss-waterfall'
	import item from './resultsBlock.vue'
  import {mapActions} from 'vuex'

	export default{
		data(){
			return{
				showMore:false,
				pageNo:1,
				pageTotal:1,
				resultData:[],
				propData:[],
				loading:false,
//				boxRect: {
//					bottom: 10,
//					right: 8
//				},
				collectedMaterialIds:',',
        hasMountedIndex:0
			}
		},
		methods:{
      updateMountedIndex(index){
        if(index>this.hasMountedIndex){
          this.hasMountedIndex=index
          this.$emit('updateData')
        }
      },
			getData(f,s,n,p){
				this.loading=true
				let obj={firstKindId:f,secondKindId:s,pageNo:n,pageSize:10}
				if(obj.secondKindId)
					delete obj.firstKindId
				searchAllMaterialsByKind(obj)
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
								console.log('网络出错')
							})
						}
					},err=>{
						this.setMessageShow({placeHolder:'网络出错',kind:'error'})
						console.log('网络出错')
					})
			},
			getCollectedMaterial(type=0,pageNo,p){
				this.$http.post('/material/getUserCollectedMaterial',{pageNo,pageSize:10,type})
					.then(({data})=>{
						let result=data.body.page
						this.pageTotal=result.pageTotal
						this.loading=false
						if(p){
							this.resultData.push(...(result.recordData))
						}else {
							this.resultData=result.recordData
						}
					},err=>{
						this.setMessageShow({placeHolder:'网络出错',kind:'error'})
						console.log('网络出错')
					})
			},
			showMoreCtrl(el,{index}){
				let array=[]
				if(this.firstId===6){
					array.push({
						width:88,
						height:88,
						specialItem:'addImg'
					})
				}
				this.resultData.forEach((e,i)=>{
					array.push({...e,width:e.img_ori_width,height:e.img_ori_height,
            index:this.firstId===6?i+1:i,showMore:(index===(this.firstId===6?i+1:i)?el:false)})
				})
				this.propData=array
			},
			getCollectedMaterialIds(){
				this.$http.post('/material/getCollectedMaterialIdsCache')
					.then(res=>{
						if(res.data.body){
							let {collectedMaterialIds}=res.data.body
							if(collectedMaterialIds)
								this.collectedMaterialIds=collectedMaterialIds
						}
					},err=>{
						this.setMessageShow({placeHolder:'网络出错',kind:'error'})
					})
			},
      ...mapActions({
	      setMessageShow:'setMessageShow'
      })
		},
		props:{
			types:{
				required:true
			},
			currentSel:{},
			firstId:{},
			position:{},
			scroll:{},
			scrollTop:{}
		},
		mounted(){
			this.$emit('resize',this.$refs.result.offsetHeight+this.typesHeight+24)
			if(this.firstId!==-1){
				this.getData(this.firstId,this.secondKindId,this.pageNo,true)
			}else {
				this.getCollectedMaterial(this.secondKindId,this.pageNo,true)
			}
		},
		computed:{
			typesHeight(){
				let {row}=this
				return this.showMore?row*40+24:row<=2?(row*40):104
			},
			row(){
				let row=
					(this.types.length)/4-(((this.types.length)/4)|0)>0?(((this.types.length)/4)|0)+1:((this.types.length)/4)|0
				return row
			},
			secondKindId(){
				let i=null
				this.types.forEach(e=>{
					if(e.active) {
						i = e.kindId
					}
				})
				return i
			},
			boxRect() {
				if(this.firstId==3){ // 细线
					return{
						bottom: 12,
						right:8
          }
        }
				return {
					bottom: 10,
					right:8
				}
			},
		},
		watch:{
			showMore(){
				this.$emit('resize',this.$refs.result.offsetHeight+this.typesHeight+24)
			},
			types(v){
				this.pageNo=1
				if(this.firstId!==-1){
					this.getData(this.firstId,this.secondKindId,this.pageNo,false)
				}else {
					this.getCollectedMaterial(this.secondKindId,this.pageNo,false)
				}
			},
			currentSel(v){
				if(v!==false){
					let row=((v+1)/4)|0+1
					this.showMore=row>2
				}
			},
			resultData(){
				let array=[]
        let {hasMountedIndex}=this
        if(this.firstId===6){
					array.push({
            width:88,
            height:88,
						specialItem:'addImg'
          })
        }
				this.resultData.forEach((e,i)=>{
					array.push({...e,width:e.img_ori_width,height:e.img_ori_height,index:this.firstId===6?i+1:i,showMore:false,hasMountedIndex})
				})
				this.propData=array
			},
			propData(){
				this.$nextTick(()=>{
					this.$emit('resize',this.$refs.result.offsetHeight+this.typesHeight+24)
					if(this.$refs.dom.offsetHeight+this.position.top<=this.position.parentHeight&&this.pageNo<this.pageTotal&&!this.loading){
						this.pageNo+=1
					}
				})
			},
			pageNo(v,o){
				if(v>o){
					if(this.firstId!==-1){
						this.getData(this.firstId,this.secondKindId,this.pageNo,true)
					}else {
						this.getCollectedMaterial(this.secondKindId,this.pageNo,true)
					}
				}
			},
			scroll(){
				if(this.pageNo<this.pageTotal&&!this.loading&&this.hasMountedIndex===(this.propData.length-1)){
					this.pageNo+=1
				}
			}
		},
		beforeMount(){
			this.getCollectedMaterialIds()
		},
		components:{
			waterfall,item
		}
	}
</script>
<style lang="less" scoped>
  @import "../../common";

  .leftPanel-material-results{
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    background: #ECECEC;
    position: relative;

    .leftPanel-material-results-types{
      width: 100%;
      height: 104px;
      position: relative;
      overflow: hidden;
      padding-bottom: 24px;
      transition: height .3s ease;
      /*box-sizing: content-box;*/

      /*&[class~='active']{*/
      /*height: auto;*/
      /*}*/

      &:after{
        content: '';
        display: block;
        clear: both;
      }

      &>span{
        width: 64px;
        float: left;
        margin-right: 8px;
        margin-bottom: 8px;
        color: #BFBFBF;

        &:nth-child(4n){
          margin-right: 0;
        }
      }

      .leftPanel-material-results-types-showMore{
        width: 100%;
        height: 24px;
        position: absolute;
        left:0;
        bottom:0;

        &>span{
          width: 100%;
          height: 100%;
          line-height: 24px;
          color: #BFBFBF;
        }
      }
    }

    .leftPanel-material-results-tips{
      margin-top: 6px;
      &>span{
        width: 100%;
        height: 17px;
        font-size: 12px;
        margin-top: 6px;
        color: #a2a2a2;
        text-align: left;

        a{
          text-decoration: none;
          color: #428bca;
          cursor: pointer;
        }
      }
    }

    .leftPanel-material-results-results{
      width: 100%;
      padding-top: 16px;
      transform: translate(0,0);

      .leftPanel-result-nomore{
        width: 100%;
        height: 24px;
        background: #FFFFff;
        text-align: center;
        line-height: 24px;
        color: #BFBFBF;
        font-size: 12px;
      }

      .leftPanel-result-loading{
        width: 48px;
        height:60px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 2px;
        background: url("../../img/onloadMaterial.gif") no-repeat;
        background-size: 48px 60px;
      }
    }

  }
</style>