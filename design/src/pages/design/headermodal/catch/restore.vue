<template>
  <div class="catch-wrap">
    <div class="catch-top">
      <img src="./image/forbid.svg" alt="">
    </div>
    <div class="catch-bottom">
      <p class="save-error">当前设计已经被移至回收站，请还原后再操作</p>
      <a href="javascript:void(0)" class="catch-fresh" @click="refresh">还原</a>
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
      window.open('/designmanage')
    }
  }
}
</script>
<style lang="less" scoped>
  @import './catcherror.less';
</style>