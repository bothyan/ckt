import Vue from 'vue'
import waterfall from './waterfall.vue'
const app = new Vue({
  el: '#app',
  data() {
    return {
      boxRect: {
        // 图片的宽度
        width: 224,
        top: 8,
        right: 8,
        left: 8,
        bottom: 65,
        // 每个模板之间的间距
        marginLeft: 8,
        marginTop: 8
      },
      eleData: [],
      listSum: 0
    }
  },
  template: `
      <waterfall 
        :boxRect="boxRect"
        :eleData="eleData"
        :listSum="listSum"
      >
        <template scope="waterfall">
          <div :style="waterfall.listData.boxStyle" class="test">
            <img :style="waterfall.listData.imgStyle">
          </div>
        </template>
      </waterfall>
  `,
  beforeMount () {
  
    this.listSum = 3;
  },
  components: {waterfall}
});
