<template>
  <div id="leftPanel-tools" ref="dom">
    <div class="leftPanel-tools-content" v-ss-scroll="scroll">
      <block
        class="leftPanel-tools-content-block"
        v-for="(e,i) in blockData"
        :key="i"
        @click="currentBlock=i"
        @cancel="clearBlock"
        :data="e"
        :state="blockState[i]"
        :style="{marginTop:blockStyle[i]+'px'}"
      ></block>
      <transition name="result">
        <!--<results-->
        <!--class="leftPanel-tools-content-results"-->
        <!--v-if="currentBlock!==null"-->
        <!--:types="types2"-->
        <!--:currentSel="typesCurrentSel"-->
        <!--:position="{top:resultTop,parentHeight:$refs.dom.offsetHeight}"-->
        <!--:style="{top:resultTop+'px'}"-->
        <!--:firstId="currentId"-->
        <!--:scroll="scrollingP"-->
        <!--@resize="e=>{resultHeight=e+24}"-->
        <!--@selectType="selectType"-->
        <!--&gt;</results>-->

        <div class="leftPanel-tools-item" v-if="currentBlock!==null" :style="{top:resultTop+'px'}">
          <!--<tables-->
            <!--v-if="currentBlock===0"-->
            <!--@resize="e=>{resultHeight=e+64}"-->
          <!--&gt;</tables>-->
          <chart
            v-if="currentBlock===0"
            @resize="e=>{resultHeight=e+64}"
          ></chart>
          <qr
            v-if="currentBlock===1"
            @resize="e=>{resultHeight=e+64}"
          ></qr>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
	import block from './comp/toolsBlock.vue'
	import {_throttle} from 'common/common'
	import tableImage from './img/leftPanel-table.svg'
	import chartImage from './img/leftPanel-charts.svg'
	import qrcodeImage from './img/leftPanel-qrCode.svg'
	import chart from './comp/chart.vue'
	import tables from './comp/table.vue'
	import qr from './comp/qrCode.vue'
	import {mapGetters,mapActions} from 'vuex'

	export default{
		name:'leftPanel-tools',
		data(){
			return{
				blockData:[
//					{imgUrl:tableImage,name:'表格'},
					{imgUrl:chartImage,name:'图表'},
//					{imgUrl:qrcodeImage,name:'二维码'},
				],
				blockState:[],
				blockStyle:[],
				currentBlock:null,
				resultTop:0,
				resultHeight:200,
				typesCurrentSel:false,
				currentId:null,
				scrollingP:false,
				throttled:{}
			}
		},
		components:{
			block,chart,tables,qr
		},
		methods:{
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
				let sT=e.target.scrollTop
				switch (true){
					case sT+72>this.resultTop:this.$emit('searchBlock',{s:2,d:this.types2});break
					case sT>10:this.$emit('searchBlock',{s:1,d:[]});break
					default:this.$emit('searchBlock',0)
				}
				if(p.scrollTop+this.$refs.dom.offsetHeight>=this.resultHeight+this.resultTop-24){
					this.scrollingP=!this.scrollingP
				}
			},
			...mapActions({
				setLeftPanelClose: 'setLeftPanelClose',
				setIndex:'setLeftPanelIndex'
			})
		},
		beforeMount(){
			this.throttled=_throttle(this.scrollExec,200)
			this.clearBlock()
		},
		watch:{
			currentBlock(v){
				if(v===null) return
				this.setBlock(v,this.resultHeight)
			},
			resultHeight(){
				this.setBlock(this.currentBlock,this.resultHeight)
			},
			focusElem: {
				handler() {
					if (this.focusElemType === 'svgChart') {
						this.setLeftPanelClose(false)
						this.setIndex(5)
						this.currentBlock = 0
					} else {
						this.clearBlock()
					}
				},
				deep: true
			}
		},
		computed:{
			...mapGetters({
				focusElemType:'getFocusElemType',
				focusElem:'getFocusElemJson'
			})
		}
	}
</script>
<style lang="less" scoped>
  @import '../common';

  #leftPanel-tools{
    overflow: hidden;

    .leftPanel-tools-content{
      width: 312px;
      height: 100%;
      /*padding-left: 16px;*/
      box-sizing: border-box;
      position: relative;
      padding-top: 72px;
      overflow-y: auto;
      overflow-x: hidden;

      .leftPanel-tools-content-block{
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

      .leftPanel-tools-item{
        position: absolute;
        left:0;
        top: 0;
        width: 100%;
        box-sizing: border-box;
        /*padding: 16px;*/

        &:after{
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left:16px;
          width: 280px;
          height: 1px;
          background: #CCCCCC;
        }
      }

    }

  }
</style>