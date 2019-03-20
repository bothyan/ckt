<template>
  <div class="leftPanel-tools-table" ref="dom">
    <div class="leftPanel-tools-table-content">
      <div class="leftPanel-tools-table-sel">
        <img :src="tableImage1" alt="" @dragstart.prevent="()=>false">
      </div>
      <div class="leftPanel-tools-table-sel">
        <img :src="tableImage2" alt="" @dragstart.prevent="()=>false">
      </div>
    </div>
  </div>
</template>
<script>
  import tableImage1 from '../img/leftPanel-tools-table1.png'
  import tableImage2 from '../img/leftPanel-tools-table2.png'

  export default {
  	name:'leftPanel-tools-table',
    data(){
  		return{
			  tableImage1,
			  tableImage2,
      }
    },
	  mounted(){
		  this.$emit('resize',this.$refs.dom.offsetHeight)
	  },
  }
</script>
<style lang="less" scoped>
  .leftPanel-tools-table{
    width: 100%;
    box-sizing: border-box;
    position: relative;
    padding: 16px;

    .leftPanel-tools-table-content{
      width: 100%;
      
      .leftPanel-tools-table-sel{
        width: 100%;
        cursor: pointer;
        margin-bottom: 16px;

        &>img{
          width: 100%;
          display: block;
        }
      }
    }
  }
</style>