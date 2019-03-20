<template>
  <div class="leftPanel-tools-block" :class="{disable:state===3}" @click="state==0?'':$emit('cancel')">
    <div class="leftPanel-tools-block-con" :class="{active:state===2}">
      <div
        class="leftPanel-tools-block-img"
        @click.stop="state==0?$emit('click'):$emit('cancel')"
      >
        <div
          class="leftPanel-tools-block-img-img"
          :style="{background:'url('+data.imgUrl+')'}"
        ></div>
      </div>
      <div class="leftPanel-tools-block-pop1" :class="{active:state===2}"></div>
      <div class="leftPanel-tools-block-pop2" :class="{active:state===2}"></div>
    </div>
    <div class="leftPanel-tools-block-text">
      <span>{{data.name}}</span>
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
			},
			state:{
				required:true,
				default:0
			}
		}

	}
</script>
<style lang="less" scoped>
  .leftPanel-tools-block{
    width: 72px;
    height: 94px;
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

    .leftPanel-tools-block-con{
      width: 72px;
      height: 72px;
      position: relative;
      cursor: pointer;

      &:hover,&[class~='active']{
        .leftPanel-tools-block-img{
          box-shadow: 0 4px 16px 0 rgba(0,0,0,.16);
        }
        .leftPanel-tools-block-pop1{
          top:-5px;
        }
      }

      .leftPanel-tools-block-img{
        width: 72px;
        height: 72px;
        border-radius: 4px;
        background: #ffffff;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,.08);
        position: absolute;
        top:0;
        left:0;
        z-index: 99;

        .leftPanel-tools-block-img-img{
          width: 64px;
          height: 64px;
          margin: 4px;
        }

      }

      .leftPanel-tools-block-pop1{
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
      .leftPanel-tools-block-pop2{
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
    }

    .leftPanel-tools-block-text{
      margin-top: 4px;
      width:100%;
      color: #626262;
      font-size: 12px;
      text-align: center;
    }
  }
</style>