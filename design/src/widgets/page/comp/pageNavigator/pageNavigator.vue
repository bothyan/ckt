<template>
  <div v-show="thumbShow" id="pageNavigator" class="page-navigator-wrap">
    <div class="page-thumb-content" :style="pageThumbContent">
      <div class="page-thumb">
        <img v-show="pageNavigatorThumb && pageNavigatorThumb.length > 0" :src="url" draggable="false">
      </div>
      <div class="page-view" @mousedown.left.stop="startMove" :style="pageView"></div>
    </div>
    <div @mousedown.left.stop="setPageThumbOpen" class="scale-switch" :class="{'thumb-open': thumbOpen}"></div>
  </div>
</template>

<script>

  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {
        thumbShow: true,
        thumbOpen: false,
        startX: null,
        startY: null,
        pageViewPosition: 0
      }
    },
    props: {

    },
    computed: {
      ...mapGetters({
        pageWidth: 'getPageWidth',
        pageHeight: 'getPageHeight',
        pageShowWidth: 'getPageShowWidth',
        pageShowHeight: 'getPageShowHeight',
        pageWrapRect: 'getPageWrapRect',
        pageRect: 'getPageRect',
        pagePosition: 'getPagePosition',
        pageScale: 'getPageScale',
        defaultPageScale: 'getDefaultPageScale',
        leftPanelClose: 'getLeftPanelClose',
        pageNavigatorThumb: 'getPageNavigatorThumb',
        pageNavigatorTime: 'getPageNavigatorTime',
        focusPageIndex: 'getFocusPageIndex',
        spaceKeyDown: 'getSpaceKeyDown'
      }),

      url() {
        if(this.pageNavigatorThumb && this.pageNavigatorThumb.length > 0) {
          return this.pageNavigatorThumb + '?v=' + this.pageNavigatorTime;
        } else {
          return undefined;
        }
      },

      pageThumbContent() {
        if(this.thumbOpen) {
          return {
            width: this.pageThumbWidth + 60 + 'px',
            height: this.pageThumbHeight + 60 + 'px',
            padding: '30px'
          }
        } else {
          return {
            width: '0px',
            height: '0px',
            padding: '0px'
          }
        }
      },

      // 缩略图显示框的样式
      pageView() {
        let pageViewWidth = this.pageWrapRect.width / this.pageShowWidth * this.pageThumbWidth,
            pageViewHeight = this.pageWrapRect.height / this.pageShowHeight * this.pageThumbHeight,
            top = (-this.pagePosition.top) * (this.pageThumbHeight / this.pageShowHeight) + 30,
            left = (-this.pagePosition.left) * (this.pageThumbWidth / this.pageShowWidth) + 30;
        top = top < 0 ? 0 : top;
        left = left < 0 ? 0 : left;
        if(top + pageViewHeight > this.pageThumbHeight + 60) {
          pageViewHeight = this.pageThumbHeight + 60 - top;
        }
        if(left + pageViewWidth > this.pageThumbWidth + 60) {
          pageViewWidth = this.pageThumbWidth + 60 - left;
        }
        this.pageViewPosition = {
          top,
          left,
          width: pageViewWidth,
          height: pageViewHeight
        };
        return {
          width: pageViewWidth + 'px',
          height: pageViewHeight + 'px',
          top: top + 'px',
          left: left + 'px'
        }
      },

      pageThumbWidth() {

        let design_w = this.pageWidth,
            design_h = this.pageHeight,
            design_r = design_w / design_h;

        while(design_w * design_h > 10000) {
          design_w = design_w - 10;
          design_h = 1 / design_r * design_w;
        }

        return design_w;

      },

      pageThumbHeight() {

        let design_w = this.pageWidth,
            design_h = this.pageHeight,
            design_r = design_w / design_h;

        while(design_w * design_h > 10000) {
          design_w = design_w - 10;
          design_h = 1 / design_r * design_w;
        }

        return design_h;

      }
      
    },
    mounted() {
      this.setPageCenter({
        top: this.pageHeight / 2,
        left: this.pageWidth / 2
      });
    },
    methods: {
      ...mapActions({
        setPageScale: 'setPageScale',
        setPagePosition: 'setPagePosition',
        setPageCenter: 'setPageCenter'
      }),

      setPageThumbOpen() {
        this.thumbOpen = !this.thumbOpen;
      },

      startMove(eve) {
        let _this = this;
        this.startX = eve.clientX;
        this.startY = eve.clientY;

        window.addEventListener('mousemove', moveView);
        window.addEventListener('mouseup', moveUp);

        function moveView(eve) {
          if(eve.button == 0) {
            let nowX = eve.clientX,
                nowY = eve.clientY,
                moveX = (nowX - _this.startX) * ((_this.pageShowWidth / _this.pageThumbWidth)),
                moveY = (nowY - _this.startY) * ((_this.pageShowHeight / _this.pageThumbHeight)),
                pagePosition = _this.pagePosition;

            let left,right,top,bottom;
            if(nowX - _this.startX < 0) {
              left = true;
            } else if(nowX - _this.startX > 0) {
              right = true;
            }
            if(nowY - _this.startY < 0) {
              top = true;
            } else if(nowY - _this.startY > 0) {
              bottom = true;
            }

            let rightBlank = _this.pageViewPosition.left + _this.pageViewPosition.width  - _this.pageThumbWidth - 60,
                bottomBlank = _this.pageViewPosition.top + _this.pageViewPosition.height - _this.pageThumbHeight - 60;

            if(_this.pageViewPosition.top <= 0 && moveY < 0 || bottomBlank >= 0 && moveY > 0) {
              moveY = 0;
            } else {
              _this.startY = nowY;
            }
            if(_this.pageViewPosition.left <= 0 && moveX < 0 || rightBlank >= 0 && moveX > 0) {
              moveX = 0;
            } else {
              _this.startX = nowX;
            }
            let newTop = pagePosition.top - moveY,
                newLeft = pagePosition.left - moveX;
            if(_this.pageShowHeight + 400 > _this.pageWrapRect.height && moveY != 0) {
              if(top) {
                newTop = newTop >= 200 ? 200 : newTop;
              }
              if(bottom) {
                newTop = _this.pageWrapRect.height - (newTop + _this.pageShowHeight) >= 200 ? _this.pageWrapRect.height - 200 - _this.pageShowHeight : newTop;
              }
            }
            if(_this.pageShowWidth + 400 >_this.pageWrapRect.width && moveX != 0) {
              if(left) {
                newLeft = newLeft >= 200 ? 200 : newLeft;
              }
              if(right) {
                newLeft = _this.pageWrapRect.width - (newLeft + _this.pageShowWidth) >= 200 ? _this.pageWrapRect.width - 200 - _this.pageShowWidth : newLeft;
              }
            }
            // newTop = newTop > 200 ? 200 : newTop;
            // newTop = _this.pageWrapRect.height - (newTop + _this.pageShowHeight) > 200 ? _this.pageWrapRect.height - 200 - _this.pageShowHeight : newTop;
            // newLeft = newLeft > 200 ? 200 : newLeft;
            // newLeft = _this.pageWrapRect.width - (newLeft + _this.pageShowWidth) > 200 ? _this.pageWrapRect.width - 200 - _this.pageShowWidth : newLeft;
            _this.setPagePosition({
              top: newTop,
              left: newLeft
            });
            _this.updatePageCenter();
          }
        }

        function moveUp() {
          window.removeEventListener('mousemove', moveView);
          window.removeEventListener('mouseup', moveUp);
        }

      },

      updatePageCenter() {
        let x = 0,
            y = 0,
            left = 0,
            right = 0,
            top = 0,
            bottom = 0;
        if(this.pageRect.left < this.pageWrapRect.left) {
          left = this.pageWrapRect.left - this.pageRect.left;
        }
        if(this.pageRect.right > this.pageWrapRect.right) {
          right = this.pageRect.right - this.pageWrapRect.right;
        }
        if(this.pageRect.top < this.pageWrapRect.top) {
          top = this.pageWrapRect.top - this.pageRect.top;
        }
        if(this.pageRect.bottom > this.pageWrapRect.bottom) {
          bottom = this.pageRect.bottom - this.pageWrapRect.bottom;
        }
        x = (left + (this.pageShowWidth - left - right) / 2) / this.pageScale;
        y = (top + (this.pageShowHeight - top - bottom) / 2) / this.pageScale;
        this.setPageCenter({
          top: y,
          left: x
        });
      }
      
    },

    watch: {

      pageScale(val) {
        this.thumbShow = val > this.defaultPageScale;
        if(val > this.defaultPageScale) {
          setTimeout(() => {
            this.thumbOpen = true;
          }, 100);
        } else {
          this.thumbOpen = false;
        }
        this.updatePageCenter();
      },

      spaceKeyDown() {
        this.updatePageCenter();
      }

    }
  } 
</script>

<style lang="less" rel="stylesheet/less" scoped>
.page-navigator-wrap {
  width: 0;
  height: 0;
  position: absolute;
  right: 46px;
  bottom: 18px;
  z-index: 1;
  .page-thumb-content {
    width: 0;
    height: 0;
    background-color: #F8F8F8;
    padding: 0;
    overflow: hidden;
    border-radius: 3px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
    position: absolute;
    bottom: 0;
    right: -28px;
    transition: width .4s, height .4s, padding .4s;
    .page-thumb {
      width: 100%;
      height: 100%;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .page-view {
      width: 50px;
      height: 50px;
      border: 2px solid #07AEFC;
      // border-image: #6D7DF9 1;
      // border-image: linear-gradient(to bottom right, #5EA2FF, #00CAFF) 1;
      position: absolute;
      top: 30px;
      left: 30px;
      cursor: move;
    }
  }
  .scale-switch {
    width: 28px;
    height: 28px;
    position: absolute;
    bottom: 0;
    left: 0;
    cursor: pointer;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
    transform: rotate(-90deg);
    background: url(./img/page_thumb_open.svg) no-repeat 2px 2px #F8F8F8;
    &[class~="thumb-open"] {
      background: url(./img/page_thumb_close.svg) no-repeat 2px 2px #F8F8F8;
    }
  }
}
</style>
