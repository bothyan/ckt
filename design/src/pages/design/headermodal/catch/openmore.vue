<template>
  <div class="catch-wrap">
    <div class="compatible-top">
    </div>
    <div class="catch-bottom">
      <p class="catch-save">此设计被多次打开</p>
      <p class="save-error">您在其他标签页面正编辑此设计</p>
      <p class="open-design">如果希望编辑设计</p>
      <p>请关闭其他重复的页面并刷新此页面</p>
      <a href="javascript:void(0)" class="catch-fresh" @click="refresh">刷新</a>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  methods:{
    refresh(){
      window.location.reload()
    }
  }
}
</script>
<style lang="less" scoped>
    @import './catcherror.less';
</style>





