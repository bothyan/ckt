<template>
  <div class="leftPanel-tools-chart-item2">
    <dataTable
      class="table"
      :pdata="pdata"
      @change="change"
    ></dataTable>
  </div>
</template>
<script>
	import dataTable from './dataTable.vue'
	import {setChartData,setChartColorList} from 'dataBus/chart'
	import dataHandle from 'common/dataHandle'
	import {mapGetters,mapActions} from 'vuex'

	const defaultColors=[
		'#DDFF45','#B1FF6C','#7AFFB2','#45ECF8',
		'#52B4FF','#529EFF','#5684FF','#7E6AFF',
		'#B770FF','#E66BFF','#FD46C4','#FC456B',
		'#FF7675','#FFA464','#FFCF68','#F7E73A'
	]

	export default {
		name:'leftPanel-tools-chart-item2',
		data(){
			return{

			}
		},
		components:{
			dataTable
		},
		props:{
			data:{}
		},

		methods:{
			change(v){
				let {value,del}=this.a2b(v)
				setChartData(value)
				let colors=[]
				colors.push(...this.chartColors)
				if(v.length>16){
					let len=v.length
					let clen=-this.chartColors.length
					for(;len-clen>16;len-16){
						colors.push(...defaultColors)
					}
					colors.push(...(defaultColors.slice(0,len-clen)))
				}else {
					colors.push(...(defaultColors.slice(this.chartColors.length,v.length)))
				}
				if(del>-1)
					colors.splice(del,1)
        console.log(colors)
				setChartColorList(colors)
				dataHandle
					.commit('element',{
						eventType:1,
						key:'chart-data',
						pageIndex:this.focusPageIndex,
						eleIndex:this.focusElemIndex,
						value
					})
					.commit('element',{
						eventType:1,
						key:'chart-colors',
						pageIndex:this.focusPageIndex,
						eleIndex:this.focusElemIndex,
						value:colors
					}).push()
			},
			a2b(v){
				let value=[],del=-1
				v.forEach((e,index)=>{
					if(e[0]===''&&e[1]===0){
						del=index
						return
					}
					value.push({
						name:e[0],
						value:e[1]
					})
//          }else if(e[1]!==null&&e[1]!==''){
//						arr.push({
//							name:'未命名',
//							value:e[1]
//            })
//          }

				})
				return {value,del}
			},
			b2a(v){
				let arr=[]
				v.forEach(e=>{
					arr.push([e.name,e.value])
				})
				return arr
			}
		},
		computed:{
			...mapGetters({
				focusPageIndex:'getFocusPageIndex',
				focusElemIndex:'getFocusElemIndex',
				focusElemJson:'getFocusElemJson'
			}),
			chartColors(){
				return this.focusElemJson['data-elem']['chart-colors']
			},
			pdata(){
				return this.b2a(this.data)
			}
		},
	}
</script>
<style lang="less" scoped>
  .leftPanel-tools-chart-item2{
    width: 100%;

    .table{
      margin: 16px;
    }
  }
</style>