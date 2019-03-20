<!-- @Auther: xiaokaike -->
<!-- https://github.com/xiaokaike/vue-qrcode -->
<template>
  <div class="qrcode-container">
    <!-- todo: ':qrcodeurl' is set as workaround for update not being fired on props change.. -->
    <canvas
      :style="{height: size + 'px', width: size + 'px'}"
      :height="size"
      :width="size"
      ref="qr"
      :qrcodeurl="qrcodeurl"
    ></canvas>
    <!--<img class="qrcode-icon" src="./img/favicon.png">-->
  </div>
</template>


<script>
import qr from 'qr.js'

const update = function() {
  this.update();
}

export default {
  props: {
    qrcodeurl: {
      type: String,
      required: true
    },
    size: {
      type: [Number,String],
      default: 100
    },
    // 'L', 'M', 'Q', 'H'
    level: String,
    //添加功能 bgColor传入transparent时背景透明
    bgColor: {
      type: String,
      default: '#FFFFFF'
    },
    fgColor: {
      type: String,
      default: '#000000'
    },


  },
  mounted: update,
  methods: {
    update() {
      var size = this.size
      var bgColor = this.bgColor
      var fgColor = this.fgColor
      var $qr = this.$refs.qr

      var qrcode = qr(this.qrcodeurl)

      var ctx = $qr.getContext('2d')
      var cells = qrcode.modules
      var tileW = size / cells.length
      var tileH = size / cells.length
      var scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx)

      $qr.height = $qr.width = size * scale
      ctx.scale(scale, scale)

      cells.forEach( (row, rdx) => {
        row.forEach( (cell, cdx) => {
        	if(bgColor==='transparent'&&!cell) return
          ctx.fillStyle = cell ? fgColor : bgColor
          var w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW))
          var h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH))
          ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h)
        })
      })

      this.$emit('imgData',$qr.toDataURL('image/png', 1))
    }
  },
  watch:{
    bgColor:update,
    fgColor:update,
	  qrcodeurl:update
  }
}

function getBackingStorePixelRatio(ctx) {
  return (
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1
  )
}

</script>

<style lang="less" scoped>
  .qrcode-container {
    position: relative;
  }
  .qrcode-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
</style>