
<template>
  <ul class="text-operation">
    <li class="color-choose" ref="color" @click="setColorBoard">
      <span :style="{background: json.color}"></span>
    </li>
    <li class="font-family-choose">
      <div class="font-family-wrap" :style="activeFontStyle" @click="setChildShow(1)"></div>
      <span class="change-family">
        <i class="number-up resize-btn" @click="btnChangeFontFamily(-1)"></i>
        <i class="number-down resize-btn" @click="btnChangeFontFamily(1)"></i>
      </span>
      <div class="family-child" v-show="childShow === 1" @mousewheel.stop>
        <div class = "top-tools-warp">
          <div class="history-list-warp" v-show="historyList.length > 0"><span>历史</span>
            <span class="history-operation" @click="toggleHistory"
                  :class="{'open': fontHistoryShow, 'close': !fontHistoryShow}">{{getHistoryText()}}
                </span>
          </div>
          <ul class="family-history" v-show="fontHistoryShow">
            <li class="font-item" :key="key" v-for="(f,key) in historyList" @click="chooseFont(f.fontFamily, f.fontNeedsVip)">
              <div :style="getFontListStyle(f.fontImgIndex)"></div>
              <span class="need-vip" v-show="f.fontNeedsVip"></span>
            </li>
          </ul>
          <span class="font-type-title">{{textHeader}}</span>
          <span class="return-top" @click="scrollTop">回顶部</span>
        </div>
        <ul class="family-list" @scroll="scrollMethod">
          <li  :key="key" v-for="(f,key) in fontList">
            <ul>
              <li class="font-item-title">{{f.kindName}}</li>
              <li class="font-item"   :key="key" v-for="(ff,key) in f.fonts" v-if="!ff.fontIsExpired" @click="chooseFont(ff.fontFamily, ff.fontNeedsVip)">
                <div :style="getFontListStyle(ff.fontImgIndex)"></div>
                <span class="need-vip" v-show="ff.fontNeedsVip"></span></li>
            </ul>
          </li>
        </ul>
      </div>
    </li>
    <li class="font-size-choose">
      <input type="text" @keydown.stop v-model="size" @keyup.enter="commitSize(size, true)" @click="setChildShow(2)">
      <span class="change-size">
        <i class="number-up resize-btn" @click="commitSize(size+1, true)"></i>
        <i class="number-down resize-btn" @click="commitSize(size-1, true)"></i>
      </span>
      <div class="size-child" v-show="childShow === 2" @click.stop @mouseleave="resetFontSize">
        <ul class="list" @mousewheel.stop="" ref='sizechild' >
          <li v-for="i in 1022" @click="commitSize(i+2, true)" @mouseover="commitSize(i+2)">{{ i + 2 }}</li>
        </ul>
      </div>
    </li>
    <li class="font-i-choose" :class="{active: json.italic}" @click="commitItalic" data-text="斜体">
      <span class="icon"></span>
    </li>
    <li class="font-u-choose" :class="{active: json.underline}" @click="commitUnderline" data-text="下划线">
      <span class="icon"></span>
    </li>
    <li class="font-b-choose" :class="{active: json.bold}" data-text="加粗" @click="setChildShow(3)">
      <span class="icon"></span>
      <div class="bold-slider" v-show="childShow === 3" @click.stop="">
        <slider label="加粗" :minValue="0" :maxValue="100" @inputEnter="setChildShow(3)" :initValue="json.bold" @upChange="commitBold"></slider>
      </div>
    </li>
    <li class="font-more-choose" @click="setChildShow(6)">
      <span class="icon"></span>
      <ul class="font-more-child" v-show="childShow === 6" @click.stop>
        <li class="b-choose" @click="setChildShow(3)"><i></i>加粗</li>
        <li class="u-choose" @click="commitUnderline"><i></i>下划线</li>
        <li class="i-choose" @click="commitItalic"><i></i>斜体</li>
      </ul>
      <div class="bold-slider" v-show="childShow === 3" @click.stop="">
        <slider label="加粗" 
                :minValue="0" 
                :maxValue="100"
                :show="childShow === 3"
                :initValue="json.bold" 
                @upChange="commitBold"></slider>
      </div>
    </li>
    <li class="part-line">
      <span></span>
    </li>
    <li class="font-a-choose" data-text="对齐" @click="setChildShow(4)">
      <span class="icon" :class="json.align"></span>
      <ul class="align-check" v-show="childShow === 4" @click.stop="">
        <li v-for="(a, index) in alignCheck"
            :class="['check-'+a, {active: json.align == a}]"
            @click.stop="commitAlign(a)"
            :key="index">
          <span></span>
        </li>
      </ul>
    </li>
    <li class="font-s-choose" data-text="间距" @click="setChildShow(5)">
      <span class="icon"></span>
      <div class="space-slider" v-show="childShow === 5" @click.stop="">
        <slider label="字间距" 
                :minValue="-400" 
                :maxValue="1600" 
                :initValue="json.wspace"
                :show="childShow === 5"
                @inputEnter="setChildShow(5)" 
                @valueChange="setWSpace"
                @sliderBegin="setTextEdit(true)"
                @upChange="commitWSpace"></slider>
        <slider label="行间距" 
                :minValue="-400" 
                :maxValue="1600"
                :show="childShow === 5" 
                :initValue="json.vspace" 
                @inputEnter="setChildShow(5)" 
                @valueChange="setVSpace" 
                @sliderBegin="setTextEdit(true)"
                @upChange="commitVSpace"></slider>
      </div>
    </li>
  </ul>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import slider from 'components/slider/slider.vue';
  import textBus from 'dataBus/text.js';
  import toolsBarBus from 'dataBus/toolsBar.js';
  import editorBus from 'dataBus/editor.js';
  import designBus from 'dataBus/design.js';
  import eleBus from 'dataBus/element.js';
  import dataHandle from 'common/dataHandle.js';
  export default {
    name: 'textTools',
    props: {
      json: {
        type: Object
      },
      colorBoardShow: {
        type: Boolean
      }
    },
    data () {
      return {
        childShow: 0,  // 1选字体，2选字号，3加粗，4对齐，5间距
        alignCheck: ['left', 'center', 'right'],
        size: 0,
        fontList: null,
        fontUrl: '',
        fontHistoryShow: false,
        historyList: [],
        textHeader: '免费字体（可商用）',
        activeFamilyIndex: 0,
        initSize: 0,
        initVSpace: 0,
        initWSpace: 0,
        sizeSure: false,
        initPage: 0,
        initElem: 0,
        initHeight: 0
      }
    },
    computed: {
      ...mapGetters({
        toolsBarShow: 'getToolsBarShow',
        toolsBarType: 'getToolsBarType',
        focusPageIndex: 'getFocusPageIndex',
        focusElemIndex: 'getFocusElemIndex',
        pageScale: 'getPageScale',
        isVip: 'getIsVip',
        isLogin: 'getIsLogin',
        textInfo: 'getElementData',
        closeChild: 'getToolsBarCloseChild',
        designUnit: 'getDesignUnit',
        textValue: 'getTextareaValue'
      }),
      activeFontStyle() {
        return {
          background: `url(${this.fontUrl}) no-repeat`,
          'background-position': `0 ${-this.activeFamilyIndex * 17}px`
        }
      }
    },
    components: { slider },
    watch: {
      toolsBarShow(v) {
        if(!v) {
          this.childShow = 0;
        } else {
          this.initPage = this.focusPageIndex;
          this.initElem = this.focusElemIndex;
        }
      },
      focusElemIndex (v) {
        if(this.toolsBarType === 'text') {
          this.size = Math.round(this.json.size);
          this.fontList = designBus.getFontList();
          this.fontUrl = designBus.getFontBackUrl();
          this.getActiveFamilyImgIndex(this.json.family);
        }
      },
      json: {
        handler(v) {
          this.size = Math.round(v.size);
          this.fontList = designBus.getFontList();
          this.fontUrl = designBus.getFontBackUrl();
          this.getActiveFamilyImgIndex(v.family);
        },
        deep: true
      },
      size(v) {
        this.size = parseInt(v) || 3;
      },
      closeChild() {
        this.childShow = 0;
      },
      childShow(v, ov) {
        if(v === 2) {
          this.initSize = this.size;
          this.initHeight = eleBus.getHeight();
        }
        if( v === 5) {
          this.initWSpace = this.json.wspace;
          this.initVSpace = this.json.vspace;
        }
        // if(v !== ov) {
        //   if(ov === 2 && !this.sizeSure) {
        //     let height = this.calcTextHeight(Object.assign(this.json, { size: this.initSize }));
        //     eleBus.setHeight(height, this.initPage, this.initElem);
        //     eleBus.setFontSize(this.initSize, this.initPage, this.initElem);
        //   }
        // }
      }
    },
    methods: {
      ...mapActions({
        setColorPickerShow: 'setColorPickerShow',
        setTextEdit: 'setTextEdit',
        setErrorShow: 'setErrorShow',
        setLogregShow: 'setLogregShow'
      }),
      scrollTop(){
        let list = this.$el.querySelector('.family-list');

        if(list){
          let scrollT = list.scrollTop;
          let timer = setInterval(function(){
            //获取滚动条距离顶部高度
            var ispeed = Math.floor(-scrollT / 8);
            list.scrollTop = scrollT = scrollT+ispeed;
            //到达顶部，清除定时器
            if (scrollT == 0) {
              clearInterval(timer);
            };
          },30);
        }

      },
      toggleHistory(){
        this.fontHistoryShow = !this.fontHistoryShow;
      },
      scrollMethod(event){
        let target = event.target;
        let items = target.querySelectorAll('.font-item-title');
        let scrollTop =target.scrollTop;
        let texth ='免费字体（可商用）';
        for(let i in items){

          if(scrollTop-items[i].offsetTop>=0){
            texth =  items[i].innerHTML;
          }
        }
        this.textHeader = texth ;
      },
      getActiveFamilyImgIndex(name) {
        for(let i=0,l=this.fontList.length; i<l; i++) {
          let fonts = this.fontList[i].fonts;
          let result = fonts.find(item => item.fontFamily === name);
          if(result){
            this.activeFamilyIndex = result.fontImgIndex;
            return;
          }
        }
        this.activeFamilyIndex = 0;
      },
      getFontJson(name) {
        for(let i=0,l=this.fontList.length; i<l; i++) {
          let fonts = this.fontList[i].fonts;
          let result = fonts.find(item => item.fontFamily === name);
          if(result !== -1){
            return result;
          }
        }
      },
      setChildShow(index) {
        this.$emit('setColorBoard', {
          show: false
        })

        this.childShow = this.childShow === index ? 0 : index;

        if(index === 1) {

          if(this.childShow) {
            this.setTextEdit(false);
            let sStorage = window.sessionStorage;
            this.historyList = sStorage.historyList ? JSON.parse(sStorage.historyList) : [];
            if(this.historyList.length==0){
              this.fontHistoryShow = false;
            }
          }
          else {
            window.sessionStorage.historyList = JSON.stringify(this.historyList);
          }
          return ;
        }

        if(this.childShow === 2) {

          this.$nextTick(() => {
            let t;
            if(this.size > 1012) {
              t = 30 * 1009;
            }
            else {
              t = 30 * (this.size - 3);
            }
            this.$refs.sizechild.scrollTop = t;
          })
          return ;
        }

        if(this.childShow === 3) {
          this.setTextEdit(false);
          return ;
        }

        if(index === 5) {
          if(this.childShow === 0) {
            this.setTextEdit(false);
          }
          else {
            this.setTextEdit(true);
          }
        }
      },
      commitSize(v, flag) {
        this.setTextEdit(true);
        this.sizeSure = false;
        if(v < 3) {
          v = 3;
        }
        else if(v > 1024) {
          v = 1024;
        }

        if(this.designUnit !== 'px') {
          v = v / 72 * 300;
        }

        let changeHeightTextarea = document.getElementById('changeHeightTextarea'),
            info = this.textInfo;

        changeHeightTextarea.style.fontSize = v * this.pageScale + 'px';
        let sizeScale = 1;
        if(v * this.pageScale < 12) {
          sizeScale = 12 / (v * this.pageScale);
          changeHeightTextarea.style.fontSize = '12px';
        }

        changeHeightTextarea.style.width = info.width * sizeScale + 'px';
        changeHeightTextarea.style.textAlign = info.align;
        changeHeightTextarea.style.letterSpacing = info.wspace / 1000 + 'em';
        changeHeightTextarea.value = info.text;

        // if(this.groupFlag) {
        //   eleBus.setHeight(changeHeightTextarea.scrollHeight / this.pageScale);
        //   editorBus.setElementData();
        //   return ;
        // }
        eleBus.setHeight(changeHeightTextarea.scrollHeight / this.pageScale / sizeScale);
        if(flag) {
          this.childShow = 0;
          this.sizeSure = true;
          textBus.setFontSize(v);
          editorBus.dispatchCommit({
            'font-size': v,
            'height': changeHeightTextarea.scrollHeight / this.pageScale / sizeScale
          }).push();
        }
        else {
          eleBus.setFontSize(v);
        }

        // this.setTextEdit(false);
        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        editorBus.setElementData();
      },
      commitItalic() {
        this.childShow = 0;
        this.setTextEdit(false);
        textBus.setFontItalic( !this.json.italic );

        editorBus.dispatchCommit({
          'data-italic': !this.json.italic
        }).push();

        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        editorBus.setElementData();
      },
      commitUnderline() {
        this.childShow = 0;
        this.setTextEdit(false);
        textBus.setFontDecoration( !this.json.underline );

        editorBus.dispatchCommit({
          'data-decoration': !this.json.underline
        }).push();

        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        editorBus.setElementData();
      },
      commitBold(v) {
        textBus.setFontBold(v / 100);

        editorBus.dispatchCommit({
          'data-bold': v / 100
        }).push();

        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        editorBus.setElementData();
      },
      commitAlign(align) {
        this.childShow = 0;
        this.setTextEdit(false);
        textBus.setFontAlign(align);

        editorBus.dispatchCommit({
          'data-align': align
        }).push();

        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        editorBus.setElementData();
      },
      commitWSpace(v) {
        this.setTextEdit(false);
        textBus.setTextWspace(v);

        editorBus.dispatchCommit({
          'wspace': v,
          'height': eleBus.getHeight()
        }).push();

        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        editorBus.setElementData();
      },
      setWSpace(v) {
        let height = this.calcTextHeight(Object.assign(this.textInfo, { wspace: v }));
        eleBus.setHeight(height);
        textBus.setFontWspace(v);
        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        editorBus.setElementData();
      },
      commitVSpace(v) {
        this.setTextEdit(false);
        textBus.setTextVspace(v);
        
        editorBus.dispatchCommit({
          'vspace': v,
          'height': eleBus.getHeight()
        }).push();

        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        editorBus.setElementData();
      },
      setVSpace(v) {
        let height = this.calcTextHeight(Object.assign(this.textInfo, { vspace: v }));
        eleBus.setHeight(height);
        textBus.setFontVspace(v);
        toolsBarBus.setToolsBarState();
        editorBus.setEditorState();
        editorBus.setElementData();
      },
      setColorBoard() {
        this.childShow = 0;
        this.setTextEdit(false);
        this.setColorPickerShow({
          isShow: false
        });
        if (this.colorBoardShow) {
          this.$emit('setColorBoard', {
            show: false
          })
        } else {
          let dom = this.$refs.color;
          this.$emit('setColorBoard', {
            show: true,
            left: dom.offsetLeft - 10,
            color: this.json.color
          })
        }

      },
      getHistoryText() {
        if(this.fontHistoryShow) {
          return '收起';
        } else {
          return '展开';
        }
      },
      getFontListStyle(index) {
        return  {
          background: `url(${this.fontUrl}) no-repeat 0 ${-index * 17}px`
        }
      },
      chooseFont(ff, needVip) {
        if(needVip) {
          if(!this.isLogin) {
            this.setLogregShow(1);
            return;
          }
          if(this.isVip !== 2) {
            this.setErrorShow(4);
            return ;
          }
        }
        textBus.setFontFamily(ff);
        editorBus.setElementData();
        this.childShow = 0;
        this.getActiveFamilyImgIndex(ff);

        editorBus.dispatchCommit({
          'font-family': ff
        }).push();

        if(ff !== this.json.family) {
          let r = this.getFontJson(ff);
          if(r) {
            let canPush = true;
            this.historyList.forEach(function(element) {
              if(element.fontImgIndex == r.fontImgIndex){
                canPush = false;
              }
            }, this);
            if(canPush){
              this.historyList.unshift(r);
              if(this.historyList.length > 3) {
                this.historyList.pop();
              }
            }
            this.fontHistoryShow = true;
            window.sessionStorage.historyList = JSON.stringify(this.historyList);
          }
        }
      },
      //上下切换字体 type
      btnChangeFontFamily(type) {
        let lIndex, fIndex;
        for(let i=0,l=this.fontList.length; i < l; i++) {
          let fonts = this.fontList[i].fonts;
          let result = fonts.find(item => item.fontImgIndex === this.activeFamilyIndex);
          if(result) {
            lIndex = i;
            fIndex = fonts.indexOf(result);
            break;
          }
        }
        fIndex = fIndex + type;
        if(fIndex < 0) {
          lIndex -- ;
          if(lIndex < 0) {
            lIndex = this.fontList.length - 1;
          }
          fIndex = this.fontList[lIndex].fonts.length - 1;
        }
        else if(fIndex === this.fontList[lIndex].fonts.length) {
          lIndex ++;
          if(lIndex === this.fontList.length) {
            lIndex = 0;
          }
          fIndex = 0;
        }
        let font = this.fontList[lIndex].fonts[fIndex];
        this.chooseFont(font.fontFamily, font.fontNeedsVip)
      },
      calcTextHeight(info) {
        let changeHeightTextarea = document.getElementById('changeHeightTextarea');

        changeHeightTextarea.style.fontSize = parseFloat(info.size) * this.pageScale + 'px';
        let sizeScale = 1;
        if(info.size * this.pageScale < 12) {
          sizeScale = 12 / (info.size * this.pageScale);
          changeHeightTextarea.style.fontSize = '12px';
        }
        changeHeightTextarea.style.width = parseFloat(info.width) * sizeScale + 'px';
        changeHeightTextarea.style.textAlign = info.align;
        changeHeightTextarea.style.letterSpacing = parseFloat(info.wspace) / 1000 + 'em';
        changeHeightTextarea.style.lineHeight = 1 + parseFloat(info.vspace) / 1000;
        changeHeightTextarea.value = this.textValue;
        return changeHeightTextarea.scrollHeight / this.pageScale / sizeScale;
      },
      resetFontSize() {
        if(!this.sizeSure) {
          let size = this.initSize;
          this.size = size;
          let size_new = size;
          if(this.designUnit !== 'px') {
            size_new = size * 300 / 72;
          }
          let height = this.initHeight;
          eleBus.setHeight(height, this.focusPageIndex, this.focusElemIndex);
          eleBus.setFontSize(size_new, this.focusPageIndex, this.focusElemIndex);
          editorBus.setEditorState();
        }
      }
    },
    created() {
      this.fontList = designBus.getFontList();
    },
    filters: {
      numberToInt(v) {
        return Math.round(v);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import './textTools.less';
</style>

