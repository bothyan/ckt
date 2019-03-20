<template>
    <div class="chat">
      <div class="shareBox">
        <div class="wechat" @click="shareTo('weixin')"></div>
        <div class="qq"  @click="shareTo('qq')"></div>
        <div class="weibo" @click="shareTo('weibo')"></div>
        <slot></slot>
      </div>
    </div>
</template>
<script>

export default {
  name:'sharetool',
  data(){
    return {
        //qq分享默认图片和描述
        shareImg:'http://eyuankupub.oss-cn-beijing.aliyuncs.com/sys/weixinorcode.png',
        sharesummary:'快来看我在创客贴www.chuangkit.com设计的美图吧！这里有海量免费的素材和模板，只要托拉拽就可以免费在线设计出心仪的图片啦'
    }
  },
  props:{
    shareLink:'',
    shareContent:'',
    shareTitle:{
      type:String,
      default:'创客贴活动'
    },
    ownImg:''
  },
  computed:{
  },
  components:{


  },
  mounted(){
    
  },
  methods:{
   shareTo(val) { // 分享到第三方
      switch (val) {
        case 'qq':
          let qq = "http://connect.qq.com/widget/shareqq/index.html?url=" + this.shareLink +
              "&title=" + this.shareTitle + "&site=www.chuangkit.com" + "&summary=" + this.sharesummary +
              "&pics=" +  this.shareImg  + "&desc=" + this.shareContent;
          window.open(qq);
          break;
        case 'weixin':
          this.$emit('showqcode')
          break;
        case 'weibo':
          let weibo = "http://service.weibo.com/share/share.php?url=" + this.shareLink +
              "&content=utf-8" + "&title=" + this.shareContent + "&pic=" +
              this.ownImg+"||"+this.shareImg + "&appkey=3818167868";
          window.open(weibo);
          break;
      }
    }
  }
  
  
}
</script>
<style lang="less" scoped>
  .shareBox{
    width:50%;
    margin:0 auto;
    height:100%;
    display:flex;
    div{
      flex:1;
      cursor:pointer;
    }
  }
  
.wechat{
  background:url(../img/wechatgray.svg) no-repeat;
  background-position: 50%;
  &:hover{
    background:url(../img/wechatcopy.svg) no-repeat;
    background-position: 50%;
  }
}
.qq{
  background:url(../img/qqgray.svg) no-repeat;
  background-position: 50%;
  &:hover{
    background:url(../img/qqcopy.svg) no-repeat;
    background-position: 50%;
  }
}
.weibo{
  background:url(../img/xinlang.svg) no-repeat;
  background-position: 50%;
  &:hover{
    background:url(../img/xinlanggray.svg) no-repeat;
    background-position: 50%;
  }
}

</style>


