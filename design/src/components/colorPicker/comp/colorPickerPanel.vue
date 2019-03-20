<template>
  <div class="ss-function-colorPickerPanel">
    <div
      class="ss-function-colorPickerPanel-items"
      :class="[{active:e.select},{addColor:!e.f}]"
      v-for="(e,i) in items"
      :style="{background:e.f?e.bg:'',backgroundImage:e.f?'':e.bg}"
      @click="selectCtrl(e,i)"
    ></div>
  </div>
</template>
<script>
  import addColor from '../img/addcolor.jpg'

  export default {
  	name:'ss-function-colorPickerPanel',
    data(){
  		return{
        colors:[
        	'url('+addColor+')','#F7A700','#4CD9D7','#FDBD89','#F1FA6D',
          '#000000','#222222','#444444','#6A6A6A','#7C7C7C',
          '#909090','#9D9D9D','#BCBCBC','#DEDEDE','#FFFFFF',
          '#57F0FF','#20BDFF','#078EFC','#2870F0','#732BFF',
          '#FF449D','#FF4C4C','#FF9D19','#E0FF26','#8AEF63'
        ],
        items:[]
      }
    },
    beforeMount(){
    	this.colors.forEach(e=>{
    		this.items.push(
          {select:false,bg:e,f:/^#/.test(e)}
        )
      })
    },
    methods:{
    	selectCtrl(el,index){
        if(el.f){
        	let arr=[]
	        this.colors.forEach((e,i)=>{
		        arr.push(
			        {select:i===index,bg:e,f:/^#/.test(e)}
		        )
	        })
          this.items=arr
          this.$emit('colorCtrl',el.bg)
        }else {
          this.$emit('setPicker')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .ss-function-colorPickerPanel{
    width: 100%;
    
    &:after{
      content: '';
      display: block;
      clear: both;
    }

    .ss-function-colorPickerPanel-items{
      width: 24px;
      height:24px;
      float: left;
      margin: 0 8px 16px 0;
      background-size: 100% auto;
      background-repeat: no-repeat;
      box-shadow: 0 1px 4px 0 rgba(0,0,0,.16);
      transition: all .2s ease;
      cursor: pointer;
      position: relative;

      &:nth-child(5n){
        margin: 0 0 16px 0;
      }

      &:hover{
        box-shadow: 0 2px 8px 0 rgba(0,0,0,.32);
      }

      &[class~='active']:after{
        position: absolute;
        content: '';
        top: 6px;
        left:4px;
        width: 16px;
        height:12px;
        background: url("../img/select-right.svg") no-repeat;
      }
      &[class~='addColor']:before{
        position: absolute;
        content: '';
        width: 11px;
        height:11px;
        top:6.5px;
        left: 6.5px;
        background: url("../img/addcolor-+.svg") no-repeat;
      }
    }
  }
</style>