<template>
  <div id="app">
    <div class="ckt-design-wrap">
      <div id="shadow-stop" v-if="stop"></div>
      <router-view
          v-if="apiReady"
          :userInfo="userInfo"
          :isLogin="isLogin"
      ></router-view>
      <message
        :messageShow="messageShow"
        @messageClose="messageClose"
      ></message>
      <modal
          type="modal1"
          :modalShow="logregShow"
          @modalClose="closeLogreg"
      >
        <div class="logreg-wrapper">
          <div class="logreg-box">
            <sign
                @promptShow="showMessage"
                @setUserInfo="setUserInfo"
                :isLogin="isLogin"
            ></sign>
          </div>
        </div>
      </modal>
      <modal
          type="modal1"
          :modalShow="dialogShow"
          @modalClose="closeDialog"
      >
        <dialog-comp></dialog-comp>
      </modal>
      <modal
          type="modal1"
          :modalShow="errorShow"
          :disable="modalDisableClose"
          :closeShow="closeShow"
          @modalClose="closeError"
      >
        <save-error v-if="errorShow == 1"></save-error>
        <net-anomaly v-else-if="errorShow == 2"></net-anomaly>
        <for-bid v-else-if="errorShow == 3"></for-bid>
        <up-grade-member v-else-if="errorShow == 4"  @closeUpgradeModal="closeUpgradeModal"></up-grade-member>
        <vip-member v-else-if="errorShow == 5" @closeUpgradeModal="closeUpgradeModal"></vip-member>
        <vip-template v-else-if="errorShow == 6" :imgArray="templateImgUrl"></vip-template>
        <compatible v-else-if="errorShow == 7"></compatible>
        <open-more v-else-if="errorShow == 8"></open-more>
        <restore v-else-if="errorShow == 9"></restore>
        <teamError v-else-if="errorShow == 10"></teamError>
      </modal>
    </div>
    <transition name="designOnloadAnimate">
      <div class="design-onload-animate" v-if="!layoutOnload">
        <div class="design-onload-wrap">
          <img src="../img/loading.gif" alt="创客贴加载动画">
          <div class="design-onload-text">{{onloadText}}</div>
        </div>
      </div>
    </transition>
    <modal
        type="modal1"
        :modalShow="iframeShow"
        @modalClose="setIframeShow(false)"
        class="thirdparty-iframe"
    >
      <iframe class="thirdparty-iframe" :src="iframeUrl"></iframe>
    </modal>
  </div>
</template>

<script>
  import message from 'ss-messsage'
  import modal from './modal/modal.vue'
  import dialogComp from './dialog/dialog.vue'
  import sign from './logreg/signComp.vue'
  import pageCtrl from 'dataBus/page'
  import forBid from 'pages/design/headermodal/catch/forbid.vue'
  import netAnomaly from 'pages/design/headermodal/catch/netanomaly.vue'
  import saveError from 'pages/design/headermodal/catch/saveerror.vue'
  import { mapGetters, mapActions } from 'vuex'
  import keyDownFunc from 'common/keyDown'
  import upGradeMember from 'pages/design/vipmember/upgrademember.vue'
  import vipMember from 'pages/design/vipmember/vipmember.vue'
  import vipTemplate from '../layout/leftPanel/comp/template/templateView.vue'
  import compatible from 'pages/design/headermodal/catch/compatible.vue'
  import openMore from 'pages/design/headermodal/catch/openmore.vue'
  import restore from 'pages/design/headermodal/catch/restore.vue'
  import teamError from 'pages/design/headermodal/catch/teamerror'
  import dataHandle from 'common/dataHandle'

	export default {
		name: 'app',
		data () {
			return {
        modalDisableClose: false ,// 控制弹窗是否能够关闭,
        closeShow: true, // 控制弹窗是否显示关闭icon
        apiReady: false
			}
		},
		components:{
			message, modal, dialogComp, sign, forBid, netAnomaly,
      saveError,upGradeMember,vipMember,vipTemplate,compatible,
      openMore,restore,teamError
		},
		computed:{
			...mapGetters({
        userInfo: 'getUserInfo',
        iframeShow: 'getIframeShow',
        iframeUrl: 'getIframeUrl',
        isLogin: 'getIsLogin',
        messageShow: 'getMessageShow',
        logregShow: 'getLogregShow',
        dialogShow: 'getDialogShow',
        errorShow: 'getErrorShow',
        layoutOnload: 'getLayoutOnload',
				templateImgUrl: 'getTemplateImgUrl',
        stop: 'getDoStop',
        apiInfo: 'getApiInfo',
        getIsVip: 'getIsVip'
			}),
      onloadText() {
        var loading_text = [
          "创客贴—像搭积木一样完成设计",
          "创客贴——极简的在线平面设计工具",
          " 注册登录后，享有更多设计特权",
          "一杯咖啡的时间即可掌握创客贴的操作",
          "解决使用问题三法宝—刷新、清缓存、找客服",
          "据统计，80%以上的创客贴用户颜值高于普通人",
          "一年会员180元=二罐咖啡=节约70%作图时间"
        ]
        return loading_text[parseInt(Math.random() * loading_text.length)];
      },
//      stop(){
//	      if(this.messageShow.placeHolder&&
//          this.messageShow.placeHolder.indexOf('连接不上服务器')>-1){
//          return true
//	      }
//	      return false
//      }
    },
    watch: {
      logregShow(v) {
        v ? pageCtrl.elementBlur() : "";
        if (localStorage.getItem('queryWxAuth')) {
          localStorage.removeItem('queryWxAuth')
        }
      },
      errorShow(v) {
        // 判断是否为保存失败弹窗
        if (v!= 4&&v!= 5&&v!=6) {
          this.modalDisableClose = true
          this.closeShow = false
        }else{
          this.modalDisableClose = false
          this.closeShow = true
        }
      }
    },
    beforeCreate(){
	    dataHandle.init(this)
    },
		beforeMount() {
      // 先检查是否是api进入
      if(this.$route.query.access) {
        window.api = true;
        // 清除所有cookie
        this.clearAllCookie();
        // 从地址栏获取api信息
        this.setApiFromLink();
      } else {
        this.appInit();
      }
		},
		methods:{
			...mapActions({
				setMessageShow: 'setMessageShow',
        setUserInfo: 'setUserInfo',
        setLogregShow: 'setLogregShow',
        setIframeShow: 'setIframeShow',
        setDialogShow: 'setDialogShow',
        setErrorShow: 'setErrorShow',
        setApiInfo: 'setApiInfo',
        setApiToken: 'setApiToken',
        setApiHref: 'setApiHref'
			}),
      // 从地址栏获取api信息
      setApiFromLink() {
        let query = this.$route.query,
            apiInfo = {
              'data-access': query.access,
              'data-exp': query.exp,
              'sign': query.sign,
              'signType': query.sign_type,
              'data-definition': query.definition || null,
              'data-change': query.change || null,
              'data-zIndex': query.zindex || null,
              'data-close-copyright': query.cc || null,
              'data-allow-login': query.al || null,
              'data-auto-save': query.as || null,
              'data-logo': query.logo || null,
              'data-imgkind': query.img_k || null
            };
        if(query.design_id) {
          // 通过已有设计进入api
          apiInfo['data-design-id'] = query.design_id;
        } else if(query.k && parseInt(query.k) != 127) {
          // 通过kindId进入api
          apiInfo['data-kind'] = query.k;
        } else {
          // 自定义尺寸进入api
          apiInfo['data-width'] = query.w;
          apiInfo['data-height'] = query.h;
          apiInfo['data-unit'] = query.unit;
        }
        for (let key in apiInfo) {
          if(!apiInfo[key]){
            delete(apiInfo[key]);
          }
        }
        this.setApiHref(window.location.href);
        // 保存API信息
        this.setApiInfo(apiInfo);
        // 请求apiToken
        this.queryApiToken(apiInfo);
      },
      // 请求apiToken
      queryApiToken(apiInfo) {
        // 获取API访问令牌
        this.$http.post('/api/authorize', this.apiInfo).then((response) => {
          let code = response.body.code;
          switch(code) {
            // 操作的状态码（-1参数错误；-2APPId不合法；-3签名错误；1token获取成功）
            // case -1:
            //   this.apiTokenError('获取API访问令牌错误，参数错误！');
            //   break;
            // case -2:
            //   this.apiTokenError('获取API访问令牌错误，AppId不合法！');
            //   break;
            // case -3:
            //   this.apiTokenError('获取API访问令牌错误，签名错误！');
            //   break;
            case 200:
              window.apiToken = response.body.token;
              this.setApiToken(response.body.token);
              let time = (parseInt(response.body.expireIn) - 60) * 1000;
              setTimeout(() => {
                this.refreshApiToken();
              }, time);

              if(apiInfo['data-design-id']) {
                this.$router.push('/design?d=' + apiInfo['data-design-id']);
                this.appInit();
              } else {
                this.appInit();
              }
              break;
            default:
              this.apiTokenError('执行出错,结果代码code: ' + code);
          }
        }).catch((error) => {
          console.log('获取API访问令牌错误, ' + error);
        });
      },
      // api报错
      apiTokenError(error) {
        window.parent.postMessage({
          'cktMessage': true,
          'kind': -1,
          'design-id': this.apiInfo['data-design-id'],
          'error': error
        }, "*");
      },
      // 重新获取apiToken
      refreshApiToken() {
        // 刷新API访问令牌
        this.$http.post('/api/refreshToken', apiInfo).then((response) => {
          let code = response.body.code;
          switch(code) {
            // 操作的状态码（-1token不存在；1token获取成功）
            case -1:
              this.setMessageShow({
                placeHolder:'刷新API访问令牌token不存在！'
              });
              break;
            case 1:
              this.setApiToken(response.body.token);
              let time = (parseInt(response.body.expireIn) - 60) * 1000;
              setTimeout(() => {
                this.refreshApiToken();
              }, time);
              break;
            default:
              this.setMessageShow({
                placeHolder:'刷新API访问令牌错误！'
              });
          }
        }).catch((error) => {
          console.log('刷新API访问令牌, ' + error);
        });
      },
      appInit() {
        this.getUserInfo();
        keyDownFunc();
      },
      getUserInfo() {
        this.apiReady = true;
        this.$http.post('/user/getUserInfo', {vip: true}).then(response => { // loginout  vip
          let result = response.body;
          if(result.LoginTimeOut && !window.api) {
            this.setUserInfo(null);
            return;
          }
          this.setUserInfo(result.userInfo);
          this.setLogregShow(false);
          this.setIframeShow(false);
          _vds.push(['setCS1', 'user_id', result.userId]);
          _vds.push(['setCS2', 'is_new_user', result.isNewUser]);
          _vds.push(['setCS3', 'is_vip', this.getIsVip]);
        });
      },
      closeUpgradeModal(){
        this.setErrorShow(false)
      },
      // 第三方注册
      thirdReg() {
        this.$http.post('/user/getUserInfo', {vip: true}).then(response => {
          let result = response.body;
          if(result.LoginTimeOut) {
            this.setUserInfo(null)
            return;
          }

          this.setUserInfo(result.userInfo);
          this.setLogregShow(false);
          this.setIframeShow(false);

          _vds.push(['setCS1', 'user_id', result.userId]);
          _vds.push(['setCS2', 'is_new_user', result.isNewUser]);
          _vds.push(['setCS3', 'is_vip', this.getIsVip]);

        }, response => {
          console.log('getUserInfo error');
        });
      },
      closeLogreg() {
			  this.setLogregShow(false);
      },
      closeDialog() {
        this.setDialogShow(false);
      },
      closeError() {
        this.setErrorShow(false);
      },
      showMessage(val) {
			  this.setMessageShow(val);
      },
			// 提示关闭
			messageClose() {
				this.setMessageShow(false);
			},
      //清除所有cookie
      clearAllCookie() {
        let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if(keys) {
          for(let i = 0; i < keys.length; i++) {
            let cookie = keys[i] + '=; domain=chuangkit.com; path=/';
            document.cookie = cookie;
          }
        }
      }

		}
	}
</script>

<style lang="less">
  @import "../base/reset.css";
  @import "../common/zindex.less";

  #app{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  #testWidth {
    position: absolute;
    left: 1000px;
    top: 1000px;
    overflow: hidden;
    border: 0;
  }

  .design-onload-animate {
    width: 100%;
    height: 100%;
    position: absolute;  
    z-index: 1000000;
    background-color: #fff;
    .design-onload-wrap {
      width: 100%;
      height: 160px;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      text-align: center;
      img {
        width: 91px;
      }
      div {
        color: #999;
        margin-top: 10px;
      }
    }
    
  }

  .designOnloadAnimate-leave-active {
    transition: opacity .5s;
  }
  .designOnloadAnimate-leave {
    opacity: 0;
  }

  .ckt-design-wrap {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;

    #shadow-stop{
      width: 100%;
      height: 100%;
      position: fixed;
      background: rgba(0,0,0,.32);
    }

  }

  .logreg-wrapper {
    width: 550px;
    height: 600px;
    position: relative;
    background-color: white;
    margin: 0 auto;
    border-radius: 3px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12);
    text-align: center;
    padding-top: 5%;
    .logreg-box {
      width: 350px;
      height: 100%;
      margin: 0 auto;
    }
  }

  #page-clone {
    position: absolute;
  }
  .thirdparty-iframe {
    width: 620px;
    height: 600px;
    background-color: #fff;
  }
</style>
