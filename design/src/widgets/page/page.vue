<template>
  <section  :class="{
              'page-transparent' : transparentBack,
              'page-slow': pageSlow,
              'hand': spaceKeyDown && pageScale > defaultPageScale,
              'hand-mousedown': pageMoveMousedown && pageScale > defaultPageScale,
              'page-fade-in': pageFadeIn
            }"
            :style="pageSytle"
            id="page"
            class="page"
  >
    <editor></editor>
    <table-editor></table-editor>
    <layer-animation></layer-animation>
    <svg  :viewBox="viewBox"
          :width="pageShowWidth"
          :height="pageShowHeight"
          id="pageSvg"
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          xmlns:xlink='http://www.w3.org/1999/xlink'
    >
      <page-ele :pageId="focusPageId"></page-ele>
    </svg>
    <hover></hover>
    <guide-line></guide-line>
    <page-bleed v-if="bleedShow"></page-bleed>
    <preview v-if="pagePreview"></preview>
  </section>
</template>

<script>

  import pageEle from './pageEle.vue'
  import webSocket from 'dataBus/webSocket'
  import editor from '../editor/editor.vue'
  import hover from '../hover/hover.vue'
  import tableEditor from '../editor/tableEditor.vue'
  import layerAnimation from 'components/layerAnimation/layerAnimation.vue';
  import designHandle from 'dataBus/design'
  import guideLine from './comp/guideLine/guideLine.vue'
  import preview from './comp/preview/preview.vue'
  import pageBleed from './comp/pageBleed.vue'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {
        elements: [],
        elementGroups: [],
        selectElement: [],
        focus_drag: false,
        zoomIn: 1,
        pageSlow: false,
        pageFadeIn: false
      }
    },
    components: {
      pageEle,
      editor,
      tableEditor,
      guideLine,
      preview,
      pageBleed,
      layerAnimation,
      hover
    },
    props: {

    },
    mounted() {
      let designInfo = designHandle.getDesignInfo();
      this.setMaxPage(designInfo.maxPageNum);
      this.pageFadeIn = true;
    },
    computed: {
      ...mapGetters({
        pagesJson: 'getPagesJson',
        pageWidth: 'getPageWidth',
        pageHeight: 'getPageHeight',
        pageShowWidth: 'getPageShowWidth',
        pageShowHeight: 'getPageShowHeight',
        pageScale: 'getPageScale',
        defaultPageScale: 'getDefaultPageScale',
        pagePosition: 'getPagePosition',
        defaultPagePosition: 'getDefaultPagePosition',
        leftPanelClose: 'getLeftPanelClose',
        pageListClose: 'getPageListClose',
        pageWrapRect: 'getPageWrapRect',
        pagePreview: 'getPagePreview',
        spaceKeyDown: 'getSpaceKeyDown',
        bleedShow: 'getIsBleed',
        pageMoveMousedown: 'getPageMoveMousedown',
        pageIdList: 'getPageIdList',
        focusPageIndex: 'getFocusPageIndex',
        transparentBack:'getTransparentBack'
      }),

      pageSytle() {
        return {
          width: this.pageShowWidth + 'px',
          height: this.pageShowHeight + 'px',
          top: this.pagePosition.top + 'px',
          left: this.pagePosition.left + 'px'
        }
      },

      viewBox() {
        return "0 0 " + this.pageWidth * this.zoomIn + " " + this.pageHeight * this.zoomIn;
      },

      focusPageId() {
        return this.pageIdList[this.focusPageIndex];
      }

    },
    watch: {
      pageScale() {
        this.updatePageRect();
      },
      pageWidth() {
        this.updatePageRect();
      },
      pageHeight() {
        this.updatePageRect();
      },
      leftPanelClose() {
        this.pageSlow = true;
        this.updatePageDefaultPosition('leftPanel');
        this.updatePageRect();
        setTimeout(()=> {
          this.pageSlow = false;
        }, 300);
      },
      pageListClose() {
        this.pageSlow = true;
        this.updatePageDefaultPosition('pageList');
        this.updatePageRect();
        setTimeout(()=> {
          this.pageSlow = false;
        }, 300);
      },
      pagePosition() {
        this.updatePageRect();
      }
    },
    methods: {
      ...mapActions({
        setPage: 'setPage',
        setPageRect: 'setPageRect',
        setPagePosition: 'setPagePosition',
        setDefaultPagePosition: 'setDefaultPagePosition',
        setMaxPage: 'setMaxPage'
      }),

      updatePageRect() {
        var rect = {
          top: 50 + this.pagePosition.top,
          right: this.pagePosition.left + this.pageShowWidth,
          bottom: 50 + this.pagePosition.top + this.pageShowHeight,
          left: this.pagePosition.left
        };
        if(this.leftPanelClose) {
          rect.left = rect.left + 54;
          rect.right = rect.right + 54;
        } else {
          rect.left = rect.left + 54 + 312;
          rect.right = rect.right + 54 + 312;
        }
        this.setPageRect(rect);
      },

      // 更新画布默认位置
      updatePageDefaultPosition(type) {
        let defaultPagePosition = this.defaultPagePosition;
        if(type === 'leftPanel') {
          if(this.leftPanelClose) {
            defaultPagePosition.left = defaultPagePosition.left + 312 / 2;
            this.setPagePosition({
              top: this.pagePosition.top,
              left: this.pagePosition.left + 312 / 2
            });
          } else {
            defaultPagePosition.left = defaultPagePosition.left - 312 / 2;
            this.setPagePosition({
              top: this.pagePosition.top,
              left: this.pagePosition.left - 312 / 2
            });
          }
        } else if(type === 'pageList') {
          if(this.pageListClose) {
            defaultPagePosition.left = defaultPagePosition.left + (160 - 54) / 2;
            this.setPagePosition({
              top: this.pagePosition.top,
              left: this.pagePosition.left + (160 - 54) / 2
            });
          } else {
            defaultPagePosition.left = defaultPagePosition.left - (160 - 54) / 2;
            this.setPagePosition({
              top: this.pagePosition.top,
              left: this.pagePosition.left - (160 - 54) / 2
            });
          }
        }
        this.setDefaultPagePosition(defaultPagePosition);
      },

      // // 保存画布id列表
      // savePageIdList() {
      //   let _this = this,
      //       state = webSocket.state(),
      //       pageIdList = _this.pageIdList;

      //   if(state.OPEN == 1 && state.readyState == 1) {
      //     var data = {
      //       reqtype: 5,
      //       params: {
      //         page_ids: pageIdList.join(','),
      //         width: _this.pageWidth,
      //         height: _this.pageHeight
      //       }
      //     };
      //     data = JSON.stringify(data);
      //     webSocket.send(data);
      //   }
      // },

      // // 更新画布id列表
      // updatePageIdList(params) {
      //   let code = params.code,
      //       pageJsonIds = params.pageJsonIds,
      //       i = 0,
      //       newPageIsList = [];

      //   // 状态码（-1参数错误；-2设计未保存；-3系统错误；1操作成功）
      //   if(code === 1) {
      //     while(pageJsonIds[i]) {
      //       newPageIsList.push(pageJsonIds[i]);
      //       ++i;
      //     }
      //     this.setPageIdList();
      //   } else {
      //     console.log('ws版本调整设计分块Json顺序错误！')
      //   }
      // }

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
.page {
  position: absolute;
  background-color: #FFF;
  transform-origin: top left 0;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
  transform: scale(0.6, 0.6);
  opacity: 0;
  transition: transform .5s linear, opacity .5s linear;
  transform-origin: center center;
}

.page-transparent {
  background-image: url(./img/transparent_back.svg) ;
  background-repeat: repeat;
  background-size: 16px;
}
.page-slow {
  transition: left 0.2s linear;
}
.hand {
  cursor: url(./img/hand.png), pointer;
}
.hand-mousedown {
  cursor: url(./img/fist.png), pointer;
}
.page-fade-in {
  transform: scale(1, 1);
  opacity: 1;
}
</style>
