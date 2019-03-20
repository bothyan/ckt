<template>
  <div class="tools-wrap">
    <div class="not-text" v-show="type != 'text'">
      <not-text-tool 
          :type="type"
          :isUpload="json.isUpload"
          :isBack="json.isBack"
          :hasImg="json.hasImg"
          :isCollection="json.isCollection"
          :isCut="json.isCut"
          :isPng="json.isPng"
          :colors="json.colors || []"
          :width="Number.parseFloat(json.width)"
          :height="Number.parseFloat(json.height)"
          :colorBoardShow="colorBoardShow"
          :lock="lock"
          @setColorBoard="setColorBoard"
      ></not-text-tool>
    </div>
    <div class="is-text" v-show="type == 'text'">
      <text-tools :json="json" 
                  :colorBoardShow="colorBoardShow"
                  @setColorBoard="setColorBoard"></text-tools>
    </div>
    <div class="color-board" v-if="colorBoardShow" :style="{left : colorBoardLeft + 'px'}">
      <color-board @selectColor="setColor" :defaultColor="pColor"></color-board>
    </div>
  </div>
</template>

<script>
  import colorBoard from './comp/colorBoard/colorBoard.vue';
  import notTextTool from './notTextTool.vue';
  import textTools from  './textTools.vue';
  import eleEvent from 'dataBus/element.js';
  import { mapGetters, mapActions } from 'vuex';
  import editorBus from 'dataBus/editor.js';
  import toolsBarBus from 'dataBus/toolsBar.js';
  import dataHandle from 'common/dataHandle.js';
  import textBus from 'dataBus/text.js';
  export default {
    name: 'leftToolsBar',
    props: {
      type: {
        type: String,
        required: true
      },
      json:{
        type: Object
      },
      lock: {
        type: Boolean
      }
    },
    data (){
      return {
        isBack: false,  //是否是背景
        resizeToolShow: false,   //尺寸板显示flag
        colorBoardShow: false,   //颜色板显示flag
        colorBoardLeft: 0,        //颜色板位置
        colorIndex: -1,           //当前操作颜色索引
        colorChange: false,       //颜色是否改
        initPageIndex: 0,
        initElemIndex:0,
        initColor: '',
        colorSureChange: false,   //颜色是否确定修改
        pColor: '',
        initType: ''
      }
    },
    computed: {
      ...mapGetters({
        focusElemIndex: 'getFocusElemIndex',
        focusPageIndex: 'getFocusPageIndex',
        closeChild: 'getToolsBarCloseChild',
        toolsBarShow: 'getToolsBarShow'
      })
    },
    components: { notTextTool, textTools, colorBoard },
    watch: {
      toolsBarInfo: {
        handler(v) {
          Object.assign(this, v);
        },
        deep: true
      },
      focusElemIndex() {
        this.colorBoardShow = false;
      },
      focusPageIndex() {
        this.colorBoardShow = false;
      },
      toolsBarShow(v) {
        if(!v) {
          this.colorBoardShow = false;
        }
      },
      colorBoardShow(v) {
        this.setColorBoardShow(v);
        if(v){
          this.initPageIndex = this.focusPageIndex;
          this.initElemIndex = this.focusElemIndex;
          if(this.type === "text") {
            this.initColor = this.json.color;
          }
          this.initType = this.type;
        } else {
          this.setColorPickerShow({
            isShow: false
          });
          if(this.colorChange && !this.colorSureChange){
            if(this.initType === 'text') {
              this.setHoverFontColor(this.initColor);
              textBus.setFontColor(this.initColor, this.initPageIndex, this.initElemIndex);
            } else if(this.initType === 'selects') {
              editorBus._resetInitColors(this.initColors);
            } else {
              eleEvent.setColor(`color-${this.colorIndex+1}`, this.initColor, this.initPageIndex, this.initElemIndex);
            }
          }

          this.colorIndex = -1;
          this.colorSureChange = false;
          this.colorChange = false;
        }
      },
      colorIndex(v) {
        this.initColor = this.json.colors[this.colorIndex];
      },
      closeChild() {
        this.colorBoardShow = false;
      }
    },
    methods: {
      ...mapActions({
        setColorPickerShow: 'setColorPickerShow',
        setHoverFontColor: 'setFontColor',
        setColorBoardShow: 'setColorBoardShow'
      }),
      setColorBoard(payload) {
        if(payload.show){
          this.colorBoardLeft = payload.left;
          this.pColor = payload.color;
          if(this.type !== 'text' && this.type !== 'selects') {
            this.initColor = payload.color;
            this.colorIndex = payload.index;
          }
          else if(this.type === 'selects') {
            this.pColor = "#000";
            this.initColors = editorBus._getInitColors();
          }
          this.colorBoardShow = true;
        } else {
          this.colorBoardShow = false;
        }
      },
      setColor(data) {
        if(!this.colorBoardShow) {
          return;
        }

        let colors;
        this.colorChange = true;
        if(this.type === 'text') {
          data.isClick ? textBus.setFontColor(data.color) : this.setHoverFontColor(data.color);
          if(data.isClick) {
            editorBus.setElementData();
          }
          colors = data.color;
        }
        else if(this.type === 'selects') {
          if(!data.isClick) {
            this.setHoverFontColor(data.color);
          }
          editorBus._setColors(data.color, data.isClick);
        }
        else {

         colors = eleEvent.setColor(`color-${this.colorIndex+1}`, data.color);
        }
          

        if(data.isClick){
          if(this.type == 'text') {
            dataHandle.commit('element',{
              pageIndex:this.focusPageIndex,
              eleIndex:this.focusElemIndex,
              key:'fill',
              value:colors,
              eventType:1
            });
          }
          else if(this.type === 'selects') {
            let arr = this.initColors;

            arr.forEach(item => {
              let elem = dataHandle.getEleJson(item.pageIndex, item.eleIndex);
              if(elem['data-type'] === 'text') {
                dataHandle.commit('element',{
                  pageIndex: item.pageIndex,
                  eleIndex: item.eleIndex,
                  key:'fill',
                  value: elem['data-elem'].fill,
                  eventType:1
                });
              }
              else {
                if(elem['data-elem']['data-colors']) {
                  dataHandle.commit('element',{
                    pageIndex: item.pageIndex,
                    eleIndex: item.eleIndex,
                    key:'data-colors',
                    value: JSON.parse(JSON.stringify(elem['data-elem']['data-colors'])),
                    eventType:1
                  });
                }
              }
            })
          }
          else {
             dataHandle.commit('element',{
              pageIndex:this.focusPageIndex,
              eleIndex:this.focusElemIndex,
              key:'data-colors',
              value:colors,
              eventType:1
            });
          }
          dataHandle.push();
          this.colorSureChange = true;
          this.colorBoardShow = false;
          if(this.type !== 'selects'){
            toolsBarBus.setToolsBarState();
          }
        }
      }
    },
    created () {
      Object.assign(this, this.toolsBarInfo);
    }
  }
</script>

<style lang="less" scoped>
  .color-board{
    position: absolute;
    top: 50px;
  }
</style>