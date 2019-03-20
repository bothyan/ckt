<template>
  <div class="resetPW">
    <!--使用邮箱方式重设密码-->
    <div class="mail-re-pw-page" v-if="mailRePwPageDisplay">
      <div class="header">重置密码</div>
      <div class="input">
        <chuangkitInput
            @inputValue="inputValue"
            @inputResult="checkInputState(arguments,'pwd1')"
            @submitInfo="submitInfo"
            placeholder="输入新密码"
            width="100%"
            name="pw"
            type="password"
        >
        </chuangkitInput>
        <chuangkitInput
            @inputResult="checkInputState(arguments,'pwd2')"
            @inputAnotherValue="inputAnotherValue"
            @submitInfo="submitInfo"
            placeholder="确认新密码"
            width="100%"
            name="pw"
            type="password"
        >
        </chuangkitInput>
      </div>
      <div class="next-step-button" :class="rePwBtnActive" @click="showRePwSuccess">
        <button>下一步</button>
      </div>
    </div>
    <!--重置密码成功-->
    <div class="re-pw-success" v-if="rePwSucPageDisplay">
      <div class="sprite success-img"></div>
      <div class="success-txt">修改密码成功</div>
      <div class="to-sign-in-button">
        <button>
          <router-link to="/signin">立即登录</router-link>
        </button>
      </div>
    </div>
    <ckt-footer></ckt-footer>
  </div>
</template>

<script>
  import chuangkitInput from 'components/input/input.vue'

  export default {
    data() {
      return {
        mailRePwPageDisplay: true,
        rePwSucPageDisplay: false,
        rePwBtnActive: {
          rePwBtnActived: false
        },
        canClickNextButton: true // 初始时允许点击下一步按钮
      }
    },
    beforeMount() {
      this.token = this.$route.query.token ? this.$route.query.token : false;
      if (!this.token) {
        this.$emit('promptShow', {'promptText': '非法请求', 'promptKind': 'error'});
        this.$router.push('/signin');
      }
    },
    methods: {
      submitInfo() {
        this.showRePwSuccess();
      },
      showRePwSuccess() {
        if (this.rePwBtnActive.rePwBtnActived && this.token) {
          if (!this.canClickNextButton) return; // 按钮禁用则不执行下方代码
          this.canClickNextButton = false; // 禁用按钮
          this.$http.post('/user/resetPwd', {password: this.secPwd, token: this.token}).then(response => {
            this.canClickNextButton = true; // 请求成功则启用按钮
            let result = response.body[0].code;
            switch (result) {
              case 0:
                this.$emit('promptShow', {'promptText': '验证token失败', 'promptKind': 'error'});
                break;
              case -1:
                this.$emit('promptShow', {'promptText': '密码不符合规则', 'promptKind': 'error'});
                break;
              case -11:
                this.$emit('promptShow', {'promptText': '重置密码失败', 'promptKind': 'error'});
                break;
              case 1:
                this.$emit('promptShow', {'promptText': '重置密码成功', 'promptKind': 'success'});
                this.rePwSucPageDisplay = true;
                this.telRePwPageDisplay = false;
                break;
            }
          }, response => {
            console.log('error');
          });
        }
      },
      inputValue(val) {
        if (val) {
          this.firstPwd = val;
          this.uniPwd = false;
          this.uniPwd = this.firstPwd === this.secPwd ? true : false;
          this.inputState();
        }
      },
      inputAnotherValue(val) {
        if (val) {
          this.secPwd = val;
          this.uniPwd = false;
          this.uniPwd = this.firstPwd === this.secPwd ? true : false;
          this.inputState();
        }
      },
      checkInputState(result, val) {
        let state = result[0];

        switch (val) {
          case 'pwd1':
            this.pwd1 = state == "success" ? true : false;
            break;
          case 'pwd2':
            this.pwd2 = state == "success" ? true : false;
            break;
        }

        this.inputState();
      },
      inputState() {
        if (this.pwd1 && this.pwd2) { // 两个密码不为空
          this.rePwBtnActive.rePwBtnActived = this.uniPwd; // this.uniPwd 当且仅当两个密码一致时为 true
        } else {
          this.rePwBtnActive.rePwBtnActived = false;
        }
      },
    },
    components: {chuangkitInput}
  }
</script>

<style lang="less" scoped>
  .mail-re-pw-page,
  .re-pw-success {
    width: 550px;
    height: 540px;
    background-color: white;
    margin: 64px auto 0;
    border-radius: 3px;
    -webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12);
    -moz-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12);
    padding-top: 46px;
  }

  .header {
    margin: 10px 227px 73px;
    font-size: 24px;
    color: #626262;
  }

  .input {
  }

  .next-step-button {
    button {
      width: 350px;
      height: 32px;
      font-size: 14px;
      color: #cdcdcd;
      background-color: #f3f3f3;
      border: 1px solid #e8e8e8;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .rePwBtnActived {
    button {
      width: 350px;
      height: 32px;
      font-size: 14px;
      color: #FFFFFF;
      background-color: #07AEFC;
      border: none;
      &:hover {
        cursor: pointer;
      }
    }
  }

  .next-step-button {
    margin: 8px 0 16px 100px;
  }

  .sprite {
    display: inline-block;
    background: url("./sprite.svg");
  }

  .re-pw-success {
    text-align: center;
    .success-img {
      width: 104px;
      height: 104px;
      background-position: -13px -114px;
      margin-top: 44px;
      margin-bottom: 32px;
    }
    .success-txt {
      line-height: 24px;
      color: #626262;
      font-size: 14px;
      margin-bottom: 32px;
    }
    .to-sign-in-button {
      button {
        width: 200px;
        height: 32px;
        font-size: 14px;
        color: #FFFFFF;
        background-color: #07AEFC;
        border: none;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
</style>