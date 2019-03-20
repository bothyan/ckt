<template>
  <div
    class="leftPanel-upload-results-item"
    :style="[data.style,{display,transform,opacity}]"
    ref="dom"
    @mousedown.left="!selectStart&&addElement($event)"
    @click="selectStart&&$emit('select',!selected)"
  >
    <img :src="data.sourceData.imgUrl" alt="" @dragstart.prevent="()=>false">
    <div
      class="item-select"
      v-show="selectStart"
      :class="{active:selectStart&&selected}"
    ></div>
    <transition name="item-progress-transition">
      <div
        class="item-progress"
        v-if="data.sourceData.uploadId"
        :style="{height:data.sourceData.uploadProgress+'%'}"
      >
        <span>{{data.sourceData.uploadProgress+'%'}}</span>
      </div>
    </transition>
    <div class="item-more" v-if="false"></div>
    <div class="item-name" v-if="false"></div>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name:'leftPanel-upload-results-item',
    data(){
      return{
        display:'block',
        transform:'',
        opacity:1
      }
    },
    computed:{
      ...mapGetters({
        elementData:'getPreparedElementData',
        addElementDone:'getAddElementDone',
      }),
    },
    methods: {
      ...mapActions({
        setElementData:'setLeftPanelElementData',
        setElementDataReady:'setLeftPanelElementReady',
      }),
      addElement(e){
        let {sourceData}=this.data
        let elemRect={
          width:this.$refs.dom.offsetWidth,
          height:this.$refs.dom.offsetHeight,
        }
        let data={
          'data-type':'img',
          'data-img-kind':sourceData.dt,
          'data-elem':{
            'id':sourceData.mid,
            'width':elemRect.width,
            'height':elemRect.height,
            'opacity':1
          }
        }
//        this.display='none'
        this.setElementData({
          data,
          ...sourceData,
          mousePos:e?{cx:e.clientX,cy:e.clientY,x:e.offsetX,y:e.offsetY}:null,
          elemRect,
          $node:this
        })
      }
    },
    props:{
      data:{},
      selectStart:{},
      selected:{},
      addToPageCtrl:{}
    },
    watch:{
      addToPageCtrl(){
        this.addElement()
      },
    },
    mounted(){
      this.transform='translateY(-50%)'
      this.opacity=0
      setTimeout(()=>{
        this.transform=''
        this.opacity=1
        this.$emit('updateMountedIndex',this.data.index)
      },30*(this.data.index-this.data.sourceData.hasMountedIndex))
    },
  }
</script>
<style lang="less" scoped>
  .leftPanel-upload-results-item{
    position: absolute;
    display: block;
    overflow: hidden;
    transition: all .4s ease;
    cursor: pointer;
    /*&:hover{*/
    /*box-shadow: 0 4px 8px 0 rgba(0,0,0,.16);*/
    /*}*/

    &>img{
      display: block;
      width: 100%;
      height: 100%;
    }

    .item-progress-transition{

    }

    .item-progress{
      position: absolute;
      display: block;
      bottom:0;
      left:0;
      width: 100%;
      background: rgba(7,174,252,.4);
      transition: height .4s ease;

      span{
        position: absolute;
        bottom: 0;
        left:0;
        font-size: 14px;
        color: #FFFFff;
        width: 100%;
        display: inline-block;
        text-align: center;
      }
    }
    .item-select{
      position: absolute;
      width: 24px;
      height:24px;
      top: 8px;
      right:8px;
      border-radius: 50%;
      background: #FFFFFF;
      cursor: pointer;

      &:after{
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top:2px;
        left:2px;
        background: #BFBFBF;
        z-index: 9;
        border-radius: 50%;
      }

      &[class~='active']{
        &:after{
          background: #07AEFC;
        }
        &:before{
          content: '';
          position: absolute;
          width: 13px;
          height:9px;
          top:8px;
          left:6px;
          background: url("../img/leftPanel-ok.svg") no-repeat;
          z-index: 10;
        }
      }
    }
  }
</style>