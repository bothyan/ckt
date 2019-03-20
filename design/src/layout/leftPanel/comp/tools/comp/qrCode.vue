<template>
  <div class="leftPanel-tools-qrCode" ref="dom">
    <div class="leftPanel-tools-qrCode-content">
      <qrcode
        :qrcodeurl="inputUrl"
        level="H" size="140"
        :bgColor="bgColor"
        :fgColor="fgColor"
        style="display: none"
        @imgData="qrImage"
      ></qrcode>
      <upload
        :file="imageData"
        @progress="uploadImageProgressCtrl"
        @uploadSuccess="uploadImageSuccess"
        @uploadStart="uploading=true"
      ></upload>
      <div class="leftPanel-tools-qrCode-content-qr">
        <img :src="qrImageUrl" alt="">
      </div>
      <div class="leftPanel-tools-qrCode-content-color" ref="setupColor">
        <div class="left">
          <span class="text">二维码颜色</span>
          <div class="selColor"
               :class="{transparent:fgColor==='transparent'}"
               :style="{background:fgColor}"
               @click="showColorPicker(fgColor,'fgColor')"
          ></div>
        </div>
        <div class="right">
          <span class="text">二维码背景色</span>
          <div class="selColor"
               :class="{transparent:bgColor==='transparent'}"
               :style="{background:bgColor}"
               @click="showColorPicker(bgColor,'bgColor')"
          ></div>
        </div>
      </div>
      <div class="leftPanel-tools-qrCode-content-input">
        <p>请输入网址生成二维码</p>
        <input type="text" v-model="inputUrl" placeholder="以http://或https://开头">
      </div>
      <div class="leftPanel-tools-qrCode-content-create">
        <span @click="createQRCode">
          {{uploading?uploadStr:'生成二维码'}}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
	import qrcode from 'components/qrcode/qrcode'
	import transparentImage from '../img/leftPanel-transparent.svg'
	import upload from '../../upload/comp/uploadFunc.vue'
	import {mapActions,mapGetters} from 'vuex'

	export default {
		name:'leftPanel-tools-qrCode',
		data(){
			return{
				qrImageUrl:'',
				inputUrl:'https://www.chuangkit.com',
				fgColor:'#000000',
				bgColor:'transparent',
        imageData:null,
				uploading:false,
        uploadProgress:0,
        currentColor:''
//        uploadStr:''
			}
		},
		methods:{
			qrImage(e){
				this.qrImageUrl=e
			},
			createQRCode(){
        if(this.isLogin){
	        this.imageData=this.qrImageUrl
        }else {
          this.showLogreg(1)
        }
			},
			uploadImageSuccess({dt,mid,w,h,fid,ik,url,id}){
        this.uploading=false
        let data={
	        'data-type':'img',
	        'data-img-kind':dt,
	        'data-elem':{
		        'id':mid,
//		        'data-key':ik,
		        'width':w,
		        'height':h,
		        'opacity':1
	        }
        }
//				this.$http.post('/material/delMaterials',{tid:0,fid:0,m_ids:mid+''})
//          .then(res=>{
//            if(res.data.body.code===1){
//            	console.log('从用户文件夹中删除了二维码')
//            }
//          })
				this.setElementData({
					data,
					'width':w,
					'height':h,
          imgUrl:this.qrImageUrl,
          disable:true
				})
        this.setElementDataReady({t:Date.now(),flag:true})
      },
			uploadImageProgressCtrl({progress,id}){
//				console.log(progress,id)
        this.uploadProgress=progress
      },
			...mapActions({
				setElementData:'setLeftPanelElementData',
				setElementDataReady:'setLeftPanelElementReady',
				showLogreg:'setLogregShow',
				setColorPickerShow:'setColorPickerShow'
			}),
			showColorPicker(color,sel){
				this.setColorPickerShow({isShow:false})
				this.currentColor=sel
				this.colorPickerIsShow||this.setColorPickerShow({
					isShow:true,
					DefaultColor:color,
					invoke:'qrCode-'+sel,
					position:{left:'370px',top:this.$refs.setupColor.offsetTop+'px'}
				})
			}
		},
		mounted(){
			this.$emit('resize',this.$refs.dom.offsetHeight)
		},
    computed:{
      ...mapGetters({
        isLogin:"getIsLogin",
	      colorPickerIsShow:'getColorPickerIsShow',
	      colorPickerInvoke:'getColorPickerInvoke',
	      colorPickerColorData:'getColorPickerColorData',
	      colorPickerColorStatus:'getColorPickerColorStatus',
      }),
	    uploadStr(){
      	return `正在生成 ${this.uploadProgress}%`
      }
    },
    watch:{
	    colorPickerColorData(){
	    	if(this.colorPickerInvoke.indexOf('qrCode-')<0) return
		    this[this.colorPickerInvoke.split('qrCode-')[1]]=this.colorPickerColorData
      },
	    colorPickerColorStatus(v){
		    if(v===0&&this.colorPickerInvoke.indexOf('qrCode-')>0)
			    this[this.colorPickerInvoke.split('qrCode-')[1]]=this.colorPickerColorData
	    }
    },
		components:{
			qrcode,upload
		}
	}
</script>
<style lang="less" scoped>
  .leftPanel-tools-qrCode{
    width: 100%;
    box-sizing: border-box;
    position: relative;
    padding: 16px;

    .leftPanel-tools-qrCode-content{
      width: 100%;
      text-align: center;
      padding-top: 16px;

      .leftPanel-tools-qrCode-content-qr{
        width: 148px;
        height:148px;
        background: #FFFFff;
        border: 1px solid #d2dadf;
        display: inline-block;
        padding: 3px;
        box-sizing: border-box;

        &>img{
          width: 140px;
          height:140px;
          display: block;
        }
      }

      .leftPanel-tools-qrCode-content-color{
        width: 100%;
        height: 24px;
        margin-top: 30px;


        &>div{
          width: 110px;
          height:100%;

          &[class~='left']{
            float: left;
          }
          &[class~='right']{
            float: right;
          }

          .text{
            color: #626262;
            font-size: 12px;
            line-height: 24px;
            margin-right: 12px;
            float: left;
          }

          .selColor{
            width: 24px;
            height:24px;
            box-shadow: 0 1px 4px 0 rgba(0,0,0,.16);
            float: left;
            cursor: pointer;
            transition: transform 0.1s ease;

            &:hover {
              transform: scale(1.2);
            }

            &[class~='transparent']:after{
              content: '';
              display: block;
              width: 100%;
              height: 100%;
              background: url("../img/leftPanel-transparent.svg") no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }

      .leftPanel-tools-qrCode-content-input{
        width: 100%;
        margin: 16px 0 0 0;
        text-align: left;

        &>p{
          font-size: 12px;
          color: #9B9B9B;
          margin: 8px 0;
        }

        &>input{
          width: 100%;
          height: 40px;
          background: #ffffff;
          box-sizing: border-box;
          padding: 0 32px 0 12px;
          line-height: 40px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
          border: none;
          font-size: 12px;

          &:focus{
            outline: none;
          }
        }
      }

      .leftPanel-tools-qrCode-content-create{
        margin: 24px 0;

        &>span{
          display: inline-block;
          width: 100%;
          height: 48px;
          line-height: 48px;
          color: #FFFFff;
          text-align: center;
          cursor: pointer;
          background: #07AEFC;
          box-shadow: 0 1px 4px 0 rgba(0,0,0,.16);

          &:hover,&:active{
            background: linear-gradient(to bottom right, #5EA2FF, #00E3FF);
          }
        }
      }

    }
  }
</style>