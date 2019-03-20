
<template>
	<svg class="svg-table" version="1.1" xmlns="http://www.w3.org/2000/svg"
			 :viewBox="viewBox"
			 :width = "svgWidth"
			 :height = "svgHeight"
	>
		<g v-for="i in row" :key="i">
			<g v-for="j in col" :key="j">
				<rect 
						:width="colWidths[j-1] || cellWidth" 
						:height="rowHeights[i-1] || cellHeight"
						:fill="colors[cells[i-1][j-1].bgc]"
						:x="colX[j-1]"
						:y="rowY[i-1]"
				></rect>
				<line class="top-line"
							v-if="lw"
							:stroke-width="lw" 
							:stroke="colors[cells[i-1][j-1].tc]"
							:x1="colX[j-1]-lw"
							:y1="rowY[i-1]-lw/2"
							:x2="colX[j-1] + colWidths[j-1]+lw"
							:y2="rowY[i-1]-lw/2"
				></line>
				<line class="left-line"
							v-if="lw"
							:stroke-width="lw" 
							:stroke="colors[cells[i-1][j-1].lc]"
							:x1="colX[j-1]-lw/2"
							:y1="rowY[i-1]"
							:x2="colX[j-1]-lw/2"
							:y2="rowY[i-1]+rowHeights[i-1]"
				></line>
				<line class="right-line"
							v-if="lw&&j===col"
							:stroke-width="lw" 
							:stroke="colors[cells[i-1][j-1].rc]"
							:x1="colX[j-1] + colWidths[j-1]+lw/2"
							:y1="rowY[i-1]"
							:x2="colX[j-1]+colWidths[j-1]+lw/2"
							:y2="rowY[i-1]+rowHeights[i-1]"
				></line>
				<line class="bottom-line" 
							v-if="lw&&i===row"
							:stroke-width="lw" 
							:stroke="colors[cells[i-1][j-1].bc]"
							:x1="colX[j-1]-lw"
							:y1="rowY[i-1]+lw/2+rowHeights[i-1]"
							:x2="colX[j-1] + colWidths[j-1]+lw"
							:y2="rowY[i-1]+lw/2+rowHeights[i-1]"
				></line>
				<text v-for="(t,index) in cells[i-1][j-1].contents"
							:key="index"
							:x="t.x"
							:y="rowY[i-1] + rowHeights[i-1]/2"
							:stroke-width="t['stroke-width']"
							:stroke="t.stroke"
							:fill="t.fill"
							:style="t.style">{{t['data-txt']}}
				</text>
			</g>
		</g>
	</svg>
</template>


<script>
	export default{
		name: "dataTable",
		props: {
			json: {
				type: Object
			},
			pageId: {
			require: true
			},  			
		},
		data() {
			return {
				cells: [],
				col: 0,
				row: 0,
				colors: [],
				lw: 0,
				viewBox: '',
				rowHeights: [],
				colWidths: [],
				rowY:[],
				colX: [],
				svgWidth: 0,
				svgHeight: 0
			}
		},
		watch: {
		  json: {
		    handler () {
		    	console.log('aaa');
					this.svgWidth = this.json.width;
					this.svgHeight = this.json.height;
					this.test();
				},
				deep: true
			}
		},
		methods: {
			calcRowYAndColX() {
				this.rowY.push(this.lw);
				this.colX.push(this.lw);
				let i = 1;
				while(i < this.row){
					this.rowY[i] = this.rowY[i-1] + this.rowHeights[i-1]+this.lw;
					i++;
				}
				i = 1;
				while(i < this.col){
					this.colX[i] = this.colX[i-1] + this.colWidths[i-1]+this.lw;
					i++;
				}
			},
			test() {
				let json = this.json;
				this.colors = json.colors;
				this.col = json.col;
				this.row = json.row;
				this.lw = json['line-width'];
				this.cells = json.cells;
				this.rowHeights = json['row-heights'];
				this.colWidths = json['col-widths'];
				this.viewBox = json.viewBox;
	      this.svgWidth = json.width;
	      this.svgHeight = json.height;
				this.calcRowYAndColX();
			}
		},
		created() {
			let json = this.json;
			this.colors = json.colors;
			this.col = json.col;
			this.row = json.row;
			this.lw = json['line-width'];
			this.cells = json.cells;
			this.rowHeights = json['row-heights'];
			this.colWidths = json['col-widths'];
			this.viewBox = json.viewBox;
      this.svgWidth = json.width;
      this.svgHeight = json.height;
			this.calcRowYAndColX();
		}
	}
</script>

<style lang="less" scoped>
	.svg-table{
		cursor: move;
		&:hover{
			border: 1px dashed;
		}
	}
</style>