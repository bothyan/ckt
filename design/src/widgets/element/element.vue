<template>
  <g @mousedown.left="onMouseDownMove" @mousemove="onMouseMove" @click="onClick"  @dblclick="ondbClick" @mouseover.stop ="onMouseOver" @mouseout="onMouseOut"  
  :transform="transformParse" :opacity="opacity"
   :data-type="dataType" :id="eleData['eleid']"
    :class="{'showElementHover':showHoverBox}" class="svgElement">
    <g :transform="reverse" :filter="shadowFilterId" :class="{'elementFadeIn': showEleFadeIn}">
      <transition name="fade">
        <background :json="json" :pageId="pageId" :eleData="eleData" :imgFilterId="imgFilterId" :eleIndex="eleIndex" v-if="dataType=='background'"></background>
        <svgcom :eleid="eleData['eleid']"  :pageId="pageId" :json="json" :eleIndex="eleIndex" v-if="dataType=='svgImage'||dataType=='svg'"></svgcom>
        <svgframecom  :imgFilterId="imgFilterId"  :pageId="pageId" :eleIndex="eleIndex" :json="json" v-else-if="dataType=='svgFrame'"> </svgframecom>
        <img-svg  :imgFilterId="imgFilterId"  :pageId="pageId" :eleIndex="eleIndex" :json="json" v-else-if="dataType=='img'||dataType=='image'"></img-svg>

        <chart  :json="chartJson"  :pageId="pageId" :eleIndex="eleIndex" v-else-if="dataType=='svgChart'"></chart>
        <textcomp :textLoading.sync="textLoadingShow" :pageId="pageId" :eleData="eleData" :eleIndex="eleIndex" v-else-if="dataType=='text'" v-show="textShow"></textcomp>
      </transition>
    </g>
    <!-- <animateTransform attributeName="transform" begin="0s" dur="1s" type="translate" from="0 -50" to="0 0" repeatCount="1"/> -->
    <filter-com :filterData="filterData"  :pageId="pageId" :eleIndex="eleIndex" :shadowData="shadowData"></filter-com>
    <hover :json="json" :eleIndex="eleIndex"  :pageId="pageId" :showHoverBox="showHoverBox"></hover>
    <text-loading :width="json.width" :height="json.height" v-if="textLoadingShow"></text-loading>
  </g>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .8s
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active in below version 2.1.8 */
{
  transform: translate(-100%);
  opacity: 0
}
.showElementHover{
  cursor: move;
}
.elementFadeIn {
  animation: .3s elemfadein 1;
}
@keyframes elemfadein {
  0% {
    transform: translate(0px, -100px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}
</style>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getTransformAttr, transformScale, inArray , _empty,setTransformAttr } from 'common/common';
import dataHandle from 'common/dataHandle';
import dataEvent from 'dataBus/element';
import svgcom from './svg.vue';
import imgSvg from './image.vue';
// import tableSvg from './table.vue';
import filterCom from './comp/flter.vue';
import chart from './chart.vue';
import svgframecom from './svgFrame.vue';
import textcomp from './text.vue';
import background from './background.vue'
import hover from './comp/hover.vue';
import pageEvent from 'dataBus/page';
import pageEleBus from 'dataBus/pageEle';
import svgFrameBus from 'dataBus/svgFrame';
import textLoading from './textLoading.vue';
import hoverBus from 'dataBus/hover.js';
import toolsBarBus from 'dataBus/toolsBar.js';
import editorBus from 'dataBus/editor.js';
import groupBus from 'dataBus/group.js';
export default {
  name: 'element',
  components: {
    svgcom, imgSvg, svgframecom, chart, filterCom, textcomp, background, hover, textLoading
    // tableSvg, 
  },
  data() {
    return {
      left: 0,
      top: 0,
      width:0,
      height:0,
      opacity: 1,
      scale: [1, 1],
      rotate: [0, 0, 0],
      z_index: 10,
      transform: '',
      reverse: '',
      type: 'element',
      json: {},
      chartJson:{},
      dataURL: '',
      dataType: '',
      filterData: {},
      shadowData: {},//阴影数据
      elemVaryType: "db",
      shadowFilterId: "",
      imgFilterId: "",
      showHoverBox:false,//显示hover框
      groupId: '',
      locked: false,
      isFillColorBackground:true, // 是否是纯色背景
      _lastClickTime:0,  //上次点击时间
      _lastClickHandle:null, //上次点击的定时器句柄
      textLoadingShow: false,
      showEleFadeIn: false
    };
  },
  props: {
    eleData: {
      type: Object,
      required: true
    },
    pageId: {
      require: true
    },
    eleIndex: {
      type: Number
    }
  },
  computed: {
    ...mapGetters({
      'getFocusElemIndex':"getFocusElemIndex",
      'focusPageIndex': 'getFocusPageIndex',
      'spaceKeyDown':'getSpaceKeyDown',
      'clipFlag': 'getClipFlag',
      'frameClip': 'getFrameClip',
      'selectEleNow': 'getCircleSelectElementsNow',
      'elementEvent': 'getElementEvent',
      'editorLock': 'getEditorLock',
      'textEdit': 'getTextEdit',
      'newAddEleId': 'getNewAddEleId'
		}),
    textShow() {
      return !this.eleData.hide
    },
    transformParse(){
  
      let rotate = getTransformAttr(this.transform,'rotate');
      let str ="";
      if(rotate[0]>3){
        rotate[1] = this.eleData['data-elem'].width/2;
        rotate[2] = this.eleData['data-elem'].height/2;
        str = setTransformAttr(this.transform,'rotate',rotate)
      }else{
        rotate[0] =0;
        rotate[1] = this.eleData['data-elem'].width/2;
        rotate[2] = this.eleData['data-elem'].height/2;
        str = setTransformAttr(this.transform,'rotate',rotate)     
      }
       return str;
    }
  },
  watch: {
    eleData: {
      handler() {
        this.update();
      },
      deep: true
    },
    selectEleNow:function(){
      this.circleSelectHover();
    },
    getFocusElemIndex(v){
      if(v==this.eleIndex){
        dataEvent.setFocusElemIndex({
          index: this.eleIndex,
          eleNode: this.$children[0].$refs.svgNode
        });
      }
    }
  },
  methods: {
    ...mapActions([
      'setEditorShow',
      'setToolsBarShow',
      'setGroupFlag',
      'setFrameClip',
      'setClipFlag',
      'setFrameClipInfo',
      'setFocusElemIndex',
      'setHoverElemIndex',
      'setCircleSelectElements',
      'setToolsBarType',
      'setElementEvent',
      'setNewAddEleId'
    ]),  
    setFocusElem(){
      //纯色背景不执行操作
      if(this.dataType=='background'&&this.isFillColorBackground){
        return;
      }
      if(this.groupId && groupBus.getGroupValueById(this.groupId)){

       pageEleBus.setGroupByGroupId(this.groupId);
     
      } else{

        this.setGroupFlag(false);
        dataEvent.setFocusElemIndex({
          index: this.eleIndex,
          eleType: this.dataType,
          eleNode: this.$children[0].$refs.svgNode
        });
      }

    },
    init() {
    
      this.update();
    },
    update() {
      //需要一个方法初始化json／／

      this.opacity = this.eleData['data-elem']['opacity'];
      this.transform = this.eleData['transform'];
      this.reverse = this.eleData['reverse'];
      this.elemVaryType = this.eleData['varyType'] || 'db';
      this.groupId = this.eleData['group']||'';
      //这里有隐藏问题
      //可以加一个状态判断 只是移动不执行下面负值  ／／？？？
      if(this.eleData['data-type']=='svgChart'){
        let chartJson   = JSON.parse(JSON.stringify(this.eleData['data-elem'])); 
          delete chartJson['opacity'];
        this.chartJson = chartJson;   
      } 
      this.width = this.json['width'];
      this.height = this.json['height'];
      this.json = this.eleData['data-elem'];
      this.locked =this.json['lock']||false;
      if(this.eleData['data-elem']['shadow'] != undefined)
        this.shadowData =this.eleData['data-elem']['shadow'];
      if(this.eleData['data-elem']['filter'] != undefined)
        this.filterData =this.eleData['data-elem']['filter'];
    },
    getRenderType() {
      //渲染类型函数
      let type = 'svg';
      // 先判断有没有图片资源
      if (this.eleData['data-img-kind']) {
        let imageArray = ['jpg', 'png', 'jpeg']
        let kind = this.eleData['data-img-kind'];
        if (inArray(kind.split('/')[1], imageArray)) {
          if(this.eleData['data-type'] == 'background'){
            type = 'background';
          }else{
            type = 'image';
          }
        } else {
          if (this.eleData['data-type'] == 'svgFrame') {
            type = 'svgFrame';
          } else if(this.eleData['data-type'] == 'background'){
            type = 'background';
          }else{
            if(this.eleData['data-type'] == 'img'){
              type = 'image';
            }else{
              type = 'svg';
            }
          }
        }
      } else {
        //其他类型的渲染方法
        switch (this.eleData['data-type']) {
          case 'text':
            type = 'text';
            break;
          case 'background':
            type = 'background';
            break;
          case 'img':
            type = 'image';
            break;
          case 'table':
            type = 'table';
            break;
          case 'svgChart':
            type = 'svgChart';
            break;
        }
      }
      this.dataType = type;
      return type;
    },
    onClick(e){
      if(e.ctrlKey || e.shiftKey || e.metaKey) {
        if(this.locked || (this.groupId && groupBus.getGroupValueById(this.groupId) && groupBus.getGroupValueById(this.groupId).lock)) {
          e.stopPropagation();
          return;
        }
      }

      if(this.dataType == 'background' && this.eleData['data-elem']['data-colors']) {
        return;
      }
      
      if(this.selectEleNow.length > 1 || this.selectEleNow.length === 1 && this.selectEleNow[0] != this.eleIndex) {
        return;
      }
      
      this.$nextTick(() => {
        this.setFocusElem();
        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        this.setEditorShow(true);
        this.setToolsBarShow(true);
      });
    },
    //双击事件
    ondbClick(event){
      // if(this._lastClickHandle!=undefined){
      //     clearTimeout(this._lastClickHandle);
      //     this._lastClickHandle = null;
      // }
      //    console.warn("%c svgFrame被双击 ",'color:#776633;font-size:20px;');
      // dataEvent.elementDbclick(this.focusPageIndex, this.eleIndex, event.target);
    },
    onMouseDownMove(event){
      this.setElementEvent(event);
      // 判断是都是纯色背景不许任何操作
      if(this.locked||(this.dataType=='background')){
        return;
      }

      if(this.locked || (this.groupId && groupBus.getGroupValueById(this.groupId) && groupBus.getGroupValueById(this.groupId).lock)) {
        return;
      }
      
      // 多选操作
      if(event.ctrlKey || event.shiftKey || event.metaKey) {
        if(! this.editorLock) {
          pageEleBus.addElementToCircleSelect(this.eleIndex);
        }
        event.stopPropagation();
        return;
      }

      if(this.clipFlag || this.frameClip || this.textEdit) {
        return;
      }

      // pageEvent.elementBlur();
      toolsBarBus.closeChild();
      editorBus.cancelEditState();

      if(this.dataType == 'image') {
        //pageEvent.cloneFocusPageToMove();
      }

      if(this.spaceKeyDown){
        return;
      }


      event.stopPropagation();

      if(this.groupId && groupBus.getGroupValueById(this.groupId)) {
        // pageEleBus.setGroupByGroupId(this.groupId);
        // return ;
        this.setCircleSelectElements(pageEleBus.getGroupArrById(this.groupId));
        this.setToolsBarType('selects');
        this.setGroupFlag(true);
      }
      else {
        if(this.dataType === 'image') {
          this.setToolsBarType('img');
        }
        else {
          this.setToolsBarType(this.dataType);
        }
        dataHandle.$vue.$nextTick(() => {
          this.setFocusElem();
        });
      }

      //阻止事件传播
      let startPoint = {
        x: event.clientX,
        y: event.clientY
      };
      
      dataEvent.hoverMousemove(startPoint,this.eleIndex);
    },
    circleSelectHover(){
      if(inArray(this.eleIndex,this.selectEleNow)){
        this.showHoverBox = true;
      }else{
        this.showHoverBox = false;
      }
    },
    onMouseOver(){
      if(this.dataType=='background'&&(this.dataType=='background'&&this.isFillColorBackground)){
        return;
      }
      if(this.textEdit) {
        this.$el.style.cursor = 'default';
      }
      else {
        this.$el.style.cursor = '';
      }
      // hoverBus.setHoverArr([this.eleIndex]);
      // hoverBus.setHoverShow(true);
      this.setHoverElemIndex(this.eleIndex) ;
      this.showHoverBox = true;
    },
    onMouseOut(){
      this.showHoverBox = false;
    },
    onMouseMove(event){
      event.preventDefault();
    },
    handleOldCut() {
      //旧版裁剪转新版
      let data = this.eleData;
      if(data['data-type'] === 'svgFrame' && data['data-elem'].id === "cut1") {
	      let imgData = data['data-elem']['data-xhref-imgs']['sorb_1'];
	      let json = {
              'data-type': 'img',
              'data-img-kind': 'image/jpg',
              'data-elem': {
                'width': data['data-elem'].width,
                'height': data['data-elem'].height,
                'opacity': data['data-elem'].opacity,
                'filter': data['data-elem'].filter,
                'shadow': data['data-elem'].shadow,
                'lock': data['data-elem'].lock,
                'data-key': imgData['data-img-key']||imgData['data-key'],
                'isCut': true,
                'id':imgData['id'],
                'imgWidth': imgData.width,
                'imgHeight': imgData.height
              },
              'transform': data.transform,
              'reverse': data.reverse,
              'group': '',
              'group-transform': '',
            },
            x = - parseFloat(imgData.x),
            y = - parseFloat(imgData.y),
            width = data['data-elem']['cut-width'],
            height = data['data-elem']['cut-height'];

        json['data-elem'].viewBox = `${x} ${y} ${width} ${height}`;
        pageEleBus.setElementJson(json, undefined, this.eleIndex);
        dataHandle.commit('element', {
          pageIndex: this.focusPageIndex,
          key: this.eleIndex,
          value: JSON.parse(JSON.stringify(json)),
          eventType: 1
        }).push(true);
      }
    }
  },
  created () {
    this.handleOldCut();
    // 判断是否是新添加的素材 播放添加动画
    if(this.newAddEleId && (this.newAddEleId === this.eleData['eleid'] || this.newAddEleId === this.eleData['group']) && this.eleData['data-type'] != 'background') {
      this.showEleFadeIn = true;
    }
    if(this.showEleFadeIn) {
      setTimeout(() => {
        if(this.newAddEleId === this.eleData['eleid'] || this.newAddEleId === this.eleData['group']) {
          this.setNewAddEleId('');
        }
        this.showEleFadeIn = true;
      }, 1000);
    }
  },
  beforeMount() {
    this.dataType = this.eleData['data-type'];
    //判断组合元素
    this.init();
    dataEvent.initReverseType(this.focusPageIndex,this.eleIndex);
  }
}
</script>