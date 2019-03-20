<template>
  <div  @mousedown.left="nodeMousedown"
        @mousewheel.stop="changePageScale"
        :style="{right: pageListClose ? '54px' : '160px'}"
        :class="{onload: onload}"
        id="pageWrap"
        ref="pageWrap"
  >
    <transition name="toolsBar-animaiton">
      <tools-bar v-show="toolsBarShow"></tools-bar>
    </transition>
    <page-comp></page-comp>
    <page-scale-set></page-scale-set>
    <page-navigator></page-navigator>
    <page-circle-select
      v-show="circleSelectShow"
      :width="circleSelectRect.width"
      :height="circleSelectRect.height"
      :top="circleSelectRect.top"
      :left="circleSelectRect.left"
    ></page-circle-select>
  </div>
</template>

<script>

  import pageComp from './page.vue';
  import pageScaleSet from './comp/pageScaleSet/pageScaleSet.vue';
  import pageNavigator from './comp/pageNavigator/pageNavigator.vue';
  import pageCircleSelect from './comp/pageCircleSelect.vue';
  import toolsBar from 'widgets/toolsbar/elementToolBar.vue'
  import eleEvent from 'dataBus/element';
  import editorBus from 'dataBus/editor';
  import pageEleBus from 'dataBus/pageEle';
  import toolsBarBus from 'dataBus/toolsBar';
  import pageBus from 'dataBus/page.js';
  import {mapGetters, mapActions} from 'vuex';
  
  export default {
    data() {
      return {
        startX: null,
        startY: null,
        // 是否显示框选
        circleSelectShow: false,
        // 框选位置
        circleSelectRect: {
          width: 0,
          height: 0,
          top: 0,
          left: 0
        },
        onload: true
      }
    },
    components: {
      pageComp,
      pageScaleSet,
      pageNavigator,
      pageCircleSelect,
      toolsBar
    },
    props: {

    },
    mounted() {
      this.onload = false;
    },
    computed: {
      ...mapGetters({
        pageWidth: 'getPageWidth',
        pageHeight: 'getPageHeight',
        pageShowWidth: 'getPageShowWidth',
        pageShowHeight: 'getPageShowHeight',
        pageWrapRect: 'getPageWrapRect',
        pageScale: 'getPageScale',
        focusPageIndex: 'getFocusPageIndex',
        focusPageJson: 'getFocusPage',
        focusElemIndex: 'getFocusElemIndex',
        pagePosition: 'getPagePosition',
        pageRect: 'getPageRect',
        defaultPageScale: 'getDefaultPageScale',
        pageListClose: 'getPageListClose',
        leftPanelClose: 'getLeftPanelClose',
        editorShow: 'getEditorShow',
        tableEditorShow: 'getTableEditorShow',
        focusPageElemSum: 'getFocusPageElemSum',
        circleSelectElements: 'getCircleSelectElements',
        clipFlag: 'getClipFlag',
        toolsBarShow: 'getToolsBarShow',
        spaceKeyDown: 'getSpaceKeyDown',
        groupFlag: 'getGroupFlag'
      })

    },
    methods: {
      ...mapActions({
        setPageScale: 'setPageScale',
        setPagePosition: 'setPagePosition',
        setPageWrapRect: 'setPageWrapRect',
        setToolsBarState: 'setToolsBarState',
        setToolsBarShow: 'setToolsBarShow',
        setToolsBarType: 'setToolsBarType',
        setEditorShow: 'setEditorShow',
        setEditorInfo: 'setEditorInfo',
        setTableEditorShow: 'setTableEditorShow',
        setCircleSelectElements: 'setCircleSelectElements',
        setGroupFlag: 'setGroupFlag',
        setPageMoveMousedown : 'setPageMoveMousedown',
        setCircleSelectElementsNow: 'setCircleSelectElementsNow'
      }),

      nodeMousedown(eve) {

        let _this = this,
            selectEleIndexList = [];
        this.startX = eve.clientX;
        this.startY = eve.clientY;
        this.circleSelectRect = {
          width: 0,
          height: 0,
          top: this.startY - this.pageWrapRect.top,
          left: this.startX - this.pageWrapRect.left
        };
        // pageBus.elementBlur();

        if(_this.spaceKeyDown) {
          _this.setPageMoveMousedown(true);
        }

        window.addEventListener('mousemove', nodeMousemove);
        window.addEventListener('mouseup', nodeMouseup);

        function nodeMousemove(eve) {
          _this.circleSelectShow = true;
          pageBus.elementBlur();

          if(_this.startX == null || _this.clipFlag) return;

          // 空格键被按下 拖动修改画布位置的状态
          if(_this.spaceKeyDown && _this.pageScale > _this.defaultPageScale) {

            _this.circleSelectShow = false;

            let newLeft,
                newTop,
                goLeft = eve.clientX - _this.startX < 0 ? true : false,
                goTop = eve.clientY - _this.startY < 0 ? true : false;

            if(_this.pageWrapRect.width - _this.pageShowWidth < 400) {
              if(_this.pagePosition.left >= 200 && !goLeft) {
                newLeft = 200;
              } else if(_this.pageWrapRect.width - (_this.pagePosition.left + _this.pageShowWidth) >= 200 && goLeft) {
                newLeft = _this.pageWrapRect.width - 200 - _this.pageShowWidth;
              } else {
                newLeft = _this.pagePosition.left + (eve.clientX - _this.startX);
              }
            } else {
              // newLeft = _this.pagePosition.left + (eve.clientX - _this.startX);
              newLeft = _this.pagePosition.left;
            }

            if(_this.pageWrapRect.height - _this.pageShowHeight < 400) {
              if(_this.pagePosition.top >= 200 && !goTop) {
                newTop = 200;
              } else if(_this.pageWrapRect.height - (_this.pagePosition.top + _this.pageShowHeight) >= 200 && goTop) {
                newTop = _this.pageWrapRect.height - 200 - _this.pageShowHeight;
              } else{
                newTop = _this.pagePosition.top + (eve.clientY - _this.startY);
              }
            } else {
              // newTop = _this.pagePosition.top + (eve.clientY - _this.startY);
              newTop = _this.pagePosition.top;
            }

            _this.setPagePosition({
              top: newTop,
              left: newLeft
            });
            _this.startY = eve.clientY;
            _this.startX = eve.clientX;
            return;
          }

          let selectTop,
              selectRight,
              selectBottom,
              selectLeft;
          _this.circleSelectRect.width = Math.abs(eve.clientX - _this.startX);
          _this.circleSelectRect.height = Math.abs(eve.clientY - _this.startY);
          if(eve.clientY > _this.startY) {
            _this.circleSelectRect.top = _this.startY - _this.pageWrapRect.top - 1;
            selectTop = _this.startY - _this.pageRect.top - 1;
          } else {
            _this.circleSelectRect.top = eve.clientY - _this.pageWrapRect.top + 1;
            selectTop = eve.clientY - _this.pageRect.top + 1;
          }
          if(eve.clientX > _this.startX) {
            _this.circleSelectRect.left = _this.startX - _this.pageWrapRect.left - 1;
            selectLeft = _this.startX - _this.pageRect.left - 1;
          } else {
            _this.circleSelectRect.left = eve.clientX - _this.pageWrapRect.left + 1;
            selectLeft = eve.clientX - _this.pageRect.left + 1;
          }
          selectBottom = selectTop + _this.circleSelectRect.height;
          selectRight = selectLeft + _this.circleSelectRect.width;
          selectElement(selectTop, selectRight, selectBottom, selectLeft);
        }

        // 计算哪些元素被选中
        function selectElement(selectTop, selectRight, selectBottom, selectLeft) {
          let eleSum = _this.focusPageElemSum,
              eleRect,
              focusEle,
              selectEleNow = [];
          selectEleIndexList = [];
          for (let i = 1; i < eleSum; i++) {
            focusEle = pageEleBus.getElementJson(undefined, i);
            if( focusEle['data-elem'].lock == true ||
                focusEle['data-elem'].lock == 'true' ||
                focusEle['data-type'] == 'background' && focusEle['data-elem']['data-colors'] ||
                focusEle.group && 
                (_this.focusPageJson.elegroups[focusEle.group] && (_this.focusPageJson.elegroups[focusEle.group].lock == true || _this.focusPageJson.elegroups[focusEle.group].lock == 'true'))
              ) {
              continue;
            }
            eleRect = eleEvent.getElemRect(undefined, i);
            eleRect = {
              top: eleRect.top * _this.pageScale,
              right: eleRect.right * _this.pageScale,
              bottom: eleRect.bottom * _this.pageScale,
              left: eleRect.left * _this.pageScale
            }
            if(!(eleRect.top > selectBottom || eleRect.right < selectLeft || eleRect.bottom < selectTop || eleRect.left > selectRight)) {
              // eleJson = pageEleBus.getElementJson(undefined, i);
              // if(eleJson.group && 
              //   (_this.focusPageJson.elegroups[eleJson.group].lock == true || _this.focusPageJson.elegroups[eleJson.group].lock == 'true')
              // ) {
              //   continue;
              // }
              selectEleIndexList.push(i);
            }
          }
          _this.setCircleSelectElementsNow(selectEleIndexList);
        }

        function nodeMouseup(eve) {
          eve.stopPropagation();
          window.removeEventListener('mousemove', nodeMousemove);
          window.removeEventListener('mouseup', nodeMouseup);

          _this.setPageMoveMousedown(false);

          _this.startX = null;
          _this.startY = null;
          _this.circleSelectShow = false;
          if(selectEleIndexList.length > 0) {
            pageEleBus.setCircleSelectElements(selectEleIndexList);
          } else {
            // 没有框选到素材
            pageBus.elementBlur();
          }

        }

      },

      // 鼠标滚轮更改画布缩放比例
      changePageScale(eve) {

        let scale,
            oldScale = this.pageScale,
            minScale = this.defaultPageScale / 4 > 1 ? 1 : this.defaultPageScale / 4,
            maxScale = this.defaultPageScale * 4 < 1 ? 1 : this.defaultPageScale * 4,
            scaleAva = (maxScale - minScale) / 60,
            scaleChange = scaleAva * (Math.abs(eve.deltaY) / 100),
            xScale = (this.pageRect.left - eve.clientX) / this.pageShowWidth,
            yScale = (this.pageRect.top - eve.clientY) / this.pageShowHeight,
            newTop,
            newLeft;
        if (eve.deltaY > 0) {
          scale = oldScale - scaleChange;
          if (scale < minScale) scale = minScale;
        } else {
          scale = oldScale + scaleChange;
          if (scale > maxScale) scale = maxScale;
        }
        this.setPageScale(scale);

        let changeScale = scale - oldScale,
            pageWidthChange = this.pageWidth * changeScale * xScale,
            pageHeightChange = this.pageHeight * changeScale * yScale;
          newTop = this.pagePosition.top + pageHeightChange;
          newLeft = this.pagePosition.left + pageWidthChange;
        if(this.pageWrapRect.width - this.pageShowWidth < 200) {
          // 检查画布左侧画布空白是否过大
          newLeft = newLeft > 200 ? 200 : newLeft;
          // 检测画布右侧画布空白是否过大
          newLeft = this.pageWrapRect.width - (newLeft + this.pageShowWidth) > 200 ? this.pageWrapRect.width - (this.pageShowWidth + 200) : newLeft;
        } else {
          newLeft = (this.pageWrapRect.width - this.pageShowWidth) / 2;
        }
          
        if(this.pageWrapRect.height - this.pageShowHeight < 200) {
          // 检查画布上侧画布空白是否过大
          newTop = newTop > 200 ? 200 : newTop;
          // 检测画布下侧画布空白是否过大
          newTop = this.pageWrapRect.height - (newTop + this.pageShowHeight) > 200 ? this.pageWrapRect.height - (this.pageShowHeight + 200) : newTop;
        } else {
          newTop = (this.pageWrapRect.height - this.pageShowHeight) / 2;
        }

        // if(this.pageShowWidth > this.pageWrapRect.width * 0.6) {
        //   let changeScale = scale - oldScale,
        //       pageWidthChange = this.pageWidth * changeScale * xScale,
        //       pageHeightChange = this.pageHeight * changeScale * yScale;
        //   newTop = this.pagePosition.top + pageHeightChange,
        //   newLeft = this.pagePosition.left + pageWidthChange;
        //   // 检查画布上侧左侧画布空白是否过大
        //   newTop = newTop > 200 ? 200 : newTop;
        //   newLeft = newLeft > 200 ? 200 : newLeft;
        //   // 检测画布右侧下侧画布空白是否过大
        //   newTop = this.pageWrapRect.height - (newTop + this.pageShowHeight) > 200 ? this.pageWrapRect.height - (this.pageShowHeight + 200) : newTop;
        //   newLeft = this.pageWrapRect.width - (newLeft + this.pageShowWidth) > 200 ? this.pageWrapRect.width - (this.pageShowWidth + 200) : newLeft;
        // } else {
        //   newTop = (this.pageWrapRect.height - this.pageShowHeight) / 2,
        //   newLeft = (this.pageWrapRect.width - this.pageShowWidth) / 2;
        // }

        this.setPagePosition({
          top: newTop,
          left: newLeft,
        });

        // 阻止浏览器默认事件执行
        eve.preventDefault();

      },

      // 更新pageWrap的rect
      updatePageWrapRect(type) {
        let pageWrapRect = this.pageWrapRect;
        if(type === 'leftPanel') {
          if(this.leftPanelClose) {
            pageWrapRect.left = pageWrapRect.left - 312;
            pageWrapRect.width = pageWrapRect.width + 312;
          } else {
            pageWrapRect.left = pageWrapRect.left + 312;
            pageWrapRect.width = pageWrapRect.width - 312;
          }
        } else if(type === 'pageList') {
          if(this.pageListClose) {
            pageWrapRect.width = pageWrapRect.width + 160;
          } else {
            pageWrapRect.width = pageWrapRect.width - 160;
          }
        }
        pageWrapRect.right = pageWrapRect.left + pageWrapRect.width;
        pageWrapRect.bottom = pageWrapRect.top + pageWrapRect.height;
        this.setPageWrapRect(pageWrapRect);
      }

    },
    watch: {
      leftPanelClose() {
        this.updatePageWrapRect('leftPanel');
      },
      pageListClose() {
        this.updatePageWrapRect('pageList');
      },
      focusElemIndex(val) {
        if(val < 0) {
          return;
        }
        
        // this.setEditorInfo(getFocusElemInfoForEditor());
        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        this.setToolsBarShow(true);
        // this.setEditorShow(true);
      },
      focusPageIndex() {
        pageBus.elementBlur();
      }
    }

  } 
</script>

<style lang="less" rel="stylesheet/less" scoped>
#pageWrap {
  // width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 160px;
  bottom: 0;
  left: 0;
  transition: right .3s linear, opacity .5s cubic-bezier(0.25, 0.1, 0, 1.04);
}
.onload {
  opacity: 0;
}
</style>
