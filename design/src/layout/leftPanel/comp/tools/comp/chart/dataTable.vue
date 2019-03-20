
<template>
	<div class="data-table relative">
		<table>
			<tbody>
			<tr>
				<th></th>
				<td class="head">名称</td>
				<td class="head">数据</td>
			</tr>
			<tr v-for="index in datas.length">
				<th>{{index}}</th>
				<td
					:class="{'current': currentPos.x === 0&&currentPos.y===index-1&&!changeFlag}"
					:title="datas[index-1][0]||''"
					@dblclick="changeCurrentFlag"
					@click="changeCurrent(index-1, 0)"
				><p>{{datas[index-1][0]}}</p></td>
				<td
					:class="{'current': currentPos.x === 1&&currentPos.y===index-1&&!changeFlag}"
					:title="datas[index-1][1] || ''"
					@dblclick="changeCurrentFlag"
					@click="changeCurrent(index-1, 1)"
				><p>{{datas[index-1][1]}}</p></td>
			</tr>
			<tr>
				<th class="add" @click="addRow">+</th>
				<td></td>
				<td></td>
			</tr>
			</tbody>
		</table>
		<input :style="inputStyle"
					 @keydown.stop
					 @keyup.stop
					 @blur="changeCurrentValue"
					 ref="text"
					 v-model="currentValue"
					 class="absolute"
					 id="text"
					 type="text"
					 autocomplete="off" />
	</div>
</template>

<script>
	export default{
		name: 'dataTable',
		data () {
			return {
				currentValue: '',
				changeFlag: false,
				currentPos: {
					x: -1,
					y: -1
				},
				datas: [
				]
			}
		},
		props:{
			pdata: {
				type: Array
			}
		},
		computed: {
			inputStyle () {
				let me = this;
				if(this.changeFlag){
					return {
						left: me.currentPos.x * 120 + 40 + 'px',
						top: (me.currentPos.y + 1 ) * 30 - 1 + 'px',
						display: "block"
					}
				}
				return {
					display: "none"
				}
			}
		},
		watch: {
			pdata: {
				handler(v) {
					this.datas = v;
				},
				deep: true
			},
			currentValue(v) {
				if(this.currentPos.x) {
					if(!(/^[0-9]{1,}\.?[0-9]{0,}$/.test(v)) && v !== ''){
						this.currentValue = 0;
					}
					else {
						if(this.currentValue.length > 15) {
							this.currentValue = this.currentValue.slice(0, 15);
						}
					}
				}
				else {
					if(this.currentValue.length > 15) {
						this.currentValue = this.currentValue.slice(0, 15);
					}
				}
			}
		},
		methods: {
			changeCurrent (index, type) {
				if(type !== undefined){
					this.currentPos.x = type;
					this.currentPos.y = index;
					this.currentValue = this.datas[index][type];
				}
				this.changeFlag = false;
			},
			changeCurrentFlag () {
				this.changeFlag = true;
				this.$nextTick(() => {
					this.$refs.text.focus();
				})
			},
			changeCurrentValue () {
				let currentPos = this.currentPos;
				if(currentPos.x){
					this.datas[currentPos.y][1] = parseInt(this.currentValue) || 0;
				}
				else{
					this.datas[currentPos.y][0] = this.currentValue;
				}
				this.$emit('change',this.datas);
				this.changeFlag = false;
			},
			addRow() {
				let len = this.datas.length - 1;
				if(this.datas[len][0] || this.datas[len][1]){
					this.datas.push(['未命名', 0]);
					this.$emit('change',this.datas)
				}
			}
		},
		beforeMount(){
			this.datas=this.pdata
		}
	}
</script>

<style lang="less" scoped>
	table *{
		box-sizing: border-box;
	}
	.relative{
		position: relative;
	}
	.absolute{
		position: absolute;
	}
	.data-table{
		display: inline-block;
		table{
			border-spacing: 0;
			font-size: 12px !important;
			color: #626262 !important;
		}
		th,td{
			max-width: 120px;
			border-left: 1px solid #f0f0f0;
			border-bottom: 1px solid #f0f0f0;
			padding: 2px 4px;
			height: 25px !important;
			line-height: 25px !important;
			&>p{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		th,.head{
			background: #BFBFBF;
			text-align: center;
			color: #fff;
		}
		th{
			width: 40px;
		}
		td{
			width: 120px;
			background: #fff;
		}
		td.current{
			box-shadow: 0 0 0 2px #5292f7 inset;
			position: relative;
			&:after{
				content: "";
				display: block;
				width: 5px;
				height: 5px;
				border: 2px solid #fff;
				background: rgb(82, 146, 247);
				position: absolute;
				right: -4px;
				bottom: -4px;
			}
		}
		.add{
			cursor: pointer;
			&:hover{
				background: #ccc;
			}
		}
		#text{
			width: 120px;
			max-width: 141px;
			padding: 2px 4px;
			height: 30px !important;
			line-height: 30px !important;
			font-size: 12px !important;
			color: #000;
			outline: none;
			border: 1px solid #f0f0f0;
			box-shadow: 0 0 0 2px #5292f7 inset;
			display: none;
		}
	}
</style>