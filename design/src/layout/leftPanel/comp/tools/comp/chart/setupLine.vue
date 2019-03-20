<template>
  <div class="chart-setup-line">
    <span>{{data.des}}</span>
    <div
      class="chart-setup-line-button"
      :class="{active:status}"
      @click="$emit('sel',!status)"
    ></div>
  </div>
</template>
<script>
  export default {
  	name:'chart-setup-line',
    data(){
  		return{

      }
    },
    props:{
    	status:{
    		default:false
      },
      data:{}
    }
  }
</script>
<style lang="less" scoped>
  .chart-setup-line{
    width:280px;
    height: 40px;
    background: #FFFFFF;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,.08);
    padding: 0 16px;
    text-align: left;

    &>span{
      line-height: 40px;
      font-size: 12px;
      color: #4A4A4A;
    }

    .chart-setup-line-button{
      float: right;
      width: 32px;
      height:18px;
      border-radius: 16px;
      background: #ECECEC;
      margin: 11px 0;
      position: relative;
      transition: all .2s ease;
      cursor: pointer;

      &:after{
        content: '';
        display: block;
        transition: all .2s ease;
        width: 14px;
        height:14px;
        background: #BFBFBF;
        top:2px;
        left: 2px;
        position: absolute;
        border-radius: 7px;
      }

      &[class~='active']{
        background: linear-gradient(to bottom right, #5EA2FF, #00E3FF);

        &:after{
          left: 16px;
          background: #FFFFff;
        }
      }
    }
  }
</style>
