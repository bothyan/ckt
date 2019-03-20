<template>
  <div id="pageCircleSelect" class="page-circle-select-wrap" :style="circleRect"></div>
</template>

<script>

  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {

      }
    },
    props: {
      width: {
        required: true,
        default: 0
      },
      height: {
        required: true,
        default: 0
      },
      top: {
        required: true,
        default: 0
      },
      left: {
        required: true,
        default: 0
      }
    },
    computed: {
      ...mapGetters({

      }),

      circleRect() {
        return {
          width: this.width + 'px',
          height: this.height + 'px',
          top: this.top + 'px',
          left: this.left + 'px'
        }
      }
    },
    mounted() {

    },
    methods: {
      ...mapActions({

      })
    }
  } 
</script>

<style lang="less" rel="stylesheet/less" scoped>
.page-circle-select-wrap {
  position: absolute;
  display: inline-block;
  background-color: rgba(0, 136, 187, 0.05);
  border: 1px solid #08B;
}
</style>
