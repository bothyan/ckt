<template>
  <defs>
    <filter :id="ShadowFilterId" v-if="ShadowFilterShow" x="-250%" y="-250%" width="500%" height="500%">
      <feGaussianBlur :stdDeviation="ShadowBlur" in="SourceAlpha"></feGaussianBlur>
      <feOffset :dx="ShadowOffset" :dy="ShadowOffset" result="offsetblur"></feOffset>
      <feComponentTransfer v-show="ShadowFilterShow">
        <feFuncA type="linear" :slope="ShadowOpacity"></feFuncA>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode></feMergeNode>
        <feMergeNode in="SourceGraphic"></feMergeNode>
      </feMerge>

    </filter>
    <filter :id="ImgFilterId" v-if="ImgFilterShow">
      <!--这片区域是图片滤镜 begin-->
      <feComponentTransfer class="brightness" color-interpolation-filters="sRGB" >
        <feFuncR type="linear" :slope="ImgBrightnessSlope" :intercept="ImgBrightness"></feFuncR>
        <feFuncG type="linear" :slope="ImgBrightnessSlope" :intercept="ImgBrightness"></feFuncG>
        <feFuncB type="linear" :slope="ImgBrightnessSlope" :intercept="ImgBrightness"></feFuncB>
      </feComponentTransfer>
      <feComponentTransfer color-interpolation-filters="sRGB" class="crossProcess" v-if="filterData['crossProcess']!==0">
        <feFuncR type="table" :tableValues="ImgCrossProcess[0]"></feFuncR>
        <feFuncG type="table" :tableValues="ImgCrossProcess[1]"></feFuncG>
        <feFuncB type="table" :tableValues="ImgCrossProcess[2]"></feFuncB>
      </feComponentTransfer>

      <feComponentTransfer class="contrast" color-interpolation-filters="sRGB" v-if="filterData['contrast']!==0">
        <feFuncR type="linear" :slope="ImgContrastSlope" :intercept="ImgContrastIntercept"></feFuncR>
        <feFuncG type="linear" :slope="ImgContrastSlope" :intercept="ImgContrastIntercept"></feFuncG>
        <feFuncB type="linear" :slope="ImgContrastSlope" :intercept="ImgContrastIntercept"></feFuncB>
      </feComponentTransfer>
      <feColorMatrix class="saturation" color-interpolation-filters="sRGB" type="matrix" :values="ImgSaturation" v-if="filterData['saturation']!==0"></feColorMatrix>

    <template v-if="filterData['gaussianBlur']!==0">
         <feConvolveMatrix order="3" :kernelMatrix="ImgkernelMatrix" class="sharpen" v-if="ImgGaussianBlurType == 1 "></feConvolveMatrix>
      <feGaussianBlur :stdDeviation="ImgGaussianBlur" class="blur" v-if="ImgGaussianBlurType == 2 "></feGaussianBlur>

    </template>
      <feComponentTransfer class="tint" color-interpolation-filters="sRGB" v-if="filterData['tint']!==0">
        <feFuncR type="linear" :slope="ImgTintSlope" :intercept="ImgTint[0]"></feFuncR>
        <feFuncG type="linear" :slope="ImgTintSlope" :intercept="ImgTint[1]"></feFuncG>
        <feFuncB type="linear" :slope="ImgTintSlope" :intercept="ImgTint[2]"></feFuncB>
      </feComponentTransfer>
      <!--这片区域是图片滤镜 end-->
    </filter>
  </defs>
</template>




<script>


import * as Filter from './filter';


export default {
  data() {
    return {
      ShadowFilterId: '',
      ImgFilterId: '',
      // 阴影滤镜的相关
      ShadowFilterShow: false,
      ShadowBlur: 0,
      ShadowOffset: 0,
      ShadowOpacity: 0,

      ImgFilterShow: false,
      // 亮度
      ImgBrightness: 0,
      ImgBrightnessSlope: 1,
      // 对比度
      ImgContrastIntercept: 0,
      ImgContrastSlope: 1,

      ImgCrossProcess: [0, 0, 0],
      //模糊程度
      ImgGaussianBlur: 0,
      ImgGaussianBlurType: 2,
      ImgkernelMatrix: '',
      //饱和度
      ImgSaturation: 0,
      ImgfeColorMatrix: '',
      //色调
      ImgTint: [0, 0, 0],
      ImgTintSlope: 1
    }
  },
  props: {
    filterData: {
      type: Object
    },
    shadowData: {
      type: Object
    }
  },
  watch: {
    //图片滤镜相关操作
    filterData: {
      handler: function(v) {
        if (v != undefined) {
          this.ImgFilterShow = true;
          this.computeImageFilter();
        }
      },
      deep: true
    },
    // 阴影相关操作
    shadowData: {
      handler: function(v) {
        this.updateShadow();
      },
      deep: true
    },
    // 显示阴影滤镜判断条件
    ShadowFilterShow: function(val) {
     
      if (val) {
        this.$parent.shadowFilterId = "url(#"+this.ShadowFilterId+")" ;
      } else {
        this.$parent.shadowFilterId = '';
      }
    },
    //图片滤镜开关
    ImgFilterShow: function(val) {
    
      if (val) {
         let ImgfilterId = "IMGFILTER_" + new Date().getTime() + "_" + Math.floor(Math.random() * 10000);
        this.ImgFilterId = ImgfilterId;
        this.$parent.imgFilterId = ImgfilterId;
      } else {
        this.ImgFilterId ="";
        this.$parent.imgFilterId = '';
      }
    }
    },
    methods: {
      init(){
        if (this.filterData.brightness != undefined) {
           this.ImgFilterShow = true;
          this.computeImageFilter();
        //this.$parent.imgFilterId =this.ImgFilterId;
        }
        if(this.shadowData['show']){
          this.updateShadow();
        }
      },
      // 初始化数值
      updateShadow() {
        this.ShadowBlur = this.shadowData['blur'] ;
        this.ShadowOffset = this.shadowData['offset'] ;
        this.ShadowOpacity = this.shadowData['opacity'] ;
        this.ShadowFilterShow = this.shadowData['show'] || false;
      
      },
      //计算图片滤镜属性
      computeImageFilter() {
        /*计算亮度*/
       let brightness = parseFloat(this.filterData['brightness'])||0;
      
        this.ImgBrightness = brightness * 0.5 / 100;;

        /*对比度计算*/
        let contrast = parseFloat(this.filterData['contrast'])||0;
        if (contrast !== 0) {
          contrast *= 0.6;
          let slope = (contrast * (1 < contrast ? 1 / 0.6 : 1) + 100) / 100;
          contrast = -(0.5 * slope) + .5;
          this.ImgContrastSlope = slope;
        } else {
          contrast = 0;
        }
        this.ImgContrastIntercept = contrast;
        /*计算饱和度*/
        let saturation =parseFloat(this.filterData['saturation'])||0;
        if (saturation !== 0) {
          if (saturation > 0) {
            saturation *= 0.8;
          }
          saturation = (saturation + 100) / 100;

          saturation *= 1 >= saturation ? 1 : saturation;
          saturation = [.3086 + .6914 * saturation, .6094 - .6094 * saturation, .082 - .082 * saturation, 0, 0, .3086 - .3086 * saturation, .6094 + (1 - .6094) * saturation, .082 - .082 * saturation, 0, 0, .3086 - .3086 * saturation, .6094 - .6094 * saturation, .082 + .918 * saturation, 0, 0, 0, 0, 0, 1, 0];
          saturation = saturation.join(" ");
         
        } else {
          saturation = 0;
        }
         this.ImgSaturation = saturation;
        /*色调 */

        let tint = parseFloat(this.filterData['tint']) || 0;
        let a = Filter.mp(tint + 100);
        let b = {
          r: a.color.r / 255,
          g: a.color.g / 255,
          b: a.color.b / 255
        }
        let c = a.Dm / 100 * 2;
        tint = [b.r * c, b.g * c, b.b * c];
        this.ImgTint = tint;
        this.ImgTintSlope = 1 - c;

        /*模糊程度*/
        let GaussianBlur = parseFloat(this.filterData['gaussianBlur']) || 0;
        if (GaussianBlur !== 0) {

          GaussianBlur *= 0.5;
          if (GaussianBlur < 0) {
            GaussianBlur *= -1;
            GaussianBlur = GaussianBlur / 100 * 4;
            GaussianBlur = [0, -GaussianBlur, 0, -GaussianBlur, 4 * GaussianBlur + 1, -GaussianBlur, 0, -GaussianBlur, 0];
            this.ImgGaussianBlurType = 1;
            this.ImgkernelMatrix = GaussianBlur.join(" ")
          } else {
            let times;
            if (this.$parent.dataType === 'image') {
              times = parseInt(this.$parent.eleData['data-elem']['width']) / 500
            } else {
              times = 1;
            }
            GaussianBlur =times * GaussianBlur;
            this.ImgGaussianBlurType = 2;
            this.ImgGaussianBlur = GaussianBlur;
          }

        } else {
          this.ImgGaussianBlur = 0;
        }

        /*附片冲印效果*/

        let CrossProcessVal = parseFloat(this.filterData['crossProcess']) || 0;
        if(CrossProcessVal!=0){
                let acp = Filter.np(CrossProcessVal);
                let ccp = {
                  r: acp.red,
                  g: acp.green,
                  b: acp.blue
                };

                let CrossProcess = [];
                ["r", "g", "b"].forEach(function(a) {

                  if (a = ccp[a])
                    a = Filter.Gp({
                      x: a[0][0],
                      y: a[0][1]
                    },
                      {
                        x: a[1][0],
                        y: a[1][1]
                      },
                      {
                        x: a[2][0],
                        y: a[2][1]
                      },
                      {
                        x: a[3][0],
                        y: a[3][1]
                      }).map(function(a) {
                        return a.y
                      });

                  CrossProcess.push(a.join(" "));
                });
           this.ImgCrossProcess = CrossProcess;
        }

        
      }

    },

    created() {
      this.ShadowFilterId = "SHADOWID_" + new Date().getTime();
  
    },
    mounted(){
      this.init();
    }
  }
</script>
