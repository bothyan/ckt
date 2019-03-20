<template>
  <div class="leftPanel-material-block" :class="{disable:state===3}" @click="state==0?'':$emit('cancel')">
    <div class="leftPanel-material-block-con" :class="{active:state===2}">
      <div
        class="leftPanel-material-block-img"
        @click.stop="state==0?$emit('click'):$emit('cancel')"
      >
        <div
          class="leftPanel-material-block-img-img"
          :style="{background:'url('+data.imgUrl+')'}"
        ></div>
      </div>
      <div class="leftPanel-material-block-pop1" :class="{active:state===2}"></div>
      <div class="leftPanel-material-block-pop2" :class="{active:state===2}"></div>
      <div class="leftPanel-material-block-text">
        <span>{{data.firstKindName}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
  	data(){
  		return{

      }
    },
    props:{
  		data:{
  			required:true,
        default:{imgUrl:1,firstKindName:'热门素材'}
      },
      state:{
  			required:true,
        default:0
      }
    }

  }
</script>
<style lang="less" scoped>
  .leftPanel-material-block{
    width: 72px;
    height: 87px;
    position: relative;
    transition: all .3s ease;

    &[class~='disable']{
      opacity: .56;
      &:after{
        content: '';
        width: 100%;
        height:100%;
        position: absolute;
        z-index: 100;
        top:0;
        left:0;
      }
    }

    .leftPanel-material-block-con{
      width: 72px;
      height: 85px;
      position: relative;
      cursor: pointer;

      &:hover,&[class~='active']{
        .leftPanel-material-block-img{
          box-shadow: 0 4px 16px 0 rgba(0,0,0,.16);
        }
        .leftPanel-material-block-pop1{
          top:-5px;
        }
      }

      .leftPanel-material-block-img{
        width: 72px;
        height: 85px;
        border-radius: 4px;
        overflow: hidden;
        background: #ffffff;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,.08);
        position: absolute;
        top:0;
        left:0;
        z-index: 99;

        .leftPanel-material-block-img-img{
          width: 72px;
          height: 85px;
          background-size: 72px auto !important;
        }

      }

      .leftPanel-material-block-pop1{
        width: 62px;
        height: 62px;
        border-radius: 4px;
        background: #ffffff;
        box-shadow: 0 4px 16px 0 rgba(0,0,0,.16);
        position: absolute;
        top:0;
        left:5px;
        z-index: 98;
        transition: top .3s ease;

        &[class~='active']{
          top:-5px;
        }
      }
      .leftPanel-material-block-pop2{
        width: 52px;
        height: 52px;
        border-radius: 4px;
        background: #ffffff;
        box-shadow: 0 4px 16px 0 rgba(0,0,0,.16);
        position: absolute;
        top:0;
        left:10px;
        z-index: 97;
        transition: top .3s ease;

        &[class~='active']{
          top:-9px;
        }
      }
      .leftPanel-material-block-text{
        position: absolute;
        bottom: 4px;
        width:100%;
        color: #626262;
        font-size: 12px;
        text-align: center;
        z-index: 99;
      }
    }
  }
</style>