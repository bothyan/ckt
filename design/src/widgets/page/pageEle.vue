<template>
  <g>
    <element-comp
      v-for="(ele, i) in elements"
      :eleIndex="i"
      :key="ele.eleid"
      :eleData="ele"
      :pageIndex="focusPageIndex"
      :pageId = "pageId"
    ></element-comp>
  </g>
</template>

<script>

  import elementComp from 'widgets/element/element.vue'
  import {mapGetters, mapActions} from 'vuex'
  
  export default {
    data() {
      return {

      }
    },
    components: {
      elementComp
    },
    props: {
      pageId: {
        require: true
      }
    },
    mounted() {
      
    },
    computed: {
      ...mapGetters({
        pageScale: 'getPageScale',
        focusPageIndex: 'getFocusPageIndex',
        focusPage: 'getFocusPage'
      }),

      elements() {
        if(this.focusPage) {
          return this.focusPage.elems;
        } else {
          return [];
        }
      }
    },
    watch: {

    },
    methods: {
      ...mapActions({
        setPage: 'setPage'
      }),

      eleSum() {
        return this.elements.length;
      }

    }
  } 
</script>
