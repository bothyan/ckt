<template>
  <div class="leftPanel-tools-chart-item1">
    <div
      class="leftPanel-tools-chart-item1-type"
      v-for="e in chartTypeList"
      @click="setType(e.type)"
    >
      <img :src="e.imgUrl" alt="" v-if="e.type!==type">
      <img :src="e.imgUrl1" alt="" v-else>
    </div>
  </div>
</template>
<script>
	import img0 from '../../img/leftPanel-chart-0.svg'
	import img1 from '../../img/leftPanel-chart-1.svg'
	import img2 from '../../img/leftPanel-chart-2.svg'
	import img3 from '../../img/leftPanel-chart-3.svg'
	import img4 from '../../img/leftPanel-chart-4.svg'
	import img01 from '../../img/leftPanel-chart-01.svg'
	import img11 from '../../img/leftPanel-chart-11.svg'
	import img21 from '../../img/leftPanel-chart-21.svg'
	import img31 from '../../img/leftPanel-chart-31.svg'
	import img41 from '../../img/leftPanel-chart-41.svg'
	import pageEle from 'dataBus/pageEle'
	import {mapGetters,mapActions} from 'vuex'
	import {setChartKind} from 'dataBus/chart'
	import dataHandle from 'common/dataHandle'

	let {addElement,delElement} = pageEle

	let newChart={
//		"data-key": "",
		"opacity": 1,
//		"id": "",
//		"view-width": 500,
//		"view-height": 500,
//		"width": 500,
//		"height": 500,
		"viewBox": "9.421875 24 788.578125 830",
		"chart-data": [
			{
				"name": "苹果",
				"value": 40
			},
			{
				"name": "香蕉",
				"value": 30
			},
			{
				"name": "橘子",
				"value": 20
			},
			{
				"name": "西瓜",
				"value": 40
			},
			{
				"name": "芒果",
				"value": 70
			}
		],
//	  "chart-kind": "histogram",
		"chart-colors": [
			'#DDFF45','#B1FF6C','#7AFFB2','#45ECF8',
			'#52B4FF'
		],
		"chart-title": "默认标题",
		"chart-titleShow": true,
		"chart-titleColor": "#808284",
		"chart-titlePosition": "top",
		"chart-axisShow": true,
		"chart-axisTitleShow": true,
		"chart-xAxisTitle": "X轴标题",
		"chart-yAxisTitle": "Y轴标题",
		"chart-yAxisNumMin": null,
		"chart-yAxisNumMax": null,
		"chart-gridShow": true,
		"chart-legendShow": true
	}


	export default {
		name:'leftPanel-tools-chart-item1',
		data(){
			return{
				chartType:null,
				//图表类型有:histogram(锥形图),cone(条形图),line(折线图),area(面积图),bar(柱状图)
				chartTypeList:[
					{imgUrl:img0,imgUrl1:img01,type:'bar'},
					{imgUrl:img1,imgUrl1:img11,type:'histogram'},
					{imgUrl:img2,imgUrl1:img21,type:'cone'},
					{imgUrl:img3,imgUrl1:img31,type:'line'},
					{imgUrl:img4,imgUrl1:img41,type:'area'},
				]
			}
		},
		props:{
			type:{}
		},
		computed:{
			...mapGetters({
				pageScale:'getPageScale',
				pageWidth:'getPageWidth',
				pageHeight:'getPageHeight',
				focusPageIndex:'getFocusPageIndex',
				focusElemJson:'getFocusElemJson',
				focusElemIndex:'getFocusElemIndex',
			})
		},
		methods:{
			setType(t){
				if(this.type===null){
					//创建新的chart
					let data={
						'data-type':'svgChart',
						'data-elem':{
							...newChart,
							'width':300/this.pageScale,
							"height": 300/this.pageScale,
							"view-width": 200/this.pageScale,
							"view-height": 200/this.pageScale,
							'chart-kind':t
						},
						'transform':`translate(${(this.pageWidth-300/this.pageScale)/2}, ${(this.pageHeight-300/this.pageScale)/2})`,
						'reverse':'translate(0,0)rotate(0,0,0)'
					}
					console.log('添加新图标，类型',t)
					let event=addElement(data,this.focusPageIndex)
					dataHandle.commit('element',event).push()
					this.$emit('change')
				} else {
					setChartKind(t)
					dataHandle.commit('element',{
						eventType:1,
						key:'chart-kind',
						pageIndex:this.focusPageIndex,
						eleIndex:this.focusElemIndex,
						value:t
					}).push()
					console.log('改变图标类型::',t)
				}
			}
		}

	}
</script>
<style lang="less" scoped>
  .leftPanel-tools-chart-item1{
    width:100%;

    .leftPanel-tools-chart-item1-type{
      float: left;
      margin-top: 12px;
      margin-left: 24px;
      width: 72px;
      height:72px;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,.08);
      border-radius: 4px;
      background: #FFFFff;
      position: relative;
      cursor: pointer;

      &>img{
        display: block;
      }
      
      /*&[class~='active']:after{*/
      /*position: absolute;*/
      /*top: 0;*/
      /*left:0;*/
      /*width: 100%;*/
      /*height: 100%;*/
      /*content: '';*/
      /*background: url("../../img/leftPanel-chart-active.svg") no-repeat;*/
      /*z-index: 1;*/
      /*}*/
    }
  }
</style>