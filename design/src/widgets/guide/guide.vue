<!--
  使用引导
  胡元港，2017/10/31，phone：15280907093
-->

<template>
  <div class="guide">
    <!--滤镜引导-->
    <transition name="filter">
      <div class="filter-guide" v-show="filterShow">
        <p class="guide-text">点击滤镜可以给图片加上不同的滤镜效果</p>
        <a class="i-know" href="javascript:void(0);" @click="clickIKnow('filterShow')">我知道了</a>
      </div>
    </transition>
    <!--svgFrame引导-->
    <transition name="frame">
      <div class="frame-guide" v-show="frameShow">
        <img class="guide-gif" src="./img/frame_guide.gif" width="100%" />
        <p class="guide-text">通过拖动可以将图片拖入到吸附框内</p>
        <a class="i-know" href="javascript:void(0);" @click="clickIKnow('frameShow')">我知道了</a>
      </div>
    </transition>
  </div>
</template>

<script>
  import  { mapGetters } from 'vuex';
  export default {
    data() {
      return {
        filterShow: false,
        frameShow: false
      }
    },
    computed: {
      ...mapGetters({
        eleType: 'getFocusElemType'
      })
    },
    watch: {
      eleType(v) {
        if( v === 'img' && !localStorage.filterShow) {
          this.filterShow = true;
        } else if( v === 'svgFrame' && !localStorage.frameShow) {
          this.frameShow = true;
        }
      }
    },
    methods: {
      clickIKnow(key) {
        this[key] = false;
        localStorage[key] = true;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "guide.less";
</style>