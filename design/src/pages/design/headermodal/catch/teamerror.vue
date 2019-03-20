<template>
  <div class="catch-wrap">
    <div class="catch-top">
      <img src="./image/forbid.svg" alt="">
    </div>
    <div class="catch-bottom">
      <p class="catch-save">禁止操作</p>
      <p class="save-error">当前设计正在被其他团队成员编辑,请稍后打开</p>
      <a href="javascript:void(0)" class="catch-fresh" @click="refresh">返回</a>
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
				window.location.href="/startDesign"
			}
		}
	}
</script>
<style lang="less" scoped>
  @import './catcherror.less';
</style>