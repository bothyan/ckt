<!--
    created by huyuangang,2017/8/4
    phone: 15280907093
-->
<template>
  <div ref="editor" v-show="editorShow" class="editor pos-ab"
      :class="{locked: lock, 'clip-editor': clipFlag}"
      :style="editorStyle"
      @mousedown.left.self="moveMouseDown($event)"
      @click.self.stop="editorClick($event)"
      @dblclick.self.stop="editorDblClick($event)"
  >
    <textarea ref="textarea"
              class="text-box"
              v-show="textEdit"
              :style="textStyle"
              @input="textareaInput"
              v-model="textValue"
              @mousedown.stop
              @keydown.stop
              @click.stop
              contenteditable="true"></textarea>
    <!-- 裁剪 -->
    <div class="clip-area" v-show="clipFlag || frameClip" @mousedown.stop.left="moveMouseDown($event)">
      <img @mousedown.stop.left.prevent="moveMouseDown($event)"
            :src="clipInfo.imageUrl"
            :width="width" :height="height"
            :style="[{position:'absolute',opacity: 0.3}, reverseStyle]" alt="裁剪图片" >
      <img v-show="!frameClip" :src="clipInfo.imageUrl" :width="width" :height="height" :style="[clipImageStyle, reverseStyle]" alt="裁剪图片" >

      <div v-show="!frameClip" class="clip-wrap pos-ab" :style="clipStyle" @mousedown.stop.self.left="moveMouseDown($event)">
        <div class="clip-left-top-btn clip-btn" @mousedown.stop="clipResizseMousedown(0, $event)"></div>
        <div class="clip-right-top-btn clip-btn" @mousedown.stop="clipResizseMousedown(1, $event)"></div>
        <div class="clip-left-bottom-btn clip-btn" @mousedown.stop="clipResizseMousedown(3, $event)"></div>
        <div class="clip-right-bottom-btn clip-btn" @mousedown.stop="clipResizseMousedown(2, $event)"></div>
        <div class="clip-left-top-point pos-ab" ref="clip0"></div>
        <div class="clip-right-top-point pos-ab" ref="clip1"></div>
        <div class="clip-left-bottom-point pos-ab" ref="clip3"></div>
        <div class="clip-right-bottom-point pos-ab" ref="clip2"></div>
        <div class="clip-mid-point pos-ab" ref="clip-mid"></div>
        <div class="clip-oper" :style="{transform: `rotate(${360-rotate}deg)`}" @mousedown.stop>
          <div class="clip-confirm" @click="clipConfirm"></div>
          <div class="clip-cancel" @click="clipCancel"></div>
        </div>
      </div>
    </div>

    <!-- 左上角宽高显示 -->
    <div class="rect-show pos-ab" v-show="showRect">{{rectStr}}</div>
    <!-- 东西操作点 -->
    <div class="w-resize-point pos-ab resize-point"
         :class="{'point-bg': point===4}"
         @mousedown.stop.prevent="resizeMouseDown(4,$event)"
         @mouseover="hoverToChangeCursor('start0', $event)"
         @click.stop
         v-show="type !== 'zx' && type!=='selects' && type !=='db' && !lock"></div>
    <div class="e-resize-point pos-ab resize-point"
         :class="{'point-bg': point===0}"
         @mousedown.stop.prevent="resizeMouseDown(0,$event)"
         @mouseover="hoverToChangeCursor('end0', $event)"
         @click.stop
         v-show="type !== 'zx' && type!=='selects' && type !== 'db' && !lock"></div>
    <!-- 东西锚点 -->
    <div class="w-point pos-ab" ref="start0"></div>
    <div class="e-point pos-ab" ref="end0"></div>
    <!-- 南北操作点 -->
    <div class="n-resize-point pos-ab resize-point"
         :class="{'point-bg': point===5}"
         @mousedown.stop.prevent="resizeMouseDown(5,$event)"
         @mouseover="hoverToChangeCursor('start1', $event)"
         @click.stop
         v-show="type !== 'hx' && type!=='selects' && type !== 'db' && type !== 'text' && !lock"></div>
    <div class="s-resize-point pos-ab resize-point"
         :class="{'point-bg': point===1}"
         @mousedown.stop.prevent="resizeMouseDown(1,$event)"
         @mouseover="hoverToChangeCursor('end1', $event)"
         @click.stop
         v-show="type !== 'hx' && type!=='selects' && type !== 'db' && type !== 'text' && !lock"></div>
    <!-- 南北锚点 -->
    <div class="n-point pos-ab" ref="start1"></div>
    <div class="s-point pos-ab" ref="end1"></div>
    <!-- 东南、西北操作点 -->
    <div class="nw-resize-point pos-ab resize-point"
         :class="{'point-bg': point===6}"
         v-show="!lock"
         @mouseover="hoverToChangeCursor('start2', $event)"
         @click.stop
         @mousedown.stop.prevent="resizeMouseDown(6,$event)"></div>
    <div class="se-resize-point pos-ab resize-point"
         :class="{'point-bg': point===2}"
         v-show="!lock"
         @mouseover="hoverToChangeCursor('end2', $event)"
         @click.stop
         @mousedown.stop.prevent="resizeMouseDown(2,$event)"></div>
    <!-- 东南、西北锚点-->
    <div class="nw-point pos-ab" ref="start2"></div>
    <div class="se-point pos-ab" ref="end2"></div>
    <!-- 西南、东北操作点 -->
    <div class="ne-resize-point pos-ab resize-point"
         :class="{'point-bg': point===7}"
         v-show="!lock"
         @mouseover="hoverToChangeCursor('start3', $event)"
         @click.stop
         @mousedown.stop.prevent="resizeMouseDown(7,$event)"></div>
    <div class="sw-resize-point pos-ab resize-point"
         :class="{'point-bg': point===3}"
         v-show="!lock"
         @mouseover="hoverToChangeCursor('end3', $event)"
         @click.stop
         @mousedown.stop.prevent="resizeMouseDown(3,$event)"></div>
    <!-- 西南、东北锚点 -->
    <div class="ne-point pos-ab" ref="start3"></div>
    <div class="sw-point pos-ab" ref="end3"></div>
    <!-- 中心锚点 -->
    <div class="mid-point" ref="mid"></div>

    <div class="lock-point pos-ab" v-show="lock" @mousedown.stop @click="setLock" title="点我解锁"></div>
    <!-- 旋转操作点 -->
    <div class="rotate-btn"
         :class="{'rotate-btn-active': showRotate}"
         @mousedown.stop.prevent="rotateMouseDown"
         @click.stop
         v-show="eleType!=='background' && !lock && ((!clipFlag && !frameClip && type !== 'selects') || groupFlag)">
      <div class="rotate-text" v-show="showRotate" :style="rotateTextStyle">{{rotate | filterInt}}°</div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import dataHandle from 'common/dataHandle.js';
  import editorBus from 'dataBus/editor.js';
  import guideLineBus from 'dataBus/guideLine.js';
  import toolsBarBus from 'dataBus/toolsBar.js';
  import pageBus from 'dataBus/page.js';
  import pageEleBus from 'dataBus/pageEle.js';
  import imgBus from 'dataBus/img.js';
  import textBus from 'dataBus/text.js';
  import eleEvent from 'dataBus/element.js';
  import svgFrameBus from 'dataBus/svgFrame.js';
  import groupBus from 'dataBus/group.js';

  export default {
    name: 'editor',
    data() {
      return {
        left: 500,
        top: 300,
        width: 200,
        height: 100,
        type: 'db',
        angle: 0,           //对角角度，h/w
        point: -1,          //点击点索引
        rotate: 0,          //旋转角度
        showRotate: false,  //展示角度标识
        showRect: false,    //展示宽高/位置标识
        rectStr: '',
        adsorbAngle: 4,      //吸附角度
        lock: false,
        lw: 0,
        resizeType: 0,   //改变方向，1横向，2纵向，3等比 0move
        resizeFlag: false,
        moveFlag: false,
        initOpacitys: [],
        initPage: 0,
        initElem: 0,
        textValue: '',
        clipInfo: {
          imageUrl: '',
          x: 0,
          y: 0,
          width: 0,
          height: 0
        },
        initClip: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        },
        clipConfirmFlag: false,
        clipCancelFlag: false,
        clickFlag: false
      };
    },
    computed: {
      ...mapGetters({
        editorShow: 'getEditorShow',   // vuex editor.js
        editorInfo: 'getEditorInfo',   // vuex editor.js
        clipFlag: 'getClipFlag',
        focusElemIndex: 'getFocusElemIndex',
        focusPageIndex: 'getFocusPageIndex',
        pageScale: 'getPageScale',
        eleDragging: 'getEleDragging',
        selectElems: 'getCircleSelectElements',
        textInfo: 'getElementData',
        textEdit: 'getTextEdit',
        frameClip: 'getFrameClip',
        frameClipInfo: 'getFrameClipInfo',
        groupFlag: 'getGroupFlag',
        eleType: 'getFocusElemType',
        selectHaveGroup: 'getSelectHaveGroup',
        selectGroup: 'getSelectGroup',
        pageWidth: 'getPageShowWidth',
        pageHeight: 'getPageShowHeight',
        imgIsCut: 'getImgIsCut',
        pageRect: 'getPageWrapRect',
        pagePosition: 'getPagePosition',
        elementEvent: 'getElementEvent'
      }),
      editorStyle() {
        return {
          width: this.width + 'px',
          height: this.height + 'px',
          left: this.left + 'px',
          top: this.top + 'px',
          transform: `rotate(${this.rotate}deg)`
        }
      },
      rotateTextStyle() {
        return {
          transform: `rotate(${360 - this.rotate}deg)`
        }
      },
      clipStyle() {
        let clipInfo = this.clipInfo;

        return {
          left: clipInfo.x + 'px',
          top: clipInfo.y + 'px',
          width: clipInfo.width + 'px',
          height: clipInfo.height + 'px'
        }
      },
      clipImageStyle() {
        let re = {};
        if(this.clipFlag || this.frameClip) {

          let clipInfo = this.clipInfo,
              left, top,
              direX = clipInfo.reverseType[0],
              direY = clipInfo.reverseType[1];

          if(direX) {
            left = this.width - clipInfo.width - clipInfo.x;
          }
          else {
            left = clipInfo.x;
          }

          if(direY) {
            top = this.height - clipInfo.height - clipInfo.y;
          }
          else {
            top = clipInfo.y;
          }

          re = {
            position: 'absolute',
            clip: `rect(${top}px, ${left+clipInfo.width}px, ${top+clipInfo.height}px, ${left}px)`
          }
        }
        return re;
      },
      textStyle() {
        if((this.eleType === 'text' || this.type==='text') && this.textEdit) {
          let info = this.textInfo;
          if(this.groupFlag) {
            let x = info.left + info.width / 2 - this.left - this.width / 2,
                y = info.top + info.height / 2 - this.top - this.height / 2,
                r = Math.sqrt(x*x + y*y, 2),
                angle;
            if(y === 0) {
              if(x < 0) {
                angle = 180;
              }
              else {
                angle = 0;
              }
            }
            else {
              angle = Math.atan( x / y) * 180 / Math.PI;
              //算出现在素材中心相对于组合旋转中心的角度
              if(y > 0) {
                angle = 90 - angle;
              } else {
                angle = 270 - angle;
              }
            }
            angle = angle - this.rotate;
            let disX = Math.cos(angle / 180 * Math.PI) * r,
                disY = Math.sin(angle / 180 * Math.PI) * r,
                left = disX + this.width / 2 - info.width/ 2,
                top = disY + this.height / 2 - info.height / 2;
            return {
              'font-family': info.ff,
              'font-size': info.size * this.pageScale + 'px',
              'text-align': info.align,
              color: info.color,
              'font-weight': info.bold * 100,
              'text-decoration': info.underline ? 'underline' : 'none',
              'font-style': info.italic ? 'italic' : 'normal',
              'letter-spacing': parseFloat(info.wspace) / 1000 + 'em',
              'line-height': 1 + parseFloat(info.vspace) / 1000,
              left: left + 'px',
              top: top + 'px',
              width: info.width + 'px',
              height: info.height + 'px',
              //'line-height': this.height + 'px',
              'background-color': 'rgba(0,0,0,0)',
              'word-break': 'break-all',
              transform: 'rotate('+(info.rotate - this.rotate)+'deg)',
              outline: '1px dashed rgb(155, 155, 155)'
            }
          }
          return {
            'font-family': info.ff,
            'font-size': info.size * this.pageScale + 'px',
            'text-align': info.align,
            color: info.color,
            'font-weight': info.bold * 100,
            'text-decoration': info.underline ? 'underline' : 'none',
            'font-style': info.italic ? 'italic' : 'normal',
            'letter-spacing': parseFloat(info.wspace) / 1000 + 'em',
            'line-height': 1 + parseFloat(info.vspace) / 1000,
            width: this.width + 'px',
            height: this.height + 'px',
            //'line-height': this.height + 'px',
            'background-color': 'rgba(0,0,0,0)',
            'word-break': 'break-all'
          }
        }
      },
      reverseStyle() {
        let re = {};
        if(this.clipFlag || this.frameClip) {
          if(this.clipInfo.reverseType[0] && this.clipInfo.reverseType[1]) {
            re = { transform: 'rotateX(180deg)rotateY(180deg)' };
          }
          else if(this.clipInfo.reverseType[0]) {
            re = { transform: 'rotateY(180deg)' };
          }
          else if(this.clipInfo.reverseType[1]) {
            re = { transform: 'rotateX(180deg)' };
          }
        }
        return re;
      }
    },
    watch: {
      focusElemIndex(v) {
        // this.setTextEdit(false);
        if(v > -1) {
          Object.assign(this, this.editorInfo);
          if(this.eleType === 'background') {
            this.clipInfo.x = -this.left;
            this.clipInfo.y = -this.top;
            this.clipInfo.width = this.pageWidth;
            this.clipInfo.height = this.pageHeight;
          }
          this.initPage = this.focusPageIndex;
          this.initElem = this.focusElemIndex;
        }
      },
      editorInfo: {
        handler (v) {
          Object.assign(this, this.editorInfo);
        },
        deep: true
      },
      editorShow(v) {
        if (v) {
          window.addEventListener('keydown', this.moveKeyDown);
          window.addEventListener('keyup', this.moveKeyUp);
        }
        else {
          this.point = -1;
          this.showRotate = false;
          this.showRect = false;
          window.removeEventListener('keydown', this.moveKeyDown);
          window.removeEventListener('keyup', this.moveKeyUp);
        }
      },
      clipFlag(v) {
        if(v) {
          this.initOpacitys = editorBus._getInitOpacity();
          eleEvent.setOpacity(0);
          editorBus.setEditorState();
          Object.assign(this, this.editorInfo);
          Object.assign(this.clipInfo, imgBus.getCutInfo());

          let clipInfo = this.clipInfo;

          if(clipInfo.reverseType[0]) {
            clipInfo.x = this.width - clipInfo.x - clipInfo.width;
          }
          if(clipInfo.reverseType[1]) {
            clipInfo.y = this.height - clipInfo.y - clipInfo.height;
          }

          this.clipInfo.resetInfo.pageIndex = this.focusPageIndex;
          this.clipInfo.resetInfo.elemIndex = this.focusElemIndex;
        } else {
          editorBus._setInitOpacity(this.initOpacitys);
          if(!this.clipConfirmFlag && !this.clipCancelFlag) {
            if(this.clipInfo.isCut && (this.moveFlag || this.resizeFlag)) {
              let clipInfo = this.clipInfo,
                  xScale, yScale;
              if(clipInfo.reverseType[0]) {
                xScale = (this.width - clipInfo.width - clipInfo.x) / this.width;
              }
              else {
                xScale = clipInfo.x / this.width;
              }

              if(clipInfo.reverseType[1]) {
                yScale = (this.height - clipInfo.height - clipInfo.y) / this.height;
              }
              else {
                yScale = clipInfo.y / this.height;
              }

              this.dispatchSetClip({
                xScale,
                yScale,
                widthScale: this.clipInfo.width / this.width,
                heightScale: this.clipInfo.height / this.height,
                width: this.clipInfo.width,
                height: this.clipInfo.height,
                pageIndex: this.initPage,
                elemIndex: this.initElem
              });

              dataHandle.commit('element', {
                pageIndex: this.initPage,
                eleIndex: this.initElem,
                key: 'viewBox',
                value: eleEvent.getViewBox(this.initPage, this.initElem),
                eventType: 1
              });
              dataHandle.commit('element', {
                pageIndex: this.initPage,
                eleIndex: this.initElem,
                key: 'width',
                value: eleEvent.getWidth(this.initPage, this.initElem),
                eventType: 1
              });
              dataHandle.commit('element', {
                pageIndex: this.initPage,
                eleIndex: this.initElem,
                key: 'height',
                value: eleEvent.getHeight(this.initPage, this.initElem),
                eventType: 1
              });
              dataHandle.commit('element', {
                pageIndex: this.initPage,
                eleIndex: this.initElem,
                key: 'transform',
                value: eleEvent.getTransform(this.initPage, this.initElem),
                eventType: 1
              }).push();
            } else {
              let info = this.clipInfo.resetInfo,
                  elem = dataHandle.getEleJson(info.pageIndex, info.elemIndex);
              elem['data-elem'].width = info.width;
              elem['data-elem'].height = info.height;
              elem['data-elem'].isCut = info.isCut;
              elem['data-elem'].viewBox = info.viewBox;
              elem.transform = info.transform;
              // eleEvent.setWidth(info.width, info.pageIndex, info.elemIndex);
              // eleEvent.setIsCut
            }
          }
          this.clipConfirmFlag = false;
          this.clipCancelFlag = false;
          this.moveFlag = false;
          this.resizeFlag = false;
        }
      },
      //监听页面缩放比，设置editor属性
      pageScale() {

        //裁剪状态下恢复之前状态
        if(this.clipFlag || this.textEdit || this.frameClip || (this.groupFlag && this.focusElemIndex > 0) || this.eleType === 'background') {
          pageBus.elementBlur();
        }
        //未裁剪状态下editor跟随画布放大缩小
        else if(this.editorShow){
          // Object.assign(this, this.editorInfo);
          editorBus.setEditorState();
        }
      },
      textEdit(v) {
        if(v) {
          this.textValue = this.textInfo.text;
          this.textOpacity = editorBus._getInitOpacity();
          eleEvent.setOpacity(0);
        }
        else {
          editorBus._setInitOpacity(this.textOpacity);
          if(this.textValue === this.textInfo.text) {
            return;
          }
          let r = textBus.setTextHtml(this.textValue, this.initPage, this.initElem);
          dataHandle.commit('element', r.event)
          editorBus.dispatchCommit({
            height: eleEvent.getHeight(this.initPage, this.initElem),
            transform: eleEvent.getTransform(this.initPage, this.initElem)
          }, this.initPage, this.initElem).push();
        }
      },
      frameClip(v) {
        if(v) {
          this.setToolsBarShow(false);
          let info = this.frameClipInfo;
          this.left = info.left;
          this.top = info.top;
          this.width = info.imgWidth;
          this.height = info.imgHeight;
          this.clipInfo.x = info.x;
          this.clipInfo.y = info.y;
          this.clipInfo.width = info.width;
          this.clipInfo.height = info.height;
          this.clipInfo.imageUrl = info.imgUrl;
          this.clipInfo.reverseType = info.reverseType;

          if(info.reverseType[0]) {
            this.clipInfo.x = this.width - info.x - info.width;
          }
          if(info.reverseType[1]) {
            this.clipInfo.y = this.height - info.y - info.height;
          }

        }else{
          Object.assign(this, this.editorInfo);
          let thisElem = dataHandle.getEleJson(this.initPage,this.initElem);
          if(!thisElem || (!this.moveFlag && !this.resizeFlag)) return;

          let xhref = JSON.parse(JSON.stringify(thisElem['data-elem']['data-xhref-imgs']));

          for(let key in xhref) {
            let sorb = xhref[key];
            delete sorb.imgUrl;
            delete sorb.EditorImg;
          }

          dataHandle.commit('element',{
            pageIndex:this.initPage,
            eleIndex:this.initElem,
            key:'data-xhref-imgs',
            value: xhref,
            eventType:1
          });
          dataHandle.push();
          this.moveFlag = false;
          this.resizeFlag = false;
        }
      },
      textInfo: {
        handler(v, ov) {
          if(this.textEdit && !this.groupFlag) {
            if(v.ff!=ov.ff || v.size!=ov.size || v.text!=ov.text ||
              v.underline!=ov.underline || v.vspace!=ov.vspace || v.width != ov.width
              || v.wspace!=ov.wspace) {

              this.$nextTick(() => {
                this.textareaInput();
              })
            }
          }
        },
        deep: true
      },
      textValue(v) {
        this.setTextareaValue(v);
      }
    },
    methods: {
      ...mapActions([
        'setDesignJson',  // vuex editor.js
        'setEditorInfo',
        'setToolsBarShow',
        'setResizeFlag',
        'setResizeToolShow',
        'setEditorShow',
        'setClipFlag',
        'setClipInfo',
        'setEleDragging',
        'setFocusElemIndex',
        'setGuideLineShow',
        'setTextEdit',
        'setEditorLock',
        'setFrameClip',
        'setCircleSelectElementsNow',
        'setTextareaValue'
      ]),
      /**
       * 修改大小按钮鼠标按下
       *
       * @param {Number} point，
       * 0代表e-resize按下，1代表s-resize按下，2代表se-resize按下
       */
      resizeMouseDown(point, event) {


        //防止resizeTool重置
        this.setResizeFlag(true);
        this.setResizeToolShow(false);
        toolsBarBus.closeChild();
        this.resizeFlag = false;

        if(this.eleType === 'text') {
          if(point === 0 || point === 4) {
            this.setTextEdit(true);
          }
          else {
            this.setTextEdit(false);
          }
        }

        if(this.elementLoading())
          return;

        let me = this,
            initInfo = {
              left: me.left,
              top: me.top,
              width: me.width,
              height: me.height
            };

        me.point = point;

        //获取定点位置
        let fixedPoint;
        if(me.eleType === 'text' && point % 4 == 0) {
          me.resizeType = 1;
          if(point === 0) {
            fixedPoint = me.$refs.start2.getBoundingClientRect();
          }
          else {
            fixedPoint = me.$refs.start3.getBoundingClientRect();
          }
        }
        else {
          switch (point) {
            case 0:
              fixedPoint = me.$refs.start0.getBoundingClientRect();
              me.resizeType = 1;
              break;
            case 4:
              fixedPoint = me.$refs.end0.getBoundingClientRect();
              me.resizeType = 1;
              break;
            case 1:
              fixedPoint = me.$refs.start1.getBoundingClientRect();
              me.resizeType = 2;
              break;
            case 5:
              fixedPoint = me.$refs.end1.getBoundingClientRect();
              me.resizeType = 2;
              break;
            case 2:
              fixedPoint = me.$refs.start2.getBoundingClientRect();
              me.resizeType = 3;
              break;
            case 6:
              fixedPoint = me.$refs.end2.getBoundingClientRect();
              me.resizeType = 3;
              break;
            case 3:
              fixedPoint = me.$refs.start3.getBoundingClientRect();
              me.resizeType = 3;
              break;
            case 7:
              fixedPoint = me.$refs.end3.getBoundingClientRect();
              me.resizeType = 3;
              break;
          }
        }
        //计算对点位置
        let across = me.getAcross(point),
            dis = {
              left: across.oX - me.width / 2 - me.left,
              top: across.oY - me.height / 2 - me.top
            }

        window.addEventListener('mousemove', resizeMouseMove);
        window.addEventListener('mouseup', resizeMouseUp);

        // let firstLoading = true;
        function resizeMouseMove(event) {

          if(me.elementLoading())
            return;

          // if(firstLoading && me.eleType === 'text') {
          //   editorBus.setEditorState();
          //   firstLoading = false;
          // }

          me.resizeFlag = true;
          me.showRect = true;
          // 文字高度适配
          
          let e = event || window.event;
          //当前鼠标点
          let eX = e.clientX - across.oX,
              eY = e.clientY - across.oY;
          let result;
          if (isNaN(across.a)) {
            if (eY < across.y1 === across.direction) {
              result = Math.abs(eY - across.y1);
            } else {
              result = 3;
            }
          } else if (across.a == 0) {
            if (eX < across.x1 === across.direction) {
              result = Math.abs(eX - across.x1);
            } else {
              result = 3;
            }
          } else {
            if (across.a2 * eX + across.b2 > eY === across.direction) {
              let disOfMouseAndStartpoint = Math.sqrt(Math.pow(eX - across.x1, 2) + Math.pow(eY - across.y1, 2), 2),
                  disOfMouseAndLine = Math.abs(across.a * eX + across.b - eY) / Math.sqrt(Math.pow(across.a, 2) + 1, 2);
              result = Math.sqrt(Math.pow(disOfMouseAndStartpoint, 2) - Math.pow(disOfMouseAndLine, 2), 2);
            }
            else {
              result = 3;
            }
          }

          if (point % 4 === 0) {
            me.width = result < 3 ? 3 : result;
          } else if (point % 4 == 1) {
            me.height = result < 3 ? 3 : result;
          } else {
            me.calcAngle();
            result = result < 3 ? 3 : result;
            me.width = result * Math.cos(me.angle / 180 * Math.PI);
            me.height = result * Math.sin(me.angle / 180 * Math.PI);
          }


          if(me.textEdit && me.width < me.pageScale * me.textInfo.size) {
            me.width = me.pageScale * me.textInfo.size;
          }

          if(me.resizeType === 1 && me.eleType === 'text') {
            me.textareaInput();
          }

          me.calcAngle();
          if(me.eleType === 'text' && me.resizeType === 1) {
            if(point === 0) {
              let r = Math.sqrt(Math.pow(me.width, 2) + Math.pow(me.height, 2), 2) / 2;
              me.left = fixedPoint.left - me.width / 2 + Math.cos((me.angle + me.rotate) / 180 * Math.PI) * r - dis.left;
              me.top = fixedPoint.top - me.height / 2 + Math.sin((me.angle + me.rotate) / 180 * Math.PI) * r - dis.top;
            }
            else {
              let r = Math.sqrt(Math.pow(me.width, 2) + Math.pow(me.height, 2), 2) / 2;
              me.left = fixedPoint.left - me.width / 2 - Math.cos((me.angle - me.rotate) / 180 * Math.PI) * r - dis.left;
              me.top = fixedPoint.top - me.height / 2 + Math.sin((me.angle - me.rotate) / 180 * Math.PI) * r - dis.top;
            }
          }
          else {
            if (point === 0) {
              me.left = fixedPoint.left + me.width / 2 * (Math.cos(me.rotate / 180 * Math.PI) - 1) - dis.left;
              me.top = fixedPoint.top - me.height / 2 + me.width / 2 * Math.sin(me.rotate / 180 * Math.PI) - dis.top;
            } else if (point === 4) {
              me.left = fixedPoint.left - me.width / 2 * (Math.cos(me.rotate / 180 * Math.PI) + 1) - dis.left;
              me.top = fixedPoint.top - me.height / 2 - me.width / 2 * Math.sin(me.rotate / 180 * Math.PI) - dis.top;
            } else if (point === 1) {
              me.left = fixedPoint.left - me.width / 2 - me.height / 2 * Math.sin(me.rotate / 180 * Math.PI) - dis.left;
              me.top = fixedPoint.top - me.height / 2 + me.height / 2 * Math.cos(me.rotate / 180 * Math.PI) - dis.top;
            } else if (point === 5) {
              me.left = fixedPoint.left - me.width / 2 + me.height / 2 * Math.sin(me.rotate / 180 * Math.PI) - dis.left;
              me.top = fixedPoint.top - me.height / 2 - me.height / 2 * Math.cos(me.rotate / 180 * Math.PI) - dis.top;
            } else if (point === 2) {
              let r = Math.sqrt(Math.pow(me.width, 2) + Math.pow(me.height, 2), 2) / 2;
              me.left = fixedPoint.left - me.width / 2 + Math.cos((me.angle + me.rotate) / 180 * Math.PI) * r - dis.left;
              me.top = fixedPoint.top - me.height / 2 + Math.sin((me.angle + me.rotate) / 180 * Math.PI) * r - dis.top;
            } else if (point === 6) {
              let r = Math.sqrt(Math.pow(me.width, 2) + Math.pow(me.height, 2), 2) / 2;
              me.left = fixedPoint.left - me.width / 2 - Math.cos((me.angle + me.rotate) / 180 * Math.PI) * r - dis.left
              me.top = fixedPoint.top - me.height / 2 - Math.sin((me.angle + me.rotate) / 180 * Math.PI) * r - dis.top;
            } else if (point === 3) {
              let r = Math.sqrt(Math.pow(me.width, 2) + Math.pow(me.height, 2), 2) / 2;
              me.left = fixedPoint.left - me.width / 2 - Math.cos((me.angle - me.rotate) / 180 * Math.PI) * r - dis.left;
              me.top = fixedPoint.top - me.height / 2 + Math.sin((me.angle - me.rotate) / 180 * Math.PI) * r - dis.top;
            } else if (point === 7) {
              let r = Math.sqrt(Math.pow(me.width, 2) + Math.pow(me.height, 2), 2) / 2;
              me.left = fixedPoint.left - me.width / 2 + Math.cos((me.angle - me.rotate) / 180 * Math.PI) * r - dis.left;
              me.top = fixedPoint.top - me.height / 2 - Math.sin((me.angle - me.rotate) / 180 * Math.PI) * r - dis.top;
            }
          }

          //框选判断
          if(me.type === 'selects') {
            me.dispatchSetSelectElement({
              leftDis: me.left - initInfo.left,
              topDis: me.top - initInfo.top,
              widthScale: me.width / initInfo.width,
              heightScale: me.height / initInfo.height,
              left: initInfo.left,
              top: initInfo.top
            })

            if(me.groupFlag) {
              groupBus.setGroupTransform({
                left: me.left,
                top: me.top,
                width: me.width,
                height: me.height,
                rotate: me.rotate
              });
            }

            if(me.selectHaveGroup) {
              me.selectGroup.forEach(item => {
                groupBus.setGroupTransformByScale(item, {
                  nLeft: me.left / me.pageScale,
                  nTop: me.top / me.pageScale,
                  widthScale: me.width / initInfo.width,
                  heightScale: me.height / initInfo.height,
                  oLeft: initInfo.left / me.pageScale,
                  oTop: initInfo.top / me.pageScale
                })
              })
            }

          }
          //裁剪判断
          if(me.clipFlag || me.frameClip || me.eleType==='background') {
            //计算editor变化后裁剪位置
            //先保留移动前位置
            let initX = me.clipInfo.x,
                initY = me.clipInfo.y;

            if(point === 6) {   //点击左上角缩放

              me.clipInfo.x += me.width - initInfo.width;
              me.clipInfo.y += me.height - initInfo.height;

            } else if(point === 3) {  //点击左下角缩放

              me.clipInfo.x += me.width - initInfo.width;

            } else if(point === 7) { //点击右上角缩放

              me.clipInfo.y += me.height - initInfo.height;

            }

            //判断边界
            if(me.clipInfo.x < 0 || me.clipInfo.x + me.clipInfo.width > me.width ) {
              me.clipInfo.x = initX;
              me.clipInfo.y = initY;
              me.width = initInfo.width;
              me.height = initInfo.height;
              me.left = initInfo.left;
              me.top = initInfo.top;
            } else if( me.clipInfo.y < 0 || me.clipInfo.y + me.clipInfo.height > me.height) {
              me.clipInfo.x = initX;
              me.clipInfo.y = initY;
              me.width = initInfo.width;
              me.height = initInfo.height;
              me.left = initInfo.left;
              me.top = initInfo.top;
            }

          }

          if(me.frameClip) {
            me.dispatchSetSvgFrame();
          }

          me.rectStr = `${me.width | 0},${me.height | 0}`;
          me.dispatchJsonChange();
          initInfo = {
            left: me.left,
            top: me.top,
            width: me.width,
            height: me.height
          };
        }

        function resizeMouseUp() {
          if(!me.editorShow) {
            window.removeEventListener('mousemove', resizeMouseMove);
            window.removeEventListener('mouseup', resizeMouseUp);
            me = null;
            across = null;
            fixedPoint = null;
            initInfo = null;
            // firstLoading = null;
            return ;
          }
          //重置图层信息
          if(me.type !== 'selects'){
            toolsBarBus.setToolsBarLayerInfo();
          }
          me.point = -1;
          me.showRect = false;

          if(me.type === 'selects'){

            let pageIndex = me.focusPageIndex
            for( let i = 0, l = me.selectElems.length; i < l; i++) {

              let index = me.selectElems[i];
              eleEvent.dispatchCommit({
                type: 1,
                pageIndex,
                eleIndex: index
              });
            }

            if(me.groupFlag) {
              groupBus.dispatchCommit('transform');
            }

            if(me.selectHaveGroup) {
              me.selectGroup.forEach(item => {
                groupBus.dispatchCommit('transform', item);
              })
            }

            dataHandle.push();

          } else {
            if (me.type === 'text') {
              if (me.resizeType === 1) { // hx 用于发请求
                textBus.setFontWidth();
              }
            }
            if(!me.frameClip && !me.clipFlag) {
              eleEvent.dispatchCommit({
                type: 1
              });
              dataHandle.push();
            }
          }


          window.removeEventListener('mousemove', resizeMouseMove);
          window.removeEventListener('mouseup', resizeMouseUp);
          if(!me.clipFlag && !me.frameClip) {
            editorBus.setEditorState();
          }
          me = null;
          across = null;
          fixedPoint = null;
          initInfo = null;
          // firstLoading = null;
        }
      },
      rotateMouseDown() {

        toolsBarBus.closeChild();
        let initRotate = this.rotate;

        if(this.textEdit) {
          this.setTextEdit(false);
        }

        let me = this;
        this.showRotate = true;
        window.addEventListener('mousemove', rotateMouseMove);
        window.addEventListener('mouseup', rotateMouseUp);

        function rotateMouseMove(event) {
          let e = event || window.event,
              midRect = me.$refs.mid.getBoundingClientRect(),
              x = e.clientX - midRect.left,
              y = e.clientY - midRect.top;
          let rotate = Math.atan(x / y) * 180 / Math.PI | 0;
          if (y < 0) {
            rotate = 180 - rotate;
          } else if (x < 0) {
            rotate = -rotate;
          } else {
            rotate = 360 - rotate;
          }
          let remainder = rotate % 45;
          if (remainder < me.adsorbAngle) {
            me.rotate = (rotate / 45 | 0) * 45;
          } else if (remainder + me.adsorbAngle > 45) {
            me.rotate = ((rotate / 45 | 0) + 1) * 45;
          } else {
            me.rotate = rotate;
          }
          if(!me.groupFlag){
            me.dispatchJsonChange();
          }
          else {
            groupBus.setElementInfoByGroupRotate(me.rotate);
          }

        }

        function rotateMouseUp() {
          if(!me.editorShow) {
            me = null;
            initRotate = null;
            window.removeEventListener('mousemove', rotateMouseMove);
            window.removeEventListener('mouseup', rotateMouseUp);
            return ;
          }
          //重置图层信息
          if(me.type !== 'selects' && initRotate !== me.rotate){
            toolsBarBus.setToolsBarLayerInfo();
          }
          if(initRotate !== me.rotate) {
            if(!me.groupFlag) {
              eleEvent.dispatchCommit({
                type: 2
              });
              dataHandle.push();
            }
            else {
              for(let i = 0, l = me.selectElems.length; i < l; i++) {
                eleEvent.dispatchCommit({
                  type: 2,
                  pageIndex: me.focusPageIndex,
                  eleIndex: me.selectElems[i]
                })
              }

              groupBus.dispatchCommit('transform');
              dataHandle.push();
            }
          }

          me.showRotate = false;
          window.removeEventListener('mousemove', rotateMouseMove);
          window.removeEventListener('mouseup', rotateMouseUp);

          if(!me.clipFlag && !me.frameClip && initRotate !== me.rotate) {
            editorBus.setEditorState();
          }
          me = null;
          initRotate = null;
        }
      },
      moveMouseDown(event) {

        let notFocusEleRect = pageEleBus.getNotFocusEleRectList();

        let initOpacitys = editorBus._getInitOpacity();

        toolsBarBus.closeChild();

        let me = this,
            startPoint = {
              x: event.clientX,
              y: event.clientY
            },
            initInfo = {
              left: this.left,
              top: this.top
            };

        this.moveFlag = false;
        this.resizeType = 0;

        if(!this.lock) {
          window.addEventListener('mousemove', moveMousemove);
          window.addEventListener('mouseup', moveMouseup);
          event.stopPropagation();
        }

        let moveDrag = false;

        function moveMousemove(event) {

          if(Math.abs(event.clientX - startPoint.x) > 1 || Math.abs(event.clientY - startPoint.y)) {
            moveDrag = true;
          }

          if(!moveDrag) {
            return;
          }

          if(me.textEdit) {
            return;
          }

          if(me.groupFlag && me.focusElemIndex > 0) {
            return ;
          }

          if(me.lock){
            return;
          }

          let e = event || window.event;
          // if(Math.sqrt(Math.pow(e.clientX - startPoint.x, 2) + Math.pow(e.clientY - startPoint.y, 2), 2) < 5){
          //   return;
          // }
          me.moveFlag = true;

          let disX = e.clientX - startPoint.x,
              disY = e.clientY - startPoint.y;


          let cos = Math.cos(me.rotate / 180 * Math.PI),
              sin = Math.sin(me.rotate / 180 * Math.PI);

          // 判断是否是裁剪
          if(me.clipFlag || me.frameClip || me.eleType==='background') {
            let clipInfo = me.clipInfo,
                x = me.clipInfo.x - disX * cos - disY * sin,
                y = me.clipInfo.y + disX * sin - disY * cos;

            if(x < 0) {
              x = 0;
            } else if(x + clipInfo.width > me.width) {
              x = me.width - clipInfo.width;
            }
            if(y < 0) {
              y = 0;
            } else if(y + clipInfo.height > me.height) {
              y = me.height - clipInfo.height;
            }

            // 反推
            disX = (me.clipInfo.x - x) * cos + (y - me.clipInfo.y) * sin;
            disY = -(y - me.clipInfo.y) * cos + (me.clipInfo.x - x) * sin;

            clipInfo.x = x;
            clipInfo.y = y;

          }

          me.left = me.left + disX;
          me.top = me.top + disY;
          me.rectStr = `${me.left | 0},${me.top | 0}`
          me.showRect = true;

          if(me.type === 'selects'){
            me.dispatchSetSelectElement({
              leftDis: me.left - initInfo.left,
              topDis: me.top - initInfo.top,
              widthScale: 1,
              heightScale: 1
            }, 'mouse')

            if(me.groupFlag) {
              groupBus.setGroupTransform({
                left: me.left,
                top: me.top,
                width: me.width,
                height: me.height,
                rotate: me.rotate
              });
            }

            if(me.selectHaveGroup) {
              groupBus.setGroupTransformByDis({
                left: me.left - initInfo.left,
                top: me.top - initInfo.top,
              })
            }

            initInfo = {
              left: me.left,
              top: me.top
            }
          } else {
            me.dispatchJsonChange('move');
          }


          if(!me.clipFlag && !me.frameClip && me.eleType !== 'background'){

            let focusElemRect = eleEvent.getFocusElemRect();

            let result = guideLineBus.setEleAdsorption(focusElemRect, notFocusEleRect);

            if(result) {
              let disX = (result.newLeft - focusElemRect.left) * me.pageScale,
                  disY = (result.newTop - focusElemRect.top) * me.pageScale;

              let left = me.left + disX,
                  top = me.top + disY ;

              startPoint.x = e.clientX + disX;
              startPoint.y = e.clientY + disY;
              

              me.left = left;
              me.top = top;
              if(me.type === 'selects'){
                me.dispatchSetSelectElement({
                  leftDis: me.left - initInfo.left,
                  topDis: me.top - initInfo.top,
                  widthScale: 1,
                  heightScale: 1
                })

                if(me.groupFlag) {
                  groupBus.setGroupTransform({
                    left: me.left,
                    top: me.top,
                    width: me.width,
                    height: me.height,
                    rotate: me.rotate
                  });
                }

                if(me.selectHaveGroup) {
                  groupBus.setGroupTransformByDis({
                    left: me.left - initInfo.left,
                    top: me.top - initInfo.top,
                  })
                }

                initInfo = {
                  left: me.left,
                  top: me.top
                }
              } else {

                me.dispatchJsonChange('move');
              }

              me.setEleDragging(!me.eleDragging);
            }
            else {
              startPoint = {
                x: e.clientX,
                y: e.clientY
              };
            }
          } else {
            startPoint = {
              x: e.clientX,
              y: e.clientY
            };
          }

          if(me.frameClip) {
            me.dispatchSetSvgFrame();
          }

          

        }

        function moveMouseup() {

          window.removeEventListener('mousemove', moveMousemove);
          window.removeEventListener('mouseup', moveMouseup);

          if(!me.moveFlag || !me.editorShow) {
            me = null;
            initInfo = null;
            notFocusEleRect = null;
            initOpacitys = null;
            return ;
          }



          //重置透明度
          editorBus._setInitOpacity(initOpacitys);
          //重置图层信息
          if(me.type !== 'selects'){
            toolsBarBus.setToolsBarLayerInfo();
          }


          if(me.type === 'selects'){
            let pageIndex = me.focusPageIndex;
            for( let i = 0, l = me.selectElems.length; i < l; i++) {

              let index = me.selectElems[i];
              eleEvent.dispatchCommit({
                type: 3,
                pageIndex,
                eleIndex: index
              });
            }
            if(me.groupFlag) {
              groupBus.dispatchCommit('transform');
            }

            if(me.selectHaveGroup) {
              me.selectGroup.forEach(item => {
                groupBus.dispatchCommit('transform', item);
              })
            }
            // me.$nextTick(() => {
              dataHandle.push();
            // })

          } else {
            if(!me.frameClip && !me.clipFlag) {
              eleEvent.dispatchCommit({
                type: 3
              });
              // me.$nextTick(() => {
                dataHandle.push();
              // })
            }
          }

          me.setGuideLineShow(false);
          me.showRect = false;
          me.dispatchJsonChange();
          if(!me.clipFlag && !me.frameClip) {
            editorBus.setEditorState();
          }
          me.setCircleSelectElementsNow([]);
          me = null;
          initInfo = null;
          notFocusEleRect = null;
          initOpacitys = null;
        }
      },
      moveKeyDown(event) {
        if(this.clipFlag || this.frameClip || this.lock || this.eleType === 'background') {
          return ;
        }
        let e = event || window.event,
            code = e.keyCode,
            initInfo = {
              left: this.left,
              top: this.top
            };

        if(code < 37 || code > 40)
          return;
        this.moveFlag = true;

        switch (code) {
          case 37:
            this.left -= 3;
            break;
          case 38:
            this.top -= 3;
            break;
          case 39:
            this.left += 3;
            break;
          case 40:
            this.top += 3;
            break;
        }
        this.dispatchJsonChange();
        this.rectStr = `${this.left | 0},${this.top | 0}`;
        if (!this.showRect) {
          this.showRect = true;
        }

        if(this.type === 'selects') {
          this.dispatchSetSelectElement({
            leftDis: this.left - initInfo.left,
            topDis: this.top - initInfo.top,
            widthScale: 1,
            heightScale: 1
          })

          if(this.groupFlag) {
            groupBus.setGroupTransform({
              left: this.left,
              top: this.top,
              width: this.width,
              height: this.height,
              rotate: this.rotate
            });
          }

          if(this.selectHaveGroup) {
            groupBus.setGroupTransformByDis({
              left: this.left - initInfo.left,
              top: this.top - initInfo.top,
            })
          }

          initInfo = {
            left: this.left,
            top: this.top
          }
        }

      },
      moveKeyUp() {
        let me = this;

        if(!this.moveFlag || this.clipFlag || this.frameClip || this.lock || this.eleType === 'background'){
          return;
        }

        //重置图层信息
        if(this.type !== 'selects'){
          toolsBarBus.setToolsBarLayerInfo();
        }

        this.moveFlag = false;
        if(this.type === 'selects'){
          let pageIndex = me.focusPageIndex;
          for( let i = 0, l = me.selectElems.length; i < l; i++) {

            let index = me.selectElems[i];
            eleEvent.dispatchCommit({
              type: 1,
              pageIndex,
              eleIndex: index
            });
          }

          if(me.groupFlag) {
            groupBus.dispatchCommit('transform');
          }

          if(me.selectHaveGroup) {
            me.selectGroup.forEach(item => {
              groupBus.dispatchCommit('transform', item);
            })
          }

          dataHandle.push();

        } else {

          eleEvent.dispatchCommit({
            type: 3
          });
          dataHandle.push();
        }
        this.showRect = false;
        editorBus.setEditorState();
      },
      //计算线框对角线角度
      calcAngle() {
        this.angle = Math.atan(this.height / this.width) * 180 / Math.PI;
      },
      //获取开始点，结束点，两点连线属性，垂直线属性
      getAcross(pNum) {
        let startRect,
            endRect,
            oRect = this.$refs.mid.getBoundingClientRect();
        if (pNum / 4 < 1) {
          startRect = this.$refs['start' + pNum].getBoundingClientRect();
          endRect = this.$refs['end' + pNum].getBoundingClientRect();
        } else {
          startRect = this.$refs['end' + pNum % 4].getBoundingClientRect();
          endRect = this.$refs['start' + pNum % 4].getBoundingClientRect();
        }

        let across = {
          x1: startRect.left - oRect.left,
          y1: startRect.top - oRect.top,
          x2: endRect.left - oRect.left,
          y2: endRect.top - oRect.top,
          oX: oRect.left,
          oY: oRect.top
        };
        if (across.x1 === across.x2) {
          across.a = NaN;
          across.a2 = 0;
          across.direction = across.y2 < across.y1;
        } else if (across.y1 === across.y2) {
          across.a = 0;
          across.a2 = NaN;
          across.direction = across.x2 < across.x1;
        } else {
          across.a = (across.y2 - across.y1) / (across.x2 - across.x1);
          across.b = -across.a * across.x1 + across.y1;
          across.a2 = -1 / across.a;
          across.b2 = across.y1 - across.a2 * across.x1;
          across.direction = across.y2 < across.a2 * across.x2 + across.b2;
        }
        return across;
      },
      dispatchJsonChange(type) {
        if(this.frameClip){
          return;
        }
        let info = {
          width: this.width,
          height: this.height,
          left: this.left,
          top: this.top,
          rotate: this.rotate,
          resizeType: this.resizeType,
          type: this.type
        }
        if(this.type === 'selects' || this.type === 'grounp'){
          return;
        }
        if(this.clipInfo.isCut && this.clipFlag) {
          info = this.calcElemInfoByClip();
        }

        if(type === 'move' && this.eleType!=='background') {
          info.opacity = 0.5;
        }

        if(this.clipFlag) {
          delete info.opacity;
        }

        eleEvent.setElemInfo(info);
        toolsBarBus.setToolsBarState();
      },
      editorClick(event) {
        if(!this.moveFlag){
          editorBus.getEditorClickTarget( {
            left: event.pageX - this.pageRect.left - this.pagePosition.left,
            top: event.pageY - this.pageRect.top - this.pagePosition.top
          });
        }

        if(this.groupFlag && this.focusElemIndex > 0) {
          this.setFocusElemIndex({ index: -1});
          toolsBarBus.setToolsBarState();
          this.textEdit && this.setTextEdit(false);
        }
      },
      setLock() {
        eleEvent.setLockForEdit(false);
        if(!this.clipFlag && !this.frameClip) {
          editorBus.setEditorState();
        }
        else {
          this.lock = false;
        }
        toolsBarBus.setToolsBarState();
      },
      //0左上，1右上，2右下，3左下
      clipResizseMousedown(point, event) {

        this.resizeFlag = false;
        let me = this;

        window.addEventListener('mousemove', _clipResizeMousemove);
        window.addEventListener('mouseup', _clipResizeMouseup);

        function _clipResizeMousemove(event) {
          me.resizeFlag = true;
          let e = event || window.event,
              result = me.calcClipWidthAndHeight(point, event.clientX, event.clientY);

          let x = me.clipInfo.x - (result.width - me.clipInfo.width),
              y = me.clipInfo.y - (result.height - me.clipInfo.height);

          if(point === 0) {
            if(x < 0) {
              result.width = me.clipInfo.width + me.clipInfo.x;
              me.clipInfo.x = 0;
            } else {
              me.clipInfo.x = x;
            }
            if(y < 0) {
              result.height = me.clipInfo.height + me.clipInfo.y;
              me.clipInfo.y = 0;
            } else{
              me.clipInfo.y = y;
            }

          } else if( point === 1) {
            if(y < 0) {
              result.height = me.clipInfo.height + me.clipInfo.y;
              me.clipInfo.y = 0;
            } else {
              me.clipInfo.y = y;
            }
            if(me.clipInfo.x + result.width > me.width) {
              result.width = me.width - me.clipInfo.x;
            }

          } else if( point === 2) {
            if(me.clipInfo.x + result.width > me.width) {
              result.width = me.width - me.clipInfo.x;
            }
            if(me.clipInfo.y + result.height > me.height) {
              result.height = me.height - me.clipInfo.y;
            }
          } else if( point === 3) {
            if(x < 0) {
              result.width = me.clipInfo.width + me.clipInfo.x;
              me.clipInfo.x = 0;
            } else {
              me.clipInfo.x = x;
            }
            if(me.clipInfo.y + result.height > me.height) {
              result.height = me.height - me.clipInfo.y;
            }
          }

          me.clipInfo.width = result.width;
          me.clipInfo.height = result.height;
          me.dispatchSetClip({
            xScale: me.clipInfo.x / me.width,
            yScale: me.clipInfo.y / me.height,
            widthScale: me.clipInfo.width / me.width,
            heightScale: me.clipInfo.height / me.height,
            width: me.clipInfo.width,
            height: me.clipInfo.height,
            pageIndex: me.focusPageIndex,
            elemIndex: me.focusElemIndex
          });
          eleEvent.setElemInfo(me.calcElemInfoByClip());

        }

        function _clipResizeMouseup() {
          me = null;
          window.removeEventListener('mousemove', _clipResizeMousemove);
          window.removeEventListener('mouseup', _clipResizeMouseup);
        }

      },
      clipConfirm() {
        // 设置裁剪
        this.clipConfirmFlag = true;
        if(this.resizeFlag || this.moveFlag || !this.clipInfo.isCut) {
          let clipInfo = this.clipInfo,
              xScale, yScale;
          if(clipInfo.reverseType[0]) {
            xScale = (this.width - clipInfo.width - clipInfo.x) / this.width;
          }
          else {
            xScale = clipInfo.x / this.width;
          }

          if(clipInfo.reverseType[1]) {
            yScale = (this.height - clipInfo.height - clipInfo.y) / this.height;
          }
          else {
            yScale = clipInfo.y / this.height;
          }

          this.dispatchSetClip({
            xScale,
            yScale,
            widthScale: this.clipInfo.width / this.width,
            heightScale: this.clipInfo.height / this.height,
            width: this.clipInfo.width,
            height: this.clipInfo.height,
            pageIndex: this.initPage,
            elemIndex: this.initElem
          });

          dataHandle.commit('element', {
            pageIndex: this.initPage,
            eleIndex: this.initElem,
            key: 'viewBox',
            value: eleEvent.getViewBox(this.initPage, this.initElem),
            eventType: 1
          });
          dataHandle.commit('element', {
            pageIndex: this.initPage,
            eleIndex: this.initElem,
            key: 'width',
            value: eleEvent.getWidth(this.initPage, this.initElem),
            eventType: 1
          });
          dataHandle.commit('element', {
            pageIndex: this.initPage,
            eleIndex: this.initElem,
            key: 'height',
            value: eleEvent.getHeight(this.initPage, this.initElem),
            eventType: 1
          });

          if(!this.clipInfo.isCut){
            eleEvent.setElemInfo(this.calcElemInfoByClip());
            this.clipInfo.isCut = true;

            dataHandle.commit('element', {
              pageIndex: this.initPage,
              eleIndex: this.initElem,
              key: 'imgWidth',
              value: eleEvent.getImgWidth(this.initPage, this.initElem),
              eventType: 1
            });
            dataHandle.commit('element', {
              pageIndex: this.initPage,
              eleIndex: this.initElem,
              key: 'imgHeight',
              value: eleEvent.getImgHeight(this.initPage, this.initElem),
              eventType: 1
            });

            dataHandle.commit('element', {
              pageIndex: this.initPage,
              eleIndex: this.initElem,
              key: 'transform',
              value: eleEvent.getTransform(this.initPage, this.initElem),
              eventType: 1
            });

            dataHandle.commit('element', {
              pageIndex: this.initPage,
              eleIndex: this.initElem,
              key: 'isCut',
              value: true,
              eventType: 1
            });

          }
          dataHandle.push();
        }
        this.resizeFlag = false;
        this.moveFlag = false;
        pageBus.elementBlur();
      },
      clipCancel() {
        this.clipCancelFlag = true;
        imgBus.resetCutPos(this.clipInfo.resetInfo);
        this.resizeFlag = false;
        this.moveFlag = false;
        pageBus.elementBlur();
      },
      dispatchSetClip(obj) {
        imgBus.setCutSize(obj, obj.pageIndex, obj.elemIndex);
      },
      dispatchSetSelectElement(option, type) {
        eleEvent.setSelectElementInfo(option, type);
      },
      calcElemInfoByClip() {
        let clipInfo = this.clipInfo,
            x = clipInfo.x + clipInfo.width / 2 - this.width / 2,
            y = clipInfo.y + clipInfo.height / 2 - this.height / 2,
            r = Math.sqrt(x*x + y*y, 2),
            disX, disY;


        if(x === 0 || y ===0) {
          disX = x;
          disY = y;
        } else {
          let angle = Math.atan( x / y) * 180 / Math.PI;

          if (y < 0) {
            angle = 270 - angle;
          } else {
            angle =  90 - angle;
          }

          disX = r * Math.cos((angle + this.rotate) / 180 * Math.PI);
          disY = r * Math.sin((angle + this.rotate) / 180 * Math.PI);
        }

        disX += (this.width - clipInfo.width) / 2;
        disY += (this.height - clipInfo.height) / 2;

        return {
          left: this.left + disX,
          top: this.top + disY,
          width: clipInfo.width,
          height: clipInfo.height,
          rotate: this.rotate,
          type: 3
        }
      },
      //点击的point：0左上，1右上，2右下，3左下， 鼠标位置x、y;
      calcClipWidthAndHeight(point, x, y) {
        //对点索引， 0，2对应， 1，3对应  对点为定点
        let fixedPoint = (point + 2) % 4,
            movePos = this.$refs['clip'+point].getBoundingClientRect(),
            fixedPos = this.$refs['clip'+fixedPoint].getBoundingClientRect(),
            xPos,yPos;

        let reto = {};

        //确定另外两个点x，y关系

        switch(fixedPoint) {
          case 0: xPos = this.$refs['clip1'].getBoundingClientRect();
                  yPos = this.$refs['clip3'].getBoundingClientRect();
                  break;
          case 2: xPos = this.$refs['clip3'].getBoundingClientRect();
                  yPos = this.$refs['clip1'].getBoundingClientRect();
                  break;
          case 1: xPos = this.$refs['clip0'].getBoundingClientRect();
                  yPos = this.$refs['clip2'].getBoundingClientRect();
                  break;
          case 3: xPos = this.$refs['clip2'].getBoundingClientRect();
                  yPos = this.$refs['clip0'].getBoundingClientRect();
                  break;
        }

        let k1, b1, k2, b2, xDirection, yDirection;

        if(xPos.left === fixedPos.left) {
          k1 = NaN;
          k2 = 0;
          xDirection = movePos.top < fixedPos.top;
          yDirection = movePos.left < fixedPos.left;
        } else if(xPos.top === fixedPos.top) {
          k1 = 0;
          k2 = NaN;
          xDirection = movePos.left < fixedPos.left;
          yDirection = movePos.top < fixedPos.top;
        } else {
          k1 = (xPos.top - fixedPos.top) / (xPos.left - fixedPos.left);
          b1 = xPos.top - k1 * xPos.left;
          k2 = (yPos.top - fixedPos.top) / (yPos.left - fixedPos.left);
          b2 = yPos.top - k2 * yPos.left;
          xDirection = movePos.top < k1 * movePos.left + b1;
          yDirection = movePos.top < k2 * movePos.left + b2;
        }

        if(k1 === 0) {
          reto.width = Math.abs(x - fixedPos.left);
          reto.height =  Math.abs(y - fixedPos.top);
          if(xDirection !== x < fixedPos.left || reto.width < 20) {
            reto.width = 20;
          }
          if(yDirection !== y < fixedPos.top || reto.height < 20) {
            reto.height = 20;
          }
        } else if(k2 ===  0) {
          reto.width = Math.abs(y - fixedPos.top);
          reto.height = Math.abs(x - fixedPos.left);
          if(xDirection !== y < fixedPos.top || reto.width < 20) {
            reto.width = 20;
          }
          if(yDirection !== x < fixedPos.left || reto.height < 20) {
            reto.height = 20;
          }
        } else {
          reto.width = Math.abs( k2 * x - y + b2 ) / Math.sqrt( k2 * k2 + 1, 2);
          reto.height = Math.abs( k1 * x - y + b1) / Math.sqrt( k1 * k1 + 1, 2);
          if(xDirection !== (y < k1*x + b1) || reto.width < 20){
            reto.width = 20;
          }
          if(yDirection !== (y < k2*x + b2) || reto.height < 20) {
            reto.height = 20;
          }
        }

        return reto;
      },
      textareaInput() {
        if(!this.editorShow) {
          return;
        }
        let textarea = this.$refs.textarea;
        let info = this.textInfo;
        let changeHeightTextarea = document.getElementById('changeHeightTextarea');
        // 适配小于12号字体
        changeHeightTextarea.style.fontSize = info.size * this.pageScale + 'px';
        let sizeScale = 1;
        if(info.size * this.pageScale < 12) {
          sizeScale = 12 / (info.size * this.pageScale);
          changeHeightTextarea.style.fontSize = '12px';
        }
        // sizeScale = 1;

        if(this.groupFlag) {
          changeHeightTextarea.style.width = info.width * sizeScale + 'px';
        } else {
          changeHeightTextarea.style.width = this.width * sizeScale + 'px';
        }
        changeHeightTextarea.style.textAlign = info.align;
        changeHeightTextarea.style.letterSpacing = info.wspace / 1000 + 'em';
        changeHeightTextarea.value = this.textValue;
        changeHeightTextarea.style['line-height'] = 1 + info.vspace / 1000;
        changeHeightTextarea.style['font-family'] = info.ff;

        if(this.groupFlag) {
          eleEvent.setHeight(changeHeightTextarea.scrollHeight / this.pageScale / sizeScale);
          editorBus.setElementData();
          return ;
        }

        if(Math.abs(this.height - changeHeightTextarea.scrollHeight / sizeScale) > this.textInfo.size * this.pageScale / 2) {
        // if(this.height != changeHeightTextarea.scrollHeight / sizeScale) {
          this.height = changeHeightTextarea.scrollHeight * 1.01 / sizeScale;
          eleEvent.setHeight(this.height / this.pageScale);
          // eleEvent.setTransform(`translate(${this.left / this.pageScale},${this.top / this.pageScale})rotate(${this.rotate},${this.width/this.pageScale/2},${this.height/this.pageScale/2})`);
        }
      },
      editorDblClick(event) {
        this.$nextTick(()=> {
          if(this.eleType === 'text' || this.type === 'text') {
            this.setTextEdit(true);
            this.$nextTick(() => {
              this.$refs.textarea.select();
            })
          }
          else if(this.eleType === 'img' || this.type === 'img') {
            if(this.imgIsCut){
              this.setClipFlag(true);
              this.setToolsBarShow(false);
            }
          }
          else if(this.eleType === 'svgFrame' || this.type === 'svgFrame') {
            let k = eleEvent.elementDbclick(this.focusPageIndex, this.focusElemIndex, this.elementEvent.target);
            if(k === -1) {
              svgFrameBus.setFrameCutInfo();
            }
          }
          if(this.groupFlag) {
            editorBus.getEditorDblClickTarget({
              left: event.pageX - this.pageRect.left - this.pagePosition.left,
              top: event.pageY - this.pageRect.top - this.pagePosition.top
            })
            if(this.eleType === 'text') {
              editorBus.setElementData();
              this.setTextEdit(true);
              this.$nextTick(() => {
                this.$refs.textarea.select();
              })
            }
          }
        });
      },
      dispatchSetSvgFrame() {
        let clipInfo = this.clipInfo,
            frameInfo = this.frameClipInfo,
            reverseType = frameInfo.reverseType;

        let x = (frameInfo.zhiyuanx - clipInfo.x) / frameInfo.scale / this.pageScale,
            y = (frameInfo.zhiyuany - clipInfo.y) / frameInfo.scale / this.pageScale;

        if(reverseType[0]) {
          x = (frameInfo.zhiyuanx - (this.width - clipInfo.x - clipInfo.width)) / frameInfo.scale / this.pageScale;
        }

        if(reverseType[1]) {
          y = (frameInfo.zhiyuany - (this.height - clipInfo.y - clipInfo.height)) / frameInfo.scale / this.pageScale;
        }

        svgFrameBus.setSvgFrameImgInfo({
          x,
          y,
          width: this.width / frameInfo.scale / this.pageScale,
          height: this.height / frameInfo.scale / this.pageScale
        }, frameInfo.childIndex);
      },
      hoverToChangeCursor(ref, event) {
        if(this.rotate % 360 === 0) {
          switch (ref) {
            case 'start0': event.target.style.cursor = 'w-resize'; break;
            case 'end0': event.target.style.cursor = 'e-resize'; break;
            case 'start1': event.target.style.cursor = 'n-resize'; break;
            case 'end1': event.target.style.cursor = 's-resize'; break;
            case 'start2': event.target.style.cursor = 'nw-resize'; break;
            case 'end2': event.target.style.cursor = 'se-resize'; break;
            case 'start3': event.target.style.cursor = 'ne-resize'; break;
            case 'end3': event.target.style.cursor = 'sw-resize'; break;
          }
          return;
        }
        let mid = this.$refs.mid.getBoundingClientRect(),
            pRect = this.$refs[ref].getBoundingClientRect(),
            x = pRect.left - mid.left,
            y = pRect.top - mid.top,
            e = event || window.event,
            angle;

        if(y === 0) {
          if(x < 0) {
            angle = 180;
          }
          else {
            angle = 0;
          }
        }
        else {
          angle = Math.atan( x / y) * 180 / Math.PI;
          //算出现在素材中心相对于组合旋转中心的角度
          if(y > 0) {
            angle = 90 - angle;
          } else {
            angle = 270 - angle;
          }
        }

        // let n = Math.floor(angle / 22.5) + 1;

        if((angle >= 0 && angle < 5) || (angle <=360 && angle > 355)) {
          e.target.style.cursor = 'e-resize';
        }
        else if(angle > 175 && angle < 185) {
          e.target.style.cursor = 'w-resize';
        }
        else if(angle > 85 && angle < 95) {
          e.target.style.cursor = 's-resize';
        }
        else if(angle > 265 && angle < 275) {
          e.target.style.cursor = 'n-resize';
        }
        else if(angle >= 5 && angle <= 85) {
          e.target.style.cursor = 'se-resize';
        }
        else if(angle >= 185 && angle <= 265) {
          e.target.style.cursor = 'nw-resize';
        }
        else if(angle >= 95 && angle <= 175) {
          e.target.style.cursor = 'sw-resize';
        }
        else {
          e.target.style.cursor = 'ne-resize';
        }
      },
      elementLoading() {
        let flag = false;
        let pageIndex = this.focusPageIndex;
        if(this.groupFlag) {
          this.selectElems.forEach(item => {
            let type = eleEvent.getEleType(pageIndex, item);
            if(type === 'svgImage' || type === 'text' || type==='svgFrame') {
              if(eleEvent.getEleIsLoading(pageIndex, item)) {
                flag = true;
              }
            }
          })
        } else {
          if(this.eleType === 'svg' || this.eleType === 'text' || this.eleType==='svgFrame') {
            if(eleEvent.getEleIsLoading(pageIndex, this.focusElemIndex)) {
              flag = true;
            }
          }
        }
        return flag;
      }
    },
    filters: {
      filterInt(v) {
        return v | 0;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import './editor.less';
</style>
