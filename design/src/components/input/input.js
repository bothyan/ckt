import Vue from 'vue'
import chuangkitInput from './input.vue'

const app = new Vue({
  el: '#app',
  template: `
      <chuangkitInput width="500" @inputResult='inputResultTotal'></chuangkitInput>
  `,
  methods: {
    inputResultTotal: function(result) {
      console.log(result);
    }
  },
  components: {chuangkitInput}
});
