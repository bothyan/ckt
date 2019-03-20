<template>
    <div class="member-wrap">
        
        <div class="member-top">
            <span class="membercup"></span>
            <span class="upgradevip">升级会员</span><br>
            <span class="price"><span>￥</span><span>20</span><span>/月</span></span><br>
            <span class="onlyvip">个人会员版</span>
        </div>
        <div class="content clearfix">
            <div class="content-left">
                <div class="content-left-parts">
                    <span class="join-member join">加入会员计划</span><br>
                    <span class="join join-morerights">更多特权</span>
                </div>
                <div class="join-wrap">
                    <span class="join-upgrade join-btn" @click="upToBeMember"><span class="design-v"></span>升级为会员</span>
                    <span class="join-later join-btn" @click="waitMoment">稍后</span>
                </div>
            </div>
            <div class="content-right">
                <p>加密分享</p>
                <p>上传空间管理</p>
                <p>我的设计文件管理</p>
                <p>场景智能变换</p>
                <p>置入我的设计</p>
                <p>回收站功能</p>
                <p>透明背景输出</p>
                <p>40多种版权会员字体</p>
                <p>VIP标识</p>
            </div>
        </div>
      
     
       
    </div>
</template>
<script>

export default {
  data(){
        return {

        }
  },
  methods:{
      upToBeMember(){
        window.open('/price?p=1')
      },
      waitMoment(){
          this.$emit('closeUpgradeModal')
      }
  }
}
</script>
<style lang="less" scoped>
.member-wrap {
    width: 640px;
    height: 400px;
    background: #fff;
    cursor:default;
}

.member-top {
    width: 100%;
    height: 180px;
    padding-top: 30px;
    background-image: url('../headermodal/img/upgrademember.svg');
    background-position: -18px;
    .membercup {
        display: inline-block;
        background-image: url('../headermodal/img/membercup.svg');
        width: 60px;
        height: 60px;
        vertical-align: middle;
        margin: 0 40px 0 30px;
    }
}

.price {

    span:nth-child(1) {
        font-size: 12px;
        color: #fff;
    }
    span:nth-child(2) {
        font-size: 24px;
        color: #fff;
    }
    span:nth-child(3) {
        font-size: 14px;
        color: #fff;
    }
}

.onlyvip {
    color: #fff;
    font-size: 14px;
    display: inline-block;
}

.price,
.onlyvip {
    margin-left: 120px;
}

.upgradevip {
    color: #fff;
    font-size: 24px;
    display: inline-block;
    margin-left: -10px;
}

.content-left {
    width: 45%;
    height: 220px;
    float: left;
}

.content-right {
    width: 45%;
    height: 220px;
    float: right;
}

.content-left-parts .join {
    display: inline-block;
}

.content-left-parts {
    padding-left: 120px;
    margin-top: 26px;
}

.join {
    background: #BFBFBF;
    color: #f4f4f4;
    padding:3px 5px;
    font-size:12px;
}

.join-btn {
    width: 163px;
    height: 38px;
    display: inline-block;
    line-height: 38px;
    text-align: center;
    font-size: 14px;
    margin-left: 120px;
    cursor: pointer;
}

.join-later {
    background: #fff;
    border: 1px solid #9b9b9b;
    color: #626262;
    &:hover{
        border:1px solid #07AEFC;
    }
}

.join-upgrade {
    background: #07aefc;
    color: #fff;
    margin-top: 25px;
    margin-bottom: 25px;
    &:hover{
        opacity: .8;
    }
}

.join-wrap {
    margin-top: -6px;
}

.join-morerights {
    margin-top: 5px;
}

.content-right p {
    margin: 0 0 8px 123px;
    line-height: 14px;
    font-size: 14px;
    text-align: left;
    color: #07aefc;
}

.content-right {
    position: relative;
    top: -10px;
}

.design-v {
    vertical-align: middle;
    background-image: url('../headermodal/img/v.png');
    width:18px;
    height:18px;
    display:inline-block;
    margin-right:8px;
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

</style>