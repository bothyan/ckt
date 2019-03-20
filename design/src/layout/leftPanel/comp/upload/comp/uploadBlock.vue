<template>
  <div
    class="leftPanel-upload-block"
    :class="{disable:state===3}" @click="state==0?'':$emit('cancel')"
    :style="{zIndex:folderEdit?100:99}"
  >
    <div class="leftPanel-upload-block-con" :class="{active:state===2||folderEdit}" v-if="!data.addFolder">
      <div
        class="leftPanel-upload-block-img"
        @click.stop="state==0?$emit('click'):$emit('cancel')"
      >
        <div
          class="leftPanel-upload-block-img-img"
          :style="{background:'url('+data.imgUrl+')'}"
        ></div>
        <div
          class="leftPanel-upload-block-more"
          v-show="data.folderId!=0&&currentBlock===null"
          :class="[{active:folderEdit},{disable:state===3}]"
          @click.stop="$emit('edit',!folderEdit)"
        >
        </div>
        <div
          class="leftPanel-upload-block-edit"
          v-show="folderEdit"
        >
          <div @click.stop="nameInputStart"></div>
          <div @click.stop="delConfirm"></div>
        </div>
      </div>
      <div class="leftPanel-upload-block-pop1" :class="{active:state===2}"></div>
      <div class="leftPanel-upload-block-pop2" :class="{active:state===2}"></div>
    </div>
    <div class="leftPanel-upload-block-con-add"
         v-else
         :class="{forVip:isVip===1}"
         @click="addFolderFuc"
    ></div>
    <div class="leftPanel-upload-block-text">
      <span v-show="!nameEdit" :title="name">{{name}}</span>
      <input
        v-show="nameEdit" ref="name"
        type="text" v-model="name"
        @keydown.enter.prevent="nameFinish"
        @blur="nameFinish"
      />
    </div>
  </div>
</template>
<script>
	import {mapGetters,mapActions} from 'vuex'

	export default{
		data(){
			return{
        nameEdit:false,
        name:''
			}
		},
		props:{
			data:{
				default:{
					folderName:'新建文件夹'
        }
			},
			state:{
				required:true,
				default:0
			},
			folderEdit:{
				default:false
      },
			currentBlock:{

      },
		},
    methods:{
			nameInputStart(){
        this.nameEdit=true
				this.$emit('edit',false)
        this.$nextTick(()=>{
	        this.$refs.name.select()
        })
      },
	    nameFinish(){
        this.nameEdit=false
        if(this.name===''){
        	this.name=this.data.folderName
        	return
        }
        this.$http.post('/material/renameMaterialFolder',{folder_name:this.name,folder_id:this.data.folderId,tid:this.teamId})
	        .then(e=>{
		        if(e.data.body){
			        let code=e.data.body.code
			        switch (code){
				        case 1:
				        	this.$emit('hasRename',this.name)
					        this.setMessageShow({placeHolder:'修改成功',kind:'success'})
                  break
				        case 0:
					        this.setMessageShow({placeHolder:'修改失败',kind:'error'})
					        break
                case -1:
	                this.setMessageShow({placeHolder:'修改失败',kind:'error'})
                  console.warn('权限不足')
	                break
				        case -2:
					        this.setMessageShow({placeHolder:'请登录',kind:'error'})
                  this.showLogreg(1)
                  break
				        case -3:
					        this.setMessageShow({placeHolder:'修改失败',kind:'error'})
					        console.warn('参数错误')
					        break
			        }
		        }
	        },err=>{
		        console.log('网络出错')
		        this.setMessageShow({placeHolder:'网络出错',kind:'error'})
	        })
      },
      delConfirm(){
        let _this=this

        this.$http.post('/material/getMaterialCountInFolder',{folder_id:this.data.folderId,tid:this.teamId})
          .then(res=>{
            let {body}=res.data
            if(body.code===1){
            	let {materialCount}=body
	            if(materialCount===0){
		            _this.delFolder(_this)
		            return
	            }
	            this.$emit('del',{text:'此文件夹里存在图片，删除文件夹会连同图片一起删除，是否继续？',func:delFunc})
            }
          },err=>{
	          this.setMessageShow({placeHolder:'网络出错',kind:'error'})
          })
        function delFunc() {
        	_this.$emit('cancel')
          _this.delFolder(_this)
        }

      },
      delFolder(_this){
	      _this.$http.post('/material/delMaterialFolder',{fid:_this.data.folderId,tid:_this.teamId})
		      .then(e=>{
			      if(e.data.body){
				      let code=e.data.body.code
				      switch (code){
					      case 1:
					      	_this.$emit('hasDel')
						      this.setMessageShow({placeHolder:'删除成功',kind:'success'})
                  break
					      case 0:
						      this.setMessageShow({placeHolder:'删除失败',kind:'error'})
						      break
                case -1:
	                this.setMessageShow({placeHolder:'删除失败',kind:'error'})
                  console.warn('参数错误')
	                break
					      case -3:
						      this.setMessageShow({placeHolder:'删除失败',kind:'error'})
						      console.warn('权限不足')
						      break
					      case -4:
						      this.setMessageShow({placeHolder:'请登录',kind:'error'})
						      this.showLogreg(1)
						      break
				      }
			      }
		      },err=>{
			      this.setMessageShow({placeHolder:'网络出错',kind:'error'})
			      console.log('网络出错')
		      })
      },
	    addFolderFuc(){
      	this.$emit('cancel')
        if(this.isVip===1){
      		this.setErrorShow(4)
          return
        }
      	this.$http.post('/material/makeFolder',{folder_name:'新建文件夹',type:this.teamId>1?1:0,tid:this.teamId}).then(res=>{
//      		if(res.data.body.code===1){
//      			this.$emit('refresh')
//          }else {
////            this
//          }
          switch (res.data.body.code){
            case 1:
	            this.$emit('refresh')
	            this.setMessageShow({placeHolder:'创建成功',kind:'success'})
              break
            case 0:
	            this.setMessageShow({placeHolder:'创建失败',kind:'error'})
	            break
            case -1:
	            this.setMessageShow({placeHolder:'创建失败',kind:'error'})
              console.warn('权限不足')
	            break
            case -2:
	            this.setMessageShow({placeHolder:'请登录',kind:'error'})
	            this.showLogreg(1)
	            break
            case -3:
	            this.setMessageShow({placeHolder:'创建失败',kind:'error'})
	            console.warn('系统错误')
	            break
          }
        },err=>{
		      this.setMessageShow({placeHolder:'网络出错',kind:'error'})
		      console.log(err)
        })
      },
      ...mapActions({
	      setErrorShow:"setErrorShow",
	      setMessageShow:'setMessageShow',
	      showLogreg:'showLogreg'
      })
    },
    watch:{
	    data(v){
	    	this.name=v.folderName
      }
    },
		computed:{
			...mapGetters({
				teamId:'getTeamId',
				isVip:'getIsVip',
				isLogin:'getIsLogin'
			})
		},
    beforeMount(){
	    this.name=this.data.folderName
    }

	}
</script>
<style lang="less" scoped>
  .leftPanel-upload-block{
    width: 72px;
    height: 94px;
    position: relative;
    transition: all .3s ease;

    &[class~='disable']{
      opacity: .56;
      &:after{
        content: '';
        width: 100%;
        height:100%;
        position: absolute;
        z-index: 100;
        top:0;
        left:0;
      }
    }

    .leftPanel-upload-block-con{
      width: 72px;
      height: 72px;
      position: relative;
      cursor: pointer;

      &:hover,&[class~='active']{
        .leftPanel-upload-block-img{
          box-shadow: 0 4px 16px 0 rgba(0,0,0,.16);

          .leftPanel-upload-block-more{
            display: block;
          }
        }
        .leftPanel-upload-block-pop1{
          top:-5px;
        }
      }

      .leftPanel-upload-block-img{
        width: 72px;
        height: 72px;
        border-radius: 4px;
        background: #ffffff;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,.08);
        position: absolute;
        top:0;
        left:0;
        z-index: 99;

        .leftPanel-upload-block-img-img{
          width: 64px;
          height: 64px;
          margin: 4px;
        }

        .leftPanel-upload-block-more{
          display: none;
          position: absolute;
          width: 16px;
          height: 16px;
          right: 6px;
          bottom:6px;
          border-radius: 50%;
          background: #F6F6F6;
          transition: background .2s ease;
          box-shadow: 0 1px 4px 0 rgba(0,0,0,.24);

          &[class~='disable']{
            display: none !important;
          }

          &:after{
            content: '';
            display: block;
            width: 14px;
            height:14px;
            margin: 1px;
            transition: background .2s ease;
            background: url("../../img/LeftPanel3dot.svg") no-repeat;
          }

          &[class~='active']{
            background:linear-gradient(90deg,#5EA2FF,#00E3FF);

            &:after{
              width: 8px;
              height:8px;
              margin: 4px;
              background:url("../../img/leftPanelX.svg") no-repeat;
            }
          }
        }
        .leftPanel-upload-block-edit{
          position: absolute;
          bottom: 0;
          left:72px;
          width: 22px;
          height: 44px;
          background: #FFFFFF;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,.24);

          &>div{
            width: 22px;
            height:22px;
            background: #FFFFff;
            cursor: pointer;
            padding:1px;

            &:after{
              content: '';
              display: block;
              width: 20px;
              height:20px;
            }

            &:nth-child(1):after{
              background: url("../img/leftPanel-edit.svg") no-repeat;
            }
            &:nth-child(2):after{
              background: url("../img/leftPanel-del.svg") no-repeat;
            }

            &:hover{
              background: #F6F6F6;

              &:nth-child(1):after{
                background: url("../img/leftPanel-edit1.svg") no-repeat;
              }
              &:nth-child(2):after{
                background: url("../img/leftPanel-del1.svg") no-repeat;
              }
            }
          }
        }
      }

      .leftPanel-upload-block-pop1{
        width: 62px;
        height: 62px;
        border-radius: 4px;
        background: #ffffff;
        box-shadow: 0 4px 16px 0 rgba(0,0,0,.16);
        position: absolute;
        top:0;
        left:5px;
        z-index: 98;
        transition: top .3s ease;

        &[class~='active']{
          top:-5px;
        }
      }
      .leftPanel-upload-block-pop2{
        width: 52px;
        height: 52px;
        border-radius: 4px;
        background: #ffffff;
        box-shadow: 0 4px 16px 0 rgba(0,0,0,.16);
        position: absolute;
        top:0;
        left:10px;
        z-index: 97;
        transition: top .3s ease;

        &[class~='active']{
          top:-9px;
        }
      }
    }

    .leftPanel-upload-block-con-add{
      width: 72px;
      height: 72px;
      position: relative;
      cursor: pointer;
      border-radius: 3px;
      background: url("../img/leftPanel-addFolder.svg") no-repeat;

      &:hover {
        opacity: .8;
      }

      &[class~='forVip']{
        background: url("../img/leftPanel-addFolder1.svg") no-repeat;
      }
    }
    .leftPanel-upload-block-text{
      margin-top: 4px;
      width:100%;
      color: #626262;
      font-size: 12px;
      text-align: center;
      white-space:nowrap;
      text-overflow:ellipsis;
      overflow: hidden;

      input{
        color: #626262;
        font-size: 12px;
        width: 100%;
        border:none;
        text-align: center;
        background: transparent;

        &:focus{
          outline: none;
        }
      }
    }
  }
</style>