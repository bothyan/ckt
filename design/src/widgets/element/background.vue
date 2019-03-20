<template>
  <g>
    <svg version="1.1" id="tu-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" :viewBox="viewBox" :width="width" :height="height" v-if="type == 'rect'">
      <rect x="0" y="0" :width="width" :height="height" :fill="fillColor"></rect>
    </svg>
    <img-svg :page-id="pageId" :imgFilterId='imgFilterId' :json="json" :eleIndex="eleIndex" v-else-if="type == 'img'"></img-svg>
    <svgcom :json="json" :page-id="pageId" :eleIndex="eleIndex" v-else-if="type == 'svg'"></svgcom>
  </g>
</template>
<script>
import {  mapGetters ,mapActions } from 'vuex';
	import svgcom from './svg.vue';
	import imgSvg from './image.vue';
	import { getTransformAttr, setTransformAttr } from 'common/common';
	import dataHandle from 'common/dataHandle';
	import eleDataBus from 'dataBus/element';
	export default {
		name: "background",
		components: {
			svgcom, imgSvg
		},
		data() {
			return {
				width: 0,
				height: 0,
				svgContext: '',
				viewBox: '',
				fillColor: '#ffffff',
				type: 'rect',
				opacity:-1,
			}
		},
		props: {
			json: {
				type: Object,
				required: true
			},
			eleIndex: {
				type: Number,
				required: true
			},
			imgFilterId:{
				required: true
			},
			pageId: {
			    require: true
			},  			
			eleData:{
				required: true
			},
			
		},
		watch: {
			json: {
				handler: function(v) {

					this.update();
				},
				deep: true
			},
			opacity(v){
				
				if(v==1){
					this.setTransparentBack(true)
				}else{
					//png也要透明背景啦
					if(this.$parent.eleData['data-img-kind'].indexOf('png')>-1){
						this.setTransparentBack(true);
					}
					this.setTransparentBack(false)
				}
			}
		},
		computed:{
			...mapGetters(
			['getPageWidth',
			'getPageHeight',
			'getFocusPageIndex']
			)
		},
		methods: {
			...mapActions([
				'setTransparentBack'
			]),
			update() {
				this.setRenderType();
				if (this.type == 'rect') {
					if (this.json['data-colors'] != undefined) {
						this.fillColor = this.json['data-colors'][0];
					}
					this.width = this.json['width'];
					this.height = this.json['height'];
					this.viewBox = this.json['viewBox'];
				}
				this.opacity = this.json['opacity'];
			},
			setRenderType() {
//	          console.log(this.json,this.$parent.eleData)
//            if (this.json['id'] != undefined && this.json['data-key'] != undefined && this.json['data-key'] != 'false') {
				if(this.$parent.eleData['data-img-kind']){
					if (this.$parent.eleData['data-img-kind'].indexOf('svg') > -1) {
						this.type = 'svg';
					} else {
						this.type = 'img';
					}
					this.$parent.isFillColorBackground = false;
				} else {
					this.$parent.isFillColorBackground = true;
					this.type = 'rect';
				}
			}
		},
		created() {
			this.update();
		},
    mounted(){
		if(this.type=='rect'){
			if(this.getPageWidth!=this.json['width']||this.getPageHeight!=this.json['height']){
				eleDataBus.setHeight(this.getPageHeight,this.getFocusPageIndex,this.eleIndex)
				eleDataBus.setWidth(this.getPageWidth,this.getFocusPageIndex,this.eleIndex)
				eleDataBus.setTransform("translate(0,0)",this.getFocusPageIndex,this.eleIndex)
				dataHandle.commit('element',{
					pageIndex: this.getFocusPageIndex,
				eleIndex: this.eleIndex,
				key:"width",
					value: this.getPageWidth,
					eventType: 1
				}).commit('element',{
					pageIndex: this.getFocusPageIndex,
				eleIndex: this.eleIndex,
				key:"height",
					value: this.getPageHeight,
					eventType: 1
				}).commit('element',{
					pageIndex: this.getFocusPageIndex,
				eleIndex: this.eleIndex,
				key:"transform",
					value: "translate(0,0)",
					eventType: 1
				}).push(true);
			}

		}else if(this.type=='img'){

		    let translate =getTransformAttr(this.eleData['transform'],'translate');
		    if((this.json.width-translate[0]<this.getPageWidth)||(this.json.height-translate[1]<this.getPageHeight)){
			    //背景强制拉伸
			    let w = this.json['width'],
				    h = this.json['height'],
				    wh = w / h,
				    sw = this.getPageWidth,
				    sh = this.getPageHeight,
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
			    let transform = `translate(${transx},${transy})`
			    eleDataBus.setHeight(backSh,this.getFocusPageIndex,this.eleIndex)
                eleDataBus.setWidth(backSw,this.getFocusPageIndex,this.eleIndex)
			    eleDataBus.setTransform(transform,this.getFocusPageIndex,this.eleIndex)
			    dataHandle.commit('element',{
				    pageIndex: this.getFocusPageIndex,
					eleIndex: this.eleIndex,
					key:"width",
				    value: backSw,
				    eventType: 1
			    }).commit('element',{
				    pageIndex: this.getFocusPageIndex,
					eleIndex: this.eleIndex,
					key:"height",
				    value: backSh,
				    eventType: 1
			    }).commit('element',{
				    pageIndex: this.getFocusPageIndex,
					eleIndex: this.eleIndex,
					key:"transform",
				    value: transform,
				    eventType: 1
			    }).push(true);
		    }
	    }
    }

	}
</script>

