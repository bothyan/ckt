<template>
  <div v-show="hoverShow">
    <div @mouseout="test" class="hover-box" v-for="h in hoverArr" :style="getBoxStyle(h)"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  
  export default {
    computed: {
      ...mapGetters({
        hoverShow: 'getHoverShow',
        hoverArr: 'getHoverArr'
      })
    },
    methods: {
      getBoxStyle(info) {
        let reto = {
          left: info.left + 'px',
          top: info.top + 'px',
          width: info.width + 'px',
          height: info.height + 'px',
          transform: `rotate(${info.rotate}deg)`
        }
        if(info.lock === true || info.lock === 'true') {
          reto.border = '1px dashed #ff3d67';
        } else {
          reto.border = '1px dashed #9b9b9b';
        }
        return reto;
      },
      test() {
        console.log(111);
      }
    }
  }
</script>
 
<style lang="less" scoped>
  .hover-box {
    position: absolute;
  }
</style>