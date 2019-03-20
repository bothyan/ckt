<template>
  <div id="rightPanel" :style="{left: rightPanelLeft}" ref="rightPanel">
    <page-wrap v-show="layoutOnload"></page-wrap>
    <page-list v-show="layoutOnload"></page-list>
    <guide></guide>
  </div>
</template>
<script>

  import pageWrap from 'widgets/page/pageWrap.vue'
  import pageList from 'widgets/page/comp/pageList/pageList.vue'
  import guide from 'widgets/guide/guide.vue'
  import {mapGetters, mapActions} from 'vuex'

  export default{
    data(){
      return{
        
      }
    },
    components:{
      pageWrap,
      pageList,
      guide
    },
    props: {

    },
    beforeMount() {

    },
    mounted() {
      this.pageWrapInit();
    },
    computed: {
      ...mapGetters({
        pageWidth: 'getPageWidth',
        pageHeight: 'getPageHeight',
        pageBlank: 'getPageBlank',
        leftPanelClose: 'getLeftPanelClose',
        layoutOnload: 'getLayoutOnload',
        defaultPageScale: 'getDefaultPagePosition',
        pageWrapRect: 'getPageWrapRect',
        windowResize: 'getWindowResize'
      }),
      rightPanelLeft() {
        if(this.leftPanelClose) {
          return 54 + 'px';
        } else {
          return 366 + 'px';
        }
      }
    },
    methods: {
      ...mapActions({
        setPageScale: 'setPageScale',
        setPagePosition: 'setPagePosition',
        setDefaultPagePosition: 'setDefaultPagePosition',
        setDefaultPageScale: 'setDefaultPageScale',
        setPageWrapRect: 'setPageWrapRect'
      }),

      pageWrapInit() {
        let rightPanelWidth = this.$refs.rightPanel.offsetWidth;
        let pageWrapHeight = this.$refs.rightPanel.offsetHeight;
        this.setPageWrapRect({
          width: rightPanelWidth - 160,
          height: pageWrapHeight,
          top: 50,
          left: 54 + 312,
          right: 54 + 312 + rightPanelWidth - 160,
          bottom: 50 + pageWrapHeight
        });
        this.compPageScale();
      },

      // 计算画布的默认缩放比例
      compPageScale() {
        let pageWidth = parseFloat(this.pageWidth),
            pageHeight = parseFloat(this.pageHeight),
            avaWidth = this.pageWrapRect.width - this.pageBlank.left - this.pageBlank.right,
            avaHeight = this.pageWrapRect.height - this.pageBlank.top - this.pageBlank.bottom,
            pageScale,
            pagePosition;
        if(pageWidth / avaWidth < pageHeight / avaHeight) {
          pageHeight = avaHeight;
          pageScale = pageHeight / parseFloat(this.pageHeight);
          pagePosition = {
            top: 50,
            left: (this.pageWrapRect.width - pageScale * parseFloat(this.pageWidth)) / 2
          };
        } else {
          pageWidth = avaWidth;
          pageScale = pageWidth / parseFloat(this.pageWidth);
          pagePosition = {
            top: (this.pageWrapRect.height - pageScale * parseFloat(this.pageHeight)) / 2,
            left: 50
          };
        }
        this.setPageScale(pageScale);
        this.setDefaultPageScale(pageScale);
        this.setPagePosition(JSON.parse(JSON.stringify(pagePosition)));
        this.setDefaultPagePosition(JSON.parse(JSON.stringify(pagePosition)));
      }
    },
    watch:{
      pageWidth() {
        this.compPageScale();
      },
      pageHeight() {
        this.compPageScale();
      },
      windowResize() {
        this.pageWrapInit();
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
#rightPanel {
  position: absolute;
  top: 50px;
  right: 0px;
  bottom: 0px;
  transition: left .3s;
}
</style>
