<template>
  <div id="pageBleed">
    <div class="bleed_top bleed_border" :style="{height: bleedHeightPercent + '%'}"></div>
    <div class="bleed_right bleed_border" :style="bleedRightLeft"></div>
    <div class="bleed_bottom bleed_border" :style="{height: bleedHeightPercent + '%'}"></div>
    <div class="bleed_left bleed_border" :style="bleedRightLeft"></div>
    <div class="bleed_ruler_top_left bleed_ruler" :style="{top: bleedScaleSize + 'px'}"></div>
    <div class="bleed_ruler_top_right bleed_ruler" :style="{top: bleedScaleSize + 'px'}"></div>
    <div class="bleed_ruler_right_top bleed_ruler" :style="{right: bleedScaleSize + 'px'}"></div>
    <div class="bleed_ruler_right_bottom bleed_ruler" :style="{right: bleedScaleSize + 'px'}"></div>
    <div class="bleed_ruler_bottom_right bleed_ruler" :style="{bottom: bleedScaleSize + 'px'}"></div>
    <div class="bleed_ruler_bottom_left bleed_ruler" :style="{bottom: bleedScaleSize + 'px'}"></div>
    <div class="bleed_ruler_left_top bleed_ruler" :style="{left: bleedScaleSize + 'px'}"></div>
    <div class="bleed_ruler_left_bottom bleed_ruler" :style="{left: bleedScaleSize + 'px'}"></div>
    <div class="bleed_line_top bleed_line" :style="bleedLineTop"></div>
    <div class="bleed_line_bottom bleed_line" :style="bleedLineBottom"></div>
    <div class="bleed_line_center_vertical" v-for="item in verticalLine" :style="item"></div>
  </div>
</template>

<script>

  import designHandle from 'dataBus/design'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {

      }
    },
    computed: {
      ...mapGetters({
        designInfo: 'getDesignInfo',
        isBleed: 'getIsBleed',
        pageScale: 'getPageScale',
        pageWidth: 'getPageWidth',
        pageHeight: 'getPageHeight'
      }),
      // 垂直辅助线
	    verticalLine(){
        let {designKindId}=this.designInfo,arr=[]
        switch (designKindId|0){
        	//二折页
          case 142:
          //画册
          case 144:
          //相册书
          case 178:
          case 179:
          case 180:
          	arr=[
              {left:'50%'}
            ]
            break
          //三折页
          case 143:
            if(this.isBleed) {
              let designW = this.pageWidth - 2 * this.bleedSize,
                  left = designW * 0.3333333333333333 + this.bleedSize,
                  right = designW * 0.6666666666666666 + this.bleedSize;
              arr=[
                {left: left / this.pageWidth * 100 + '%'},
                {left: right / this.pageWidth * 100 + '%'}
              ]
            } else {
              arr=[
                {left:'33.33333333333333%'},
                {left:'66.66666666666666%'}
              ]
            }
            break
          //手提袋
          case 183:
            if(this.isBleed) {
              let designW = this.pageWidth - 2 * this.bleedSize,
                  left = designW * 0.3814616755793226 + this.bleedSize,
                  right = designW * 0.8814616755793226 + this.bleedSize;
              arr=[
                {left: left / this.pageWidth * 100 + '%'},
                {left: '50%'},
                {left: right / this.pageWidth * 100 + '%'}
              ]
            } else {
              arr=[
                {left:'38.14616755793226%'},
                {left:'50%'},
                {left:'88.14616755793226%'}
              ]
            }
          	break
          default:
          	arr=[]
        }
      	return arr
      },
      // 出血相关
      bleedSize() {
        return this.designInfo.bleedValue || 0;
      },
      bleedScaleSize() {
        return this.pageScale * this.bleedSize;
      },
      // 计算出血边框的原始宽高百分比
      bleedWidthPercent() {
        return 100 * (this.bleedSize / this.pageWidth);
      },
      bleedHeightPercent() {
        return 100 * (this.bleedSize / this.pageHeight);
      },
      bleedRightLeft() {
        return {
          "width": this.bleedWidthPercent + "%",
          "height": 100 - (2 * this.bleedHeightPercent) + "%",
          "top": this.bleedHeightPercent + "%"
        }
      },
      bleedLineTop() {
        return {
          "top": this.bleedScaleSize + "px",
          "left": this.bleedScaleSize + "px",
          "width": 100 - (2 * this.bleedWidthPercent) + "%"
        }
      },
      bleedLineBottom() {
        return {
          "bottom": this.bleedScaleSize + "px",
          "left": this.bleedScaleSize + "px",
          "width": 100 - (2 * this.bleedWidthPercent) + "%"
        }
      },
      threeSecendLine() {
        return {
          'left' : ((100 - (2 * this.bleedWidthPercent)) / 3 * 2 + this.bleedWidthPercent) + '%'
        }
      },
      threeFirstLine() {
        return {
          'left' : ((100 - (2 * this.bleedWidthPercent)) / 3 + this.bleedWidthPercent) + '%'
        }
      }

    }

  } 
</script>

<style lang="less" rel="stylesheet/less" scoped>
#pageBleed{
  .bleed_border {
      background-color: rgba(255,255,255,0.3);
  }
  .bleed_top {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
  }
  .bleed_right {
      position: absolute;
      right: 0px;
      border-left: 1px dashed #9B9B9B;
  }
  .bleed_bottom {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
  }
  .bleed_left {
      position: absolute;
      left: 0;
      border-right: 1px dashed #9B9B9B;
  }
  .bleed_ruler {
      background-color: #9B9B9B;
      position: absolute;
  }
  .bleed_ruler_top_left {
      width: 10px;
      height: 1px;
      left: -14px;
  }
  .bleed_ruler_top_right {
      width: 10px;
      height: 1px;
      right: -14px;
  }
  .bleed_ruler_right_top {
      width: 1px;
      height: 10px;
      top: -14px;
  }
  .bleed_ruler_right_bottom {
      width: 1px;
      height: 10px;
      bottom: -14px;
  }
  .bleed_ruler_bottom_right {
      width: 10px;
      height: 1px;
      right: -14px;
  }
  .bleed_ruler_bottom_left {
      width: 10px;
      height: 1px;
      left: -14px;
  }
  .bleed_ruler_left_top {
      width: 1px;
      height: 10px;
      top: -14px;
  }
  .bleed_ruler_left_bottom {
      width: 1px;
      height: 10px;
      bottom: -14px;
  }
  .bleed_line {
      height: 0;
      border-bottom: 1px dashed #9B9B9B;
      position: absolute;
  }
  .bleed_line_center_vertical{
    position: absolute;
    width: 1px;
    height:100%;
    border-right: 1px dashed #9B9B9B;
    top:0;
  }
}
</style>
