<template>
  <div id="pageScaleSet" class="page-scale-set-wrap">
    <div class="page-scale-set" :style="scaleStyle">
        <div @mousedown.left.stop="setPageScaleOne" class="design-scale-btn  design-scale-one" title="实际大小">1:1</div>
        <div @mousedown.left.stop="setPageScaleDefault" class="design-scale-btn  design-scale-screen" title="合适大小"></div>
        <div @mousedown.left.stop="setPageScaleSub" class="design-scale-sub design-scale-btn" title="缩小画布"></div>
        <div class="design-scale-num" title="当前缩放比">
            <div>{{scale}}</div>
        </div>
        <div @mousedown.left.stop="setPageScaleAdd" class="design-scale-add design-scale-btn" title="放大画布"></div>
        <div  @mousedown.left.stop="setBleed()"
              v-if="bleedBtnShow"
              class="design-bleed-switch design-scale-btn"
              :style="{
                opacity: bleedSaving || !isLogin || designInfo.thirdKindId == 1 ? '.2' : '1'
              }"
        >
          <div :class="{'turn-on': bleed}" class="bleed-switch-icon" title="设置出血"></div>
        </div>
        <div  @mousedown.left.stop="setPagePreview(!pagePreview)"
              v-if="preViewBtnShow"
              class="design-preview-switch design-scale-btn"
              title="预览"
        >
              <div :class="{'turn-on': pagePreview}" class="preview-switch-icon"></div>
        </div>
    </div>
</div>
</template>

<script>

  import pageBus from 'dataBus/page'
  import designHandle from 'dataBus/design'
  import dataHandle from 'common/dataHandle'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {
        bleedSaving: false
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
        pageScale: 'getPageScale',
        defaultPageScale: 'getDefaultPageScale',
        pagePosition: 'getPagePosition',
        defaultPagePosition: 'getDefaultPagePosition',
        pagePreview: 'getPagePreview',
        bleed: 'getIsBleed',
        designInfo: 'getDesignInfo',
        isLogin: 'getIsLogin'
      }),
      scale() {
        let scale = parseInt(this.pageScale * 100);
        return isNaN(scale) ? '' : scale + '%';
      },
      minScale() {
        let minScale = this.defaultPageScale / 4;
        return minScale > 1 ? 1 : minScale;
      },
      maxScale() {
        let maxScale = this.defaultPageScale * 4;
        return maxScale < 1 ? 1 : maxScale;
      },
      scaleAva() {
        return (this.maxScale - this.minScale) / 50;
      },
      designKindId() {
        return this.designInfo.designKindId;
      },
      // 是否显示出血按钮
      bleedBtnShow() {
        return this.designInfo.bleedValue > 0 ? true : false;
      },
      // 是否显示预览按钮
      preViewBtnShow() {
        if(this.designKindId == 4 || this.designKindId == 6 || this.designKindId == 20) {
          return true;
        } else {
          return false;
        }
      },
      scaleStyle() {
        if(this.bleedBtnShow) {
          if(this.preViewBtnShow) {
            return {
              width: '350px',
              left: '-175px'
            }
          } else {
            return {
              width: '300px',
              left: '-150px'
            }
          }
        } else {
          if(this.preViewBtnShow) {
            return {
              width: '300px',
              left: '-150px'
            }
          } else {
            return {
              width: '250px',
              left: '-125px'
            }
          }
        }
      }
    },
    mounted() {
      let callBack = () => {
        this.bleedSaving = false;
        this.setAllPageSaving(false);
      };
      dataHandle.setBleedCallBack(callBack);
    },
    methods: {
      ...mapActions({
        setPageScale: 'setPageScale',
        setPagePosition: 'setPagePosition',
        setIsBleed: 'setIsBleed',
        setPagePreview: 'setPagePreview',
        setAllPageSaving: 'setAllPageSaving'
      }),

      setBleed() {
        if(this.bleedSaving || !this.isLogin || this.designInfo.thirdKindId == 1) return;
        if(this.bleed) {
          this.bleedSaving = true;
          this.setIsBleed(false);
          // pageBus.pageBleedOff();
          dataHandle.commit(
            'design',
            {
              key: 'bleed',
              value: 0,
              eventType: 0
            }).push();
          dataHandle.update();
          pageBus.pageBleedOffSetPageWH();
        } else {
          this.bleedSaving = true;
          this.setIsBleed(true);
          // pageBus.pageBleedOn();
          dataHandle.commit(
            'design',
            {
              key: 'bleed',
              value: 1,
              eventType: 0
            }).push();
          dataHandle.update();
          pageBus.pageBleedOnSetPageWH();
        }
      },

      setPageScaleOne() {
        this.setPageScale(1);
        let newTop = (this.pageWrapRect.height - this.pageShowHeight) / 2,
            newLeft = (this.pageWrapRect.width - this.pageShowWidth) / 2;
        this.setPagePosition({
          top: newTop,
          left: newLeft
        });
      },

      // 设置默认缩放比例
      setPageScaleDefault() {
        this.setPageScale(this.defaultPageScale);
        this.setPagePosition(this.defaultPagePosition);
      },

      // 减小缩放比例
      setPageScaleSub() {
        let scale = this.pageScale,
            scaleAva = this.scaleAva,
            newScale = scale - scaleAva;
        if(newScale < this.minScale) newScale = this.minScale;
        this.setPageScale(newScale);
        let newTop = (this.pageWrapRect.height - this.pageShowHeight) / 2,
            newLeft = (this.pageWrapRect.width - this.pageShowWidth) / 2;
        this.setPagePosition({
          top: newTop,
          left: newLeft
        });
      },

      // 增大缩放比例
      setPageScaleAdd() {
        let scale = this.pageScale,
            scaleAva = this.scaleAva,
            newScale = scale + scaleAva;
        if(newScale > this.maxScale) newScale = this.maxScale;
        this.setPageScale(newScale);
        let newTop = (this.pageWrapRect.height - this.pageShowHeight) / 2,
            newLeft = (this.pageWrapRect.width - this.pageShowWidth) / 2;
        this.setPagePosition({
          top: newTop,
          left: newLeft
        });
      }

    }
  } 
</script>

<style lang="less" rel="stylesheet/less" scoped>
.page-scale-set-wrap {
  width: 0;
  height: 0;
  position: absolute;
  left: 50%;
  bottom: 16px;
  .page-scale-set {
    width: 350px;
    height: 34px;
    background: #FFF;
    overflow: hidden;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.2);
    position: absolute;
    left: -175px;
    bottom: 0;
    .design-scale-btn {
      height: 100%;
      float: left;
      cursor: pointer;
      &:hover {
        background-color: #ECECEC;
      }
    }
    .design-scale-sub {
      width: 43px;
      background: url(./img/page_scale_sub.png) no-repeat 15px 16px;
    }
    .design-scale-add {
      width: 43px;
      background: url(./img/page_scale_add.png) no-repeat 15px 11px;
    }
    .design-scale-num {
      width: 64px;
      height: 100%;
      position: relative;
      color: #353535;
      float: left;
      div {
        width: 70px;
        font-size: 14px;
        color: #8f8f8f;
        text-align: center;
        line-height: 34px;
      }
    }
    .design-scale-one {
      width: 50px;
      color: #8f8f8f;
      font-size: 14px;
      line-height: 34px;
      text-align: center;
      border-right: 1px solid #ECECEC;
    }
    .design-scale-screen {
      width: 50px;
      border-right: 1px solid #ECECEC;
      background: url(./img/page_scale_adapt.png) no-repeat 19px 10px;
    }
    .design-bleed-switch {
      width: 50px;
      border-left: 1px solid #ECECEC;
      .bleed-switch-icon {
        width: 16px;
        height: 16px;
        margin: 9px auto 0 auto;
        background: url(./img/bleed_icon.svg) no-repeat 0px 0px;
        &[class~="turn-on"] {
          background-position-y: -16px;
        }
      }
    }
    .design-preview-switch {
      width: 50px;
      border-left: 1px solid #ECECEC;
      .preview-switch-icon {
        width: 16px;
        height: 16px;
        margin: 9px auto 0 auto;
        background: url(./img/preview_icon.svg) no-repeat 0px 0px;
        &[class~="turn-on"] {
          background-position-y: -16px;
        }
      }
    }
    // .design-scale-screen.now-click{
    //   background-image: url(./img/designIcon.svg);
    //   background-position: -215px -19px;
    // }

  }
}

</style>
