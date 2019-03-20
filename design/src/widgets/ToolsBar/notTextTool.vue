<template>
  <div class="not-text-tool">
    <ul class="operation" v-if="type!=='selects'">
      <li v-for="o in operations" :key="o.index" :class="{'uneable-operation': !o.canUse, 'active': o.index===1&&filterShow}" @click="emitOperation(o.index)">
        <span>{{operTexts[o.index]}}</span>
      </li>
      <li class="color-bar" v-for="(c, index) in colors" :key="index" :ref="'color-bar-'+index" @click="setColorBoard(index)">
        <span :style="{background: c}"></span>
      </li>
    </ul>
    <ul class="operation" v-else-if="type === 'selects' && !groupFlag">
      <li @click="setGroup" v-show="!selectHaveGroup" class="bg-hover">
        <span>设置组合</span>
      </li>
      <li class="select-align" data-tip="对齐" @click="alignShow = !alignShow">
        <span></span>
        <ul class="align-child" v-show="alignShow" @click="setAlign($event)">
          <li v-for="(a, index) in aligns" :class="a.class" :key="index" :data-text="a.text"></li>
        </ul>
      </li>
      <li class="select-vertical" data-tip="分布" @click="distributionShow = !distributionShow">
        <span></span>
        <ul class="align-child" v-show="distributionShow" @click="setDistribution($event)">
          <li v-for="(d, index) in distribution" :class="d.class" :data-text="d.text" :key="index"></li>
        </ul>
      </li>
      <li v-show="selectCanChangeColor" class="select-color" ref="group-color" @click="setGroupColor">
        <span></span>
      </li>
    </ul>
    <ul class="operation" v-else-if="type === 'selects' && groupFlag">
      <li class="bg-hover" v-if="userInfo.isGm" @click="commitGroup">
        <span>提交素材</span></li>
      <li @click="splitGroup" class="bg-hover" :class="{'cant-use': lock}">
        <span>拆分组合</span>
      </li>
    </ul>
    <upload id="changeImageId" :multiple="false" @progress="uploadImageProgressCtrl" @uploadSuccess="uploadImageSuccess" @uploadStart="uploading=true"></upload>
    <resize-tool :width="width" :height="height" :show="resizeToolShow"></resize-tool>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import resizeTool from './resizeTool.vue';
import eleEvent from 'dataBus/element.js';
import userEvent from 'dataBus/user.js';
import editorBus from 'dataBus/editor.js';
import toolsBarBus from 'dataBus/toolsBar.js';
import leftPanelBus from 'dataBus/leftPanel.js';
import pageBus from 'dataBus/page.js';
import pageEvent from 'dataBus/pageEle';
import svgFrameBus from 'dataBus/svgFrame.js';
import upload from '../../layout/leftPanel/comp/upload/comp/uploadFunc.vue'
import dataHandle from 'common/dataHandle'
import { elementJsonHandle } from 'common/common.js'
import pagechange from '../../dataBus/page'
let { setElementJson,delElement } = pageEvent
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    isUpload: {
      type: Boolean,
      default: false
    },
    colors: {
      type: Array
    },
    isCollection: {
      type: Boolean
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    colorBoardShow: {
      type: Boolean
    },
    isCut: {
      type: Boolean
    },
    lock: {
      type: Boolean
    },
    hasImg: {
      type: Boolean
    },
    isPng: {
      type: Boolean
    }
  },
  data() {
    return {
      filterShow: false,
      colorBarIndex: -1,
      uploading: false,
      uploadProgress: 0,
      uploadBackgroundCtrl: false,
      operTexts: ['尺寸', '滤镜', '裁剪', '换图', '设为背景', '收藏到我的素材'],
      aligns: [{ class: 'left-align', text: '左边对齐' }, { class: 'standard-middle', text: '水平居中' },
      { class: 'right-align', text: '右边对齐' }, { class: 'vertical-middle', text: '垂直居中' },
      { class: 'top-align', text: ' 顶部对齐' }, { class: 'bottom-align', text: ' 底部对齐' }],
      distribution: [{ class: 'standard-auto', text: '水平分布' }, { class: 'vertical-auto', text: '垂直分布' }],
      alignShow: false,
      distributionShow: false,
      selectCanChangeColor: true
    }
  },
  components: { resizeTool, upload },
  computed: {
    ...mapGetters({
      toolsBarShow: 'getToolsBarShow',
      resizeToolShow: 'getResizeToolShow',
      focusElemIndex: 'getFocusElemIndex',
      focusPageIndex: 'getFocusPageIndex',
      focusElementJson: 'getFocusElemJson',
      pageWidth: 'getPageWidth',
      pageHeight: 'getPageHeight',
      isLogin: 'getIsLogin',
      groupFlag: 'getGroupFlag',
      groupId: 'getGroupId',
      selectHaveGroup: 'getSelectHaveGroup',
      userInfo: 'getUserInfo'
    }),
    operations() {
      if (this.type === 'background') {
        return [{ index: 1, canUse: true }];
      } 
      else if (this.type === 'img') {
        //是否为上传
        if(this.groupFlag) {
          return [{index: 1, canUse: true}];
        }
        else {
          let arr = [{index: 0, canUse: true}];
          if(!this.isPng) {
            arr.push({index: 1, canUse: true});
          }
          arr.push({index: 2, canUse: true});
          if(!this.isCut) {
            arr.push({index: 3, canUse: true});
          }
          if(!this.isPng && !this.isCut) {
            arr.push({index: 4, canUse: true});
          }
          if(!this.isUpload) {
            arr.push({index: 5, canUse: !this.isCollection});
          }
          return arr;
        }
      }
      else if (this.type === 'svgFrame') {
        if(this.groupFlag) {
          if(this.hasImg) {
            return [{ index: 1, canUse: true }, { index: 5, canUse: !this.isCollection }];
          }
          else {
            return [{ index: 5, canUse: !this.isCollection }]
          }
        }
        else {
          if(this.hasImg) {
            return [{ index: 0, canUse: true }, { index: 1, canUse: true }, { index: 2, canUse: true }, { index: 5, canUse: !this.isCollection }];
          }
          else {
            return [{ index: 0, canUse: true }, { index: 5, canUse: !this.isCollection }]
          }
        }
      }
      else if (this.type === 'svgChart') {
        return [];
      }
      else {
        if(this.groupFlag) {
          return [{ index: 5, canUse: !this.isCollection }]
        }
        return [{ index: 0, canUse: true }, { index: 5, canUse: !this.isCollection }]
      }
    },
    uploadStr() {
      return `正在生成 ${this.uploadProgress}%`
    }
  },
  watch: {
    toolsBarShow(v) {
      if (!v) {
        this.setResizeToolShow(false);
        this.filterShow = false;
        this.alignShow = false;
        this.distributionShow = false;
      }
      else {
        if(this.type === 'selects' && !this.groupFlag) {
          this.selectCanChangeColor = editorBus.selectCanChangeColor();
        }
      }
    },
    distributionShow(v) {
      if(v) {
        this.alignShow = false;
        this.$emit('setColorBoard', {
          show: false
        })
      }
    },
    alignShow(v) {
      if(v) {
        this.distributionShow = false;
        this.$emit('setColorBoard', {
          show: false
        })
      }
    },
    focusElemIndex() {
      this.setResizeToolShow(false);
    }
  },
  methods: {
    ...mapActions({
      setResizeToolShow: 'setResizeToolShow',
      setClipFlag: 'setClipFlag',
      logregShow:'setLogregShow',
      setToolsBarShow: 'setToolsBarShow',
      setGroupFlag: 'setGroupFlag',
      setMessageShow: 'setMessageShow'
    }),
    uploadImageSuccess({ dt, mid, w, h, fid, ik, url, id }) {

      this.uploading = false
      let ow = this.focusElementJson['data-elem']['width'];
      let oh = this.focusElementJson['data-elem']['height'];
      let nw;
      let nh;

      //ow oh 为被替换的图的宽高
      //w h 为替代品（上传素材）的宽高
      if (w > h) {
        var rate = w / ow;
        if (h / rate <= oh) {
          nw = ow;
          nh = h / rate;
        } else {
          var hrate = h / oh;
          nw = w / hrate;
          nh = oh;
        }
      } else {
        var hrate = h / oh;
        if (w / hrate < ow) {
          nw = w / hrate;
          nh = oh;
        } else {
          var wrate = w / ow;
          nw = ow;
          nh = h / wrate;
        }
      }
      let viewBox = [0,0,0,0]
      viewBox[2] = nw
      viewBox[3] = nh
      // console.info('原始高度：'+this.focusElementJson['data-elem']['height']+'-------'+'上传的高度：'+h+'-------'+'新的高度:'+nh)
      // console.info('原始viewBox:'+this.focusElementJson['data-elem']['viewBox']+'-------'+'新的viewBox:'+viewBox)
      //----------------------------------------------------------
      let data = {
        'data-type': 'img',
        'data-img-kind': dt,
        'transform': this.focusElementJson['transform'],
        'data-elem': {
          'id': mid,
          'width':  nw,
          'height': nh,
          'imgWidth':nw,
          'imgHeight':nh,
          'opacity': this.focusElementJson['data-elem']['opacity'],
          'viewBox':viewBox.join(" "),
          'filter':this.focusElementJson['data-elem']['filter'],
          'lock':this.focusElementJson['data-elem']['lock']
        }
      }
      setElementJson(elementJsonHandle(data), this.focusPageIndex, this.focusElemIndex)
      let tempData = JSON.parse(JSON.stringify(data));
      delete tempData.dataImgUrl;
      //触发保存操作
      dataHandle.commit('element',{
        pageIndex:this.focusPageIndex,
        key:this.focusElemIndex,
        value: tempData,
        eventType:1
      }).push()
    },
    uploadImageProgressCtrl({ progress, id }) {
      this.uploadProgress = progress
    },
    emitOperation(o) {
      //尺寸
      if (o === 0) {
        this.setResizeToolShow(!this.resizeToolShow);
      }
      //滤镜
      else if (o === 1) {
        leftPanelBus.setShowFilter(!this.filterShow);
        this.filterShow = !this.filterShow;
      }
      //裁剪
      else if (o === 2) {
        if(this.type === 'img') {
          this.setClipFlag(true);
        }
        else {
          svgFrameBus.setFrameCutInfo();
        }
        this.setToolsBarShow(false);
      }
      //收藏
      else if (o === 5) {
        if(!this.isLogin) {
          this.logregShow(1);
        } else {

          if (!this.isCollection) {
            let id = dataHandle.getEleJson()['data-elem'].id;
            let me = this;
            userEvent.collectMaterial(id, function(res){ 
              if(res.code == 1) {
                toolsBarBus.setToolsBarState(); 
                me.setMessageShow({ placeHolder: '收藏成功，已添加至我的素材！', kind: 'success'}) 
              } else {
                me.setMessageShow({ placeHolder: '收藏失败！', kind: 'error'}) 
              }
            });
          } else {
            this.setMessageShow({ placeHolder: '你已收藏过该素材', kind: 'warning'})
          }
        }
      }
      //换图
      else if (o === 3) {
        if(this.isLogin==false){
          this.logregShow(1)
        }else{
          //触发上传操作
          document.getElementById('changeImageId').click()
        }
      }
      //设为背景
      else if (o === 4) {
        //获取当前点击素材的下标
        //注意这里取到的page宽高应该为出血后的宽高
        let dt = this.focusElementJson['data-img-kind'],
          mid = this.focusElementJson['data-elem']['id'],
          ik = this.focusElementJson['data-elem']['data-key'],
          w = this.focusElementJson['data-elem']['width'],
          h = this.focusElementJson['data-elem']['height'],
          url = this.focusElementJson['data-elem']['dataImgUrl'],
          wh = w / h,
          sw = this.pageWidth,
          sh = this.pageHeight,
          swh = sw / sh;
        ///对数据进行处理分析
        //1.宽度超出
        if (wh > swh) {
          var backSh = sh,
          backSw = (sh * wh) < sw ? sw : sh * wh,
          transx = -(backSw - sw) / 2,
          transy = 0;
        } else if (wh <= swh) {
          var backSw = sw,
          backSh = (sw / wh < sh) ? sh : sw / wh,
          transx = 0,
          transy = -(backSh - sh) / 2;
        }
        let data = {
          'data-type': 'background',
          'data-img-kind': dt,
          "reverse": " translate(0,0)rotate(0,0,0)",
          'transform': `translate(${transx},${transy})`,
          'data-elem': {
            'id': mid,
            'data-key': ik,
            'width': Number.parseFloat(backSw),
            'height': Number.parseFloat(backSh),
            'opacity': 1,
            'dataImgUrl': url,
            'lock': true,
            'filter':this.focusElementJson['data-elem']['filter'],
          }
        }
        let save_data = JSON.parse(JSON.stringify(data));
        
        let pageIndex = this.focusPageIndex,
          eleIndex = this.focusElemIndex;
	      //删除当前的素材
	      delElement(pageIndex,eleIndex)
        //置换素材（背景）
        setElementJson(elementJsonHandle(data), pageIndex, 0)
        //素材失去焦点
        pagechange.elementBlur()
        //触发保存操作
        let temp =save_data['data-elem'];
        delete temp.dataImgUrl;
        dataHandle.commit('element',{
          pageIndex:pageIndex,
          key:0,
          value: save_data,
          eventType:1
        })
	      //触发删除保存操作
        dataHandle.commit('element',{
          pageIndex:pageIndex,
          eleIndex:eleIndex,
          eventType:3
        })
	      dataHandle.push()
      }
    },
    setColorBoard(index) {
      if (this.colorBoardShow && this.colorBarIndex === index) {
        this.$emit('setColorBoard', {
          show: false
        })
      } else {
        this.colorBarIndex = index;
        let dom = this.$refs['color-bar-' + index][0];
        this.$emit('setColorBoard', {
          show: true,
          left: dom.offsetLeft - 10,
          index,
          color: this.colors[index]
        })
      }
    },
    setGroup() {
      let {elemsEvents,dataHandleEvent}=pageEvent.setElementGroup(editorBus.getEditorTransform());
	    elemsEvents.forEach(e=>{
		    dataHandle.commit('element',e)
      })
      dataHandle.commit('group',{
        pageIndex: this.focusPageIndex,
        eleIndex: dataHandleEvent.groupIndex,
        key: null,
        value: dataHandleEvent.groupValue,
	      eventType: 0
      }).push()
    },
    splitGroup() {
	    if(this.lock) return
      let {elemsEvents,dataHandleEvent}=pageEvent.splitElementGroup();
	    elemsEvents.forEach(e=>{
		    dataHandle.commit('element',e)
	    })

      delete dataHandle.getPageJson().elegroups[this.groupId];
      
	    dataHandle.commit('group',{
		    pageIndex:this.focusPageIndex,
        eleIndex: this.groupId,
        key: null,
		    value: null,
		    eventType:3
	    }).push()

      this.setGroupFlag(false);
      editorBus.setEditorState();
    },
    setGroupColor() {
      if (this.colorBoardShow) {
        this.$emit('setColorBoard', {
          show: false
        })
      } else {
        let dom = this.$refs['group-color'];
        this.alignShow = false;
        this.distributionShow = false;
        this.$emit('setColorBoard', {
          show: true,
          left: dom.offsetLeft - 10
        })
      }
    },
    setAlign(event) {
      let e = event || window.event,
          cName = e.target.className;

      //console.log(JSON.parse(JSON.stringify(editorBus.getEditorPostion())))
      switch(cName) {
        case 'left-align': pageBus.alignLeft(); break;
        case 'standard-middle': pageBus.alignXMid(); break;
        case 'right-align': pageBus.alignRight(); break;
        case 'top-align': pageBus.alignTop(); break;
        case 'bottom-align': pageBus.alignBottom(); break;
        case 'vertical-middle': pageBus.alignYMid(); break;
      }
      editorBus.setEditorState();
      //console.log(JSON.parse(JSON.stringify(editorBus.getEditorPostion())))
    },
    setDistribution(event) {
      let e = event || window.event,
          cName = e.target.className;

      switch(cName) {
        case 'standard-auto': pageBus.alignXAuto(); break;
        case 'vertical-auto': pageBus.alignYAuto(); break;
      }
    },
    commitGroup() {
      toolsBarBus.groupPut();
    }
  }
}
</script>

<style lang="less" scoped>
  .cant-use{
    opacity: .3;
  }
  .bg-hover{
    &:hover{
      color: #07AFEC;
    }
  }
  .active{
    color: #07AFEC;
  }
  .operation {
    &:after {
      content: "";
      display: table;
      clear: both;
    }
    .uneable-operation {
      cursor: default;
      opacity: 0.5;
    }
    &>li {
      float: left;
      height: 42px;
      padding: 6px 10px;
      cursor: pointer;
      position: relative;
      span {
        display: inline-block;
        line-height: 30px;
        font-size: 13px;
      }
      &:hover {
        background-color: #F4F4F4;
      }
    }
    .select-align {
      &>span {
        width: 20px;
        height: 20px;
        margin-top: 5px;
        background: url(img/topalign.svg) no-repeat 0 0;
      }
      &:hover {
        &:before {
          content: attr(data-tip);
          background-color: #fff;
          color: #626262;
          padding: 5px 8px;
          position: absolute;
          top: 53px;
          left: -3.5px;
          white-space: pre;
          border-radius: 4px;
          box-shadow: 0px 1px 1px #e8e8e8;
        }
        &:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-bottom: 8px solid #fff;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          top: 45px;
          left: 9.5px;
        }
      }
    }
    .select-vertical {
      &>span {
        width: 20px;
        height: 20px;
        margin-top: 5px;
        background: url(img/standard_auto.svg) no-repeat 0 0;
      }
      &:hover {
        &:before {
          content: attr(data-tip);
          background-color: #fff;
          color: #626262;
          padding: 5px 8px;
          position: absolute;
          top: 53px;
          left: -3.5px;
          white-space: pre;
          border-radius: 4px;
          box-shadow: 0px 1px 1px #e8e8e8;
        }
        &:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-bottom: 8px solid #fff;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          top: 45px;
          left: 9.5px;
        }
      }
    }
    .select-color {
      &>span {
        width: 24px;
        height: 24px;
        margin-top: 3px;
        background: url(img/colorpickupbg.png);
        background-size: contain;
      }
    }
    .color-bar {
      padding: 0;
      span {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin: 8px 10px;
        border-radius: 8px;
        box-shadow: -1px 1px 2px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .align-child {
    position: absolute;
    left: -18px;
    top: 53px;
    background: #fff;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
    &:before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: 8px solid #fff;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      top: -8px;
      left: 30px;
    }
    li {
      width: 104px;
      height: 30px;
      line-height: 30px;
      &:hover {
        background-color: #F4F4F4;
      }
      &:before {
        float: left;
        display: block;
        width: 20px;
        height: 20px;
        margin: 5px 0 0 10px;
      }
      &:after {
        content: attr(data-text);
        float: left;
        display: block;
        font-size: 12px;
        width: 48px;
        line-height: 30px;
        color: #515151;
        margin-left: 16px;
      }
    }
    .left-align {
      &:before {
        content: url(img/leftalign.svg);
      }
    }
    .standard-middle {
      &:before {
        content: url(img/standard_middle.svg);
      }
    }
    .right-align {
      &:before {
        content: url(img/rightalign.svg);
      }
    }
    .vertical-middle {
      &:before {
        content: url(img/vertical_middle.svg);
      }
    }
    .top-align {
      &:before {
        content: url(img/topalign.svg);
      }
    }
    .bottom-align {
      &:before {
        content: url(img/bottomalign.svg);
      }
    }
    .standard-auto {
      &:before {
        content: url(img/standard_auto.svg);
      }
    }
    .vertical-auto {
      &:before {
        content: url(img/vertical_auto.svg);
      }
    }
  }
</style>


