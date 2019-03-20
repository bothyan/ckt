<template>
  <div class="leftPanel-tools-chart-item3">
    <lines class="chart-setup-line" :data="{des:'图表标题'}" :status="titleShow" @sel="setTitleFlag"></lines>
    <div
      class="chart-setup-content chart-setup-title"
      :class="{disabled:!titleShow}"
      ref="setupTitleColor"
    >
      <input type="text" class="chart-setup-title-input"
             :placeholder="!titleInputing?'输入图表标题':''"
             v-model="titleInput"
             @blur="(titleInputing=false)&&titleInputBlur()"
             @focus="titleInputing=true"
      >
      <div class="chart-setup-title-pull-line">
        <span>标题位置</span>
        <dropDown class="drop-down" :data="chartTitlePosition" @select="setChartTitlePosition" eventType="click"></dropDown>
      </div>
      <div class="chart-setup-title-pull-line">
        <span>标题颜色</span>
        <!--<dropDown class="drop-down" :data="{sel:'灰',opt:[]}"></dropDown>-->
        <div
          class="mainColor"
          :style="{background:titleColor}"
          @click="showColorPicker(titleColor,null,'chartTitleColor')"
        ></div>
      </div>
    </div>
    <lines class="chart-setup-line" :data="{des:'X、Y轴名称'}" :status="axisTitleShow" @sel="setAxisTitleShow"></lines>
    <div
      class="chart-setup-content chart-setup-XY"
      :class="{disabled:!axisTitleShow}"
    >
      <div class="chart-setup-content-inputLine">
        <span>X轴</span>
        <input
          type="text" :placeholder="!xTitleInputing?'输入图表标题':''"
          @focus="xTitleInputing=true"
          v-model="xTitleInput"
          @blur="xTitleInputing=false"
        >
      </div>
      <div class="chart-setup-content-inputLine">
        <span>Y轴</span>
        <input
          type="text" :placeholder="!yTitleInputing?'输入图表标题':''"
          @focus="yTitleInputing=true"
          @blur="yTitleInputing=false"
          v-model="yTitleInput"
        >
      </div>
    </div>

    <lines class="chart-setup-line" :data="{des:'坐标轴'}" :status="axisShow" @sel="setAxisFlag"></lines>

    <lines class="chart-setup-line" :data="{des:'网格'}" :status="gridShow" @sel="setGridFlag"></lines>

    <lines class="chart-setup-line" :data="{des:'图例'}" :status="legendShow" @sel="setLegendFlag"></lines>

    <lines class="chart-setup-line" :data="{des:'自定义配色'}" :status="useDiyColor" @sel="e=>{useDiyColor=e}"></lines>
    <div
      class="chart-setup-content chart-setup-color"
      :class="{disabled:!useDiyColor}"
      ref="setupColor"
    >
      <div class="chart-setup-color-line">
        <span>自定义</span>
        <div class="colorsContainer">
          <div class="colors"
               v-for="(e,i) in colors" :style="{background:e}"
               @click="showColorPicker(e,i,'chartColor')"
          ></div>
        </div>
      </div>
    </div>
    <!--<lines class="chart-setup-line" :data="{des:'限制坐标值'}" :status="axisLimit" @sel="axisLimitCtrl"></lines>-->
    <!--<div-->
    <!--class="chart-setup-content chart-setup-lim"-->
    <!--:class="{disabled:!axisLimit}"-->
    <!--&gt;-->
    <!--<div class="chart-setup-content-inputLine">-->
    <!--<span>坐标最小值</span>-->
    <!--<input type="text" :placeholder="chartYAxisNumMin===''?'在此输入坐标值':chartYAxisNumMin">-->
    <!--</div>-->
    <!--<div class="chart-setup-content-inputLine">-->
    <!--<span>坐标最大值</span>-->
    <!--<input type="text" :placeholder="chartYAxisNumMax===''?'在此输入坐标值':chartYAxisNumMax">-->
    <!--</div>-->
    <!--</div>-->
  </div>
</template>
<script>
	import lines from './setupLine.vue'
	import dropDown from 'components/dropDown/dropDown'
	import {mapGetters,mapActions} from 'vuex'
	import dataHandle from 'common/dataHandle'
	import {
		setTitleFlag,setTitleColor,setTitlePosition,
		setTitleName,setXAxisTitle,setYAxisTitle,
		setAxisFlag,setGridFlag,setChartColorList,
		setLegendFlag, setAxisTitleShow
	} from 'dataBus/chart'

	const colors=[
		'#DDFF45','#B1FF6C','#7AFFB2','#45ECF8',
		'#52B4FF','#529EFF','#5684FF','#7E6AFF',
		'#B770FF','#E66BFF','#FD46C4','#FC456B',
		'#FF7675','#FFA464','#FFCF68','#F7E73A'
	]

	export default {
		name:'leftPanel-tools-chart-item3',
		data(){
			return{
				status:[false,false,false,false,false,false],
				useDiyColor:false,
				titleColor:'#DDFF45',
				colors:[
					'#DDFF45','#B1FF6C','#7AFFB2','#45ECF8',
					'#52B4FF','#529EFF','#5684FF','#7E6AFF',
					'#B770FF','#E66BFF','#FD46C4','#FC456B',
					'#FF7675','#FFA464','#FFCF68','#F7E73A'
				],
				chartColorIndex:null,
				titleInput:'',
				titleInputing:false,
				xTitleInput:'',
				xTitleInputing:false,
				yTitleInput:'',
				yTitleInputing:false
			}
		},
		components:{
			lines,dropDown
		},
		computed:{
			...mapGetters({
				colorPickerIsShow:'getColorPickerIsShow',
				colorPickerInvoke:'getColorPickerInvoke',
				colorPickerColorData:'getColorPickerColorData',
				colorPickerColorStatus:'getColorPickerColorStatus',
				focusPageIndex:'getFocusPageIndex',
				focusElemIndex:'getFocusElemIndex'
			}),
			titleShow(){
				return this.setup['chart-titleShow']
			},
			chartTitle(){
//				if(this.setup['chart-title']==='')
//					this.titleInput=this.setup['chart-title']
				return this.setup['chart-title']
			},
			chartTitlePosition(){
				let str =this.setup['chart-titlePosition'],
					obj={}
				switch (str){
					case 'top':
						obj={sel:'上',opt:[
							{dis:false,des:'上',
								sel:true,id:'top'},
							{dis:false,des:'下',
								sel:false,id:'bottom'}
						]}
						break
					case 'bottom':
						obj={sel:'下',opt:[
							{dis:false,des:'上',
								sel:false,id:'top'},
							{dis:false,des:'下',
								sel:true,id:'bottom'}
						]}
						break
				}

				return obj
			},
			chartTitleColor(){
				return this.setup['chart-titleColor']
			},
			chartXAxisTitle(){
//				this.xTitleInput=this.setup['chart-xAxisTitle']
				return this.setup['chart-xAxisTitle']
			},
			chartYAxisTitle(){
//				this.yTitleInput=this.setup['chart-yAxisTitle']
				return this.setup['chart-yAxisTitle']
			},
			axisShow(){
				return this.setup['chart-axisShow']
			},
			axisTitleShow(){
				return this.setup['chart-axisTitleShow']
			},
			gridShow(){
				return this.setup['chart-gridShow']
			},
			legendShow(){
				return this.setup['chart-legendShow']
			},
//			chartYAxisNumMin(){
//				return this.setup['chart-yAxisNumMin']
//			},
//			chartYAxisNumMax(){
//				return this.setup['chart-yAxisNumMax']
//			},
//			axisLimit(){
//				if(this.chartYAxisNumMax>this.chartYAxisNumMin&&this.chartYAxisNumMin>=0){
//					return true
//				}
//				return false
//			},
			chartColors(){
				return this.setup['chart-colors']
			}

		},
		methods:{
			...mapActions({
				setColorPickerShow:'setColorPickerShow'
			}),
			showColorPicker(color,i,type){
				this.chartColorIndex=i
				this.colorPickerIsShow||this.setColorPickerShow({
					isShow:true,
					DefaultColor:color,
					invoke:type==='chartTitleColor'?'chart3-title':'chart3',
					position:{left:'370px',top:this.$refs['setupTitleColor'].offsetTop+'px'}
				})
			},
			setChartTitlePosition({id}){
				setTitlePosition(id)
				dataHandle.commit('element',{
					pageIndex:this.focusPageIndex,
					eleIndex:this.focusElemIndex,
					eventType:1,
					key:'chart-titlePosition',
					value:id
				}).push()
			},
//			titleInput(e){
//				let value=e.target.value.substring(0,16)
//        this.titleInputValue=value
//				setTitleName(value)
//				dataHandle.commit('element',{
//					pageIndex:this.focusPageIndex,
//					eleIndex:this.focusElemIndex,
//					eventType:1,
//					key:'chart-title',
//          value
//				}).push()
//      },
			titleInputBlur(){
				dataHandle.push()
			},
//			xTitleInput(e){
//				let value=e.target.value
//				setXAxisTitle(value)
//				dataHandle.commit('element',{
//					pageIndex:this.focusPageIndex,
//					eleIndex:this.focusElemIndex,
//					eventType:1,
//					key:'chart-xAxisTitle',
//					value
//				}).push()
//      },
//			yTitleInput(e){
//				let value=e.target.value
//				setYAxisTitle(value)
//				dataHandle.commit('element',{
//					pageIndex:this.focusPageIndex,
//					eleIndex:this.focusElemIndex,
//					eventType:1,
//					key:'chart-yAxisTitle',
//					value
//				}).push()
//      },
//			axisLimitCtrl(v){
//				if(v){
//					setAxisMax(600)
//					setAxisMin(0)
//        }else {
//					setAxisMax(null)
//					setAxisMin(null)
//        }
//      }
			setTitleFlag(v){
				setTitleFlag(v)
				dataHandle.commit('element',{
					pageIndex:this.focusPageIndex,
					eleIndex:this.focusElemIndex,
					eventType:1,
					key:'chart-titleShow',
					value:v
				}).push()
			},
			setAxisFlag(v){
				setAxisFlag(v)
				dataHandle.commit('element',{
					pageIndex:this.focusPageIndex,
					eleIndex:this.focusElemIndex,
					eventType:1,
					key:'chart-axisShow',
					value:v
				}).push()
			},
			setGridFlag(v){
				setGridFlag(v)
				dataHandle.commit('element',{
					pageIndex:this.focusPageIndex,
					eleIndex:this.focusElemIndex,
					eventType:1,
					key:'chart-gridShow',
					value:v
				}).push()
			},
			setLegendFlag(v){
				setLegendFlag(v)
				dataHandle.commit('element',{
					pageIndex:this.focusPageIndex,
					eleIndex:this.focusElemIndex,
					eventType:1,
					key:'chart-legendShow',
					value:v
				}).push()
			},
			setAxisTitleShow(v){
				setAxisTitleShow(v)
				dataHandle.commit('element',{
					pageIndex:this.focusPageIndex,
					eleIndex:this.focusElemIndex,
					eventType:1,
					key:'chart-axisTitleShow',
					value:v
				}).push()
			}
		},
		watch:{
			titleInput(value){
				if(value===this.chartTitle) return
				this.titleInput=value.substring(0,16)
				setTitleName(value)
				dataHandle.commit('element',{
					pageIndex:this.focusPageIndex,
					eleIndex:this.focusElemIndex,
					eventType:1,
					key:'chart-title',
					value
				})
			},
			xTitleInput(value){
				if(value===this.chartXAxisTitle) return
				this.xTitleInput=value.substring(0,5)
				setXAxisTitle(value)
				dataHandle.commit('element',{
					pageIndex:this.focusPageIndex,
					eleIndex:this.focusElemIndex,
					eventType:1,
					key:'chart-xAxisTitle',
					value
				})
			},
			yTitleInput(value){
				if(value===this.chartYAxisTitle) return
				this.yTitleInput=value.substring(0,5)
				setYAxisTitle(value)
				dataHandle.commit('element',{
					pageIndex:this.focusPageIndex,
					eleIndex:this.focusElemIndex,
					eventType:1,
					key:'chart-yAxisTitle',
					value
				})
			},
			colorPickerColorData(c){
				if(this.colorPickerInvoke==='chart3'){
					this.$set(this.colors,this.chartColorIndex,c)
					setChartColorList(this.colors)
				}
				if(this.colorPickerInvoke==='chart3-title')
					this.$set(this,'titleColor',c)
			},
			colorPickerColorStatus(v){
				if(v===0&&this.colorPickerInvoke==='chart3'){
					this.$set(this.colors,this.chartColorIndex,this.colorPickerColorData)
					setChartColorList(this.colors)
					dataHandle.commit('element',{
						pageIndex:this.focusPageIndex,
						eleIndex:this.focusElemIndex,
						eventType:1,
						key:'chart-colors',
						value:this.colors
					}).push()
				}
				if(v===0&&this.colorPickerInvoke==='chart3-title'){
					this.$set(this,'titleColor',this.colorPickerColorData)
					setTitleColor(this.colorPickerColorData)
					dataHandle.commit('element',{
						pageIndex:this.focusPageIndex,
						eleIndex:this.focusElemIndex,
						eventType:1,
						key:'chart-titleColor',
						value:this.colorPickerColorData
					}).push()
				}
			},
			chartTitleColor(){
				this.titleColor=this.chartTitleColor
			},
			chartColors(){
				this.colors=this.chartColors
			},
			colors(){
				if(this.colors===this.chartColors) return

			}
		},
		props:{
			setup:{
				required:true
			},
			data:{
				required:true
			}
		},
		beforeMount(){
			this.titleColor=this.chartTitleColor
			this.colors=this.chartColors
			this.titleInput=this.chartTitle
			this.xTitleInput=this.chartXAxisTitle
			this.yTitleInput=this.chartYAxisTitle
		}
	}
</script>
<style lang="less" scoped>
  .leftPanel-tools-chart-item3{
    width:100%;
    padding: 16px;

    .chart-setup-line{
      margin-bottom: 1px;
    }

    .chart-setup-content{
      width: 100%;
      padding: 16px 0;
      position: relative;
      overflow: visible;
      transition: all .4s ease;

      input{
        padding: 0 16px;
        background: #ECECEC;
        height: 32px;
        color: #626262;
        line-height: 32px;
        font-size: 14px;
        border: none;

        &:focus{
          outline: none;
        }

        &::placeholder{
          color: #9B9B9B;
        }
      }

      &[class~='disabled']{
        padding: 0;
        height: 0;
        overflow: hidden;
      }

      .chart-setup-content-inputLine{
        width: 100%;
        height: 32px;
        margin-bottom: 8px;

        &>span{
          float: left;
          color: #626262;
          font-size: 14px;
          line-height: 32px;
        }

        &>input{
          width: 184px;
          float: right;
        }

        &:nth-last-child(1){
          margin-bottom: 0;
        }
      }
    }

    .chart-setup-title{

      .chart-setup-title-input{
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-bottom: 16px;
      }

      .mainColor{
        width: 184px;
        height:100%;
        float: right;
        cursor: pointer;
        transition:transform .1s ease;

        &:hover{
          transform: scale(1.05);
          box-shadow: 0 2px 8px 0 rgba(0,0,0,.32);
        }
      }

      .chart-setup-title-pull-line{
        width: 100%;
        height: 32px;
        margin-bottom: 8px;

        &:nth-last-child(1){
          margin-bottom: 0;
        }

        &>span{
          float: left;
          color: #626262;
          font-size: 14px;
          line-height: 32px;
        }

        &>.drop-down{
          float: right;
          width: 184px;
          height:32px;
          background: #FFFFff;
        }

      }
    }

    .chart-setup-color{
      .chart-setup-color-line{
        width: 100%;
        margin-bottom: 8px;
        /*height: 24px;*/
        position: relative;

        &:after{
          content: '';
          display: block;
          clear: both;
        }

        &:nth-last-child(1){
          margin-bottom: 0;
        }

        &>span{
          float: left;
          color: #626262;
          font-size: 14px;
          line-height: 32px;
        }

        .mainColor{
          width: 184px;
          height:100%;
          float: right;
          cursor: pointer;

          &:hover{

          }
        }

        .colorsContainer{
          width: 184px;
          height:100%;
          float: right;
          position: relative;

          &:after{
            content: '';
            display: block;
            clear: both;
          }

          .colors{
            width: 24px;
            height:24px;
            top: 0;
            cursor: pointer;
            transition:all .2s ease;
            float: left;
            margin-right: 8px;
            margin-bottom: 4px;

            &:nth-child(6n){
              margin-right: 0;
            }

            &:hover{
              transform: scale(1.2);
              box-shadow: 0 2px 8px 0 rgba(0,0,0,.32);
            }
          }
        }

      }
    }
  }
</style>