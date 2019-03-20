<template>
  <div class="sign-page" v-if="signPageDisplay">
    <img class="ckt-logo" src="./img/ckt_logo_for_logreg.svg">
    <p class="use-thirdparty-tips">使用第三方账号登录</p>
    <div class="thirdparty-container">
      <span class="qq-icon thirdparty-icon" @click="qqLogin"></span>
      <span class="weixin-icon thirdparty-icon" @click="wechatLogin"></span>
      <span class="weibo-icon thirdparty-icon" @click="weiboLogin"></span>
    </div>
    <p class="use-default-way">使用手机号/邮箱登录</p>
    <div class="sign-in">
      <div class="input">
        <sinput
            placeholder="输入手机号或邮箱"
            width="100%"
            name="usr"
            :autofocus="true"
            :isAppClick="isAppClick"
            @inputResult="checkInputState(arguments,'usrname')"
            @inputValue="inputUsr"
            @submitInfo="submitInfo"
        ></sinput>
        <sinput
            placeholder="输入密码"
            width="100%"
            name="pw"
            type="password"
            @inputResult="checkInputState(arguments,'pwd')"
            @inputAnotherValue="inputPwd"
            @submitInfo="submitInfo"
        ></sinput>
        <sinput
            v-if="showVcode"
            placeholder="输入验证码"
            width="100%"
            name="yzm"
            maxlength="4"
            :emptyValue="vcodeEmpty"
            @inputResult="checkInputState(arguments,'signInYzm')"
            @inputAnotherValue="getInputVcode"
            @submitInfo="submitInfo"
        >
          <div class="vcode">
            <div class="text">
              <span @click="getVcode">点击刷新</span>
            </div>
            <div class="img">
              <img :src="vCodeImgUrl" alt="" @click="getVcode">
            </div>
          </div>
        </sinput>
      </div>

      <div class="forget-line">
          <span class="forget">
          <span @click="showWhat(3)">
             <span>忘记密码</span>
            <span class="sprite question-mark"></span>
          </span>
        </span>
      </div>

      <div class="log-in-button" :class="btnActive" @click="checkLogin">
        <button>登录</button>
      </div>

      <p class="reg-text">还没有创客贴账号？<span @click="showWhat(2)">点击注册>></span></p>
    </div>
  </div>
</template>

<script>
  import sinput from 'components/input/input.vue'
  import config from 'config/global_config'

  export default {
    components: {sinput},
    props: {
      isAppClick: {
        default: false
      },
      isLogin: {
        default: false
      },
      isPopup: {
        default: true
      },
      isApi: {
        default: null
      },
      apiHref: {
        default: ''
      }
    },
    data() {
      return {
        signPageDisplay: true,// 整个登录框
        btnActive: {
          btnActived: false // 按钮激活
        },
        showVcode: false, // 显示验证码
        canClickLogin: true,  //初始时允许点击登录
        vcodeEmpty: false, //清空vcode
        vCodeImgUrl: config.APIDOMAIN + '/index/vcode.do?codeNum=' + new Date().getTime() // 验证码地址
      }
    },
    methods: {
      showWhat(val) {
        this.$emit('showWhat', val);
      },
      checkInputState(result, val) { // 检查输入状态
        let state = result[0];

        switch (val) {
          case 'usrname':
            this.ifUsrInput = state !== "error";
            break;
          case 'pwd':
            this.ifPwdInput = state === "success";
            break;
          case 'signInYzm':
            this.ifVcodeInput = state === "success";
            break;
        }

        this.inputState();
      },
      inputState() { // 检查输入状态并控制按钮点亮
        if (this.showVcode) {
          this.btnActive.btnActived = this.ifUsrInput && this.ifPwdInput && this.ifVcodeInput;
        } else {
          this.btnActive.btnActived = this.ifUsrInput && this.ifPwdInput ? true : false;
        }
      },
      inputUsr(val) { // 取得输入的用户名
        this.inputUsrValue = val;
      },
      inputPwd(val) { // 取得输入的密码
        this.inputPwdValue = val;
      },
      getVcode() { // 获取验证码
        this.vCodeImgUrl = config.APIDOMAIN + '/index/vcode.do?codeNum=' + new Date().getTime();
        this.vcodeEmpty = !this.vcodeEmpty;
      },
      getInputVcode(val) { // 取得输入的验证码
        this.inputVcodeValue = val;
      },
      checkLogin() { // 发送登录请求
        let inputUsername = this.inputUsrValue,
            inputPwd = this.inputPwdValue,
            inputVcode = this.inputVcodeValue;
        if (!this.btnActive.btnActived) return;
        if (!this.canClickLogin) return; // 点击登录后，如果当前不允许点击则不执行下方代码
        this.canClickLogin = false; // 点击登录后，请求成功前不允许多次点击

        if (this.showVcode) { // 有验证码框时发送用户名、密码和验证码
          let data = {
            username: inputUsername,
            password: inputPwd,
            vcode: inputVcode
          };
          this.sSOLogin4Web2(data);
        } else { // 没有验证码框时只发送用户名和密码
          let data = {
            username: inputUsername,
            password: inputPwd
          };
          this.sSOLogin4Web2(data);
        }
      },
      sSOLogin4Web2(data) { // 发送登录请求
        this.$http.post('/login/sSOLogin4Web2', data).then(response => {
          this.canClickLogin = true; // 请求成功才允许再次点击，防止发送多次请求
          let result = response.body,
              logInResult = result.code,
              authCount = result.authCount,
              userInfo = result.userInfo;

          switch (logInResult) {
            case 1:
              this.$emit('promptShow', {'promptText': '登录成功', 'promptKind': 'success'});
              this.$emit('setUserInfo', userInfo);
              if (this.isApi) {
                window.location.href = this.apiHref
                return
              }
              if (this.isPopup) return;
              if (this.$route.query.teaminvitekey && this.$route.query.teaminvitekey.length > 0) {
                this.$router.push('/startdesign?teaminvitekey=' + this.$route.query.teaminvitekey);
              } else {
                this.$emit('pushToWhere');
              }
              break;
            case -1:
              this.$emit('promptShow', {'promptText': '用户名不存在', 'promptKind': 'error'});
              break;
            case -2:
              this.$emit('promptShow', {'promptText': '账号或密码错误', 'promptKind': 'error'});
              break;
            case -3:
              this.$emit('promptShow', {'promptText': '验证码为空', 'promptKind': 'error'});
              break;
            case -4:
              this.$emit('promptShow', {'promptText': '验证码错误', 'promptKind': 'error'});
              break;
            case 0:
              this.$emit('promptShow', {'promptText': '登录失败', 'promptKind': 'error'});
              break;
          }
          if (logInResult != 1) {
            this.getVcode();
          }
          if (authCount > 2) {
            this.showVcode = true;
          }
        }, response => {
          console.log("error");
        });
      },
      submitInfo() {
        this.checkLogin();
      },
      weiboLogin() {
        let frame = window.open("about:blank", "_blank", "height=600,width=600,top=0,left=0," +
            "toolbar=no,menubar=no,scrollbars=no, location=no, status=no");

        this.$http.post('/login/webSinaLogin').then(response => {
          frame.location = response.body.url;
        }, response => {
          console.log('error');
        });
      },
      wechatLogin() {
        let frame = window.open("about:blank", "_blank", "height=600,width=600,top=0,left=0," +
            "toolbar=no,menubar=no,scrollbars=no, location=no, status=no");

//        let self = this
//
//        frame.location = '/wxlogin'
//        localStorage.setItem('queryWxAuth', true)
//
//        setTimeout(timer, 3000)
//
//        function timer() {
//          if (!localStorage.getItem('queryWxAuth')) return
//          self.$http.post('/login/wxLoginAuthorized').then(res => {
//            let flag = true, // 设置检测标志
//              t;
//            // -1未携带Cookie；0微信未授权；-2系统错误；1已授权
//            if (res.body.code === 1) {
//              frame.close()
//              localStorage.removeItem('queryWxAuth')
//              flag = false
//              location.reload()
//            }
//            if (flag) {
//              t = setTimeout(timer, 3000)
//            } else {
//              clearTimeout(t)
//            }
//          })
//        }
        this.$http.post('/login/webWxLogin').then(response => {
          frame.location = response.body.url;
        }, response => {
          console.log('error');
        });
      },
      qqLogin() {
        let frame = window.open("about:blank", "_blank", "height=600,width=600,top=0,left=0," +
            "toolbar=no,menubar=no,scrollbars=no, location=no, status=no");

        this.$http.post('/login/webQQLogin').then(response => {
          frame.location = response.body.url;
        }, response => {
          console.log('error');
        });
      }
    }
  }


</script>

<style lang="less" scoped>
  @import "../../base/base.less";
  @import "./signIn.less";
</style>
