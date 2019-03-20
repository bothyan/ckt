<template>
  <div>
    <!-- 微博封面 KIND_ID 6 -->
    <ul v-if="designKindId == 6" class="weibo-preview" :style="previewStyle">
      <li class="top-img"></li>
      <li class="weibo-name">
        <span class="nickname">创客贴</span>
        <span class="nickname-remark">(设置备注)</span>
      </li>
      <li class="mid-text">(此为模拟资料，仅供预览参考)</li>
      <li class="btn-wrap">
        <span class="attention"><span class="add-img"></span>关注</span>
        <span class="cancel">取消</span>
        <span class="menu"><span class="menu-img"></span></span>
      </li>
    </ul>
    <!-- 微信朋友圈封面 KIND_ID 4 -->
    <div v-if="designKindId == 4" class="weixin-preview" :style="previewStyle">
        <div class="img-wrap">
            <span class="preview-title">创客贴在线设计平台</span>
            <span class="preview-text">(此为模拟头像，仅供预览参考)</span>
            <span class="head-img"></span>
        </div>
    </div>
    <!-- 订阅号文章首图 KIND_ID 20 -->
    <div  v-if="designKindId == 20"
          :style="previewStyle"
          :class="{'dingyue-preview-open': dingYueOpen}"
          class="dingyuehao-preview"
    >
      <span @click="openDingYue()"
            :class="{'dingyue-open': dingYueOpen}"
            class="top-img"
      ></span>
      <div class="text-wrap" :style="{height: dingYueOpen ? '140px' : '70px'}">
        <span class="title">小白也能做设计-创客贴在线设计平台</span>
        <span class="text">(此为模拟标题,仅供预览参考)</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  @import "./preview.less";
</style>

<script>

  import designHandle from 'dataBus/design'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {
        dingYueOpen: false
      }
    },
    components: {

    },
    props: {

    },
    mounted() {

    },
    computed: {
      ...mapGetters({
        pageScale: 'getPageScale',
        designInfo: 'getDesignInfo'
      }),

      designKindId() {
        return this.designInfo.designKindId;
      },

      previewStyle() {
        return {
          transform: 'scale(' + this.pageScale + ')'
        }
      }
    },
    watch: {

    },
    methods: {
      ...mapActions({

      }),

      openDingYue() {
        this.dingYueOpen = !this.dingYueOpen;
      }

    }
  }
</script>