<template>
  <div>
    <div class="content-middle">
      <div class="wrapper">
        <div class="log-reg-box">
          <sign-comp
              :isAppClick="isAppClick"
              @promptShow="promptShow"
              @setUserInfo="setUserInfo"
              :isLogin="isLogin"
          ></sign-comp>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
  @import "./logreg.less";
</style>
<script>
  import signComp from './signComp.vue'

  export default {
    date() {
      return {}
    },
    props: {
      isLogin: {
        default: false
      },
      isAppClick: {
        default: false
      }
    },
    methods: {
      promptShow(val) {
        this.$emit('promptShow', val);
      },
      setUserInfo(val) {
        this.$emit('setUserInfo', val);
      }
    },
    components: {signComp}
  }
</script>
