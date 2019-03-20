<template>
  <div class="resize-tool" v-show="show">
    <div class="resize-group">
      <span class="text">宽度</span>
      <input type="text" class="input" 
            :value="this.width | numberToInt" 
            @keydown.stop="keyDownToChange($event, 1);" 
            @keyup.enter="sure" @input="setWidth($event)"
            >
      <div class="change-wrap">
        <i @click="increaseWidth" class="increase"></i>
        <i @click="reduceWidth" class="reduce"></i>
      </div>
    </div>
    <div class="resize-group">
      <span class="text">高度</span>
      <input type="text" class="input" :value="this.height | numberToInt" @keydown.stop="keyDownToChange($event, 2)" @keyup.enter="sure" @input="setHeight($event)">
      <div class="change-wrap">
        <i @click="increaseHeight" class="increase"></i>
        <i @click="reduceHeight" class="reduce"></i>
      </div>
    </div>
    <button class="submit" @click="sure">确定</button>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import eleEvent from 'dataBus/element.js';
  import editorBus from 'dataBus/editor.js';
  import toolsBarBus from 'dataBus/toolsBar.js'
  import dataHandle from 'common/dataHandle.js'
  export default {
    name: 'resizeTool',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      width:{
        type: Number
      },
      height: {
        type: Number
      }
    },
    data () {
      return {
        initWidth: 0,
        initHeight: 0,
        initElemIndex: 0,
        initPageIndex: 0,
        lastWidth: 0,
        lastHeight: 0
      }
    },
    computed: {
      ...mapGetters({
        focusElemIndex: 'getFocusElemIndex',
        focusPageIndex: 'getFocusPageIndex',
        resizeFlag: 'getResizeFlag',
        eleType: 'getFocusElemType'
      })
    },
    watch: {
      show(v) {
        if(v){
          this.setResizeFlag(false);
          this.initWidth = this.width;
          this.initHeight = this.height;
          this.initElemIndex = this.focusElemIndex;
          this.initPageIndex = this.focusPageIndex;
        } else {

          let width = this.width,
              height = this.height;
              
          if(!this.resizeFlag){
            if(width !== this.initWidth){
              this.dispatchChange(this.initWidth, height, 1);
            }
            if(height !== this.initHeight){
              this.dispatchChange(this.initWidth, this.initHeight, 2);
            }
          }
        }
      }
    },
    methods: {
      ...mapActions({
        setResizeFlag: 'setResizeFlag',
        setResizeToolShow: 'setResizeToolShow'
      }),
      reduceWidth () {
        let value = (this.width - 1) | 0;
        this.dispatchChange(value, this.height, 1);
      },
      reduceHeight () {
        let value = (this.height - 1) | 0;
        this.dispatchChange(this.width, value, 2);
      },
      increaseWidth () {
        let value = (this.width + 1) | 0;
        this.dispatchChange(value, this.height, 1);
      },
      increaseHeight () {
        let value = (this.height + 1) | 0;
        this.dispatchChange(this.width, value, 2);
      },
      setWidth(event) {
        if(!this.show) {
          return;
        }
        let value = event.target.value;

        value = parseInt(value) || 1;
        if(value > 5000) {
          value = 5000;
        }

        this.dispatchChange(value, this.height, 1);
      },
      setHeight(event) {
        if(!this.show) {
          return;
        }
        let value = event.target.value;

        value = parseInt(value) || 1;
        if(value > 5000) {
          value = 5000;
        }

        this.dispatchChange(this.width, value, 2);
      },
      dispatchChange(width, height, type) {
        eleEvent.changeFocusElemSize({width, height, type}, this.initPageIndex, this.initElemIndex);
        if(this.focusElemIndex > -1){
          editorBus.setEditorState();
          toolsBarBus.setToolsBarState();
          this.$forceUpdate();
        }
      },
      keyDownToChange(event, type) {
        let code = event.keyCode;
        if(code !== 38 && code !== 40){
          return;
        }
        if(code === 38) {
          if(type === 1){
            this.increaseWidth();
          } else {
            this.increaseHeight()
          }
        }
        else{
          if(type === 1){
            this.reduceWidth();
          } else {
            this.reduceHeight()
          }
        }
      },
      sure() {
        eleEvent.dispatchCommit({
          type: 1,
          pageIndex: this.focusPageIndex,
          eleIndex: this.focusElemIndex
        }).push();

        this.setResizeFlag(true);
        this.setResizeToolShow(false);
      }
    },
    filters: {
      numberToInt(v) {
        return Math.round(v);
      }
    }
  }
</script>

<style lang="less" scoped>
  .resize-tool{
    position: absolute;
    z-index: 10000;
    line-height: normal;
    text-align: left;
    padding: 11px 15px;
    width: 200px;
    left: -15px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
    top: 48px;
    color: #515151;
    font-size: 13px;
  }
  .resize-group{
    line-height: 33px;
    position: relative;
    .input{
      width: 105px;
      height: 32px;
      line-height: 32px;
      margin-left: 14px;
      background-color: #fff;
      border: 0;
      vertical-align: top;
      font-size: 14px;
      color: #515151;
      padding-left: 4px;
      border: 1px solid #cdcdcd;
      margin-bottom: 10px;
      outline: none;
    }
    .change-wrap{
      position: absolute;
      top: 0;
      right: 0;
      i{
        &:hover{
          background-color: #e9e9e9;
        }
      }
    }
    .reduce{
      width: 22px;
      height: 16px;
      display: block;
      zoom: 1;
      background: url(./img/reduce.svg) 5px 4px no-repeat #ffffff;
      cursor: pointer;
      border: 1px solid #cdcdcd;
    }
    .increase{
      width: 22px;
      height: 16px;
      display: block;
      zoom: 1;
      background: url(./img/increase.svg) 5px 4px no-repeat #ffffff;
      cursor: pointer;
      border: 1px solid #cdcdcd;
    }
  }
  .submit{
    display: block;
    width: 170px;
    height: 32px;
    background-color: #18a3de;
    font-size: 14px;
    color: #fff;
    line-height: 32px;
    text-align: center;
    border-radius: 3px;
    border: none;
    outline: none;
    padding: 0;
    cursor: pointer;
    &:hover{
      background-color: #07aefc;
    }
  }
</style>

