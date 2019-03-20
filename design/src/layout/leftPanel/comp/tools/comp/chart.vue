<template>
  <div class="leftPanel-tools-chart">
    <div class="leftPanel-tools-chart-content">
      <div class="leftPanel-tools-chart-content-top">
        <span class="selectTextBlock" :class="{active:step===0}" @click="step=0">图表</span>
        <span class="selectTextBlock" :class="{active:step===1,disable}" @click="!disable&&(step=1)">数据</span>
        <span class="selectTextBlock" :class="{active:step===2,disable}" @click="!disable&&(step=2)">设置</span>
      </div>
      <div class="leftPanel-tools-chart-content-items">
        <item1
          v-if="step===0"
          :type="chartData.type"
          @change="step=1"
        ></item1>
        <item2
          v-if="step===1"
          :data="chartData.data"
        ></item2>
        <item3
          v-if="step===2"
          :data="chartData.data"
          :setup="chartData.setup"
        ></item3>
      </div>
    </div>
  </div>
</template>

<script>
	import item1 from './chart/chart1.vue'
	import item2 from './chart/chart2.vue'
	import item3 from './chart/chart3.vue'
	import {mapGetters,mapActions} from 'vuex'

	const colors=[
		'#DDFF45','#B1FF6C','#7AFFB2','#45ECF8',
		'#52B4FF','#529EFF','#5684FF','#7E6AFF',
		'#B770FF','#E66BFF','#FD46C4','#FC456B',
		'#FF7675','#FFA464','#FFCF68','#F7E73A'
	]

	export default{
		name:'leftPanel-tools-chart',
		data(){
			return{
				step:0,
				create:false,
				chartData:{
					type:null,
					data:[],
					setup:{}
				},
			}
		},
		computed:{
			...mapGetters({
				focusElemType:'getFocusElemType',
				focusElem:'getFocusElemJson',
				focusElemIndex:'getFocusElemIndex',
			}),
			disable(){
				return this.focusElemIndex===-1
      }
		},
		props:{

		},
		methods:{
			tranformData(){

			},
			...mapActions({
				setColorPickerShow:'setColorPickerShow'
			}),
		},
		watch:{
			focusElem: {
				handler() {
					if (this.focusElemType === 'svgChart') {
						this.create = false
						let dataElem = this.focusElem['data-elem'],
							chartData = {
								type: dataElem['chart-kind'],
								data: dataElem["chart-data"],
								setup: JSON.parse(JSON.stringify(dataElem))
							}
						this.chartData = chartData
					}
				},
        deep:true
			},
			step(){
				this.setColorPickerShow({
					cancel:true
				})
      }

		},
		components: {
			item1,item2,item3
		},
		beforeMount(){
			if(this.focusElemType==='svgChart'){
				this.create=false
				let dataElem=this.focusElem['data-elem'],
					chartData={
						type:dataElem['chart-kind'],
						data:dataElem["chart-data"],
						setup:dataElem
					}
				this.chartData=chartData
        this.step=1
			}else {
				this.create=true
			}
		}
	}
</script>
<style lang="less" scoped>
  @import "../../common";

  .leftPanel-tools-chart{
    width: 100%;
    box-sizing: border-box;
    position: relative;
    padding-top: 16px;

    .leftPanel-tools-chart-content {
      width: 312px;

      .leftPanel-tools-chart-content-top{
        text-align: center;
        padding: 0 16px;

        &:after{
          content: '';
          display: block;
          clear: both;
        }

        .selectTextBlock{
          float: left;
          width: 88px;
          margin-right: 8px;
          cursor: pointer;

          &:nth-last-child(1){
            margin-right: 0;
          }

          &[class~='disable']{
            background: #E7E7E7;
            color: #CDCDCD !important;
            cursor: not-allowed;

            &:hover{
              background: #E7E7E7;
              color: #CDCDCD !important;
              cursor: not-allowed;
            }
          }
        }
      }

      .leftPanel-tools-chart-content-items{
        width: 100%;
        padding-top:2px;
      }

    }
  }
</style>