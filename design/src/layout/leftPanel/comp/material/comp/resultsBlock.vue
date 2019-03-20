<template>
  <div
    class="leftPanel-common-results-item"
    :style="[data.style,{display,transform,opacity}]"
    :class="{active:specialItem===''&&showMore,addImg:specialItem==='addImg'}"
    @mousedown.left="addElement"
  >
    <div class="container-noStyle" v-if="specialItem===''">
      <img
        :src="data.sourceData.imgUrl+'@'+data.width*2+'w.src'"
        alt="" @dragstart.prevent="()=>false"
        ref="dom"
      >
      <div
        class="leftPanel-common-results-item-dots"
        :class="[{active:showMore},{isLine}]"
        @click="$emit('select',!showMore)"
        @mousedown.stop=""
      >
      </div>
      <div
        class="leftPanel-common-results-item-collect"
        :class="[{active:isCollected},{isLine}]"
        @click="doCollect"
        @mousedown.stop=""
        v-if="type!=='background'&&type!=='font'"
      >
      </div>
      <div
        class="leftPanel-common-results-item-showMore"
        v-show="showMore"
        :style="{top}"
        @mousedown.stop=""
      >
        <p>
          <span>上传者：</span>
          <span>{{nickname}}</span>
        </p>
        <p>
          <span>关键词：</span>
          <span>{{keywords}}</span>
        </p>
      </div>
    </div>
    <div class="container-noStyle" v-if="specialItem==='addImg'">
      <div
        class="leftPanel-common-results-item-addImg"
        @click="addImg"
        @mousedown.stop=""
      >
        <span>添加图片</span>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import user from 'dataBus/user'

  export default{
    name:'leftPanel-common-results-item',
    data(){
      return{
//				showMore:false
        isCollected:false,
        display:'block',
        transform:'',
        opacity:1
      }
    },
    props:{
      data:{},
      showMore:{
        default:false
      },
      type:{},
      collectedMaterialIds:{
        default:''
      },
      isLine:{
        default:false
      },
      specialItem:{
        default:''
      }
    },
    computed:{
      top(){
        let top=Number.parseFloat(this.data.style.top)
          +Number.parseFloat(this.data.style.height)+8
        return top+'px'
      },
      ...mapGetters({
        addElementDone:'getAddElementDone',
        getUploadImgCtrl:'getUploadImgCtrl',
      }),
      nickname(){
        let str=""
        try{
          str=decodeURIComponent(this.data.sourceData.nickname)
        }catch (e){
          str=this.data.sourceData.nickname
        }
        return str
      },
      keywords(){
        let str=""
        try{
          str=decodeURIComponent(this.data.sourceData.keywords)
        }catch (e){
          str=this.data.sourceData.keywords
        }
        return str
      },

    },
    methods: {
      ...mapActions({
        setElementData:'setLeftPanelElementData',
        setElementDataReady:'setLeftPanelElementReady',
        setMessageShow:'setMessageShow',
        showLogreg:'setLogregShow',
        setIndex:'setLeftPanelIndex',
        setUploadImgCtrl:'setUploadImgCtrl'
      }),
      addImg(){
        this.setIndex(6)
        this.$nextTick(()=>{
          this.setUploadImgCtrl(!this.getUploadImgCtrl)
        })
      },
      addElement(e){
        let {sourceData}=this.data,dataType='元素类型未定义'
        let elemRect={
          width:this.$refs.dom.offsetWidth,
          height:this.$refs.dom.offsetHeight,
        }
//        console.log(sourceData)
        switch (this.type){
          case 'material' :dataType=/^image\/svg/.test(sourceData.content_type)?'svgImage':'img';break
          case 'background':dataType='background';break
          case 'svgFrame':dataType='svgFrame';break
          case 'font': dataType='font';break
        }
        let	data
        if(dataType!=='font'){
          data={
            'data-type':dataType,
            'data-img-kind':sourceData.content_type,
            'data-elem':{
              'id':sourceData.material_id,
              'data-key':sourceData.img_key,
              'width':elemRect.width,
              'height':elemRect.height,
              'opacity':1
            }
          }
        }else {
          data={
            'data-type':dataType,
            'fileUrl':sourceData.fileUrl,
            'width':elemRect.width,
            'height':elemRect.height,
          }
        }

        if(this.type==='background'){
          this.$emit('postData',{data,imgUrl:sourceData.imgUrl+'@'+this.data.width*2+'w.src'})
        }else {
//          this.display='none'
          this.setElementData({
            data,
            ...sourceData,
            imgUrl:sourceData.imgUrl+'@'+this.data.width*2+'w.src',
            mousePos:{cx:e.clientX,cy:e.clientY,x:e.offsetX,y:e.offsetY},
            elemRect,
            $node:this
          })
        }
      },
      doCollect(){
        if(this.isCollected){
          this.$http.post('/material/deleteCollectMaterial',{id:this.data.sourceData.material_id})
          .then(res=>{
            if(res.data.body){
              switch (res.data.body.code){
                case 1:
                  this.isCollected=false
                  this.$emit('updateCollectedMaterialIds')
                  this.setMessageShow({placeHolder:'取消收藏成功',kind:'success'})
                  user.removeCollectedMaterialId(this.data.sourceData.material_id)
                  break
                case -1:
                  this.setMessageShow({placeHolder:'取消收藏失败',kind:'error'})
                  console.warn('参数有误')
                  break
                case -2:
                  this.setMessageShow({placeHolder:'请登录',kind:'error'})
                  this.showLogreg(1)
                  break
                case -3:
                  this.setMessageShow({placeHolder:'取消收藏失败，系统错误',kind:'error'})
                  break
              }
            }
          },err=>{
            this.setMessageShow({placeHolder:'网络出错',kind:'error'})
          })
        }else {
          this.$http.post('/material/collectMaterial',{id:this.data.sourceData.material_id})
          .then(res=>{
            if(res.data.body){
              switch (res.data.body.code){
                case 1:
                  this.isCollected=true
                  this.$emit('updateCollectedMaterialIds')
                  this.setMessageShow({placeHolder:'收藏成功',kind:'success'})
                  user.addCollectedMaterialId(this.data.sourceData.material_id)
                  break
                case 0:
                  this.setMessageShow({placeHolder:'收藏失败',kind:'error'})
                  break
                case -1:
                  this.setMessageShow({placeHolder:'收藏失败',kind:'error'})
                  console.warn('参数错误')
                  break
                case -2:
                  this.setMessageShow({placeHolder:'请登录',kind:'error'})
                  this.showLogreg(1)
                  break
                case -3:
                  this.setMessageShow({placeHolder:'收藏失败',kind:'error'})
                  console.warn('素材不存在')
                  break
                case -4:
                  this.setMessageShow({placeHolder:'收藏失败',kind:'error'})
                  console.warn('查询到的数据有误')
                  break
                case -5:
                  this.setMessageShow({placeHolder:'收藏失败',kind:'error'})
                  console.warn('素材已被删除')
                  break
                case -6:
                  this.setMessageShow({placeHolder:'收藏失败',kind:'error'})
                  console.warn('不是官方素材')
                  break
                case -7:
                  this.setMessageShow({placeHolder:'收藏失败',kind:'error'})
                  console.warn('该素材是隐藏素材')
                  break
                case -8:
                  this.setMessageShow({placeHolder:'素材已收藏',kind:'warning'})
                  console.warn('用户已收藏该素材')
                  break
              }
            }
          },err=>{
            this.setMessageShow({placeHolder:'收藏失败,网络出错',kind:'error'})
          })
        }
      }
    },
    watch:{
      collectedMaterialIds(){
        let co=false
        this.collectedMaterialIds.split(',').forEach(ids => {
          if (this.data.sourceData.material_id === (ids | 0)) {
            co = true
          }
        })
        this.isCollected=co
      },
      data: {
        handler() {
          let co=false
          this.collectedMaterialIds.split(',').forEach(ids => {
            if (this.data.sourceData.material_id === (ids | 0)) {
              co = true
            }
          })
          this.isCollected=co
        },
        deep: true
      },
    },
    mounted(){
      this.transform='translateY(-50%)'
      this.opacity=0
      setTimeout(()=>{
        this.transform=''
        this.opacity=1
        this.$emit('updateMountedIndex',this.data.sourceData.index)
      },30*(this.data.sourceData.index-this.data.sourceData.hasMountedIndex))
    },
    beforeMount(){
      let co=false
      this.collectedMaterialIds.split(',').forEach(ids => {
        if (this.data.sourceData.material_id === (ids | 0)) {
          co = true
        }
      })
      this.isCollected=co
    },
  }
</script>
<style lang="less" scoped>
  .leftPanel-common-results-item{
    position: absolute;
    display: flex;
    align-items: center;
    /*overflow: hidden;*/
    transition: all .4s ease;
    cursor: pointer;

    /*&:hover{*/
    /*box-shadow: 0 4px 8px 0 rgba(0,0,0,.16);*/
    /*}*/

    .container-noStyle{
      width: 100%;
      height: 100%;

      .leftPanel-common-results-item-addImg{
        width: 88px;
        height: 88px;
        background: #07aefc;
        position: relative;

        &:after{
          content: '';
          display: block;
          position: absolute;
          top: 14px;
          left:25px;
          height:35px;
          width:35px;
          background: url("../img/addNewImgToFolder.svg") no-repeat;
        }

        &>span{
          color: #FFFFff;
          display: inline-block;
          position: absolute;
          bottom:14px;
          left:0;
          width: 100%;
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          text-align: center;
        }

        &:hover{
          background: linear-gradient(to bottom right, #5EA2FF, #00E3FF);
        }
      }

      &>img{
        display: block;
        width: 100%;
        min-height: 1px;
      }

      &:hover,&[class~='active']{
        .leftPanel-common-results-item-dots{
          display: block;
        }
        .leftPanel-common-results-item-collect{
          display: block;
        }
      }

      .leftPanel-common-results-item-dots{
        display: none;
        position: absolute;
        width: 16px;
        height: 16px;
        left: 6px;
        bottom:6px;
        border-radius: 50%;
        background: #F6F6F6;
        transition: background .2s ease;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,.24);

        &:after{
          content: '';
          display: block;
          width: 14px;
          height:14px;
          margin: 1px;
          transition: background .2s ease;
          background: url("../../img/LeftPanel3dot.svg") no-repeat;
        }

        &[class~='active']{
          background:linear-gradient(90deg,#5EA2FF,#00E3FF);

          &:after{
            width: 8px;
            height:8px;
            margin: 4px;
            background:url("../../img/leftPanelX.svg") no-repeat;
          }
        }

        &[class~='isLine']{
          left: 6px !important;
          bottom:0 !important;
        }
      }

      .leftPanel-common-results-item-collect{
        width: 18px;
        height:18px;
        position: absolute;
        top:6px;
        right:6px;
        border-radius: 2px;
        padding: 1px;
        box-sizing: border-box;
        display: none;
        background: #FFFFff;
        cursor: pointer;

        &:after{
          content: '';
          display: block;
          width: 16px;
          height: 16px;
          background: url("../../../img/islike.svg") no-repeat 0 0;
          background-size: 16px auto;
        }

        &[class~='active']:after{
          background: url("../../../img/islike.svg") no-repeat 0 -16px;
          background-size: 16px auto;
        }

        &[class~='isLine']{
          top:0 !important;
          right:6px !important;
        }
      }

      .leftPanel-common-results-item-showMore{
        position: fixed;
        left:0;
        width: 100%;
        overflow: hidden;
        background: #FFFFFF;
        z-index: 99;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,.04);
        padding: 8px;
        box-sizing: border-box;
        text-align: left;

        &>p{
          line-height: 20px;
          font-size:14px;

          &:nth-child(1){
            margin: 0 0 8px 0;
          }

          &:after{
            content: '';
            display: block;
            clear: both;
          }

          &>span{
            color: #4A4A4A;
            display: block;
            width: 200px;
            float: left;
          }

          &>span:nth-child(1){
            width: 60px;
            color: #9B9B9B;
          }
        }
      }
    }

  }
</style>