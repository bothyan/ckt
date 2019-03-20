<template>
  <div class="ss-function-colorPicker">
    <div class="ss-function-colorPicker-content">
      <colorPicker
        @colorCtrl="colorCtrl"
        :imgUrl="imgUrl"
        :defaultColor="defaultColor"
        v-if="!showColorPanel||type===2"
      ></colorPicker>
      <colorPanel
        v-if="showColorPanel&&type===1"
        @setPicker="type=2"
        @colorCtrl="colorCtrl"
      ></colorPanel>
    </div>
    <div class="ss-function-colorPicker-confirm">
      <span @click="cancel">取消</span>
      <span @click="confirm">确定</span>
    </div>
  </div>
</template>
<script>
  import colorPicker from './comp/colorPicker.vue'
  import colorPanel from './comp/colorPickerPanel.vue'
  import {mapGetters, mapActions} from 'vuex'

  export default {
  	name:'ss-function-colorPicker-main',
    data(){
  		return{
//        typeHeight:'auto',
        color:'#ffffff',
        type:1
      }
    },
    props:{
    	showColorPanel:{
    		default:false
      },
	    imgUrl:{
    		required:true
      }
    },
    methods:{
	    colorCtrl(c){
        this.color=c
      },
	    cancel(){
		    this.setShow({isShow:false,cancel:true})
      },
      confirm(){
        this.setShow(false)
      },
      ...mapActions({
	      setStatus:"setColorPickerStatus",
	      setShow:"setColorPickerShow",
      })
    },
    computed:{
	    ...mapGetters({
        defaultColor:"getColorPickerDefaultColor"
      }),
      imgBase64(){

      }
    },
    watch:{
	    color(v){
	    	this.setStatus({colorData:v})
      }
    },
    components:{
	    colorPicker,colorPanel
    }
  }
</script>
<style lang="less" scoped>
  .ss-function-colorPicker{
    width:184px;
    /*height:285px;*/
    /*position: fixed;*/
    /*z-index: 9999;*/
    background: #ffffff;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,.24);
    box-sizing: border-box;
    padding: 16px;
    transition: all ,2s ease;
    cursor: default;

    .ss-function-colorPicker-content{
      width: 100%;

    }

    .ss-function-colorPicker-confirm{
      width: 150px;
      height:24px;

      span{
        width: 71px;
        height:24px;
        float: left;
        text-align: center;
        line-height: 24px;
        font-size: 12px;
        cursor: pointer;

        &:nth-child(1){
          box-shadow: 0 0 1px 0 rgba(0,0,0,.24);
          color: #626262;
          margin-right: 8px;
        }
        &:nth-child(2){
          background:#07AEFC;
          color: #ffffff;
        }
      }
    }
  }
</style>