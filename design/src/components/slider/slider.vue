
<template>
  <div class="slider">
    <label class="slider-label">{{label}}</label>
    <div class="slider-area" ref="back">
      <div class="slider-back" @click="sliderClick($event)"></div>
      <div class="slider-block" :style="blockStyle" :data-value="value" @mousedown="blockMouseDown"></div>
    </div>
    <input class="slider-input"
           type="text"
           v-model="inputValue"
           @keydown.stop
           @keyup.enter="inputEnter"
           @input="changeFlag=true"
    >
  </div>
</template>

<script>
  export default {
    props: {
      label: {
        type: String,
        default: 'slider'
      },
      minValue: {
        type: Number,
        default: -10,
      },
      maxValue: {
        type: Number,
        default: 100,
      },
      initValue:{
        type: Number
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        left: 0,
        width: 160,
        value: 0,
        inputValue: 0
      }
    },
    computed: {
      range () {
        return this.maxValue - this.minValue;
      },
      blockStyle () {
        return {
          left: (this.value - this.minValue) / this.range * (this.width-10) + 'px'
        };
      }
    },
    watch: {
      inputValue(v) {
        if(v === '' || v === '-' || v === this.value || isNaN(v)){
          return;
        } else {
          this.inputValue = parseInt(v) || 0;
        }
        if(this.inputValue < this.minValue){
          this.value = this.minValue;
        } else if(this.inputValue > this.maxValue){
          this.inputValue = this.maxValue;
        } else{
          this.value = this.inputValue;
        }
        if(this.show)
          this.handleComplete();
      },
      initValue(v) {
        this.value = Math.round(v);
        this.inputValue = this.value;
      }
    },
    methods: {
      handleComplete() {
        this.$emit('upChange', this.value);
        this.$emit('valueChange', this.value);
      },
      inputEnter() {
        this.$emit('inputEnter');
      },
      blockMouseDown () {

        let me = this;
        let rect = this.$refs.back.getBoundingClientRect();
        this.left = rect.left;
        this.width = rect.width;
        this.$emit('sliderBegin');

        window.addEventListener('mousemove', blockMouseMove);
        window.addEventListener('mouseup', blockMouseUp);

        function blockMouseMove(event) {
          let e = event || window.event,
            dis = event.clientX - me.left;

          if(dis < 0) {
            me.value = me.minValue;
          }else if(dis > me.width){
            me.value = me.maxValue;
          } else{
            me.value = Math.round((dis / me.width) * me.range + me.minValue);
          }
          me.inputValue = me.value;
          me.$emit('valueChange', me.value);
        }

        function blockMouseUp() {
          me.$emit('upChange', me.value);
          window.removeEventListener('mousemove', blockMouseMove);
          window.removeEventListener('mouseup', blockMouseUp);
          me = null;
        }
      },
      sliderClick(event) {

        let value = event.offsetX + event.target.offsetWidth;

        if(value > 160) {
          value = 160;
        }
        if(value < 0) {
          value = 0;
        }

        this.value = Math.round(value / 160 * this.range + this.minValue);
        this.$emit('valueChange', this.value);
        this .$emit('upChange', this.value);
      }
    }
  }
</script>

<style lang="less" scoped>
  .slider{
    position: relative;
    width: 300px;
    height: 40px;
    background: #fff;
    z-index: 1;
    cursor: default;
    &:after{
      content: "";
      display: table;
      clear: both;
    }
  }
  .slider-label{
    position: absolute;
    left: 16px;
    line-height: 40px;
  }
  .slider-area{
    position: absolute;
    left: 67px;
    width: 160px;
    height: 40px;
    .slider-back{
      position: absolute;
      top: 22px;
      width: 0;
      height: 0;
      border-left: 160px solid transparent;
      border-bottom: 5px solid #515151;
      cursor: pointer;
      &:before{
        content: "";
        position: absolute;
        left: -160px;
        top: -7px;
        height: 16px;
        width: 160px;
      }
    }
    .slider-block{
      position: absolute;
      top: 18px;
      left: 72px;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background-color: #515151;
      cursor: pointer;
      &:before{
        position: absolute;
        left: -11px;
        bottom: 11px;
        content: attr(data-value);
        width: 24px;
        text-align: center;
        font-size: 14px;
      }
    }
  }
  .slider-input{
    position: absolute;
    top: 5px;
    right: 10px;
    width: 50px;
    height: 30px;
    padding-left: 10px;
    border: 1px solid #E6E6E6;
    background-color: #F4F4F4;
  }
</style>