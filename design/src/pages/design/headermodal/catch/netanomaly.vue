<template>
  <div class="catch-wrap">
    <div class="catch-top">
      <img src="./image/neterror.svg" alt="">
    </div>
    <div class="catch-bottom">
      <p class="catch-save">网络连接失败</p>
      <p class="save-error">由于网络连接错误，我们无法暂时帮你保存设计</p>
      <p>建议稍后再试，如果依然失败，尝试刷新页面，但您可能丢失几步操作</p>
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


