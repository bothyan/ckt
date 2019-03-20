<template>
  <div id="moveGuide" class="move-guide">
    <div class="page-standard-guide page-top" v-if="pageTopShow && guideLineShow"></div>
    <div class="page-standard-guide page-bottom" v-if="pageBottomShow && guideLineShow"></div>
    <div class="page-standard-guide page-standard-mid" v-if="pageStandardMidShow && guideLineShow"></div>
    <div class="page-vertical-guide page-left" v-if="pageLeftShow && guideLineShow"></div>
    <div class="page-vertical-guide page-right" v-if="pageRightShow && guideLineShow"></div>
    <div class="page-vertical-guide page-vertical-mid" v-if="pageVerticalMidShow && guideLineShow"></div>
    <div class="ele-standard-guide ele-top" v-if="eleTopShow && guideLineShow" :style="eleTopStyle"></div>
    <div class="ele-standard-guide ele-bottom" v-if="eleBottomShow && guideLineShow" :style="eleBottomStyle"></div>
    <div class="ele-standard-guide ele-standard-mid" v-if="eleStandardMidShow && guideLineShow" :style="eleStandardMidStyle"></div>
    <div class="ele-vertical-guide ele-left" v-if="eleLeftShow && guideLineShow" :style="eleLeftStyle"></div>
    <div class="ele-vertical-guide ele-right" v-if="eleRightShow && guideLineShow" :style="eleRightStyle"></div>
    <div class="ele-vertical-guide ele-vertical-mid" v-if="eleVerticalMidShow && guideLineShow" :style="eleVerticalMidStyle"></div>
  </div>
</template>

<script>

  import eleEvent from 'dataBus/element';
  import groupEvent from 'dataBus/group.js';
  import editorEvent from 'dataBus/editor'
  import dataHandle from 'common/dataHandle';
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {
        pageTopShow: false,
        pageBottomShow: false,
        pageStandardMidShow: false,
        pageLeftShow: false,
        pageRightShow: false,
        pageVerticalMidShow: false,

        eleTopShow: false,
        eleBottomShow: false,
        eleStandardMidShow: false,
        eleLeftShow: false,
        eleRightShow: false,
        eleVerticalMidShow: false,

        eleTopStyle: {},
        eleBottomStyle: {},
        eleStandardMidStyle: {},
        eleLeftStyle: {},
        eleRightStyle: {},
        eleVerticalMidStyle: {}

      }
    },
    props: {

    },
    computed: {
      ...mapGetters({
        pageWidth: 'getPageWidth',
        pageHeight: 'getPageHeight',
        focusElemIndex: 'getFocusElemIndex',
        circleSelectElements: 'getCircleSelectElements',
        pageScale: 'getPageScale',
        eleDragging: 'getEleDragging',
        guideLineShow: 'getGuideLineShow',
        notFocusEleRectList: 'getNotFocusEleRectList',
        guideLineFocusEle: 'getGuideLineFocusEle'
      })
    },
    mounted() {
      
    },
    methods: {
      ...mapActions({
        setCircleSelectElementsNow: 'setCircleSelectElementsNow'
      }),

      guideShow() {

        this.pageTopShow = false;
        this.pageBottomShow = false;
        this.pageStandardMidShow = false;
        this.pageLeftShow = false;
        this.pageRightShow = false;
        this.pageVerticalMidShow = false;

        this.eleTopShow = false;
        this.eleBottomShow = false;
        this.eleStandardMidShow = false;
        this.eleLeftShow = false;
        this.eleRightShow = false;
        this.eleVerticalMidShow = false;

        let eleRect,
            focusEleRect = this.focusElemIndex >= 0 ? eleEvent.getFocusElemRect() : eleEvent.getFocusElemRect(undefined, this.guideLineFocusEle),
            eleRectList = this.notFocusEleRectList,
            dis = 3;

        this.setCircleSelectElementsNow([]);
        let antEleList = [];

        let eleIndex = this.focusElemIndex >= 0 ? this.focusElemIndex : this.guideLineFocusEle,
            eleJson = dataHandle.getEleJson(undefined, eleIndex);
        if(eleJson && eleJson.group) {
          focusEleRect = groupEvent.getGroupRectById(eleJson.group);
          this.setCircleSelectElementsNow([eleIndex]);
        }
        
        for (let i = 0; i < eleRectList.length; i++) {

          eleRect = eleRectList[i];
          eleRect.xMid = eleRect.left + eleRect.width / 2;
          eleRect.yMid = eleRect.top + eleRect.height / 2;
          focusEleRect.xMid = focusEleRect.left + focusEleRect.width / 2;
          focusEleRect.yMid = focusEleRect.top + focusEleRect.height / 2;

          // 判断元素左侧线是否显示
          if( Math.abs(focusEleRect.left - eleRect.left) < dis ||
              Math.abs(focusEleRect.left - eleRect.xMid) < dis ||
              Math.abs(focusEleRect.left - eleRect.right) < dis){
            this.setEleLeftShow(focusEleRect, eleRect);
            antEleList.push(eleRect.eleIndex);
          }
          // 判断元素垂直中侧线是否显示
          if( Math.abs(focusEleRect.xMid - eleRect.left) < dis ||
              Math.abs(focusEleRect.xMid - eleRect.xMid) < dis ||
              Math.abs(focusEleRect.xMid - eleRect.right) < dis){
            this.setEleVerticalMidShow(focusEleRect, eleRect);
            antEleList.push(eleRect.eleIndex);
          }
          // 判断元素右侧线是否显示
          if( Math.abs(focusEleRect.right - eleRect.left) < dis ||
              Math.abs(focusEleRect.right - eleRect.xMid) < dis ||
              Math.abs(focusEleRect.right - eleRect.right) < dis){
            this.setEleRightShow(focusEleRect, eleRect);
            antEleList.push(eleRect.eleIndex);
          }

          // 判断元素上侧线是否显示
          if( Math.abs(focusEleRect.top - eleRect.top) < dis ||
              Math.abs(focusEleRect.top - eleRect.yMid) < dis ||
              Math.abs(focusEleRect.top - eleRect.bottom) < dis){
            this.setEleTopShow(focusEleRect, eleRect);
            antEleList.push(eleRect.eleIndex);
          }
          // 判断元素水平中侧线是否显示
          if( Math.abs(focusEleRect.yMid - eleRect.top) < dis ||
              Math.abs(focusEleRect.yMid - eleRect.yMid) < dis ||
              Math.abs(focusEleRect.yMid - eleRect.bottom) < dis){
            this.setStandardMidShow(focusEleRect, eleRect);
            antEleList.push(eleRect.eleIndex);
          }
          // 判断元素底侧线是否显示
          if( Math.abs(focusEleRect.bottom - eleRect.top) < dis ||
              Math.abs(focusEleRect.bottom - eleRect.yMid) < dis ||
              Math.abs(focusEleRect.bottom - eleRect.bottom) < dis){
            this.setEleBottomShow(focusEleRect, eleRect);
            antEleList.push(eleRect.eleIndex);
          }

        }
        this.setCircleSelectElementsNow(antEleList);
        
      },

      // setFocusElePossiton(eleRect, leftDis, topDis) {
      //   if(this.focusElemIndex > 0) {
      //     eleEvent.setElementTranslate([eleRect.left + leftDis, eleRect.top + topDis], undefined, undefined);
      //   } else {
      //     eleEvent.setSelectElementInfo({leftDis: leftDis, topDis: topDis});
      //   }
      // },

      // 显示素材左侧对齐线
      setEleLeftShow(aRect, bRect) {
        if(bRect.background) {
          this.pageXGuildShow(aRect, bRect);
          return;
        }
        this.eleLeftStyle = {
          top: parseInt(Math.min(aRect.yMid, bRect.yMid) * this.pageScale) + 'px',
          left: parseInt(aRect.left * this.pageScale) + 'px',
          height: parseInt(Math.abs(aRect.yMid - bRect.yMid) * this.pageScale) + 'px'
        };
        this.eleLeftShow = true;
      },

      // 显示素材垂直中侧对齐线
      setEleVerticalMidShow(aRect, bRect) {
        if(bRect.background) {
          this.pageXGuildShow(aRect, bRect);
          return;
        }
        this.eleVerticalMidStyle = {
          top: parseInt(Math.min(aRect.yMid, bRect.yMid) * this.pageScale) + 'px',
          left: parseInt(aRect.xMid * this.pageScale) + 'px',
          height: parseInt(Math.abs(aRect.yMid - bRect.yMid) * this.pageScale) + 'px'
        };
        this.eleVerticalMidShow = true;
      },

      // 显示素材右侧对齐线
      setEleRightShow(aRect, bRect) {
        if(bRect.background) {
          this.pageXGuildShow(aRect, bRect);
          return;
        }
        this.eleRightStyle = {
          top: parseInt(Math.min(aRect.yMid, bRect.yMid) * this.pageScale) + 'px',
          left: parseInt(aRect.right * this.pageScale) + 'px',
          height: parseInt(Math.abs(aRect.yMid - bRect.yMid) * this.pageScale) + 'px'
        };
        this.eleRightShow = true;
      },

      // 显示素材上侧对齐线
      setEleTopShow(aRect, bRect) {
        if(bRect.background) {
          this.pageYGuildShow(aRect, bRect);
          return;
        }
        this.eleTopStyle = {
          top: parseInt(aRect.top * this.pageScale) + 'px',
          left: parseInt(Math.min(aRect.xMid, bRect.xMid) * this.pageScale) + 'px',
          width: parseInt(Math.abs(aRect.xMid - bRect.xMid) * this.pageScale) + 'px'
        };
        this.eleTopShow = true;
      },

      // 显示素材水平中测侧对齐线
      setStandardMidShow(aRect, bRect) {
        if(bRect.background) {
          this.pageYGuildShow(aRect, bRect);
          return;
        }
        this.eleStandardMidStyle = {
          top: parseInt(aRect.yMid * this.pageScale) + 'px',
          left: parseInt(Math.min(aRect.xMid, bRect.xMid) * this.pageScale) + 'px',
          width: parseInt(Math.abs(aRect.xMid - bRect.xMid) * this.pageScale) + 'px'
        };
        this.eleStandardMidShow = true;
      },

      // 显示素材下侧对齐线
      setEleBottomShow(aRect, bRect) {
        if(bRect.background) {
          this.pageYGuildShow(aRect, bRect);
          return;
        }
        this.eleBottomStyle = {
          top: parseInt(aRect.bottom * this.pageScale) + 'px',
          left: parseInt(Math.min(aRect.xMid, bRect.xMid) * this.pageScale) + 'px',
          width: parseInt(Math.abs(aRect.xMid - bRect.xMid) * this.pageScale) + 'px'
        };
        this.eleBottomShow = true;
      },

      // 判断显示竖的画布引导线
      pageXGuildShow(focusEleRect, eleRect) {
        if( Math.round(focusEleRect.left) === Math.round(eleRect.left) ||
            Math.round(focusEleRect.xMid) === Math.round(eleRect.left) ||
            Math.round(focusEleRect.right) === Math.round(eleRect.left)) {
          this.pageLeftShow = true;
        } 
        else if(Math.round(focusEleRect.left) === Math.round(eleRect.right) ||
                Math.round(focusEleRect.xMid) === Math.round(eleRect.right) ||
                Math.round(focusEleRect.right) === Math.round(eleRect.right)) {
          this.pageRightShow = true;
        }
        else if(Math.round(focusEleRect.left) === Math.round(eleRect.xMid) ||
                Math.round(focusEleRect.xMid) === Math.round(eleRect.xMid) ||
                Math.round(focusEleRect.right) === Math.round(eleRect.xMid)) {
          this.pageVerticalMidShow = true;
        }

      },

      // 判断显示横的画布引导线
      pageYGuildShow(focusEleRect, eleRect) {
        if( Math.round(focusEleRect.top) === Math.round(eleRect.top) ||
            Math.round(focusEleRect.yMid) === Math.round(eleRect.top) ||
            Math.round(focusEleRect.bottom) === Math.round(eleRect.top)) {
          this.pageTopShow = true;
        } 
        else if(Math.round(focusEleRect.top) === Math.round(eleRect.yMid) ||
                Math.round(focusEleRect.yMid) === Math.round(eleRect.yMid) ||
                Math.round(focusEleRect.bottom) === Math.round(eleRect.yMid)) {
          this.pageStandardMidShow = true;
        }
        else if(Math.round(focusEleRect.top) === Math.round(eleRect.bottom) ||
                Math.round(focusEleRect.yMid) === Math.round(eleRect.bottom) ||
                Math.round(focusEleRect.bottom) === Math.round(eleRect.bottom)) {
          this.pageBottomShow = true;
        }

      }

    },

    watch: {
      eleDragging() {
        this.guideShow();
      }
    }
  } 
</script>

<style lang="less" rel="stylesheet/less" scoped>
.move-guide {
  .page-standard-guide {
    width: 100%;
    height: 1px;
    background: url(./img/pageStandardGuide.png);
    position: absolute;
    left: 0px;
    &[class~="page-top"] {
      top: 0px;
    }
    &[class~="page-bottom"] {
      bottom: 1px;
    }
    &[class~="page-standard-mid"] {
      top: 50%;
    }
  }
  .page-vertical-guide {
    width: 1px;
    height: 100%;
    background: url(./img/pageVerticalGuide.png);
    position: absolute;
    top: 0px;
    &[class~="page-left"] {
      left: 0px;
    }
    &[class~="page-right"] {
      right: 0px;
    }
    &[class~="page-vertical-mid"] {
      left: 50%;
    }
  }
  .ele-standard-guide {
    height: 1px;
    background: url(./img/eleStandardGuide.png);
    position: absolute;
  }
  .ele-vertical-guide {
    width: 1px;
    background: url(./img/eleVerticalGuide.png);
    position: absolute;
  }
}
</style>
