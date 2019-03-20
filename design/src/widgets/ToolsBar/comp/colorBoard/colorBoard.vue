<template>
  <div class="color-board-colors" ref="color">
        <span
            class="color-board-colors-items add-color"
            @click="showColorPicker"
            title="取色器"
        ></span>
    <span
        class="color-board-colors-items hidden"
    ></span>
    <span
        class="color-board-colors-items"
        v-for="e in colors"
        :style="{background:e}"
        :title="e"
        @click="setFontColor(e, 1)"
        @mouseover="setFontColor(e)"
    ></span>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import colorPicker from 'components/colorPicker/colorPickerMain.vue'


  const defaultColors = [
    '#000000', '#242424', '#484848', '#6C6C6C', '#909090', '#B4B4B4', '#D8D8D8', '#FFFFFF',
    '#FF7768', '#FFEE00', '#DBFF58', '#A0FFB1', '#9FE0FF', '#8AAAE0', '#B39CFF', '#FFCED0',
    '#E60112', '#FFCD00', '#8CC319', '#09E51E', '#1CADBA', '#00A1EC', '#8957A1', '#FB9C9F',
    '#D6340D', '#F39800', '#4C8E00', '#009B00', '#00489E', '#0568B7', '#5F1985', '#E4004E',
    '#A40001', '#EC6100', '#475B00', '#015420', '#001C57', '#1F005D', '#510047', '#800043',
  ];

  export default {
    name: 'ColorBoard',
    data() {
      return {
        colors: []
      }
    },
    props: {
      defaultColor: {
        default: '#000'
      }
    },
    computed: {
      ...mapGetters({
        colorPickerIsShow: 'getColorPickerIsShow',
        colorPickerInvoke: 'getColorPickerInvoke',
        colorPickerColorData: 'getColorPickerColorData',
        colorPickerPosition: 'getColorPickerPosition',
        colorPickerColorStatus: 'getColorPickerColorStatus'
      })
    },
    watch: {
      colorPickerColorStatus(v) {
        if (v === 0 && this.colorPickerInvoke === 'fontColor') {
          let color = this.colorPickerColorData, colors = this.colors.slice(0, 6);
          this.setFontColor(color, 1);
          colors.unshift(color);
          colors.pop();
          this.colors = [...colors, ...defaultColors];
          window.localStorage.setItem('search_background_color', colors);
        }
      },
      colorPickerColorData(color) {
        this.setFontColor(color);
      }
    },
    methods: {
      ...mapActions({
        setColorPickerShow: 'setColorPickerShow'
      }),
      showColorPicker() {
        let rect = this.$refs.color.getBoundingClientRect();
        this.colorPickerIsShow || this.setColorPickerShow({
          isShow: true,
          DefaultColor: this.defaultColor,
          invoke: 'fontColor',
          position: {left: rect.left + rect.width + 'px', top: rect.top - 50 + 'px'}
        })
      },
      setFontColor(color, type) { // 点击时type存在
        let data = {
          color,
          isClick: !!type
        };
        this.$emit('selectColor', data);
      }
    },
    beforeMount() {
      let str = window.localStorage.getItem('search_background_color'),
          colors = [];
      str && (colors = str.split(','));
      for (let i = 0; i < 6; i++) {
        colors[i] ? '' : colors[i] = '#ffffff';
      }
      let arr = [...colors, ...defaultColors];
      this.colors = arr
    },
    components: {
      colorPicker
    }
  }
</script>

<style lang="less" scoped>
  .color-board-colors {
    display: inline-block;
    position: relative;
    width: 308px;
    height: 242px;
    padding-left: 16px;
    padding-top: 16px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);

    &:before {
      position: absolute;
      content: "";
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-bottom-color: #fff;
      top: -12px;
      left: 26px;
    }

    &:after {
      content: '';
      display: block;
      clear: both;
    }

    .color-board-colors-items {
      width: 27px;
      height: 27px;
      display: block;
      margin: 0 9px 10px 0;
      float: left;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .16);
      cursor: pointer;
      transition: all .1s ease;

      &[class~='add-color'] {
        background: url("./img/addcolor.png");
        background-size: 27px 27px;

        &:after {
          content: '';
          display: block;
          margin: 8px;
          width: 11px;
          height: 11px;
          background: url("./img/addcolor-+.svg") no-repeat;
        }
      }

      &[class~='hidden'] {
        visibility: hidden;
      }

      &:hover {
        transform: scale(1.2);
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .32);
      }

      &:nth-child(8n) {
        margin: 0 0 10px 0;
      }
    }
  }
</style>