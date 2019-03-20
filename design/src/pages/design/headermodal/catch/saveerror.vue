<template>
  <div class="catch-wrap">
    <div class="catch-top">
      <img src="./image/sveerror.svg" alt="">
    </div>
    <div class="catch-bottom">
      <p class="catch-save">保存遇到问题</p>
      <p class="save-error">保存失败，请尝试刷新当前页面</p>
      <p>如果多次出现该问题，请联系客服
        <span class="catch-cellphone">400-871-8211</span>
      </p>
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





