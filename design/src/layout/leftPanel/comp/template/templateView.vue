<template>
  <div class="pop-wrap clearfix">
      <div class="pop-left fl">
          <div class="img-show" v-if="imgArray.length>1">
                <ul :style="{width:(imgArray.length*510+(imgArray.length*50))+'px',left:slideleft,}">
                  <li v-for="(img, mark) in imgArray" :key="mark"  :style="{ backgroundImage: 'url(' + img + ')' }">
                       
                  </li>
                </ul>
          </div>
          <div v-else>
              <ul class="single-page">
                  <li>
                      <img :src="imgArray[0]"/>
                  </li>
              </ul>
          </div>
          <span class="right-arrow" @click="goLeft" v-if="imgArray.length>1"><img :src="left"></span>
          <span class="left-arrow" @click="goRight" v-if="imgArray.length>1"><img :src="right"></span>
      </div>
      <div class="pop-right fr">
        <div class="pop-title">
          <span>此模板是VIP专享模板</span><br/>
          <span>请开通创客贴VIP会员免费使用</span>
        </div>
        <ul class="design_vip_list upvip-list">
          <li class="design_open clearfix vip-icon">
            <div class="vip-left fl ">
              <img src="./img/group5.svg" alt="">
            </div>
            <div class="vip-right fr margin1">
              <span>专属模板</span><br>
              <span>1000+付费模板，无限使用</span>
            </div>
          </li>
            <li class="design_open clearfix vip-icon">
            <div class="vip-left fl ">
              <img src="./img/group7.svg" alt="">
            </div>
            <div class="vip-right fr margin2">
              <span>版权字体</span><br>
              <span>40+会员专属字体</span>
            </div>
          </li>
            <li class="design_open clearfix vip-icon">
            <div class="vip-left fl ">
              <img src="./img/group4.svg" alt="">
            </div>
            <div class="vip-right fr margin3">
              <span>文件夹管理</span><br>
              <span>云端储存轻松管理</span>
            </div>
          </li>
            <li class="design_open clearfix vip-icon">
            <div class="vip-left fl">
              <img src="./img/xz.svg" alt="">
            </div>
            <div class="vip-right fr margin4">
              <span>智能变换尺寸</span><br>
              <span>一个设计，秒变多个尺寸</span>
            </div>
          </li>
            <li class="design_open clearfix vip-icon">
            <div class="vip-left fl">
              <img src="./img/group6.svg" alt="">
            </div>
            <div class="vip-right fr margin5">
              <span>更多权益</span><br>
              <span>更多会员权益，等你来发现</span>
            </div>
          </li>
           <li class="design_open clearfix design-vip">
              <a class="go-vip" @click="goToCharge">立即开通</a>
          </li>
      </ul>
      </div>
  </div>
</template>
<script>
import right from './img/right.png'
import left from './img/left.png'
export default {
  data(){
    return {
      right,
      left,
      index:0
    }
  },
  props:{
      imgArray:{
        type:Array,
        default() {
          return [
           
          ]
        }
      }
  },
  computed:{
    slideleft(){
      console.log(this.index)
      return -this.index*560+'px'
    }
  },
  mounted(){
    
  },
  methods:{
    goLeft(){
       if(this.index==0){
         this.index = this.imgArray.length
       }
         this.index-=1;
      
    },
    goRight(){
      if(this.index==this.imgArray.length-1){
        this.index =-1
      }
      this.index+=1
    },
    goToCharge(){
      window.open('/price?p=1')
    }
  }
}
</script>
<style lang="less" scoped>
.image-enter-active {  
    transform: translateX(0);  
    transition: all 1.5s ease;  
  }  
  .image-leave-active {  
    transform: translateX(-100%);  
    transition: all 1.5s ease;  
  }  
  .image-enter {  
    transform: translateX(100%);  
  }  
  .image-leave {  
    transform: translateX(0);  
  }  
.clearfix:before,
.clearfix:after {
    display: table;
    content: " ";
}
.clearfix:after {
    clear: both;
}
.clearfix {
    *zoom: 1;
}
.fl{
  float:left;
}
.fr{
  float:right;
}
  .pop-wrap{
    width:960px;
    height:610px;
    border-radius:5px;
  }
  .pop-left{
    width:610px;
    height:490px;
    background:#f0f0f0;
    position:relative;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;

  }
  .pop-right{
    width:350px;
    height:100%;
  }
  .design_vip_list{
    width:350px;
  height: 410px;
	background-color: #fff;
	z-index: 20000;
  transition: opacity .3s;
   border-bottom-right-radius: 5px;
}
.design_vip_why{
  height:90px;
  line-height:55px;
  color:#494949;
  text-align:center;
  border-bottom: 3px solid #80EDFF;
  font-weight:normal;
  font-size:18px;
}
.vip-icon{
  padding-left:70px;
  padding-top:13px;
  height:60px;
  cursor: default;
  img{
    vertical-align: middle;
  }
}
.vip-right{
  span:nth-of-type(2){
    color:#9b9b9b;
    margin-top: 3px;
    display: inline-block;
  }
  span:nth-of-type(1){
    color:#494949;
  }
}

  
  .margin1{
    margin-right:65px;
  }
  .margin2{
    margin-right:120px;
  }
  .margin3{
    margin-right:118px;
  }
  .margin4{
    margin-right:76px;
  }
  .margin5{
    margin-right:61px;
  }

.vip-right{
  span:nth-of-type(2){
    color:#9b9b9b;
    margin-top: 3px;
    display: inline-block;
  }
  span:nth-of-type(1){
    color:#494949;
  }
}
.pop-title{
  width:100%;
  height:80px;
  background:#fff;
  color:#6b6b6b;
  font-size:14px;
  text-align:center;
  font-weight:500;
  padding-top:34px;
  border-top-right-radius:5px;
}
.go-vip{
  width:170px;
  height: 30px;
  display:inline-block;
  text-align:center;
  line-height:30px;
  background:#07aefc;
  color:#fff;
  margin-left: 20px;
  &:hover{
    opacity: .8;
  }
}
.design-vip{
   padding-left:70px;
  padding-top:28px;
  height:110px;
}
.go-vip{
  cursor:pointer;
}
.img-show{
  width:510px;
  height:280px;
  position:relative;
  left: 0;
  top:105px;
  bottom:0;
  right:0;
  margin:auto;
  overflow: hidden;
  ul{
    overflow:hidden;
    height:280px;
    position:relative;
    transition: left .4s ease;
  }
  img{
    width:510px;
    height:280px;
  }
  li{
    float:left;
    margin-right:50px;
    background-position: center;
    background-size: contain;
    width: 510px;
    height: 280px;
    background-repeat:no-repeat;
  }
  
}
.left-arrow{
  position:absolute;
  display:inline-block;
  top: 50%;
  right: 21px;
  cursor:pointer;
}
.right-arrow{
  position:absolute;
  display:inline-block;
  top: 50%;
  left: 21px;
  cursor:pointer;
}
.single-page{
  width: 610px;
  height: 415px;
  img{
    max-width:610px;
    max-height:415px;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 0;
    right: 0;
  }
}
</style>


