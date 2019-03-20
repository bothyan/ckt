import Vue from 'vue'
import App from 'components/App.vue'
import VueRouter from 'vue-router'
import routes from './router/routes'
import http_config from 'config/http-config'
import store from './vuex/index'
import VueSsScroll from './lib/vue-ss-scroll'

Vue.use(VueRouter)
Vue.use(VueSsScroll)
// 创建一个路由器实例
// 并且配置路由规则
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: routes
})

const app = new Vue({
  el: '#app',
  router: router,
  store,
  render: h => h(App)
})


// 第三方登录
window.thirdpartyCB = function(code) {
  if(code == 1) {
    app.$children[0].thirdReg();
  }
  else if(code == 2){
    app.$children[0].getUserInfo();
  }
}

if (!/localhost/.test(window.location.href)) {
  document.domain = 'chuangkit.com';
}