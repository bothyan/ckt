import Vue from 'vue'
import paging from './pagination.vue'

let app = new Vue({
  el: '#app',
  template: `
      <paging :count="count" :current="cur" @jumpUrl="jumpUrl"></paging>
  `,
  data:{
    count:3,
    cur:3
  },
  methods:{
    jumpUrl:function (i) {
      this.cur=Number.parseInt(i);
    }
  },
  components: {paging}
});