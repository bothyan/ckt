<template>
  <div class="comp">
    <sign-in
        v-if="show === 1"
        :isAppClick="isAppClick"
        :isLogin="isLogin"
        :isPopup="isPopup"
        :isApi="isApi"
        :apiHref="apiHref"
        @showWhat="showWhat"
        @pushToWhere="pushToWhere"
        @promptShow="promptShow"
        @setUserInfo="setUserInfo"
    ></sign-in>
    <sign-up
        v-else-if="show === 2"
        :isAppClick="isAppClick"
        :inviteId="inviteId"
        :isLogin="isLogin"
        :isApi="isApi"
        @showWhat="showWhat"
        @promptShow="promptShow"
        @setUserInfo="setUserInfo"
    ></sign-up>
    <retrieve
        v-else-if="show === 3"
        :isAppClick="isAppClick"
        :isLogin="isLogin"
        @showWhat="showWhat"
        @promptShow="promptShow"
    ></retrieve>
  </div>
</template>

<style lang="less" scoped>
  .comp {
    width: 100%;
    height: 100%;
  }
</style>
<script>
  import signIn from './signIn.vue'
  import signUp from './signUp.vue'
  import retrieve from './retrieve.vue'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    components: {signIn, signUp, retrieve},
    data() {
      return {
//        show: 1
      }
    },
    computed: {
        ...mapGetters({
          show: 'getLogregShow',
          isApi: 'getApiInfo',
          apiHref: 'getApiHref'
        })
    },
    props: {
      isLogin: {
        default: false
      },
      isAppClick: {
        default: false
      },
      inviteId: {
        default: null
      },
      isPopup: {
        default: true
      }
    },
    watch: {
      $route() {
        if (this.isPopup) return;
        this.logOrReg();
      },
      isLogin(val) {
        // 控制第三方登录跳转
        if (val) {
          this.isPopup ? this.showWhat(false) : this.pushToWhere();
        }
      }
    },
    beforeMount() {
      if (this.isLogin) {
        if (this.isApi) {
          return
        }
        this.isPopup ? this.showWhat(false) : this.$router.push('/startDesign');
      }
    },
    mounted() {
      if (this.isPopup) return;
      this.logOrReg();
    },
    methods: {
        ...mapActions({
          setLogregShow: 'setLogregShow'
        }),
      logOrReg() { // 显示 登录/注册/找回
        if (this.$route.query.e) {
          switch (~~this.$route.query.e) {
            case 1:
              this.show = 1; // 登录
              break;
            case 2:
              this.show = 2; // 注册
              break;
            case 3:
              this.show = 3; // 找回密码
              break;
          }
        } else {
          this.show = 1;
        }
      },
      showWhat(val) {
        if (this.isPopup) {
          this.setLogregShow(val);
        } else {
          this.show = val;
          this.$router.push({path: '/logreg', query: {e: val}});
        }
      },
      setUserInfo(val) {
        this.$emit('setUserInfo', val);
      },
      promptShow(val) {
        this.$emit('promptShow', val);
      },
      pushToWhere() { // 确定跳转目标
        let refer = document.referrer,
            reg = /logreg/g.test(refer),
            index = window.location.origin + '/',
            price = window.location.origin + '/price';

        if (refer !== null && refer.length > 0) { // 前页存在
          if (!reg) { // 如果前页不是登录页
            switch (refer) {
              case price:
                this.$router.push({path:'/price', query:{p:1}});
                return;
                break;
              case index:
                this.$router.push('/startdesign');
                return;
                break;
            }
            window.location.href = refer;
          } else {
            this.$router.push('/startdesign');
          }
        } else {  // 前页不存在
          this.$router.push('/startdesign');
        }
      }
    }
  }
</script>
