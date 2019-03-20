<template>
    <div class="member-wrap">
        
        <div class="member-top">
            <span></span>
            <span>会员续费</span>
        </div>
      
        <div class="member-middle">
            <p class="member-hasDone">你的会员已到期</p>
            <div>
                <p>由于你的会员到期了,会员功能不可使用,缴费会员后,会员<br>功能将自动回复</p>
            </div>
            
            <p class="member-warn"><span class="member-on"></span><span>下次不再提醒</span></p>
        </div>
        <div class="member-foot">
            <span class="design-send charge-later" @click="waitMoment">稍后续费</span>
            <span class="design-send charge-intime" @click="chargeMoney"><span class="design-v"></span>马上续费</span>
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
    waitMoment(){
        this.$emit('closeUpgradeModal')
    },
    chargeMoney(){
        window.open('/price?p=1')
    }
  }

}
</script>
<style lang="less" scoped>
    .member-wrap{
        width:640px;
        height:400px;
        background:#fff;
    }
    .member-top{
        width:100%;
        height:133px;
        padding-top:30px;
        // background:red;
    background-image: url('../headermodal/img/member.svg');
    background-position: -18px ;
        span:nth-child(2){
            display:inline-block;
            color:#fff;
            font-size:24px;
            cursor:default;

        }
        span:nth-child(1){
            display:inline-block;
            background-image: url('../headermodal/img/membercup.svg');
            width: 60px;
            height: 60px;
            vertical-align: middle;
            margin:0 40px 0  30px;

        }
        
    }
    .member-middle{
        height:192px;
        cursor:default;
       .member-hasDone{
            text-align: center;
            color:#626262;
            font-size:16PX;
            margin:27px 0 30px 0;
        }
        div{
            margin:0 auto;
            width: 390px;
            height:40px;
            color:#626262;
            font-size:14px;
            line-height:16px;
        }
        .member-on{
        background-image: url('../headermodal/img/off.png');
        background-repeat: no-repeat;
        width: 22px;
        height: 22px;
        display: inline-block;
        vertical-align: middle;
        margin-right:18px;
        }
        .member-warn{
            margin:15px 0 0 125px;
            color:#9b9b9b;
            font-size:14px;
            cursor:default;
        }
       
        
    }
    .design-send {
        width: 163px;
        height: 38px;
        display: inline-block;
        line-height: 38px;
        text-align: center;
        font-size: 14px;
        margin-left: 75px;
        cursor: pointer;
        }
        .member-foot{
            margin-top:-32px;
            margin-left:50px;
        }
        .charge-later{
            background:#fff;
            border:1px solid #9b9b9b;
             color: #626262;
             &:hover{
                  border:1px solid #07AEFC;
             }
        }
        .charge-intime{
            background:#07aefc;
            color:#fff;
            &:hover{
                opacity: .8;
            }
        }
        
    .design-v {
    vertical-align: middle;
    background-image: url('../headermodal/img/v.png');
    width:18px;
    height:18px;
    display:inline-block;
    margin-right:8px;
}
</style>



