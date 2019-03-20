<template>
  <div class="ss-func-prompt">
    <div class="ss-func-prompt-text">
      {{text}}
    </div>
    <div class="ss-func-prompt-button">
      <span @click="doIt">确定</span>
      <span @click="$emit('close')">取消</span>
    </div>
  </div>
</template>
<script>
  export default {
  	name:'ss-func-prompt',
    data(){
  		return{

      }
    },
    methods:{
    	doIt(){
		    this.func&&this.func()
		    this.$emit('close')
      }
    },
    props:{
    	text:{
    		required:true
      },
      func:{
    		required:true
      },
    }
  }
</script>
<style lang="less" scoped>
  .ss-func-prompt{
    width: 221px;
    height:86px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
    box-sizing: border-box;
    padding: 16px 16px 8px 16px;
    background: #FFFFff;
    position: relative;

    .ss-func-prompt-text{
      font-size: 12px;
      color: #4A4A4A;
      line-height: 18px;
    }
    .ss-func-prompt-button{
      position: absolute;
      width: 189px;
      height: 20px;
      bottom: 8px;
      left:16px;

      span{
        width: 38px;
        height:18px;
        border: 1px solid #C0CCDA;
        background: #FFFFff;
        cursor: pointer;
        line-height: 18px;
        color: #475669;
        font-size: 12px;
        text-align: center;
        float: right;
        margin-left: 8px;

        &:nth-child(1){
          border: 1px solid #00ACFF;
          background: #00ACFF;
          color: #FFFFff;
        }
      }
    }
  }
</style>