<template>
  <transition name="modal-wrap">
    <div v-if="modalShow && (type === 'modal1' || type === 'modal3' || type === 'modal5' || type === 'modal6')" class="modal-wrap"
         @click.self="modalClose">
      <transition :name="type" appear>
        <div class="modal1-center" v-if="type === 'modal1' && modalShow">
          <slot></slot>
          <div class="modal-close modal1-close" v-if="type === 'modal1' && closeShow" @click="modalClose"></div>
        </div>
        <div class="modal3-right" v-else-if="type === 'modal3' && modalShow">
          <slot></slot>
          <div class="modal-close modal3-close" @click="modalClose"></div>
        </div>
        <div class="modal5-bottom" :class="{display:modalFiveDisplay}" v-else-if="type === 'modal5' && modalShow">
          <slot></slot>
          <div class="modal-close modal5-close" @click="modalClose"></div>
        </div>
        <div class="modal6" v-else-if="type === 'modal6' && modalShow" :style="modal6Position">
          <slot></slot>
        </div>
      </transition>
    </div>
    <div class="modal4" v-else-if="type === 'modal4' && modalShow" :style="modal4Position">
      <slot></slot>
    </div>
  </transition>
</template>

<style lang="less" scoped>
  @import "modal.less";
</style>

<script>

export default {
  props: {
    type: {
      required: true,
      default: 'modal1'
      /*
        {
          'modal1': '完全自定义对话框',
          'modal3': '右侧拉显示对话框'
          'modal4': '自定义tag提示'
          'modal5': '底部弹窗'
          'modal6': '自定义位置弹窗'
        }
      */
    },
    modalShow: {
      required: true,
      default: false
    },
    position: {
      default() {
        return {
          'top': 0
        }
      }
    },
    closeShow:{
      default: true
    },
    disable: {
      default: false
    }
  },
  data() {
    return {
      modal4Position: {
        left: 0,
        top: 0
      },
      modal6Position: {
        top: 0
      },
      modalFiveDisplay: false
    }
  },
  methods: {
    modalClose() {
      if (this.disable) return;
      this.$emit('modalClose');
    }
  },
  watch: {
    modalShow(val){
      if (val && this.type === 'modal5') {
        setTimeout(() => {
          this.modalFiveDisplay = true;
        }, 500);
      }
    },
    position(val){
      this.modal4Position = {
        'left': val.left + 'px',
        'top': val.top + 'px'
      };
      this.modal6Position = {
        'top': val.top + 'px'
      }
    }
  },
  mounted() {
    if (this.type == 'modal6') {
      this.modal6Position = {
        'top': this.position.top + 'px'
      }
    }
  }
}

</script>

