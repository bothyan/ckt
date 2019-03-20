<template>
  <div class="leftPanel-search-template" ref="dom">
    <!--<div class="leftPanel-search-showType">-->
    <!--<span class="selectTextBlock" :class="{active:ct===null}" @click="ct=null">全部</span>-->
    <!--<span class="selectTextBlock" :class="{active:ct===2}" @click="ct=2">照片</span>-->
    <!--<span class="selectTextBlock" :class="{active:ct===1}" @click="ct=1">图形</span>-->
    <!--</div>-->
    <div
      class="leftPanel-search-history"
      v-show="!hasSearch"
    >
      <div class="leftPanel-search-history-title">
        历史搜索
      </div>
      <span
        class="leftPanel-search-history-item"
        v-for="e in history"
        @click="doSearch(e)"
      >
          {{e}}
        </span>
    </div>
    <div class="leftPanel-search-result">

      <div class="leftPanel-template-result-container">
        <templateBlock
          class="leftPanel-template-result-block"
          v-for="(e,i) in blockData"
          :data="e"
          :key="i"
          :state="blockState[i]"
          @click="currentBlock=i"
          @cancel="clearBlock"
          :style="{marginTop:blockStyle[i]+'px'}"
          :large="isLarge"
        ></templateBlock>
        <div class="leftPanel-result-loading"
             v-show="loading"
        ></div>
      </div>
      <transition name="result">
        <templateMore
          class="leftPanel-template-result-block-more"
          v-if="currentBlock!==null"
          :style="{top:resultTop+'px'}"
          :data="blockData[currentBlock]"
          :large="isLarge"
        ></templateMore>
      </transition>
      <div class="leftPanel-result-nomore" v-show="hasSearch&&!notFound&&(pageNo===pageTotal||pageTotal===0)">
        <span>素材库正在完善，敬请期待</span>
      </div>
      <div class="leftPanel-search-result-null" v-show="hasSearch&&notFound">
        <span>没有找到你搜索的内容</span><br/>
        <span>换个词搜索试试~</span>
      </div>

    </div>
  </div>
</template>
<script>
	import templateBlock from '../../template/comp/templateBlock.vue'
	import templateMore from '../../template/comp/templateMore.vue'
	import {mapGetters,mapActions} from 'vuex'

	let getdata={
		pageNo:1,
		pageSize:10,
		isShowMyCollectedTemplates:0,
		parentKindId:null,
		secondKindId:null,
		tagId:null,
		themeId:null,
		isOfficial:0,
//    startTime:"",
//    endTime:"",
		keywords:"",

		timeOrder:0,
		useTimesOrder:0,
		collectionTimesOrder:0,
		stickOrder:1,
		priceType:0,
		usage:null,
		time:new Date().getTime(),
	}

	export default {
		name:'leftPanel-search-template',
		data(){
			return{
				history:[],
				kw:'',
				blockData:[],
				currentBlock:null,
				blockState:[],
				blockStyle:[],
				resultTop:0,
				showCollectedTemplates:0,
				pageNo:1,
				pageTotal:1,
				loading:false,
				hasSearch:false,
				notFound:false
			}
		},
		methods:{
			...mapActions({
				showLogreg:'setLogregShow',
				setMessageShow:'setMessageShow'
			}),
			getHistory(){
				let str=window.localStorage.getItem('search_template_history')
				str&&(this.history=str.split(','))
			},
			setHistory(arr){
				window.localStorage.setItem('search_template_history',arr.join(','))
			},
			doSearch(k){
				this.$emit('doSearch',k)
				this.hasSearch=true
				this.kw=k
				this.blockData=[]
				this.getDataAllTemplates(k)
			},
			getDataAllTemplates(k){
				this.loading=true
//        this.kw
				this.$http.post('/designtemplate/getAllTemplates',{secondKindId:this.designInfo.designKindId,pageNo:1,pageSize:10,stickOrder:1,keywords:k})
					.then(res=>{
						if(res.data.body){
							if(res.data.body.cacheUrl){
								this.$http.get(res.data.body.cacheUrl).then(({data}) => {
									this.pageTotal = data.body.totalCount / 10 > 1 ?
										(((data.body.totalCount / 10) | 0) + (data.body.totalCount - ((data.body.totalCount / 10) | 0) * 10 > 0 ? 1 : 0)) : 1
									this.blockData.push(...data.body.queryDesignTemplateBeanList)
									this.loading = false
									this.notFound = this.blockData.length < 1
								},err=>{
									console.log(err)
									this.setMessageShow({placeHolder:'网络出错',kind:'error'})
                })
							}else {
								let {data}=res
								this.pageTotal = data.body.totalCount / 10 > 1 ?
									(((data.body.totalCount / 10) | 0) + (data.body.totalCount - ((data.body.totalCount / 10) | 0) * 10 > 0 ? 1 : 0)) : 1
								this.blockData.push(...data.body.queryDesignTemplateBeanList)
								this.loading = false
								this.notFound = this.blockData.length < 1
              }

						}
					},err=>{
						console.log(err)
						this.setMessageShow({placeHolder:'网络出错',kind:'error'})
          })
			},
			setBlock(i,h){
				let blockState=[],blockStyle=[];
				for (let j=0;j<this.blockData.length;j++){
					if(j===i){
						blockState.push(1)
					}else {
						blockState.push(2)
					}
				}
				this.blockState=blockState

				if(this.isLarge){
					for (let j=0;j<this.blockData.length;j++){
						if(j===i+1){
							blockStyle.push(this.resultHeight+24)
						}else {
							blockStyle.push(8)
						}
					}
					this.resultTop=(this.blockHeight+8)*(i+1)+8
					console.log(this.resultTop)
				}else {
					let row=((i/2)|0)+1
					for (let j=0;j<this.blockData.length;j++){
						if(j===row*2||j===row*2+1){
							blockStyle.push(this.resultHeight+24)
						}else {
							blockStyle.push(8)
						}
					}
					this.resultTop=(this.blockHeight+8)*row+8
				}
				this.blockStyle=blockStyle
			},
			clearBlock(){
				let blockState=[],blockStyle=[];
				for (let i=0;i<this.blockData.length;i++){blockState.push(0)}
				for (let i=0;i<this.blockData.length;i++){blockStyle.push(8)}
				this.blockState=blockState
				this.blockStyle=blockStyle
				this.currentBlock=null
			},
		},
		beforeMount(){
			this.getHistory()
      if(this.keyword.k&&this.keyword.k!==''){
        this.doSearch(this.keyword.k)
      }
		},
		props:{
			keyword:{
				type:Object,
				required:true
			},
			loadCtrl:{

			},
			clearFlag:{

			},
//			search:{
//
//      }
		},
		watch:{
			keyword(v){
        this.pageNo=1
				this.doSearch(v.k)
				this.history.unshift(v.k)
        this.history=Array.from(new Set(this.history))
				if(this.history.length>10)
					this.history.pop()
				this.setHistory(this.history)
			},
//			search(){
//				console.log(this.keyword)
//				this.doSearch(this.keyword.k)
//      },
			currentBlock(v){
				if(v!==null)
					this.setBlock(v)
			},
			pageNo(){
				this.getDataAllTemplates()
			},
			blockData(){
				this.$nextTick(e=>{
					this.$emit('resize',this.$refs.dom.offsetHeight)
				})
//				let T=this.$refs.dom.lastChild.offsetHeight+120-this.$refs.dom.offsetHeight
//				if(T<=0&&!this.loading&&this.pageNo<this.pageTotal){
//					this.pageNo+=1
//				}
			},
			loadCtrl(){
				if(this.pageNo<this.pageTotal&&!this.loading){
					this.pageNo+=1
				}
			},
			clearFlag(){
				this.hasSearch=false
				this.pageNo=1
				this.pageTotal=1
				this.loading=false
				this.hasSearch=false
				this.notFound=false
				this.clearBlock()
				this.blockData=[]
			}
		},
		computed:{
			isLarge(){
				let f=false
				if(this.blockData.length>0){
					if(parseFloat(this.blockData[0].width)/parseFloat(this.blockData[0].height)>=1.8)
						f=true
				}
				return f
			},
			blockHeight(){
				if(this.blockData.length>0){
					let w=this.isLarge?280:136
					return parseFloat(this.blockData[0].height)/parseFloat(this.blockData[0].width)*w
				}
				return 0
			},
			resultHeight(){
				let h=0
				if(this.isLarge){
					if(this.currentBlock!==null){
						if(this.blockData[this.currentBlock].designTemplatePageCount>1){
							let c=this.blockData[this.currentBlock].designTemplatePageCount
							h=74+(8+this.blockHeight)*c
						}else{
							h=74
						}
					}
					return h
				}else {
					if(this.currentBlock!==null){
						if(this.blockData[this.currentBlock].designTemplatePageCount>1){
							let c=this.blockData[this.currentBlock].designTemplatePageCount,row=((c/2)-((c/2)|0))>0?((c/2)|0)+1:((c/2)|0)
							h=74+(8+this.blockHeight)*row
						}else{
							h=74
						}
					}
					return h
				}
			},
			...mapGetters({
				teamId:'getTeamId',
				isVip:'getIsVip',
				isLogin:'getIsLogin',
				index:'getLeftPanelIndex',
				designInfo:'getDesignInfo'
			})
		},
		components:{
			templateBlock,templateMore
		},
	}
</script>
<style lang="less" scoped>
  @import "./searchCommon";

  .leftPanel-search-template{
    width: 312px;
    padding:0 !important;
    box-sizing: border-box;
    position: relative;

    .leftPanel-search-history{
      margin-left: 16px;
    }

    .leftPanel-search-result{
      position: relative;

      .leftPanel-result-nomore{
        width: 100%;
        height: 24px;
        background: #FFFFff;
        text-align: center;
        line-height: 24px;
        color: #BFBFBF;
        font-size: 12px;
      }

      .leftPanel-template-result-container{
        width: 280px;
        overflow: hidden;
        position: relative;
        margin-left: 16px;
        width:280px;
        min-height: 62px;

        &:after{
          content: '';
          display: block;
          clear: both;
        }

        .leftPanel-template-result-block{
          float: left;
          margin-top: 8px;
          transition: all .3s ease;

          &:nth-child(2n-1){
            margin-right: 8px;
          }
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
          z-index: 9;
        }
      }

      .result-enter-active, .result-leave-active {
        opacity:1;
        transition: opacity .3s ease;
      }
      .result-enter, .result-leave-to{
        opacity:0;
      }

      .leftPanel-template-result-block-more{
        position: absolute;
      }
    }
  }

</style>