<template>
  <div
    class="leftPanel-dragBar"
  >
    <div class="leftPanel-dragBar-top">
      <span>{{title}}</span>
      <span>{{type===2?progress*2-100:progress}}</span>
    </div>
    <div
      class="leftPanel-dragBar-progress"
    >
      <div class="leftPanel-dragBar-progress-line"></div>
      <div
        class="leftPanel-dragBar-progress-bo"
        :style="{left:progress/100*252-6.5+'px'}"
        :class="{move:!moveStart}"
        @mousedown="move"
      ></div>
    </div>
  </div>
</template>
<script>
	export default {
		name:'leftPanel-dragBar',
		data(){
			return{
				progress:50,
				moveStart:false,
			}
		},
		props:{
			title:{},
			type:{},
      data:{}
		},
		methods:{
			move(e){
        let _this=this
        this.moveStart=true
				window.addEventListener('mousemove',mousemove)
				window.addEventListener('mouseup',mouseup)

				function mousemove(e) {
					let x=e.clientX
					if(x<84){
						x=84
					}else if(x>336){
						x=336
					}
					_this.progress=(((x-84)*200/252)|0)/2
          let result=_this.type===2?_this.progress*2-100:_this.progress
					_this.$emit('change',result)
				}
				function mouseup(e) {
					_this.$emit('fin')
					_this.moveStart=false
					window.removeEventListener('mousemove',mousemove)
					window.removeEventListener('mouseup',mouseup)
				}
			}
		},
    watch:{
			data(){
				this.progress=(100+this.data)/2
      }
    },
    beforeMount(){
	    this.progress=(100+this.data)/2
    }
	}
</script>
<style lang="less" scoped>
  .leftPanel-dragBar{
    width: 252px;
    height:35px;

    .leftPanel-dragBar-top{
      width: 100%;
      height: 17px;
      font-size: 12px;
      color: #676767;
      line-height: 17px;
      margin-bottom: 4px;

      &>span{
        display: inline-block;
        float: left;

        &:nth-child(2){
          float: right;
          font-size: 14px;
        }
      }
    }

    .leftPanel-dragBar-progress{
      width: 100%;
      height: 13px;
      position: relative;
      padding: 6px 0;

      /*&:after{*/
      /*content: '';*/
      /*width: 100%;*/
      /*height:100%;*/
      /*top:0;*/
      /*left:0;*/
      /*position: absolute;*/
      /*z-index: 9;*/
      /*}*/

      .leftPanel-dragBar-progress-line{
        width: 100%;
        height: 1px;
        background: #DDDDDD;
        /*margin: 6px 0;*/
      }

      .leftPanel-dragBar-progress-bo{
        position: absolute;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        top:0;
        background: #00ACFF;
        z-index: 2;
        cursor: pointer;

        &[class~='move']{
          transition: left .2s ease;
        }
      }
    }
  }
</style>