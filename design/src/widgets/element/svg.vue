<template>
  <svg version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 
    :viewBox="viewBox" 
    :width="width" 
    :height="height" 
    :id="'svgNode' + eleid"
    v-html="svgContext"
    ref="svgNode">
      
  </svg>
</template>

<script>
import g_config from 'config/global_config';
import { mapActions,mapGetters } from 'vuex';
import svgBus from 'dataBus/svg';
import eleEvent from 'dataBus/element';
import editorBus from 'dataBus/editor.js';
import toolsBarBus from 'dataBus/toolsBar.js'
import leftPanel from 'dataBus/leftPanel'
import { _empty, formatSvg } from 'common/common'
import dataHandle from 'common/dataHandle.js'
export default {
  name: 'svg',
  props: {
    json: {
      type: Object,
      required: true
    },
    // svg在素材数组中的下标
    eleIndex: {
      type: Number,
      required: true
    },
    eleid: {
      required: true
    },
    pageId: {
      require: true
    },    
  },
  data() {
    return {
      mid:undefined,
      dataKey:undefined,
      width: 0,
      height: 0,
      thumbUrl: '', 
      viewBox: '0 0 0 0', 
      originViewBox:'0 0 0 0',       
      // 直接请求回来的svg，未经过处理
      svgDom: '',
      vary: {},
      colors: {},
      repeatWidth: 0
    }
  },
  computed: {
    ...mapGetters({
      'focusPageIndex': 'getFocusPageIndex',
       'focusElemIndex' : 'getFocusElemIndex',
       'designInfo': 'getDesignInfo'
    }),
    // 处理后svg标签
    svgContext() {
      if(this.svgDom.indexOf('layoutImgWrap') > -1) {
        dataHandle.getEleJson(this.focusPageIndex, this.eleIndex)['data-type'] = 'svgFrame';
        dataHandle.getEleJson(this.focusPageIndex, this.eleIndex).eleid = 'ele' + new Date().getTime()+"_"+Math.floor(Math.random()*10000)+window.material_id_index++;
        dataHandle.commit('element', {
          pageId: this.pageId,
          eleIndex: this.eleIndex,
          key: 'data-type',
          value: 'svgFrame',
          eventType: 1
        }).push(true);
      }
      if(this.svgDom.indexOf('svg')>-1){
        return this.svgDom.substring(this.svgDom.indexOf('>') + 1, this.svgDom.lastIndexOf('<'));
      }
      return this.svgDom;
    }
  },
  watch: {
    json: {
      handler(v) {
        this.update(v);
      },
      deep: true
    },
    viewBox:function(v){
      //防止撤销时候viewbox变成0，0，0，0问题
      if(v=="0 0 0 0"){
        this.viewBox = this.originViewBox;
      }
    },
    colors:{
      handler:function(val, oldVal) {
      // 如果oldVal为undefined说明是初始化，相等说明此次此值没有变化
     // if(oldVal == undefined || val === oldVal) return;
     
      if (val != undefined) {
        let colorStr = '';
        //查找颜色节点替换颜色
        //设置
        this.$parent.svgScaleType = this.$el.querySelector('g').id || "db";
        for (let i in val) {
          let color_eles = this.$el.querySelectorAll('.' + i);
          for (let j = 0; j < color_eles.length; j++) {
            if(color_eles[j])
             color_eles[j].setAttribute('fill', val[i]);
          }
        }
      }
    },
    deep:true
    },
    vary:{
      handler:function (val, oldVal) {
        // 如果oldVal为undefined说明是初始化，相等说明此次此值没有变化
        //if(oldVal == undefined || val === oldVal) return;
        // DOM 更新了
        for (let i in val) {
          //纵向复制
          if (i == 'zx_def') {
            let repeat = this.$el.querySelector('.repeat');
            repeat.querySelector('.repeat').setAttribute('height', val[i]);
            //repeat-height
          }

        let el = this.$el.querySelector('#' + i);
        if(el)
          el.setAttribute('transform', val[i]);        
        }

      },
      deep:true
    },
    repeatWidth:function(val, oldVal) {
      // 如果oldVal为undefined说明是初始化，相等说明此次此值没有变化
     // if(oldVal == undefined || val === oldVal) return;

      //横向复制
      let repeat = this.$el.querySelector('#n');
      // let repeatWidth =this.json.$origin['data-elem']['repeat-width'];
      if(repeat == null) return;
      let repEle = repeat.querySelector('.repeat');
      if(repEle)
      repEle.setAttribute('width', val);
    }
    // mid(){
    //   this.loadSvg();
    // },
    // dataKey(v){
    //   this.loadSvg(v);
    // }

  },
  methods: {
    //初始化
    init() {
      // 设置缩略图
      //leftPanel.dragElementPreviewImg.getImgUrl
 
      this.update();
      //加载设计时候不加载缩略图
      if(this.thumbUrl!=''){
        this.svgDom =`<image xlink:href='${this.thumbUrl}' x='0' y='0' width='${this.width}' height='${this.height}'/>`;
        this.viewBox = `0 0 ${this.width} ${this.height}`;
      }
      this.loadSvg(this.dataKey);
    },
    //更新当前元素数据
    update(v){

      if(v!=undefined){
        this.colors = v['data-colors'];
        this.vary = v['vary'];

        if(v['repeat-width']!=undefined)
          this.repeatWidth = v['repeat-width'];
      }
      v = v||this.json;
      this.width = v['width'];
      this.height = v['height'];
      this.viewBox = v['viewBox'];
    
      if(v['id'] !=undefined ){
        this.mid  = v['id'] ;
      }
      if(v['data-key'] !=undefined ){
        this.dataKey  = v['data-key'] ;
      }
    },
    // 初始化重复拉伸width
    initRepeatWidth() {
      let repeat = this.$refs.svgNode.querySelector('#n');
      let repeatWidth =0;
      if(repeat!= undefined){
        repeat = repeat.querySelector('.repeat')
         if(repeat!= undefined){
            repeatWidth =repeat.getAttribute('width');
             svgBus.setSvgRepeatWidth(this.pageId, this.eleIndex, repeatWidth);
         }
      }
    },
    // 初始化拉伸
    initVary() {
      let root_g = this.$refs.svgNode.querySelector('g');

      if(root_g == undefined) return;
      
      let child_gs = root_g.querySelectorAll('g')||[],
        child_count = 0, //统计子节点个数用于判断是否有子节点
        vary = {};
      // let AllowList =['hx_def','ry','zx','hs','zx_def','db']
      if (child_gs.length > 0) {

        if (root_g.id == 'hx_def') {
          // width 横向拉伸复制
          let val = root_g.getAttribute("transform") || "";
          vary[root_g.id] = val;
        } else if (root_g.id == 'zx_def') {
          // height 纵向拉伸复制
          let val = root_g.getAttribute("transform") || "";
          vary[root_g.id] = val;
        } else {
          // 判断子元素有没有变形操作
          for (let i = 0; i < child_gs.length; i++) {
            if (child_gs[i].id) {
              vary[child_gs[i].id] = child_gs[i].getAttribute("transform") || "";
              child_count++;
            } 
          }
        }
      } 
        // 'ry'情况
      if(root_g.getAttribute('id') == 'ry'||child_count==0){
        let val= root_g.getAttribute("transform") || "";

        if(root_g.getAttribute('id')){
        
          vary[root_g.getAttribute('id')] = val;
        }else{
          
          console.warn(`素材${this.dataKey||this.mid}有问题`)
        }
          
      }
      this.$parent.elemVaryType = root_g.id;

      svgBus.setSvgVary(this.pageId, this.eleIndex, vary);
    },
    //初始化 varytype
    initVaryType(){
      let root_g = this.$el.querySelector('g')||{};
      let varyType ='db';
      if(root_g.id){
        varyType =root_g.id;
      }
      this.$parent.elemVaryType = varyType;
      svgBus.setSvgVaryType(this.pageId, this.eleIndex,varyType);
    },
    // 初始化svg颜色
    initColors() {
      let colors = {};
      //let colorsText = '';

      for (let i = 1; true; i++) {
        if (this.$el.querySelectorAll('.color-' + i).length == 0) {
          break;
        }

        colors['color-' + i] = this.$el.querySelector('.color-' + i).getAttribute('fill');
      }

      svgBus.setSvgColors(this.pageId, this.eleIndex, colors);
    },
    initViewBox(){
    
    if(this.json['viewBox'] != '0 0 0 0'){
      
      this.viewBox =this.json['viewBox'];
      return;
    }; 
  
     let domStr =this.svgDom.substring(this.svgDom.indexOf('viewBox') , this.svgDom.indexOf('>'));
     let viewBoxFinded  = domStr.match(/viewBox=\"(.*?)\"/);
     if(viewBoxFinded.length>1){
       this.viewBox = viewBoxFinded[1];
       this.originViewBox = viewBoxFinded[1];
        svgBus.setSvgViewBox(this.viewBox,this.pageId, this.eleIndex);
     }  
    
    },
    initSvgData() {
      this.$nextTick(() => {
        // 设置颜色
        if(this.json['data-colors'] == false) {
          // json中没有值
          this.initColors();
        } else {
          // json中有值
          this.colors = this.json['data-colors'];
        }

        // 设置拉伸初始值
        if(_empty(this.json['vary'])) {

          this.initVary();
        } else {
          this.vary = this.json['vary'];
        }
        //初始化viewBox
        this.initViewBox();

        //设置变形类型
        this.initVaryType();
  
        // 设置重复拉伸width
        if(this.json['repeat-width'] == undefined) {
          this.initRepeatWidth();
        } else {
          this.repeatWidth = this.json['repeat-width'];
        }
        if(this.focusElemIndex!= -1&&this.focusElemIndex == this.eleIndex){
          eleEvent.setFocusElemIndex({
            index: this.eleIndex,
            eleNode: this.$refs.svgNode
          });
          editorBus.setEditorState();
          toolsBarBus.setToolsBarState();
        }
        
        this.$nextTick(()=> {
          eleEvent.setLoading(false,this.pageId,this.eleIndex)
        });
      })

    },
    // 请求svg素材数据
    loadSvg(val) {
      eleEvent.setLoading(true,this.pageId,this.eleIndex)
      if (val != undefined && val != 'false') {
        this.$http.get('//' + this.designInfo.imgHost+ '/materials/' + val).then(response => {
          if(response.status==200){
            this.svgDom = formatSvg(response.data);
            this.initSvgData();
          }else{
           console.log(`data-key为 %c「${this.json['data-key']}」%c 的素材未能成功加载|原因是 %c「${response['body']['code']}」%c(-1参数有误;-2未登录;-3权限不足)`, "color:#fff;background:red", 'color:black', "color:red", '');
          }

        }, error => {
          console.error(new Error(error));
        })
      } else {
        //通过ID取素材的  /material/getMaterialUrlsByIds.do
        this.$http.post('/material/getMaterialUrlsByIds', { mids: this.json['id'] }).then(response => {
          if (!response['body']['code']) {
            this.svgDom = formatSvg(response['body']['urls'][this.json['id']]);
            this.initSvgData();
          } else {
            //z拿不到图像
            console.log(`ID为 %c「${this.json['id']}」%c 的素材未能成功加载|原因是 %c「${response['body']['code']}」%c(-1参数有误;-2未登录;-3权限不足)`, "color:#fff;background:red", 'color:black', "color:red", '');
          }
        }, error => {
          console.error(new Error(error));
        })
      }
    }
  },
  created() {

    //设置缩略图的地址
    let thumbImg =leftPanel.dragElementPreviewImg.getImgUrl();
    if(thumbImg!=''){
      this.thumbUrl = thumbImg;
      //重新置空图片地址
      leftPanel.dragElementPreviewImg.setImgUrl('');
 
    }
    this.init();
  }
}
</script>
