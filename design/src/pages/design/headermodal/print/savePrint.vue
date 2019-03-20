<template>
<div>
  <div class="catch-wrap">
    <div class="catch-top">
      <img src="../img/Artboard.svg" alt="">
    </div>
    <div class="catch-bottom">
      <p class="save-error">生成保存成功，点击确定去印刷哟</p>
      <a  class="catch-fresh surePrint" @click="goToPrint">确定</a>
    </div>
    
  </div>
  <div class="cktprint-place">
       
  </div>
  <div class="cktprint-content">
     <span>在线印刷</span>
      <span>急速发货</span>
      <span>超高性价比</span>
      <span class="have-try" @click="goToPrint">去印刷</span>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  props:{
    designId:{
      type:String
    }
  },
  methods:{
    //去打印
    goToPrint(){
       this.$emit('closePrintModal')
      window.open('/orderdetails?d='+this.designId)
     
    }
  }
}
</script>
<style lang="less" scoped>
.catch-wrap {
  width: 640px;
  height: 320px;
  background: #fff;
  margin: 0 auto;
  color: #6a6a6a;
}

.catch-top {
  text-align: center;
  padding-top: 54px;
  img{
    width: 80px;
    height: 80px;
  }
}

.catch-bottom {
  text-align: center;
}

.catch-save {
  font-weight: bold;
}


.catch-fresh {
  width: 160px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  display: inline-block;
  color: #fff;
  margin-top:32px;
}
.cancell{
  color: #9B9B9B;
  border: 1px solid #D8D8D8;
  background-color: #FFF;
  margin-right: 32px;
  &:hover{
      opacity:0.7;
  }
}
.surePrint{
    background: #07aefc;
    cursor:pointer;
    &:hover{
      opacity:0.7;
    }
}
.save-error{
  margin-top:45px;
}
.catch-cellphone {
  color: #07aefc;
}
.cktprint-place{
  width:100%;
  height: 112px;
  background:#595959;
  text-align:center;
  opacity: .5;
  width: 640px;
  margin:0 auto;
}
.cktprint-content{
   width:100%;
  height: 112px;
  text-align:center;
  width: 640px;
  margin:0 auto;
  position: relative;
  top: -112px;
  background: url('../img/sprintBackGround.png');
  background-size: cover;
  background-position: -1px;
  .have-try{
    width:120px;
    height:40px;
    line-height:40px;
    display:inline-block;
    color:#fff;
    background:#07aefc;
    border-radius:60px;
    margin-left:44px;
    cursor:pointer;
  }
   span{
    display:inline-block;
    line-height:112px;
    text-align:center;
    font-size:20px;
    color:#fff;
    font-weight:bolder;
  }
  span:nth-child(2){
    margin:0 30px;
  }
}
</style>