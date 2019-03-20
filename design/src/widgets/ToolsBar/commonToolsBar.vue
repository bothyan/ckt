<template>
  <ul class="common-tools" @click="setTextEdit(false)">
    <li class="tools-icon-wrap tools-copy" data-tip="复制" @click="copyElement" v-show="type !== 'background' && !groupFlag">
      <span class="tools-text" id="tools-bar-copy">复制</span>
    </li>
    <li class="tools-icon-wrap tools-sort" id="toolbar-sort" data-tip="图层" @click="setChildShow(1)" v-show="type !== 'background' && type !== 'selects' && !groupFlag">
      <span id="tool-bar-sort" class="tools-icon"></span>
      <ul class="tools-list-wrap tool-sort-child" @click.stop="" v-show="childShow===1">
        <li id="tool-bar-moveup" 
            :class="{'cant-use': layerIndex === layerLen -1}"
            @click="setLayer('up', layerIndex === layerLen -1)">
            <span class="icon"></span> <span class="text">上移一层</span></li>

        <li id="tool-bar-movedown" 
            :class="{'cant-use': layerIndex === 0}"
            @click="setLayer('down', layerIndex === 0)">
            <span class="icon"></span> <span class="text">下移一层</span></li>

        <li id="tool-bar-movetop"
            :class="{'cant-use': layerIndex === layerLen -1}"
            @click="setLayer('top', layerIndex === layerLen -1)">
            <span class="icon"></span> <span class="text">置顶图层</span></li>

        <li id="tool-bar-movebottom"
            :class="{'cant-use': layerIndex === 0}"
            @click="setLayer('bottom', layerIndex === 0)">
            <span class="icon"></span> <span class="text">置底图层</span></li>
      </ul>
    </li>
    <li class="tools-icon-wrap tools-opacity" id="toolbar-opacity" @click="setChildShow(2)" v-show="type !== 'selects'" data-tip="透明度">
      <span id="tool-bar-opacity" class="tools-icon"></span>
      <div class="tool-opacity-child" @click.stop="" v-show="childShow===2">
        <slider label="透明度" :minValue="0" :show="childShow === 2" :maxValue="100" :initValue="(1-opacity)*100" @valueChange="setOpacity"></slider>
      </div>
    </li>
    <li class="tools-icon-wrap tools-reverse" data-tip="翻转" @click="setChildShow(3)" id="toolbar-reverse" v-show="type !== 'svgChart' && type !== 'selects' && !groupFlag">
      <span id="tool-bar-reverse" class="tools-icon"></span>
      <ul class="tools-list-wrap tool-reverse-child" @click.stop="" v-show="childShow===3" id="tool-bar-reverse-wrap">
        <li class="tool-bar-lr" @click="setReverse('x')"><span class="icon"></span></li>
        <li class="tool-bar-tb" @click="setReverse('y')"><span class="icon"></span></li>
      </ul>
    </li>
    <li class="tools-icon-wrap tools-shadow" data-tip="阴影" @click="setChildShow(4)" v-show="type !== 'selects' && !groupFlag">
      <span id="tool-bar-shadow" class="tools-icon tool-bar-shadow"></span>
      <div class="tool-shadow-child" @click.stop="" v-show="childShow===4">
        <slider label="扩展" :minValue="0" :maxValue="100" :show="childShow===4" :initValue="shadow.blur" @valueChange="setShadowBlur"></slider>
        <slider label="距离" :minValue="0" :maxValue="100" :show="childShow===4" :initValue="shadow.offset" @valueChange="setShadowOffset"></slider>
        <slider label="透明度" :minValue="0" :maxValue="100" :show="childShow===4" :initValue="(1-shadow.opacity)*100" @valueChange="setShadowOpacity"></slider>
        <div class="shadow-control">
          <label>是否显示阴影</label>
          <div class="switch-wrap">
            <ckt-switch :value="shadow.show" @on-change="shadowSwitch"></ckt-switch>
          </div>
        </div>
      </div>
    </li>
    <li class="tools-icon-wrap tools-more" @click="setChildShow(5)" v-show="type !== 'selects' && !groupFlag">
      <span class="tools-text">更多<i></i></span>
      <ul class="tools-more-child" @click.stop v-show="childShow === 5">
        <li class="more-sort" @click="setChildShow(1)" v-show="type !== 'background'"><i></i>图层</li>
        <li class="more-opacity" @click="setChildShow(2)"><i></i>透明度</li>
        <li class="more-reverse" @click="setChildShow(3)"><i></i>翻转</li>
        <li class="more-shadow" @click="setChildShow(4)"><i></i>阴影</li>
      </ul>
      <ul class="tools-list-wrap tool-sort-child" @click.stop="" v-show="childShow===1">
        <li id="tool-bar-moveup" 
            :class="{'cant-use': layerIndex === layerLen -1}"
            @click="setLayer('up', layerIndex === layerLen -1)">
            <span class="icon"></span> <span class="text">上移一层</span></li>

        <li id="tool-bar-movedown" 
            :class="{'cant-use': layerIndex === 0}"
            @click="setLayer('down', layerIndex === 0)">
            <span class="icon"></span> <span class="text">下移一层</span></li>

        <li id="tool-bar-movetop"
            :class="{'cant-use': layerIndex === layerLen -1}"
            @click="setLayer('top', layerIndex === layerLen -1)">
            <span class="icon"></span> <span class="text">置顶图层</span></li>

        <li id="tool-bar-movebottom"
            :class="{'cant-use': layerIndex === 0}"
            @click="setLayer('bottom', layerIndex === 0)">
            <span class="icon"></span> <span class="text">置底图层</span></li>
      </ul>
      <div class="tool-opacity-child" @click.stop="" v-show="childShow===2">
        <slider label="透明度" :minValue="0" :maxValue="100" :initValue="(1-opacity)*100" @valueChange="setOpacity"></slider>
      </div>
      <ul class="tools-list-wrap tool-reverse-child" @click.stop="" v-show="childShow===3" id="tool-bar-reverse-wrap">
        <li class="tool-bar-lr" @click="setReverse('x')"><span class="icon"></span></li>
        <li class="tool-bar-tb" @click="setReverse('y')"><span class="icon"></span></li>
      </ul>
      <div class="tool-shadow-child" @click.stop="" v-show="childShow===4">
        <slider label="扩展" :minValue="0" :maxValue="100" :initValue="shadow.blur" @valueChange="setShadowBlur"></slider>
        <slider label="距离" :minValue="0" :maxValue="100" :initValue="shadow.offset" @valueChange="setShadowOffset"></slider>
        <slider label="透明度" :minValue="0" :maxValue="100" :initValue="(1-shadow.opacity)*100" @valueChange="setShadowOpacity"></slider>
        <div class="shadow-control">
          <label>是否显示阴影</label>
          <div class="switch-wrap">
            <ckt-switch :value="shadow.show" @on-change="shadowSwitch"></ckt-switch>
          </div>
        </div>
      </div>
    </li>
    <li class="tools-icon-wrap" data-tip="锁定" @click="setLock" v-show="!(groupFlag&&focusElemIndex>-1) && !lockAnimationFlag">
      <span class="tools-icon tool-bar-lock" :class="{'tools-bar-locked': lock}"></span>
    </li>
    <li class="lock-animation-wrap" v-if="lockAnimationFlag" @click="setLock">
      <span class="lock-animation-icon"></span>
      <span class="lock-animation-text" @click.stop>点我解锁</span>
    </li>
    <li class="tools-icon-wrap" data-tip="删除" @click="delElement" v-show="!(groupFlag&&focusElemIndex>-1)">
      <span id="tool-bar-delete" class="tools-icon"></span>
    </li>
  </ul>
</template>

<script>
  import slider from 'components/slider/slider.vue';
  import cktSwitch from 'components/switch/switch.vue';
  import { mapGetters, mapActions } from 'vuex';
  import eleEvent from 'dataBus/element.js';
  import pageBus from 'dataBus/page.js';
  import pageEleMethods from 'dataBus/pageEle.js';
  import editorBus from 'dataBus/editor.js';
  import toolsBarBus from 'dataBus/toolsBar.js';
  import dataHandle from 'common/dataHandle.js'
  export default {
    props: {
      type: {
        type: String,
        required: true
      },
      shadow: {
        type: Object,
        default () {
          return {
            blur: 0,
            offset: 0,
            opacity: 1,
            show: false
          }
        }
      },
      opacity: {
        type: Number,
        default: 0
      },
      lock: {
        type: Boolean
      }
    },
    data() {
      return {
        valueChange: true,
        popShow: false,       //图层子弹框控制
        opacityShow: false,   //透明度子弹框控制
        reverseShow: false,   //翻转子弹框控制
        shadowShow: false,     //阴影子弹框控制
        childShow: 0,    //1图层，2透明度，3翻转，4阴影，5更多
        lockAnimationFlag: false,
        lockTimer: null,
        layerFlag: false
      }
    },
    computed:{
      ...mapGetters({
        focusElemIndex: 'getFocusElemIndex',
        focusPageIndex: 'getFocusPageIndex',
        selectsArr: 'getCircleSelectElements',
        closeChild: 'getToolsBarCloseChild',
        toolsBarShow: 'getToolsBarShow',
        elemSum: 'getFocusPageElemSum',
        textEdit: 'getTextEdit',
        groupFlag: 'getGroupFlag',
        layerIndex: 'getLayerIndex',
        layerArr: 'getLayerArr',
        layerLen: 'getLayerLen'
      })
    },
    components: { slider, cktSwitch },
    watch: {
      focusElemIndex(v) {
        if(!this.layerFlag) {
          this.closeAll();
        }
        this.layerFlag = false;
        this.lockAnimationFlag = false;
        if(v > 0) {
          toolsBarBus.setToolsBarLayerInfo();
        }
        if(this.lock) {
          this.$nextTick(() => {
            clearTimeout(this.lockTimer);
            this.lockAnimationFlag = true;
            this.lockTimer = setTimeout(() => {
              this.lockAnimationFlag = false;
              clearTimeout(this.lockTimer);
            }, 1600);
          })
        }
      },
      lock(v) {
        if(!v) {
          clearTimeout(this.lockTimer);
          this.lockAnimationFlag = false;
        }
      },
      toolsBarShow(v) {
        if(!v) {
          clearTimeout(this.lockTimer);
          this.lockAnimationFlag = false;
        }
      },
      type(v) {
        if(!this.toolsBarShow) 
          return ;
        if(v === 'selects' && this.lock) {
          this.$nextTick(() => {
            clearTimeout(this.lockTimer);
            this.lockAnimationFlag = true;
            this.lockTimer = setTimeout(() => {
              this.lockAnimationFlag = false;
              clearTimeout(this.lockTimer);
            }, 1600);
          })
        }
      },
      childShow(v, ov) {
        if(v || !this.valueChange) {
          return;
        }
        if(ov === 2 || ov === 4) {
          dataHandle.push();
          this.valueChange = false;
        }
      },
      opacityShow(v){
         if(!v){
           if(this.valueChange){
             dataHandle.push();
             this.valueChange = false;
           }
         }
      },
      shadowShow(v){
        if(!v){
          if(this.valueChange){
            dataHandle.push();
            this.valueChange = false;
          }
        }
      },
      closeChild() {
        this.closeAll();
      }
    },
    methods: {
      ...mapActions({
        'setEditorShow': 'setEditorShow',
        'setTableEditorShow': 'setTableEditorShow',
        'setToolsBarShow': 'setToolsBarShow',
        'setFocusElemIndex': 'setFocusElemIndex',
        'setCircleSelectElements': 'setCircleSelectElements',
        'setTextEdit': 'setTextEdit',
        'setLayerAnimationShow': 'setLayerAnimationShow'
      }),
      closeAll() {
        this.childShow = 0;
      },
      //复制
      copyElement() {
        this.closeAll();
        if(this.type !== 'selects'){
          this.textEdit && this.setTextEdit(false);
          this.$nextTick(() => {
            let val = pageEleMethods.copyElement();
            dataHandle.commit('element',{
              pageIndex: this.focusPageIndex,
              eleIndex: this.elemSum - 1,
              key:null,
              value:val,
              eventType:0
            });
            this.setFocusElemIndex({index: this.elemSum - 1});
            dataHandle.push();
          })
        } else {
          let arr = [];
          this.selectsArr.forEach(item => {
            let val = pageEleMethods.copyElement(this.focusPageIndex, item);
        
            dataHandle.commit('element',{
              pageIndex: this.focusPageIndex,
              eleIndex: this.elemSum - 1,
              key:null,
              value:val,
              eventType:0
            });
     
            arr.push(this.elemSum - 1);
          })
  
          this.setCircleSelectElements(arr);
          dataHandle.push();          
        }
        editorBus.setEditorState();
      },
      //设置图层
      setLayer(type, flag) {
        if(flag) {
          return ;
        }
        let newIndex, val;
        switch(type) {
          case 'up': 
              newIndex = this.layerArr[this.layerIndex + 1];
              val = pageEleMethods.setElementIndex('index', undefined, this.focusElemIndex, newIndex);
              break;
          case 'down':
              newIndex = this.layerArr[this.layerIndex - 1];
              val = pageEleMethods.setElementIndex('index', undefined, this.focusElemIndex, newIndex);
              break;
          case 'top':
              newIndex = this.layerArr[this.layerLen - 1];
              val = pageEleMethods.setElementIndex('index', undefined, this.focusElemIndex, newIndex);
              break;
          case 'bottom': 
              newIndex = this.layerArr[0];
              val = pageEleMethods.setElementIndex('index', undefined, this.focusElemIndex, newIndex);
              break;
        }
        dataHandle.commit('element',{
          pageIndex:this.focusPageIndex,
          eleIndex:this.focusElemIndex,
          key:null,
          value:val,
          eventType:4
        });
        dataHandle.push();
        this.setFocusElemIndex({index: val})
        if(type === 'up' || type === 'down') {
          editorBus.setLayerAnimationInfo(type);
          this.setLayerAnimationShow(false);
          this.$nextTick(() => {
            this.setLayerAnimationShow(true);
          })
        } else {
          this.setLayerAnimationShow(false);
        }
        toolsBarBus.setToolsBarLayerInfo();
        this.layerFlag = true;  
        // toolsBarBus.setToolsBarState();
      },
      delElement() {
        this.closeAll();
        toolsBarBus.delElement();
      },
      setLock() {
        this.closeAll();

        eleEvent.setLockForEdit(!this.lock);

        if(this.lock) {
          this.lockAnimationFlag = false;
        }
        
        editorBus.setEditorState();
        toolsBarBus.setToolsBarState();
      },
      setOpacity(v) {
       let val = eleEvent.setOpacity((100-v)/100);
        dataHandle.commit('element',{
          pageIndex:this.focusPageIndex,
          eleIndex:this.focusElemIndex,
          key:'opacity',
          value:val,
          eventType:1
        });
        
        this.valueChange = true ;
        editorBus.setElementData();
        toolsBarBus.setToolsBarState();
      },
      setReverse(direction) {
        let val ;
        if(direction === 'x'){
          //横向
         val = eleEvent.setReverse(1);
        } else if(direction === 'y') {
          //纵向翻转
         val = eleEvent.setReverse(2);
        }
        dataHandle.commit('element',{
          pageIndex:this.focusPageIndex,
          eleIndex:this.focusElemIndex,
          key:'reverse',
          value:val,
          eventType:1
        });
        dataHandle.push();
      },
      setShadowBlur(v) {
        let val = eleEvent.setShadow(Object.assign(this.shadow, {
          show: true,
          blur: v
        }));
        dataHandle.commit('element',{
          pageIndex:this.focusPageIndex,
          eleIndex:this.focusElemIndex,
          key:'shadow',
          value:val,
          eventType:1
        });   
        this.valueChange = true ;     
        toolsBarBus.setToolsBarState();
      },
      setShadowOffset(v) {
       let val = eleEvent.setShadow(Object.assign(this.shadow, {
          show: true,
          offset: v
        }));
         dataHandle.commit('element',{
          pageIndex:this.focusPageIndex,
          eleIndex:this.focusElemIndex,
          key:'shadow',
          value:val,
          eventType:1
        });
        toolsBarBus.setToolsBarState();
      },
      setShadowOpacity(v) {
       let val = eleEvent.setShadow(Object.assign(this.shadow, {
          show: true,
          opacity: (100-v) / 100
        }));
        this.valueChange = true ;
       dataHandle.commit('element',{
          pageIndex:this.focusPageIndex,
          eleIndex:this.focusElemIndex,
          key:'shadow',
          value:val,
          eventType:1
        });
        this.valueChange = true ;
        toolsBarBus.setToolsBarState();
      },
      shadowSwitch(v) {
       let val = eleEvent.setShadow(Object.assign(this.shadow, {
          show: v
        }));
       dataHandle.commit('element',{
          pageIndex:this.focusPageIndex,
          eleIndex:this.focusElemIndex,
          key:'shadow',
          value:val,
          eventType:1
        });
        this.valueChange = true ;
        toolsBarBus.setToolsBarState();
      },
      setChildShow(index) {
        this.childShow = this.childShow === index ? 0 : index;
      }
    }

  }
</script>

<style lang="less" scoped>
  .common-tools {
    display: inline-block;
    height: 42px;
  }
  
  .cant-use{
      cursor: default;
      span{
        opacity: 0.3;
      }
      &:hover{
        background: #fff !important;
      }
    }
  
  .tools-icon-wrap {
    position: relative;
    width: 35px;
    height: 42px;
    float: left;
    cursor: pointer;
    text-align: center;
    font-size: 13px;
    color: #515151;
    display: block;
    .tools-icon {
      width: 20px;
      height: 20px;
      margin-top: 11px;
      display: inline-block;
    }
    &:hover {
      .tools-text {
        color: #07AFEC;
      }
    }
    #tools-opacity-wrap {
      position: absolute;
      width: 300px;
      height: 40px;
      top: 50px;
      left: 0px;
      margin-left: -60px;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
      background-color: #FFFFFF;
      &:before {
        content: "";
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-bottom-color: #FFF;
        position: absolute;
        top: -12px;
        right: 144px;
      }
      .edit-line-span {
        line-height: 40px;
        font-family: 'Hiragino Sans GB', 'Hiragino Sans GB W3', 'Microsoft Yahei', '微软雅黑', Tahoma, Arial, Helvetica, STHeiti;
        position: absolute;
        left: 16px;
      }
      .edit-line-wrap {
        width: 160px;
        height: 5px;
        overflow: hidden;
        position: absolute;
        top: 22px;
        left: 67px;
        .edit-line-background {
          width: 0px;
          height: 0px;
          border-left: 160px solid transparent;
          border-bottom: 5px solid #515151;
          position: absolute;
          left: 0px;
          bottom: 0px;
        }

      }
      .edit-line-scroll {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background-color: #515151;
        position: absolute;
        top: 18px;
        left: 72px;
        cursor: pointer;
        &:after {
          content: attr(data-num);
          position: absolute;
          bottom: 11px;
          width: 24px;
          text-align: center;
          left: -6px;
        }
      }
      .edit-line-input {
        width: 50px;
        height: 30px;
        padding-left: 10px;
        border: 1px solid #E6E6E6;
        background-color: #F4F4F4;
        position: absolute;
        top: 5px;
        right: 10px;
      }
    }

    #tool-bar-reverse-wrap {
      .tool-bar-lr {
        .icon {
          background: url(img/reverse_y.svg) no-repeat 0 0;
        }
        &:hover {
          .icon {
            background-position-y: -20px;
          }
        }
      }
      .tool-bar-tb {
        .icon {
          background: url('img/reverse_x.svg') no-repeat 0 0;
        }
        &:hover {
          .icon {
            background-position-y: -20px;
          }
        }
      }
    }
    #tool-bar-sort {
      background: url("img/move.svg") no-repeat 0px 0px;
      background-size: 100% auto;
    }
    #tool-bar-opacity {
      background: url("img/opacity.png") no-repeat 0px 0px;
      background-size: 100% auto;
    }
    #tool-bar-reverse {
      background: url("img/reverseY.svg") no-repeat 0px 0px;
      background-size: 100% auto;
    }
    #tool-bar-shadow {
      background: url("img/shadow_new.svg") no-repeat 0 0;
      /*background-size:100% auto;*/
    }
    .tool-bar-lock {
      background: url("img/lock.svg") no-repeat 0px 0px;
      background-size: 100% auto;
    }
    .tools-bar-locked{
      background-position-y: -60px;
    }
    #tool-bar-delete {
      background: url("img/del.svg") no-repeat 0px 0px;
      background-size: 100% auto;
    }

    .tools-text {
      line-height: 42px;
    }
    &:hover {
      background-color: #F4F4F4;
      #tool-bar-sort {
        background-position: 0px -20px;
      }
      #tool-bar-opacity {
        background-position: 0px -20px;
      }
      #tool-bar-reverse {
        background-position: 0px -20px;
      }
      .tool-bar-lock {
        background-position: 0px -20px;
      }
      #tool-bar-delete {
        background-position: 0px -20px;
      }
      #tool-bar-delete.ban-del-btn {
        background-position: 0px 0px;
      }
      #tool-bar-shadow {
        background-position-y: -20px;
      }
      &:before {
        content: attr(data-tip);
        background-color: #fff;
        color: #626262;
        padding: 5px 8px;
        position: absolute;
        top: 53px;
        left: -3.5px;
        white-space: pre;
        border-radius: 4px;
        box-shadow: 0px 1px 1px #e8e8e8;
      }
      &:after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: 8px solid #fff;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        top: 45px;
        left: 9.5px;
      }
    }
  }
  .tools-opacity {
    &:hover {
      &:before {
        left: -10px;
      }
    }
  }

  .tool-sort-child {
    position: absolute;
    top: 50px;
    width: 104px;
    left: -34.5px;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
    //padding: 2px;
    &:before {
      content: "";
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-bottom-color: #FFF;
      position: absolute;
      top: -12px;
      left: 46px;
    }
    li {
      width: 100%;
      height: 30px;
      display: inline-block;
      background-color: #FFFFFF;
      transition: .5s ease;
      .icon {
        width: 20px;
        height: 20px;
        margin: 5px 0px 0 10px;
        display: inline-block;
        float: left;
      }
      .text {
        line-height: 2.5em;
      }
      &:hover {
        background-color: #F4F4F4;
      }
    }
    #tool-bar-moveup {
      .icon {
        background: url("img/moveup.svg") no-repeat 0px 0px;
      }
    }
    #tool-bar-movedown {
      .icon {
        background: url("img/movedown.svg") no-repeat 0px 0px;
      }
    }
    #tool-bar-movetop {
      .icon {
        background: url("img/movetop.svg") no-repeat 0px 0px;
      }
    }
    #tool-bar-movebottom {
      .icon {
        background: url("img/movebottom.svg") no-repeat 0px 0px;
      }
    }

  }

  .tool-opacity-child {
    position: absolute;
    left: -132.5px;
    top: 50px;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
    &:before {
      content: "";
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-bottom-color: #FFF;
      position: absolute;
      top: -12px;
      left: 144px;
    }
  }

  .tool-reverse-child {
    position: absolute;
    top: 50px;
    left: -27.5px;
    width: 90px;
    padding: 0 5px;
    background: #fff;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
    li {
      float: left;
      width: 40px;
      height: 40px;
      padding: 11px;
      .icon {
        display: block;
        width: 18px;
        height: 18px;
        background: url("./img/edit_icon.svg");
      }
    }
    .tool-bar-lr {
      .icon {
        background-position-x: -88px;
      }
    }
    .tool-bar-tb {
      background-position-x: -118px;
    }
    &:before {
      content: "";
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-bottom-color: #FFF;
      position: absolute;
      top: -12px;
      left: 39px;
    }
  }

  .tool-shadow-child {
    position: absolute;
    left: -200px;
    top: 50px;
    background: #fff;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
    &:before {
      content: "";
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-bottom-color: #FFF;
      position: absolute;
      top: -12px;
      left: 211px;
    }
    .shadow-control {
      position: relative;
      height: 40px;
      label {
        position: absolute;
        left: 16px;
        display: block;
        line-height: 40px;
      }
      .switch-wrap{
        position: absolute;
        right: 0;
        padding: 11px 10px;
      }
    }
  }

  .tools-more {
    display: none;
    width: 70px;
    &:hover {
      .tools-text {
        i {
          &:before {
            border-top-color: #07AFEC;
          }
        }
      }
    }
    &:before{
      display: none;
    }
    &:after{
      display: none;
    }
    .tools-text {
      display: inline-block;
      width: 55px;
      height: 20px;
      margin-top: 11px;
      line-height: 20px;
      i{
        float: right;
        position: relative;
        width: 20px;
        height: 20px;
        &:after {
          content: "";
          position: absolute;
          left: 5px;
          top: 6px;
          width: 0;
          height: 0;
          border-top: 5px solid #fff;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
        }
        &:before {
          content: "";
          position: absolute;
          left: 3px;
          top: 6px;
          width: 0;
          height: 0;
          border-top: 7px solid #515151;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
        }

      }
    }
    .tools-more-child {
      position: absolute;
      top: 50px;
      left: -10px;
      width: 90px;
      background: #fff;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
      line-height: 30px;
      text-align: left;
      li {
        &:hover {
          background: #F4F4F4;
        }
      }
      &:before {
        content: "";
        position: absolute;
        top: -12px;
        left: 39px;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-bottom-color: #FFF;
      }
      i {
        float: left;
        margin: 5px 10px;
        width: 20px;
        height: 20px;
      }
      .more-sort{
        i {
          background: url(./img/move.svg) 0 0 no-repeat;
        }
      }
      .more-opacity {
        i {
          background: url(./img/opacity.png) 0 0 no-repeat;
        }
      }
      .more-shadow {
        i {
          background: url(img/shadow_new.svg) no-repeat 0 0;
        }
      }
      .more-reverse {
        i {
          background: url(./img/turn.svg) no-repeat 0px 0px;
        }
      }
    }
    
  }

  .lock-animation-wrap {
    position: relative;
    width: 35px;
    height: 42px;
    float: left;
    cursor: pointer;
    text-align: center;
    font-size: 13px;
    color: #515151;
    .lock-animation-icon {
      display: block;
      width: 24px;
      height: 24px;
      margin: 9px auto;
      background: url(./img/lock_animation.svg) no-repeat;
      animation: lock-shake 1.5s;
    }
    .lock-animation-text {
      position: absolute;
      top: 53px;
      left: -15.5px;
      background: linear-gradient(to bottom right, #5EA2FF, #00E3FF);
      color: #fff;
      padding: 5px 8px;
      white-space: pre;
      border-radius: 4px;
      border: none;
      animation: lock-shadow .8s;
      animation-iteration-count: 2;
      -webkit-animation-iteration-count: 2;
      &:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: 8px solid #4EADFF;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        top: -8px;
        left: 25px;
      }
    }
  }
  @keyframes lock-shake {
    0% {
      transform:rotate(-8deg);
      -ms-transform:rotate(-8deg);     /* IE 9 */
      -moz-transform:rotate(-8deg);    /* Firefox */
      -webkit-transform:rotate(-8deg); /* Safari 和 Chrome */
      -o-transform:rotate(-8deg);      /* Opera */
    }
    10% {
      transform:rotate(18deg);
      -ms-transform:rotate(18deg);     /* IE 9 */
      -moz-transform:rotate(18deg);    /* Firefox */
      -webkit-transform:rotate(18deg); /* Safari 和 Chrome */
      -o-transform:rotate(18deg);      /* Opera */
    }
    20% {
      transform:rotate(-16deg);
      -ms-transform:rotate(-16deg);     /* IE 9 */
      -moz-transform:rotate(-16deg);    /* Firefox */
      -webkit-transform:rotate(-16deg); /* Safari 和 Chrome */
      -o-transform:rotate(-16deg);      /* Opera */
    }
    30% {
      transform:rotate(18deg);
      -ms-transform:rotate(18deg);     /* IE 9 */
      -moz-transform:rotate(18deg);    /* Firefox */
      -webkit-transform:rotate(18deg); /* Safari 和 Chrome */
      -o-transform:rotate(18deg);      /* Opera */
    }
    40% {
      transform:rotate(-18deg);
      -ms-transform:rotate(-18deg);     /* IE 9 */
      -moz-transform:rotate(-18deg);    /* Firefox */
      -webkit-transform:rotate(-18deg); /* Safari 和 Chrome */
      -o-transform:rotate(-18deg);      /* Opera */
    }
    50% {
      transform:rotate(12deg);
      -ms-transform:rotate(12deg);     /* IE 9 */
      -moz-transform:rotate(12deg);    /* Firefox */
      -webkit-transform:rotate(12deg); /* Safari 和 Chrome */
      -o-transform:rotate(12deg);      /* Opera */
    }
    60% {
      transform:rotate(-12deg);
      -ms-transform:rotate(-12deg);     /* IE 9 */
      -moz-transform:rotate(-12deg);    /* Firefox */
      -webkit-transform:rotate(-12deg); /* Safari 和 Chrome */
      -o-transform:rotate(-12deg);      /* Opera */
    }
    70% {
      transform:rotate(6deg);
      -ms-transform:rotate(6deg);     /* IE 9 */
      -moz-transform:rotate(6deg);    /* Firefox */
      -webkit-transform:rotate(6deg); /* Safari 和 Chrome */
      -o-transform:rotate(6deg);      /* Opera */
    }
    80% {
      transform:rotate(-6deg);
      -ms-transform:rotate(-6deg);     /* IE 9 */
      -moz-transform:rotate(-6deg);    /* Firefox */
      -webkit-transform:rotate(-6deg); /* Safari 和 Chrome */
      -o-transform:rotate(-6deg);      /* Opera */
    }
    90% {
      transform:rotate(6deg);
      -ms-transform:rotate(6deg);     /* IE 9 */
      -moz-transform:rotate(6deg);    /* Firefox */
      -webkit-transform:rotate(6deg); /* Safari 和 Chrome */
      -o-transform:rotate(6deg);      /* Opera */
    }
    95% {
      transform:rotate(-2deg);
      -ms-transform:rotate(-2deg);     /* IE 9 */
      -moz-transform:rotate(-2deg);    /* Firefox */
      -webkit-transform:rotate(-2deg); /* Safari 和 Chrome */
      -o-transform:rotate(-2deg);      /* Opera */
    }
    100% {
      transform:rotate(0deg);
      -ms-transform:rotate(0deg);     /* IE 9 */
      -moz-transform:rotate(0deg);    /* Firefox */
      -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
      -o-transform:rotate(0deg);      /* Opera */
    }
  }
  @-webkit-keyframes lock-shake {
    0% {
      transform:rotate(-8deg);
      -ms-transform:rotate(-8deg);     /* IE 9 */
      -moz-transform:rotate(-8deg);    /* Firefox */
      -webkit-transform:rotate(-8deg); /* Safari 和 Chrome */
      -o-transform:rotate(-8deg);      /* Opera */
    }
    10% {
      transform:rotate(18deg);
      -ms-transform:rotate(18deg);     /* IE 9 */
      -moz-transform:rotate(18deg);    /* Firefox */
      -webkit-transform:rotate(18deg); /* Safari 和 Chrome */
      -o-transform:rotate(18deg);      /* Opera */
    }
    20% {
    transform:rotate(-16deg);
    -ms-transform:rotate(-16deg);     /* IE 9 */
    -moz-transform:rotate(-16deg);    /* Firefox */
    -webkit-transform:rotate(-16deg); /* Safari 和 Chrome */
    -o-transform:rotate(-16deg);      /* Opera */
    }
    30% {
      transform:rotate(18deg);
      -ms-transform:rotate(18deg);     /* IE 9 */
      -moz-transform:rotate(18deg);    /* Firefox */
      -webkit-transform:rotate(18deg); /* Safari 和 Chrome */
      -o-transform:rotate(18deg);      /* Opera */
    }
    40% {
      transform:rotate(-18deg);
      -ms-transform:rotate(-18deg);     /* IE 9 */
      -moz-transform:rotate(-18deg);    /* Firefox */
      -webkit-transform:rotate(-18deg); /* Safari 和 Chrome */
      -o-transform:rotate(-18deg);      /* Opera */
    }
    50% {
      transform:rotate(12deg);
      -ms-transform:rotate(12deg);     /* IE 9 */
      -moz-transform:rotate(12deg);    /* Firefox */
      -webkit-transform:rotate(12deg); /* Safari 和 Chrome */
      -o-transform:rotate(12deg);      /* Opera */
    }
    60% {
      transform:rotate(-12deg);
      -ms-transform:rotate(-12deg);     /* IE 9 */
      -moz-transform:rotate(-12deg);    /* Firefox */
      -webkit-transform:rotate(-12deg); /* Safari 和 Chrome */
      -o-transform:rotate(-12deg);      /* Opera */
    }
    70% {
      transform:rotate(6deg);
      -ms-transform:rotate(6deg);     /* IE 9 */
      -moz-transform:rotate(6deg);    /* Firefox */
      -webkit-transform:rotate(6deg); /* Safari 和 Chrome */
      -o-transform:rotate(6deg);      /* Opera */
    }
    80% {
      transform:rotate(-6deg);
      -ms-transform:rotate(-6deg);     /* IE 9 */
      -moz-transform:rotate(-6deg);    /* Firefox */
      -webkit-transform:rotate(-6deg); /* Safari 和 Chrome */
      -o-transform:rotate(-6deg);      /* Opera */
    }
    90% {
      transform:rotate(6deg);
      -ms-transform:rotate(6deg);     /* IE 9 */
      -moz-transform:rotate(6deg);    /* Firefox */
      -webkit-transform:rotate(6deg); /* Safari 和 Chrome */
      -o-transform:rotate(6deg);      /* Opera */
    }
    95% {
      transform:rotate(-2deg);
      -ms-transform:rotate(-2deg);     /* IE 9 */
      -moz-transform:rotate(-2deg);    /* Firefox */
      -webkit-transform:rotate(-2deg); /* Safari 和 Chrome */
      -o-transform:rotate(-2deg);      /* Opera */
    }
    100% {
      transform:rotate(0deg);
      -ms-transform:rotate(0deg);     /* IE 9 */
      -moz-transform:rotate(0deg);    /* Firefox */
      -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
      -o-transform:rotate(0deg);      /* Opera */
    }
  }
  @keyframes lock-shadow {
    0% {
      box-shadow: none;
    }
    12% {
      box-shadow: 0 4px 6px #7d7d7d;
    }
    24% {
      box-shadow: 0 4px 10px #7d7d7d;
    }
    36% {
      box-shadow: 0 4px 14px #696767;
    }
    50% {
      box-shadow: 0 4px 10px #7d7d7d;
    }
    80% {
      box-shadow: 0 4px 6px #7d7d7d;
    }
    100% {
      box-shadow: none;
    }
  }

  .disable-btn {
    cursor: not-allowed;
    background-color: #ffffff !important;
  }

  @media screen and (max-width: 1200px) {
    .tools-sort, .tools-opacity, .tools-shadow, .tools-reverse {
      display: none;
    }
    .tools-more {
      display: block;
    }
    .tool-sort-child {
      left: -17px;
    }
    .tool-opacity-child {
      left: -115px;
    }
    .tool-reverse-child {
      left: -5px;
    }
    .tool-shadow-child {
      left: -182px;
    }
  }
</style>