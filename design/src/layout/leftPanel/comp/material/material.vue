<template>
  <div id="leftPanel-material" ref="dom">
    <div class="leftPanel-material-content" v-ss-scroll="scroll" ref="scroll">
      <block
        class="leftPanel-material-content-block"
        v-for="(e,i) in blockData"
        :key="i"
        @click="selectBlock(i)"
        @cancel="clearBlock"
        :data="e"
        :state="blockState[i]"
        :style="{marginTop:blockStyle[i]+'px'}"
      ></block>
      <transition name="result">
        <results
          class="leftPanel-material-content-results"
          v-if="currentBlock!==null"
          :types="types2"
          :currentSel="typesCurrentSel"
          :position="{top:resultTop,parentHeight:$refs.dom.offsetHeight}"
          :style="{top:resultTop+'px'}"
          :firstId="currentId"
          :scroll="scrollingP"
          :scrollTop="scrollTop"
          @resize="e=>{resultHeight=e+24}"
          @selectType="selectType"
          @updateData="updateData"
        ></results>
      </transition>
    </div>
  </div>
</template>
<script>
	import block from './comp/materialBlock.vue'
	import results from './comp/materialResults.vue'
  import myCollectedMaterialImg from './img/myCollectedMaterial.png'
	import {_throttle} from 'common/common'
  import {mapGetters,mapActions} from 'vuex'

	export default{
		name:'leftPanel-material',
		data(){
			return{
				blockData:[
					{imgUrl:11,firstKindName:'没有数据？！！！'},
				],
				blockState:[],
				blockStyle:[],
				currentBlock:null,
				resultTop:0,
				resultHeight:200,
				types2:[],
				typesCurrentSel:false,
        currentId:null,
        scrollingP:false,
        throttled:{},
        scrollTop:0
			}
		},
		props:{
			typesSel:{},
      closeResult:{}
		},
		components:{
			block,results
		},
		methods:{
      updateData(){
        if(this.$refs.scroll.scrollTop+this.$refs.dom.offsetHeight>=this.resultHeight+this.resultTop-24){
          this.scrollingP=!this.scrollingP
        }
      },
			setBlock(i,h){
				let blockState=[],blockStyle=[];
				for (let j=0;j<this.blockData.length;j++){
					if(j===i){
						blockState.push(2)
					}else {
						blockState.push(3)
					}
				}
				this.blockState=blockState

				let row=((i/3)|0)+1
				for (let j=0;j<this.blockData.length;j++){
					if(j===row*3||j===row*3+1||j===row*3+2){
						blockStyle.push(h)
					}else {
						blockStyle.push(12)
					}
				}
				this.resultTop=72+106*row+6
				this.blockStyle=blockStyle
			},
      selectBlock(i){
	      if(i===0&&!this.isLogin){
		      this.showLogreg(1)
		      return
	      }
	      this.currentBlock=i
      },
			clearBlock(){
				let blockState=[],blockStyle=[];
				for (let i=0;i<this.blockData.length;i++){blockState.push(0)}
				for (let i=0;i<this.blockData.length;i++){blockStyle.push(12)}
				this.blockState=blockState
				this.blockStyle=blockStyle
				this.currentBlock=null
			},
			scroll(e,p){
        this.throttled.apply(this,[e,p])
			},
      scrollExec(e,p){
	      let sT=this.scrollTop=e.target.scrollTop
	      switch (true){
		      case sT+72>this.resultTop:this.$emit('searchBlock',{s:2,d:this.types2});break
		      case sT>10:this.$emit('searchBlock',{s:1,d:[]});break
		      default:this.$emit('searchBlock',0)
	      }
	      if(p.scrollTop+this.$refs.dom.offsetHeight>=this.resultHeight+this.resultTop-24){
		      this.scrollingP=!this.scrollingP
	      }
      },
			selectType(index){
				let types=[...(this.types2)]
				types.map((t,i)=>{
					t.active=i===index
				})
				this.types2=types
			},
			...mapActions({
				showLogreg:'setLogregShow',
				setIndex:'setLeftPanelIndex',
				setMessageShow:'setMessageShow'
			}),
		},
		beforeMount(){
			this.throttled=_throttle(this.scrollExec,200)
			this.$http.post('/material/getAllMaterialKind').then(res=>{
				if(res.data===null) return
				this.blockData=[{
					firstKindId:-1,
					firstKindName:'我的素材',
					imgUrl:myCollectedMaterialImg,
					lsQueryMaterialKindBean:[
            {
	            kindId:1,
	            kindTitle:'位图素材'
            },
            {
	            kindId:2,
	            kindTitle:'矢量素材'
            }
          ]
        },...res.data.body.list]
			},err=>{
				this.setMessageShow({placeHolder:'网络出错',kind:'error'})
				console.log(err)
			})
			this.clearBlock()
		},
		watch:{
			currentBlock(v){
				if(v===null) return
				this.setBlock(v,this.resultHeight)
				let types2=[]
				types2.push({active:true,kindTitle:'全部'})
				this.types.forEach(t=>{
					types2.push({active:false,...t})
				})
				this.types2=types2
        this.currentId=v!==null?this.blockData[v].firstKindId:null
			},
			resultHeight(){
				this.setBlock(this.currentBlock,this.resultHeight)
			},
			types2(v){
				this.$emit('updateSel',v)
			},
			typesSel({id}){
				let types2=[],index=false
				types2.push({active:id===undefined,kindTitle:'全部'})
				this.types.forEach((t,i)=>{
					types2.push({active:t.kindId===id,...t})
					if(t.kindId===id)
						index=i
				})
				this.typesCurrentSel=id===undefined?-1:index
				this.types2=types2
			},
			closeResult(){
				this.clearBlock()
      }
		},
		computed:{
			types(){
				let t=this.blockData[this.currentBlock].lsQueryMaterialKindBean
				return t
			},
			...mapGetters({
				teamId:'getTeamId',
				isVip:'getIsVip',
				isLogin:'getIsLogin',
				index:'getLeftPanelIndex'
			})
		}
	}
</script>
<style lang="less" scoped>
  @import '../common';

  #leftPanel-material{
    overflow: hidden;

    .leftPanel-material-content{
      width: 312px;
      height: 100%;
      /*padding-left: 16px;*/
      box-sizing: border-box;
      position: relative;
      padding-top: 72px;
      overflow-y: auto;
      overflow-x: hidden;

      .leftPanel-material-content-block{
        float: left;
        margin-top: 12px;
        margin-left: 24px;
      }

      .result-enter-active, .result-leave-active {
        opacity:1;
        transition: opacity .3s ease;
      }
      .result-enter, .result-leave-to{
        opacity:0;
      }

      .leftPanel-material-content-results{
        position: absolute;
        left:0;
        top: 0;
        width: 312px;
      }

    }

  }
</style>