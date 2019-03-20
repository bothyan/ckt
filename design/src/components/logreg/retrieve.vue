<template>
  <div class="retrieve-page-hole">
    <!--找回密码页面-->
    <div class="retrieve-page" v-if="retrievePageDisplay">
      <div class="go-back">
        <span @click="showWhat(1)"><span class="sprite go-back-icon"></span>返回</span>
      </div>
      <div class="retrieve-tab">
        <div :class="{active: telRetriActive}" @click="showTelRetri">手机号找回</div>
        <div :class="{active: mailRetriActive}" @click="showMailRetri">邮箱找回</div>
      </div>
      <!--使用手机号找回-->
      <div class="tel-retrieve" v-if="telRetriActive">
        <sinput
            width="100%"
            placeholder="输入手机号"
            name="tel"
            @inputValue="getInputTel"
            @inputResult="checkInputState(arguments,'tel')"
            @submitInfo="submitInfo"
        >
        </sinput>
        <sinput
            width="100%"
            placeholder="输入图形验证码"
            name="yzm"
            maxlength="4"
            :emptyValue="vcodeEmpty"
            @inputResult="checkInputState(arguments,'firstYzm')"
            @inputValue="getInputVcode"
            @submitInfo="submitInfo"
        >
          <div class="input-inner">
            <div class="vcode">
              <div class="text" @click="getVcode">
                <span>点击刷新</span>
              </div>
              <div class="img">
                <img :src="vCodeImgUrl" alt="" @click="getVcode">
              </div>
            </div>
          </div>
        </sinput>
        <sinput
            width="100%"
            placeholder="输入短信验证码"
            name="yzm"
            maxlength="4"
            @inputResult="checkInputState(arguments,'secondYzm')"
            @inputValue="getInputSmsVcode"
            @submitInfo="submitInfo"
        >
          <div class="input-inner">
            <div class="get-vcode" :class="{bePointer:!disablePostSms}" @click="getCheckNum">
              <span v-if='getCheckNumCount==0' style="cursor: pointer">获取短信验证码</span>
              <span v-else style="cursor: wait">{{getCheckNumCount}}s后重新获取</span>
            </div>
          </div>
        </sinput>
        <div class="next-step-button" :class="btnActive" @click="showTelRePw">
          <button>下一步</button>
        </div>
      </div>
      <!--使用邮箱找回-->
      <div class="mail-retrieve" v-if="mailRetriActive">
        <sinput
            placeholder="输入邮箱账号"
            width="100%"
            name="mail"
            @inputResult="checkInputState(arguments,'mailRetri')"
            @inputValue="getInputMail"
            @submitInfo="submitInfo"
        >
        </sinput>
        <sinput
            placeholder="输入图形验证码"
            width="100%"
            name="yzm"
            maxlength="4"
            :emptyValue="vcodeEmpty"
            @inputResult="checkInputState(arguments,'mailYzm')"
            @inputAnotherValue="getInputCode"
            @submitInfo="submitInfo"
        >
          <div class="input-inner">
            <div class="vcode">
              <div class="text" @click="getVcode">
                <span>点击刷新</span>
              </div>
              <div class="img">
                <img :src="vCodeImgUrl" alt="图形验证码" @click="getVcode">
              </div>
            </div>
          </div>
        </sinput>
        <div class="next-step-button" :class="mailBtnActive" @click="sendResetPwdEmail">
          <button>下一步</button>
        </div>
      </div>
    </div>
    <!--使用手机号重置密码页-->
    <div class="tel-re-pw-page" v-if="telRePwPageDisplay">
      <div class="go-back" @click="showRetriPage">
        <span class="sprite go-back-icon"></span><span>返回</span>
      </div>
      <div class="header">重置密码</div>
      <sinput
          placeholder="输入新密码"
          width="100%"
          name="pw"
          type="password"
          @inputValue="inputValue"
          @inputResult="checkInputState(arguments,'pwd1')"
          @submitInfo="submitInfo"
      >
      </sinput>
      <sinput
          placeholder="确认新密码"
          width="100%"
          name="pw"
          type="password"
          @inputResult="checkInputState(arguments,'pwd2')"
          @inputAnotherValue="inputAnotherValue"
          @submitInfo="submitInfo"
      >
      </sinput>
      <div class="next-step-button" :class="rePwBtnActive" @click="showRePwSuccess">
        <button>下一步</button>
      </div>
    </div>
    <!--重置密码成功-->
    <div class="re-pw-success" v-if="rePwSucPageDisplay">
      <div class="sprite success-img"></div>
      <div class="success-txt">修改密码成功</div>
      <div class="to-sign-in-button" @click="showWhat(1)">
        <button><span>立即登录</span></button>
      </div>
    </div>
    <!--使用邮箱，发送验证邮件成功-->
    <div class="mail-retrieve-success" v-if="mailRetriSucDisplay">
      <div class="go-back" @click="showMailRetri">
        <span class="sprite go-back-icon"></span><span>返回</span>
      </div>
      <div class="mail-retrieve-success-content">
        <div class="sprite success-img"></div>
        <div class="success-txt">验证链接已成功发送至<br/>
          {{ usrMail }}的邮箱
        </div>
        <div class="to-verify-mail-button">
          <a :href="emailUrl">前往邮箱验证</a>
        </div>
        <div class="to-sign-in-button" @click="showWhat(1)">
          <button><span>立即登录</span></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import sinput from 'components/input/input.vue'
  import config from 'config/global_config'

  export default {
    data() {
      return {
        vCodeImgUrl: config.APIDOMAIN + '/index/vcode.do?codeNum=' + new Date().getTime(), // 验证码地址
        emailUrl: '', // 登录邮箱的网址
        retrievePageDisplay: true, // 找回页
        telRePwPageDisplay: false, // 通过手机号重置密码页
        rePwSucPageDisplay: false, // 重置密码成功页
        mailRetriSucDisplay: false, // 发送验证邮件成功
        telRetriActive: true, // 通过手机找回页
        mailRetriActive: false, // 通过邮箱找回页
        getCheckNumCount: 0, // 发送验证码成功后的计时数值
        btnActive: {
          btnActived: false // 第一页下一步按钮
        },
        rePwBtnActive: {
          rePwBtnActived: false // 第二页下一步按钮
        },
        mailBtnActive: {
          mailBtnActived: false // 第二页下一步按钮
        },
        usrMail: "",
        disablePostSms: true, // 禁用发送短信验证码按钮
        canClickTelNextButton: true, // 初始时可以点击手机号找回的下一步按钮
        canClickMailNextButton: true, // 初始时可以点击邮箱找回的下一步按钮
        canClickTelResetPwd: true, // 初始时可以点击通过手机号重置密码的下一步按钮
        vcodeEmpty: false //清空vcode
      }
    },
    props: {
      isAppClick: {
        default: false
      },
      isLogin: {
        default: false
      }
    },
    watch: {
      getCheckNumCount() {  // 倒计时计数值
        if (this.getCheckNumCount == 0) {
          this.disablePostSms = false;
          return;
        }
        setTimeout(() => {
          this.getCheckNumCount -= 1;
        }, 1000);
      }
    },
    methods: {
      showWhat(val) {
        this.$emit('showWhat', val);
      },
      showTelRetri() { // 显示手机号找回页
        this.mailRetriActive = false;
        this.telRetriActive = true;
      },
      showRetriPage() { // 显示找回页
        this.telRePwPageDisplay = false;
        this.retrievePageDisplay = true;
      },
      showMailRetri() { // 显示邮箱找回页
        this.retrievePageDisplay = true;
        this.mailRetriActive = true;
        this.mailRetriSucDisplay = false;
        this.telRetriActive = false;
      },
      getInputTel(val) { // 取得输入的手机号
        this.usrTel = val;
      },
      getInputMail(val) { // 取得输入的邮箱
        this.usrMail = val;
      },
      getInputVcode(val) {
        this.inputVcode = val;
        let str = val + '';
        this.disablePostSms = !(str.length === 4 && this.getCheckNumCount === 0);
      },
      getInputSmsVcode(val) {
        this.inputSmsVcode = val;
      },
      getInputCode(val) { // 取得输入的验证码
        this.mailCode = val;
      },
      getVcode() { // 获取验证码
        this.vCodeImgUrl = config.APIDOMAIN + '/index/vcode.do?codeNum=' + new Date().getTime();
        this.vcodeEmpty = !this.vcodeEmpty;
      },
      getCheckNum() { // 发送验证码成功后的倒计时
        let self = this;
        if (!this.usrTel) return;
        if (!this.inputVcode) return;
        if (this.disablePostSms) return;
        self.disablePostSms = true;
        self.$http.post('/user/sendSmsValiCode', {pn: this.usrTel, vcode: this.inputVcode}).then(res => {
          // -4图形验证码错误;-3传入的手机号码有误;-2未登录;-1用户未绑定手机号;0系统错误;1操作成功
          switch (res.body.code) {
            case 1:
              self.getCheckNumCount = 60;
              self.$emit('promptShow', {'promptText': '发送成功', 'promptKind': 'success'});
              break;
            case 0:
              self.$emit('promptShow', {'promptText': '系统错误', 'promptKind': 'error'});
              break;
            case -1:
              self.$emit('promptShow', {'promptText': '未绑定手机号', 'promptKind': 'error'});
              break;
            case -2:
              self.$emit('promptShow', {'promptText': '请登录', 'promptKind': 'error'});
              self.$router.push('/logreg');
              break;
            case -3:
              self.$emit('promptShow', {'promptText': '手机号码有误', 'promptKind': 'error'});
              break;
            case -4:
              self.$emit('promptShow', {'promptText': '图形验证码错误', 'promptKind': 'error'});
              break;
          }
          if (res.body.code !== 1) {
            self.getVcode();
          }
        });
      },
      inputValue(val) { // 取得输入的第一个密码并验证
        if (val) {
          this.firstPwd = val;
          this.uniPwd = false;
          this.uniPwd = this.firstPwd === this.secPwd;
          this.inputState();
        }
      },
      inputAnotherValue(val) {// 取得输入的第二个密码并验证
        if (val) {
          this.secPwd = val;
          this.uniPwd = false;
          this.uniPwd = this.firstPwd === this.secPwd;
          this.inputState();
        }
      },
      checkInputState(result, val) { // 检查输入状态
        let state = result[0];

        switch (val) {
          case 'tel':
            this.telFilled = state === "success";
            break;
          case 'firstYzm':
            this.firstYzmFilled = state === "success";
            break;
          case 'secondYzm':
            this.secondYzmFilled = state === "success";
            break;
          case 'pwd1':
            this.pwd1 = state === "success";
            break;
          case 'pwd2':
            this.pwd2 = state === "success";
            break;
          case 'mailRetri':
            this.mailRetriFilled = state === "success";
            break;
          case 'mailYzm':
            this.mailYzmFilled = state === "success";
        }

        this.inputState();
      },
      inputState() { // 检查输入状态并控制按钮点亮
        // 如果手机号和两个验证码都填入，按钮点亮
        this.btnActive.btnActived = this.telFilled && this.firstYzmFilled && this.secondYzmFilled;
        if (this.pwd1 && this.pwd2) { // 两个密码不为空
          this.rePwBtnActive.rePwBtnActived = this.uniPwd; // this.uniPwd 当且仅当两个密码一致时为 true
        } else {
          this.rePwBtnActive.rePwBtnActived = false;
        }
        // 邮箱找回界面 邮箱和验证码都填入时点亮按钮
        this.mailBtnActive.mailBtnActived = this.mailRetriFilled && this.mailYzmFilled;
      },
      submitInfo() {
        if (this.telRetriActive) {
          this.showTelRePw();
        }
        if (this.telRePwPageDisplay) {
          this.showRePwSuccess();
        }
        if (this.mailRetriActive) {
          this.sendResetPwdEmail();
        }
      },
      // 是否显示发送验证邮件成功页面
      sendResetPwdEmail() {
        if (this.mailBtnActive.mailBtnActived) {
          if (!this.canClickMailNextButton) return; // 按钮禁用则不执行下方代码
          this.canClickMailNextButton = false; // 禁用按钮
          this.$http.post('/user/sendResetPwdEmail', {email: this.usrMail, vcode: this.mailCode}).then(response => {
            this.canClickMailNextButton = true; // 请求成功则启用按钮
            let result = response.body.code;

            switch (result) {
              case 1:
                this.mailRetriSucDisplay = true; // 显示发送验证邮件成功页面
                this.retrievePageDisplay = false;
                this.getEmailUrl(this.usrMail);
                break;
              case 0:
                this.$emit('promptShow', {'promptText': '邮箱不存在', 'promptKind': 'error'});
                break;
              case -1:
                this.$emit('promptShow', {'promptText': '邮箱格式错误', 'promptKind': 'error'});
                break;
              case -2:
                this.$emit('promptShow', {'promptText': '邮箱参数为空', 'promptKind': 'error'});
                break;
              case -3:
                this.$emit('promptShow', {'promptText': '验证码错误', 'promptKind': 'error'});
                break;
              case -11:
                this.$emit('promptShow', {'promptText': '系统错误', 'promptKind': 'error'});
            }
            if (result != 1) {
              this.getVcode();
            }
          }, response => {
            console.log('error');
          });
        }
      },
      // 显示手机方式重置密码页面
      showTelRePw() {
        if (this.btnActive.btnActived) {
          if (!this.canClickTelNextButton) return; // 按钮禁用则不执行下方代码
          this.canClickTelNextButton = false; // 禁用按钮
          this.$http.post('/user/validateSmsCode4Forget', {
            pn: this.usrTel,
            vcode: this.inputSmsVcode
          }).then(response => {
            this.canClickTelNextButton = true; // 请求成功则启用按钮
            let sendResult = response.body.code;

            switch (sendResult) {
              case 1:
                this.telRePwPageDisplay = true;
                this.retrievePageDisplay = false;
                break;
              case -1:
                this.$emit('promptShow', {'promptText': '手机号格式不正确', 'promptKind': 'error'});
                break;
              case -2:
                this.$emit('promptShow', {'promptText': '短信验证码不正确', 'promptKind': 'error'});
                break;
              case -3:
                this.$emit('promptShow', {'promptText': '短信验证码错误', 'promptKind': 'error'});
                break;
            }
            if (response.body.code != 1) {
              this.getVcode();
            }
          }, response => {
            console.log('error');
          });
        }
      },
      // 是否显示重置密码成功界面
      showRePwSuccess() {
        if (this.rePwBtnActive.rePwBtnActived) {
          if (!this.canClickTelResetPwd) return; // 按钮禁用则不执行下方代码
          this.canClickTelResetPwd = false; // 禁用按钮
          this.$http.post('/user/resetPwd4Phone', {
            pn: this.usrTel,
            password: this.secPwd,
            vcode: this.inputSmsVcode
          }).then(response => {
            this.canClickTelResetPwd = true; // 请求成功则启用按钮
            let sendResult = response.body.code;
            switch (sendResult) {
              case 1:
                this.$emit('promptShow', {'promptText': '重置密码成功', 'promptKind': 'success'});
                this.rePwSucPageDisplay = true;
                this.telRePwPageDisplay = false;
                break;
              case 0:
                this.$emit('promptShow', {'promptText': '参数为空', 'promptKind': 'error'});
                break;
              case -1:
                this.$emit('promptShow', {'promptText': '密码不符合规则', 'promptKind': 'error'});
                break;
              case -3:
                this.$emit('promptShow', {'promptText': '验证码错误', 'promptKind': 'error'});
                break;
              case -4:
                this.$emit('promptShow', {'promptText': '重置密码失败', 'promptKind': 'error'});
                break;
            }
          }, response => {
            console.log('error');
          });
        }
      },
      getEmailUrl(email) {
        let emailType = email.substring(email.indexOf('@') + 1), emailUrl = '';
        emailType = emailType.toLowerCase();
        switch (emailType) {
          case 'qq.com':
          case 'vip.qq.com':
          case 'foxmail.com':
            emailUrl = 'http://mail.qq.com/';
            break;
          case '163.com':
          case '126.com':
          case 'yeah.net':
          case 'vip.163.com':
          case '188.com':
            emailUrl = 'http://email.163.com/';
            break;
          case 'tom.com':
            emailUrl = 'http://mail.tom.com/';
            break;
          case 'sina.com':
          case 'vip.sina.com':
          case 'sina.com.cn':
            emailUrl = 'http://mail.sina.com.cn/';
            break;
          case 'sohu.com':
          case 'souhu.com':
          case 'vip.sohu.com':
            emailUrl = 'http://mail.sohu.com/';
            break;
          case '139.com':
          case '136.com':
            emailUrl = 'http://mail.10086.cn/';
            break;
          case 'gmail.com':
            emailUrl = 'http://www.gmail.com/';
            break;
          case 'hotmail.com':
          case 'msn.com':
          case 'live.cn':
          case 'live.com':
          case 'msn.cn':
          case 'hotmail.com.cn':
            emailUrl = 'https://login.live.com/';
            break;
          case 'yahoo.com.cn':
          case 'yahoo.cn':
          case 'yahoo.com':
            emailUrl = 'http://mail.cn.yahoo.com/';
            break;
          case '21cn.com':
          case '21cn.net':
            emailUrl = 'http://mail.21cn.com/';
            break;
          case 'sogou.com':
            emailUrl = 'http://mail.sogou.com/';
            break;
          case '189.cn':
            emailUrl = 'http://www.189.cn/';
            break;
          case 'yjcp.com':
            emailUrl = 'http://www.yjcp.cn/';
            break;
          case 'eyou.com':
            emailUrl = 'http://www.eyou.com/';
            break;
          default:
            emailUrl = 'http://www.' + emailType + '/';
        }
        this.emailUrl = emailUrl;
      }
    },
    components: {sinput}
  }
</script>

<style lang="less" scoped>
  @import "retrieve.less";
</style>
