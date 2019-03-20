<template>
  <div id="download-wait">
  <div class="download-onload">
      <div id="download-spinner" class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
      </div>
  </div>
  <div class="download-wait-title" v-if="waitAnimationWords==''&&changeAnimationWords==''&&isVip==2">尊敬的VIP用户<br/>你的设计将会优先生成</div>
  <div class="download-wait-title" v-if="waitAnimationWords==''&&changeAnimationWords==''&&isVip==1">设计生成排队中...</div>
  <div class="download-wait-text" v-if="waitAnimationWords==''&&changeAnimationWords==''&&isVip==1">PS:加入VIP可以优先生成哦~</div>
  <div class="download-wait-title">{{changeAnimationWords}}</div>
  <div class="download-wait-text">{{waitAnimationWords}}</div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name:'loadAnimation',
  data(){
    return {
        
    }
  },
  props:{
    changeAnimationWords:{
      type:String
    },
    waitAnimationWords:{
      type:String
    }
  },
  computed:{
    ...mapGetters({
      isVip:'getIsVip'
    })
  },
  mounted(){
    console.log(this.changeAnimationWords)
  }
}
</script>
<style lang="less" scoped>
   #download-wait{
	  .spinner {
      width: 150px;
	    text-align: center;
	 }
}
.spinner > div {
  width: 30px;
  height: 30px;
  background-color: #07aefc;
 
  border-radius: 100%;
  display: inline-block;
  -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
  animation: bouncedelay 1.4s infinite ease-in-out;
  /* Prevent first frame from flickering when animation starts */
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
 
.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
 
.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
 
 
@keyframes bouncedelay {
  0%, 80%, 100% { 
    transform: scale(0.0);

  } 40% { 
    transform: scale(1.0);

  }
}
#download-wait {
    width: 400px;
    height: 200px;
    background: linear-gradient(to bottom right, #00E3FF 0%, #00D5FF 35%, #5EA2FF 100%);
    z-index: 20000;
    opacity: .8;
    padding-top:20px;
}
.download-onload {
    margin-top: 20px;
}
#download-spinner {
    width: 150px;
    margin: 0px auto 0px auto;
}
#download-spinner div {
    background-color: #FFF;
}
.download-wait-title {
    font-size: 18px;
    margin-top: 20px;
    text-align: center;
    color: #FFF;
}
.download-wait-text {
    font-size: 12px;
    margin-top: 16px;
    text-align: center;
    color: #FFF;
}
</style>


