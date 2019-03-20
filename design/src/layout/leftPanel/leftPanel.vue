<template>
  <div id="leftPanel" @keydown.stop="" @keyup.stop="">
    <modal
      :modalShow="qrCodeShow"
      type="modal1"
      @modalClose="setQrCodeShow(false)"
    >
      <template>
        <div class="upload-qrcode">
          <qrcode
            class="upload-qrcode-qr"
            :qrcodeurl="qrCodeUrl"
            level="H" size="166"
            bgColor="#ffffff"
          ></qrcode>
          <p>用微信"扫一扫"上传手机相册图片</p>
          <p>（*上传成功后，关闭页面即可使用）</p>
        </div>
      </template>
    </modal>

    <div class="leftPanels" :style="{left:showFilter?'-312px':0}">
      <div id="leftPanel-leftPanelMenu">
        <div
          class="leftPanel-leftPanelMenuList"
          v-for="(e,i) in menuList"
          :key="i"
          :class="{active:i==index,disable:e.disable}"
          @click="!e.disable&&(current={name:e.name,index:i})"
        >
          <span class="leftPanel-leftPanelMenuList-image" :class="'leftPanel-leftPanelMenuList-image-'+e.name"></span>
          <span class="leftPanel-leftPanelMenuList-text">{{e.text}}</span>
        </div>
      </div>
      <div id="leftPanel-mainContent" :class="{close:leftPanelClose}" v-if="loaded">
        <mainContent :index="index" @changeIndex="e=>{setIndex(e)}"></mainContent>
        <div
          class="leftPanel-mainContent-toggle"
          :class="{close:leftPanelClose,disable:showFilter}"
          @click="!showFilter&&setLeftPanelClose(!leftPanelClose)"
          @showQrCode="showQrCode"
        ></div>
      </div>
    </div>
    <transition name="colorPicker">
      <colorPicker
        class="leftPanel-colorPicker"
        v-if="colorPickerIsShow"
        :style="[colorPickerPosition]"
        :showColorPanel="colorPickerInvoke.indexOf('qrCode-')>-1"
        :imgUrl="pagePreviewImgUrl"
      ></colorPicker>
    </transition>
    <div class="leftPanels-shadow" v-show="!leftPanelClose">
      <transition name="colorPicker">
        <imgFilter v-if="showFilter"></imgFilter>
      </transition>
    </div>
    <!--模板弹窗-->
    <modal :modalShow="myTemplateModalShow" type="modal1" @modalClose="myTemplateModalShow=false">
      <template-view></template-view>
    </modal>

  </div>
</template>
<script>
	import mainContent from './comp/leftPanelMainContent.vue'
	import imgFilter from './comp/filter/filter.vue'
	import {mapGetters, mapActions} from 'vuex'
	import colorPicker from 'components/colorPicker/colorPickerMain.vue'
	import {elementCtrl} from './addElementCtrl'
	import dataHandle from 'common/dataHandle'
	import {addElementHandle} from './addElementHandle'
	import leftPanel from 'dataBus/leftPanel'
	import modal from 'components/modal/modal.vue'
	import templateView from '../leftPanel/comp/template/templateView.vue'
	import qrcode from 'components/qrcode/qrcode'

	let {setShowFilter} = leftPanel

	export default{
		name:'leftPanel',
		data(){
			return{
//				menuList:[
//					{name:'search',text:'检索'},
//					{name:'template',text:'模板',disable:true},
//					{name:'material',text:'素材'},
//					{name:'font',text:'文字'},
//					{name:'background',text:'背景'},
//					{name:'chart',text:'小工具'},
//					{name:'upload',text:'上传'},
//				],
				current:{name:'search',index:0},
				setShowFilter,
				loaded:false,
				myTemplateModalShow:false,
			}
		},
		components:{
			mainContent,colorPicker,imgFilter,modal,templateView,
			qrcode
		},
		computed: {
			...mapGetters({
				leftPanelClose: 'getLeftPanelClose',
				colorPickerIsShow:'getColorPickerIsShow',
				colorPickerPosition:'getColorPickerPosition',
				colorPickerInvoke:'getColorPickerInvoke',
				elementData:'getTargetElementData',
				getPageRect:'getPageRect',
				preparedElementData:'getPreparedElementData',
				index:'getLeftPanelIndex',
				preparedTemplate:'getPreparedTemplate',
				showFilter: 'getShowFilter',
				pageThumbList:'getPageThumbList',
				focusPageIndex:'getFocusPageIndex',
				focusEleIndex:'getFocusElemIndex',
				designInfo:'getDesignInfo',
				qrCodeShow:'getQrCodeShow',
				qrCodeUrl:'getQrCodeUrl'
//				menuList:'getLeftPanelMenuList'
			}),
			pagePreviewImgUrl(){
				return this.pageThumbList[this.focusPageIndex].thumbnailsUrl
			},
			menuList(){
			  let {thirdKindId,designKindId}=this.designInfo
				return [
					{name:'search',text:'检索'},
					{name:'template',text:'模板',disable:thirdKindId===1||designKindId==127||designKindId==128},
					{name:'material',text:'素材'},
					{name:'font',text:'文字'},
					{name:'background',text:'背景'},
					{name:'chart',text:'小工具'},
					{name:'upload',text:'上传'},
				]
      },
		},
		methods: {
			...mapActions({
				setLeftPanelClose: 'setLeftPanelClose',
				setElementDataReady:'setLeftPanelElementReady',
				setElementData:'setLeftPanelElementData',
				setIndex:'setLeftPanelIndex',
				setColorPickerShow:'setColorPickerShow',
				setQrCodeShow:'setQrCodeShow',
				setQrCodeUrl:'setQrCodeUrl'
			}),
			closeColorPicker(){
				this.setColorPickerShow({
					cancel:true
				})
			},
			showQrCode(url){
				this.QrUrl=url
				this.showQR=true
			},
		},
		watch:{
			current(v){
				this.setIndex(v.index)
				this.setLeftPanelClose(false)
				this.closeColorPicker()
			},
			elementData(v){
				(!v.disable)&&elementCtrl(v,this)
			},
			preparedElementData(v){
				addElementHandle(v,this)
			},
			preparedTemplate(v){
				console.log(v)
			},
			designInfo(v){
				if(v)
					this.loaded=true
			},
			leftPanelClose(){
				this.closeColorPicker()
			},
			focusPageIndex(){
				this.closeColorPicker()
			},
			index(){
				this.closeColorPicker()
			},
			focusEleIndex(){
				this.closeColorPicker()
			}
		},
		mounted(){
			/*
      dataHandle.commit('element',{pageIndex:0,eleIndex:0,key:'width',value:'123',eventType:1})
      dataHandle.push()
      dataHandle.undo()
      dataHandle.redo()*/
//      dataHandle.pushQueueLengthCallBack(e=>{
//      	console.log('pushQueueCallBack:',e)
//      })
		}
	}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import './leftPanel';

  .leftPanel-colorPicker{
    position: absolute;
    top:50px;
    left: 370px;
  }

  .colorPicker-enter-active, .colorPicker-leave-active {
    opacity:1;
    transition: all .3s ease !important;
  }
  .colorPicker-enter, .colorPicker-leave-to{
    opacity:0;
  }

  .leftPanel-leftPanelMenuList{
    &>.leftPanel-leftPanelMenuList-image-search{
      background: url(./img/leftPanel-icon.svg) no-repeat 0 0;
    }
    &:hover >.leftPanel-leftPanelMenuList-image-search,
    &[class~='active'] >.leftPanel-leftPanelMenuList-image-search{
      background: url(./img/leftPanel-icon.svg) no-repeat -24px 0;
    }
    &>.leftPanel-leftPanelMenuList-image-material{
      background: url(./img/leftPanel-icon.svg) no-repeat 0 -48px;
    }
    &:hover >.leftPanel-leftPanelMenuList-image-material,
    &[class~='active'] >.leftPanel-leftPanelMenuList-image-material{
      background: url(./img/leftPanel-icon.svg) no-repeat -24px -48px;
    }
    &>.leftPanel-leftPanelMenuList-image-chart{
      background: url(./img/leftPanel-icon.svg) no-repeat 0 -72px;
    }
    &:hover >.leftPanel-leftPanelMenuList-image-chart,
    &[class~='active'] >.leftPanel-leftPanelMenuList-image-chart{
      background: url(./img/leftPanel-icon.svg) no-repeat -24px -72px;
    }
    &>.leftPanel-leftPanelMenuList-image-font{
      background: url(./img/leftPanel-icon.svg) no-repeat 0 -96px;
    }
    &:hover >.leftPanel-leftPanelMenuList-image-font,
    &[class~='active'] >.leftPanel-leftPanelMenuList-image-font{
      background: url(./img/leftPanel-icon.svg) no-repeat -24px -96px;
    }
    &>.leftPanel-leftPanelMenuList-image-template{
      background: url(./img/leftPanel-icon.svg) no-repeat 0 -24px;
    }
    &:hover >.leftPanel-leftPanelMenuList-image-template,
    &[class~='active'] >.leftPanel-leftPanelMenuList-image-template{
      background: url(./img/leftPanel-icon.svg) no-repeat -24px -24px;
    }
    &[class~='disable'] >.leftPanel-leftPanelMenuList-image-template{
      background: url(./img/leftPanel-icon.svg) no-repeat 0 -24px !important;
    }

    &>.leftPanel-leftPanelMenuList-image-background{
      background: url(./img/leftPanel-icon.svg) no-repeat 0 -120px;
    }
    &:hover >.leftPanel-leftPanelMenuList-image-background,
    &[class~='active'] >.leftPanel-leftPanelMenuList-image-background{
      background: url(./img/leftPanel-icon.svg) no-repeat -24px -120px;
    }
    &>.leftPanel-leftPanelMenuList-image-upload{
      background: url(./img/leftPanel-icon.svg) no-repeat 0 -144px;
    }
    &:hover >.leftPanel-leftPanelMenuList-image-upload,
    &[class~='active'] >.leftPanel-leftPanelMenuList-image-upload{
      background: url(./img/leftPanel-icon.svg) no-repeat -24px -144px;
    }
  }
</style>