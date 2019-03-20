<template>
  <div class="leftPanel-search-material" ref="dom">
    <div class="leftPanel-search-showType">
      <span class="selectTextBlock" :class="{active:ct===null}" @click="ct=null">全部</span>
      <span class="selectTextBlock" :class="{active:ct===2}" @click="ct=2">图片</span>
      <span class="selectTextBlock" :class="{active:ct===1}" @click="ct=1">图形</span>
    </div>
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
      <waterfall
        waterfallWidth="280"
        :propData="propData"
      >
        <template scope="waterfall">
          <item
            :data="waterfall.listData"
            @select="e=>{showMoreCtrl(e,waterfall.listData)}"
            :showMore="waterfall.listData.sourceData.showMore"
            type="material"
          ></item>
        </template>

      </waterfall>
      <div class="leftPanel-result-nomore" v-show="hasSearch&&!notFound&&(pageNo===pageTotal||pageTotal===0)">
        <span>素材库正在完善，敬请期待</span>
      </div>
      <div class="leftPanel-result-loading"
           v-show="loading"
      ></div>

      <div class="leftPanel-search-result-null" v-show="hasSearch&&notFound">
        <span>没有找到你搜索的内容</span><br/>
        <span>换个词搜索试试~</span>
      </div>
    </div>
  </div>
</template>
<script>
	import waterfall from 'ss-waterfall'
	import item from '../../material/comp/resultsBlock.vue'
	import {searchAllMaterialsByKind} from '../../searchAllMaterialsByKind'
  import {mapActions} from 'vuex'

	export default {
		name:'leftPanel-search-material',
		data(){
			return{
				history:[],
				resultData:[],
				ct:null,
				propData:[],
				pageNo:1,
				pageTotal:1,
				loading:false,
				hasSearch:false,
				notFound:false,
				kw:''
			}
		},
		methods:{
      ...mapActions({
	      setMessageShow:'setMessageShow'
      }),
			getHistory(){
				let str=window.localStorage.getItem('search_material_history')
				str&&(this.history=str.split(','))
			},
			setHistory(arr){
				window.localStorage.setItem('search_material_history',arr.join(','))
			},
			doSearch(k){
				console.log(k)
				this.$emit('doSearch',k)
				this.hasSearch=true
				this.kw=k
				this.resultData=[]
				try{
					this.getData()
        }catch (e){
					console.log(e)
        }
//				this.getData()

			},
			getData(){
//				this.getTestData()
//				return
				let {ct,pageNo,kw} =this
				this.loading=true
				this.$http.post('/material/queryMaterialsByWord',{word:kw,ct,pageSize:10,pageNo}).then(({data})=>{
					if(data.body){
						let result=data.body.result
						this.pageTotal=result.pageTotal
						this.loading=false
						this.resultData.push(...(result.recordData))
					}
				},err=>{
					this.setMessageShow({placeHolder:'网络出错',kind:'error'})
					console.log('网络出错')
				})
			},
			getTestData(){
				this.loading=true
				searchAllMaterialsByKind({firstKindId:7,pageNo:this.pageNo,pageSize:10})
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
			showMoreCtrl(el,{index}){
				let array=[]
				this.resultData.forEach((e,i)=>{
					array[i]={...e,width:e.img_ori_width,height:e.img_ori_height,index:i,showMore:(index===i?el:false)}
				})
				this.propData=array
			}
		},
		beforeMount(){
			this.getHistory()
			if(this.keyword.k&&this.keyword.k!==''){
				this.doSearch(this.keyword.k)
			}
		},
    change(){
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
//			search:{}
		},
		computed:{

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
//				this.doSearch(this.keyword.k)
//			},
			resultData(){
				let array=[]
				this.resultData.forEach((e,i)=>{
					array[i]={...e,width:e.img_ori_width,height:e.img_ori_height,index:i,showMore:false}
				})
				this.propData=array
				this.notFound=array.length===0
			},
			propData(){
				this.$nextTick(()=>{
					this.$emit('resize',this.$refs.dom.offsetHeight)
				})
			},
			pageNo(val,old){
				if(val>old&&old>0)
					this.getData()
			},
			loadCtrl(){
				if(this.pageNo<this.pageTotal&&!this.loading){
					this.pageNo+=1
				}
			},
			ct(){
				if(this.kw!==''){
					this.resultData=[]
					this.pageNo=1
					this.pageTotal=1
					this.getData()
				}
			},
			clearFlag(){
				this.resultData=[]
				this.propData=[]
				this.hasSearch=false
				this.pageNo=1
				this.pageTotal=1
				this.loading=false
				this.hasSearch=false
				this.notFound=false
			}
		},
		components:{
			waterfall,item
		}
	}
</script>
<style lang="less" scoped>
  @import "./searchCommon";

  .leftPanel-search-material{
    padding:0 16px;

    .leftPanel-search-result{
      margin-top: 16px;
      width: 280px;
      min-height: 62px;
      position: relative;

      .leftPanel-result-nomore{
        width: 280px;
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