<template>
  <div
    class="ss-function-colorPicker-func"
    @mousemove="getPosition"
    @mouseup="wheelSet=sliderSet=false"
    @mouseleave="wheelSet=sliderSet=false"
  >
    <transition name="op">
      <div
        class="ss-function-colorPicker-func-waiting"
        v-show="waiting"
      ></div>
    </transition>
    <!--<div class="ss-function-colorPicker-cancel">-->

    <!--</div>-->
    <div class="ss-function-colorPicker-panel">
      <div
        class="ss-function-colorPicker-panel-wheel"
        @mousedown="e=>{(wheelSet=true)&&getPosition(e)}"
      >
        <div
          class="wheel-selector"
          :style="{top:wheelPos.y+'px',left:wheelPos.x+'px'}"
        ></div>
      </div>
      <div
        class="ss-function-colorPicker-panel-slider"
        @mousedown="e=>{(sliderSet=true)&&getPosition(e)}"
        :style="{background:sliderBg}"
      >
        <div
          class="slider-selector"
          :style="{background:sliderSeleBg,left:sliderPosX-5+'px'}"
        ></div>
      </div>
    </div>
    <div class="ss-function-colorPicker-colors">
      <div class="color-picker" @click="getColor"></div>
      <input type="text" class="color-input" :value="inputValue" @input="inputCtrl">
    </div>
  </div>
</template>
<script>
	import SeeColors from './seeColors'
	import ws from 'dataBus/webSocket'
	import {mapActions,mapGetters} from 'vuex'
	//  import dataHandle from 'common/dataHandle'

	const _ct=(()=>{
		return{
			fixHSB(hsb) {
				return {
					h: Math.min(360, Math.max(0, hsb.h)),
					s: Math.min(100, Math.max(0, hsb.s)),
					b: Math.min(100, Math.max(0, hsb.b))
				};
			},
			fixRGB(rgb) {
				return {
					r: Math.min(255, Math.max(0, rgb.r)),
					g: Math.min(255, Math.max(0, rgb.g)),
					b: Math.min(255, Math.max(0, rgb.b))
				};
			},
			fixHex(hex) {
				let len = 6 - hex.length;
				if (len > 0) {
					let o = [];
					for (let i=0; i<len; i++) {
						o.push('0');
					}
					o.push(hex);
					hex = o.join('');
				}
				return hex;
			},
			HexToRGB(hex) {
				hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
				return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
			},
			HexToHSB(hex) {
				return this.RGBToHSB(this.HexToRGB(hex));
			},
			RGBToHSB(rgb) {
				let hsb = {
					h: 0,
					s: 0,
					b: 0
				};
				let min = Math.min(rgb.r, rgb.g, rgb.b);
				let max = Math.max(rgb.r, rgb.g, rgb.b);
				let delta = max - min;
				hsb.b = max;
				if (max != 0) {

				}
				hsb.s = max != 0 ? 255 * delta / max : 0;
				if (hsb.s != 0) {
					if (rgb.r == max) {
						hsb.h = (rgb.g - rgb.b) / delta;
					} else if (rgb.g == max) {
						hsb.h = 2 + (rgb.b - rgb.r) / delta;
					} else {
						hsb.h = 4 + (rgb.r - rgb.g) / delta;
					}
				} else {
					hsb.h = -1;
				}
				hsb.h *= 60;
				if (hsb.h < 0) {
					hsb.h += 360;
				}
				hsb.s *= 100/255;
				hsb.b *= 100/255;
				return hsb;
			},
			HSBToRGB(hsb) {
				let rgb = {};
				let h = Math.round(hsb.h);
				let s = Math.round(hsb.s*255/100);
				let v = Math.round(hsb.b*255/100);
				if(s == 0) {
					rgb.r = rgb.g = rgb.b = v;
				} else {
					let t1 = v;
					let t2 = (255-s)*v/255;
					let t3 = (t1-t2)*(h%60)/60;
					if(h==360) h = 0;
					if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
					else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
					else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
					else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
					else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
					else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
					else {rgb.r=0; rgb.g=0;	rgb.b=0}
				}
				return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
			},
			RGBToHex (rgb) {
				let hex = [
					rgb.r.toString(16),
					rgb.g.toString(16),
					rgb.b.toString(16)
				];
				Array.prototype.map.call(hex, function (val, nr) {
					if (val.length == 1) {
						hex[nr] = '0' + val;
					}
				});
				return hex.join('');
			},
			HSBToHex(hsb) {
				return this.RGBToHex(this.HSBToRGB(hsb));
			},
		}
	})()

	export default {
		name:'ss-function-colorPicker',
		data(){
			return{
				wheelSet:false,
				sliderSet:false,
				wheelPos:{},
				sliderPosX:undefined,
				curHsb:_ct.HexToHSB('#ffffff'),
				inputValue:'#ffffff',
				waiting:false
			}
		},
		props:{
			imgUrl:{
				required:true
			},
      defaultColor:{
        required:true
      }
		},
    mounted(){
      this.curHsb=_ct.HexToHSB(this.defaultColor)
      this.inputValue=this.defaultColor
    },
		methods:{
			getPosition(e){
				if(this.wheelSet){
					if(!e.target.classList.contains('ss-function-colorPicker-panel-wheel')) return
					let hsb={},x,y,r,phi
					x=75-e.offsetX
					y=75-e.offsetY
					r = Math.sqrt(x * x + y * y)
					phi = Math.atan2(y, x)
					if( phi < 0 ) phi += Math.PI * 2
					if( r > 75 ) {
						r = 75;
						this.wheelPos={
							x:69 - (75 * Math.cos(phi)),
							y:69 - (75 * Math.sin(phi))
						}
					}
					hsb.s = keepWithin(r / 0.75, 0, 100)
					hsb.h = keepWithin(phi * 180 / Math.PI, 0, 360)
					hsb.b = keepWithin(100 - Math.floor((this.sliderPosX===undefined?0:this.sliderPosX) * (100 / 150)), 0, 100)
					this.curHsb=hsb
				}else if(this.sliderSet){
					if(!e.target.classList.contains('ss-function-colorPicker-panel-slider')) return
					let hsb={},x
					x=e.offsetX+1
					hsb.s = this.curHsb.s
					hsb.h = this.curHsb.h
					hsb.b = keepWithin(100 - Math.floor(x * (100 / 150)), 0, 100)
					this.sliderPosX=e.offsetX
					this.curHsb=hsb
				}
			},
			inputCtrl(e){
				if(e.target.value===''||e.target.value.substring(0,1)!=='#') this.inputValue='#'
				if(e.target.value.substring(0,1)==='#')
					if(e.target.value.length<7) return
				let hex=_ct.fixHex(e.target.value.substring(1,7))
				this.curHsb=_ct.HexToHSB(hex)
			},
			getColor(){
				let svg = document.getElementById('pageSvg').cloneNode(true),images,href

				svg.setAttribute('version', '1.1')
				svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
				svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
				images = svg.getElementsByTagName('image')
				for (let i = 0; i < images.length; i++) {
					href = images[i].href.baseVal
					let url
					if(href.indexOf('//')>-1){
						url=href.split('//')[1]
					}else {
						url=href
					}
					images[i].setAttribute('href', window.location.protocol + url)
					// images[i].setAttribute('xmlns:xlink', window.location.protocol + href);
					// images[i].setAttribute('xlink:href', window.location.protocol + href);
				}
				svg = svg.outerHTML
				svg = svg.replace(/\&nbsp/g, ' ')

				function getImgUrl() {
					return new Promise((resolve,reject)=>{
						ws.addCallBack(6,v=>{
							if(v.code<1){
								reject('err2')
              }
            })
            let timeout=setTimeout(()=>{
							reject('err1')
            },20000)
						ws.addCallBack(7,data=>{
							clearTimeout(timeout)
							resolve(data)
            })
					})
				}

				getImgUrl()
					.then((data)=>{
						this.waiting=false
						ws.removeCallBack(6)
						ws.removeCallBack(7)
						if(data.code===1){
							let imgUrl=''
							if(data.imgUrl.indexOf('?')>-1){
								imgUrl=data.imgUrl+'&v='+Date.now()
							}else {
								imgUrl=data.imgUrl+'?v='+Date.now()
							}
							new SeeColors(imgUrl,null,e=>{
								this.curHsb=_ct.RGBToHSB(e)
							}).then(e=>{
								this.curHsb=_ct.RGBToHSB(e.rgbaColor)
							})
						}
					})
          .catch(err=>{
          	console.log(err)
	          this.setMessageShow({placeHolder:'解析出错，请重试',type:'error'})
	          this.waiting=false
	          ws.removeCallBack(6)
	          ws.removeCallBack(7)
          })
				let dom=document.getElementById('page')
				let width=dom.offsetWidth>800?800:dom.offsetWidth

				ws.send(JSON.stringify({
					"reqtype":6,
					"params":{
						width,
						"content":svg
					}
				}))
				this.waiting=true

			},
      ...mapActions({
	      setMessageShow:'setMessageShow'
      })
		},
		watch:{
			curHsb(){
				this.sliderPosX=(100-this.curHsb.b)*1.5
				let phi=this.curHsb.h*Math.PI/180,
					r=this.curHsb.s*0.75
				this.wheelPos={
					x:69 - (r * Math.cos(phi)),
					y:69 - (r * Math.sin(phi))
				}
				this.inputValue='#'+_ct.HSBToHex(this.curHsb)
			},
			inputValue(v){
				this.$emit('colorCtrl',v)
			}
		},
		computed:{
			sliderSeleBg(){
				return '#'+_ct.HSBToHex(this.curHsb)
			},
			sliderBg(){
				let hsb={
					h:this.curHsb.h,
					s:this.curHsb.s,
					b:100
				}
				return '#'+_ct.HSBToHex(hsb)
			},
			...mapGetters({

			})
		}
	}

	function keepWithin(value, min, max) {
		if( value < min ) value = min
		if( value > max ) value = max
		return value
	}
</script>
<style lang="less" scoped>
  @import "./colorPicker";

</style>