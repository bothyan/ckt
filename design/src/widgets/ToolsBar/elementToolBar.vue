<template>
  <div id="tools-bar" @mousedown.stop="">
    <div class="left-tools-bar">
      <left-tools-bar
      :type="toolsBarState.type"
      :json="toolsBarState.special"
      :lock="toolsBarState.common.lock"
      ></left-tools-bar>
    </div>
    <div class="right-tools-bar">
      <com-tools-bar
      :type="toolsBarState.type"
      :shadow="toolsBarState.common.shadow"
      :opacity="toolsBarState.common.opacity"
      :lock="toolsBarState.common.lock"
      ></com-tools-bar>
    </div>
  </div>
</template>

<script>

  import comToolsBar from './commonToolsBar.vue';
  import leftToolsBar from './leftToolsBar.vue';
  import { mapGetters } from 'vuex';


  export default {
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        toolsBarState: 'getToolsBarState'   // vuex toolsBar.js
      })
    },
    components:{
      comToolsBar, leftToolsBar
    }
  }
</script>
<style scoped lang="less">
  #tools-bar{
    width: 100%;
    height: 42px;
    font-size: 14px;
    min-width: 624px;
    background-color: #FFF;
    padding: 0px 10px 0px 20px;
    top: 0px;
    left: 0px;
    position: absolute;
    box-shadow: -3px 0px 10px #b3b3b3;
    
    .left-tools-bar{
      position: absolute;
      left: 20px;
      right: 220px;
    }
    .right-tools-bar{
      height: 40px;
      position: absolute;
      right: 10px;
    }
  }
</style>
