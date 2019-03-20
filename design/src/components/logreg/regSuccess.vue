<template>
  <div class="content-middle">
    <div class="content-container">
      <div class="content-box">
        <!--注册成功页面-->
        <div class="sign-up-success">
          <div class="success-img"></div>
          <div class="txt">注册成功</div>
          <router-link to="/logreg" class="to-sign-in-button">立即体验</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="less" scoped>
  .content-container {
    width: 550px;
    height: 540px;
    position: relative;
    background-color: white;
    margin: 0 auto;
    border-radius: 3px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12);
    text-align: center;
    padding-top: 10%;
    .content-box {
      width: 350px;
      height: 100%;
      margin: 0 auto;
    }
  }

  .sign-up-success {
    text-align: center;
    .success-img {
      display: inline-block;
      background: url("./sprite.svg");
      background-position: -13px -114px;
      width: 104px;
      height: 104px;
      margin-top: 10%;
    }
    .txt {
      color: #626262;
      font-size: 14px;
      margin-top: 5%;
    }
    .to-sign-in-button {
      display: inline-block;
      width: 57%;
      height: 32px;
      margin-top: 10%;
      line-height: 32px;
      font-size: 14px;
      color: #FFFFFF;
      background-color: #07AEFC;
      border: none;
      &:hover {
        cursor: pointer;
      }
    }
  }
</style>