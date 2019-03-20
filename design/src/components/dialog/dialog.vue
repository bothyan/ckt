<template>
  <div class="dialog-box">
    <div class="dialog-title">{{getDialogTitle}}</div>
    <div class="dialog-content" v-html="getDialogContent"></div>
    <div class="buttons">
      <div class="cancel" @click="buttonClick(0)">
        {{getDialogBtnTexts[0]}}
      </div>
      <div class="ok" @click="buttonClick(1)">
        {{getDialogBtnTexts[1]}}
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'getDialogTitle',
        'getDialogContent',
        'getDialogBtnTexts',
        'getDialogFuncs'
      ])
    },
    methods: {
      ...mapActions({
        setDialogShow: 'setDialogShow'
      }),
      buttonClick(v) {
        if (v) { // 点击确定
          if (this.getDialogFuncs.confirm) {
            this.getDialogFuncs.confirm()
          }
        } else { // 点击取消
          if (this.getDialogFuncs.cancel) {
            this.getDialogFuncs.cancel()
          }
        }
        this.setDialogShow(false);
      }
    }
  }
</script>

<style lang="less" scoped>
  .dialog-box {
    position: relative;
    width: 640px;
    height: 294px;
    padding-top: 42px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, .16);
    .dialog-title {
      margin-bottom: 40px;
      color: #626262;
      font-size: 24px;
      text-align: center;
    }
    .dialog-content {
      width: 70%;
      margin: 0 auto;
      color: #626262;
      font-size: 14px;
      text-align: center;
    }
    .buttons {
      position: absolute;
      bottom: 58px;
      width: 100%;
      text-align: center;
      & > div {
        display: inline-block;
        width: 163px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        background-color: #fff;
        cursor: pointer;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .cancel {
        margin-right: 16px;
        color: #9B9B9B;
        border: #D8D8D8 solid 1px;
      }
      .ok {
        color: #fff;
        background-color: #07aefc;
        &:active {
          background-image: linear-gradient(90deg, #5ea2ff, #00e3ff) !important;
        }
        &:hover {
          opacity: .8;
        }
      }
    }
  }
</style>