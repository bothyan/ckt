<template>
  <div id="leftPanel-upload" ref="dom">
    <div class="leftPanel-upload-content" v-ss-scroll="scroll">
      <div class="leftPanel-upload-showType" v-if="teamId>0">
        <span class="selectTextBlock" :class="{active:showType===0}" @click="showType=0">我的上传</span>
        <span class="selectTextBlock" :class="{active:showType===1}" @click="showType=1">团队上传</span>
      </div>
      <transition name="result">
        <prompt
          class="leftPanel-upload-content-prompt"
          v-if="showPrompt"
          :text="promptData.text"
          :func="promptData.func"
          :style="{top:promptData.flag?resultTop+'px':'80px'}"
          @close="showPrompt=false"
        ></prompt>
      </transition>
      <block
        class="leftPanel-upload-content-block"
        v-for="(e,i) in blockData1"
        :key="i"
        @click="currentBlock=i"
        @cancel="clearBlock"
        @edit="e=>{folderEdit(e,i)}"
        :folderEdit="e.folderEdit"
        :data="e"
        :currentBlock="currentBlock"
        :state="blockState[i]"
        :style="{marginTop:blockStyle[i]+'px'}"
        :userInfo="{teamId,isVip}"
        @refresh="getFolderList"
        @hasRename="e=>{folderRename(e,i)}"
        @hasDel="blockData.splice(i,1)"
        @del="e=>{delFunc(e,false)}"
      ></block>
      <transition name="result">
        <manage
          class="leftPanel-upload-content-results"
          v-if="currentBlock!==null"
          :isTeam="!!showType"
          :style="{top:resultTop+'px'}"
          :current="currentBlock"
          :position="{top:resultTop,parentHeight:$refs.dom.offsetHeight}"
          :folderList="blockData"
          :scroll="scrollingP"
          :dragImgData="dragImgData"
          :getUploadImgCtrl="uploadImgCtrl"
          @resize="e=>{resultHeight=e+24}"
          @delItem="e=>{delFunc(e,true)}"
          @folderMaterialCounts="folderMaterialCountsCtrl"
        ></manage>
      </transition>
    </div>
  </div>
</template>
<script>
	import block from './comp/uploadBlock.vue'
	import manage from './comp/uploadManage.vue'
	import prompt from './comp/prompt.vue'
	import defaultFolder from './img/leftPanel-DefaultFolder.svg'
	import newFolder from './img/leftPanel-NewFolder.svg'
	import {_throttle} from 'common/common'
	import {mapGetters,mapActions} from 'vuex'
	import Drag from './comp/Dropdrag'

	//  {imgUrl:null,addFolder:2,folderName:'新建文件夹'}

	export default {
		name:'leftPanel-upload',
		data(){
			return{
				blockData:[
					{imgUrl:defaultFolder,folderName:'默认文件夹',folderId:0,folderEdit:false},
				],
				showType:0,
				blockData1:[],
				blockState:[],
				blockStyle:[],
				currentBlock:null,
				resultTop:0,
				resultHeight:200,
				types2:[],
				typesCurrentSel:false,
				currentId:null,
				scrollingP:false,
				throttled:{},
				showPrompt:false,
				promptData:{
					text:'',
					func:null
				},
				dragImgData:null,
				uploadImgCtrl:false
			}
		},
		computed:{
			...mapGetters({
				teamId:'getTeamId',
				isVip:'getIsVip',
				isLogin:'getIsLogin',
				index:'getLeftPanelIndex',
				getUploadImgCtrl:'getUploadImgCtrl',
				getApiInfo:'getApiInfo'
			})
		},
		methods:{
			setBlock(i,h){
				let blockState=[],blockStyle=[];
				for (let j=0;j<this.blockData.length;j++){
					if(j===i){
						blockState.push(2)
					}else {
						blockState.push(3)
					}
				}
				this.blockState=blockState

				let row=((i/3)|0)+1
				for (let j=0;j<this.blockData1.length;j++){
					if(j===row*3||j===row*3+1||j===row*3+2){
						blockStyle.push(h)
					}else {
						blockStyle.push(12)
					}
				}
				this.resultTop=72+106*row+6+(this.teamId>0?32:0)
				this.blockStyle=blockStyle
			},
			clearBlock(){
				let blockState=[],blockStyle=[];
				for (let i=0;i<this.blockData.length;i++){blockState.push(0)}
				for (let i=0;i<this.blockData1.length;i++){blockStyle.push(12)}
				this.blockState=blockState
				this.blockStyle=blockStyle
				this.currentBlock=null
			},
			scroll(e,p){
				this.throttled.apply(this,[p])
			},
			scrollExec(p){
				if(p.scrollTop>16){
					this.$emit('searchBlock',{s:1,d:[]})
				}else {
					this.$emit('searchBlock',{s:0,d:[]})
				}
//				console.log(p.scrollTop,this.$refs.dom.offsetHeight,this.resultHeight,this.resultTop,24)
//				console.log(p.scrollTop+this.$refs.dom.offsetHeight-this.resultHeight-this.resultTop+24)
				if(p.scrollTop+this.$refs.dom.offsetHeight>=this.resultHeight+this.resultTop-24-24){
					this.scrollingP=!this.scrollingP
				}
			},
			getFolderList(){
				this.$http.post('/material/getMaterialFolders',{tid:this.showType===0?0:this.teamId})
					.then(e=>{
						if(e.data.body){
							if(e.data.body.folderList){
								let list=e.data.body.folderList
								list.map(e=>{
									e.imgUrl=newFolder
									e.folderEdit=false
								})
								this.blockData=[{imgUrl:defaultFolder,folderName:'默认文件夹',folderId:0,folderEdit:false},...list]
							}
						}
					},err=>{
						console.log('网络出错')
					})
			},

			folderEdit(el,index){
				let array=[]
				this.blockData.forEach((e,i)=>{
					array[i]={...e,folderEdit:i===index?el:false}
				})
				this.blockData=array
			},
			folderRename(e,i){
				this.$set(this.blockData,i,{...this.blockData[i],folderName:e})
			},
			delFunc(e,f){
				this.promptData={...e,flag:f}
				this.showPrompt=true
			},
			...mapActions({
				showLogreg:'setLogregShow',
				setIndex:'setLeftPanelIndex',
				setMessageShow:'setMessageShow'
			}),
			imgLoad(files){
				[...files].forEach(file=>{
					try {
						console.log(file.size/1048576,'MB')
						if(file.size>1048576*20){
							this.setMessageShow({placeHolder:'仅支持上传20M以下的图片',kind:'error'})
							return
						}
						if(file.type.indexOf('image/')===0){
							let fr = new FileReader()
							fr.readAsDataURL(file)
							fr.onload = e => {
								let src = e.target.result
								if(!this.isLogin){
									this.showLogreg(1)
									return
								}
								this.setIndex(6)
								if(this.currentBlock===null)
									this.currentBlock=0
								this.$nextTick(()=>{
									this.dragImgData=src
								})
							}
						}
					}catch(err){
						console.warn(err)
					}
				})
			},
			folderMaterialCountsCtrl(con){
				if(this.blockData[this.current]&&this.blockData[this.current]['materialCounts']){
					this.blockData[this.current]['materialCounts']+=con
				}
			}
		},
		components:{
			block,manage,prompt
		},
		watch: {
			showType(){
				this.clearBlock()
        this.getFolderList()
      },
			getUploadImgCtrl(){
				if(this.currentBlock===null){
					this.currentBlock=0
				}
				this.$nextTick(()=>{
          this.uploadImgCtrl=!this.uploadImgCtrl
        })
      },
			currentBlock(v) {
				if (v === null) return
				this.setBlock(v, this.resultHeight)
				this.currentId = v !== null ? this.blockData[v].folderId : null
				let array=[]
				this.blockData.forEach((e,i)=>{
					array[i]={...e,folderEdit:false}
				})
				this.blockData=array
			},
			resultHeight() {
        if(this.resultHeight<188)
	        this.resultHeight=188
				this.setBlock(this.currentBlock, this.resultHeight)
			},
			blockData(){
				if(this.getApiInfo){
					this.blockData1=[...this.blockData]
        }else {
					this.blockData1=[...this.blockData,{imgUrl:null,addFolder:1,folderName:'新建文件夹'}]
				}
			},
			index(v,b){
				if(this.index===6&&!this.isLogin){
					this.showLogreg(1)
					this.setIndex(b)
				}
			},
			isLogin(){
				if(this.isLogin){
					this.getFolderList()
					this.currentBlock=0
				}
      }
		},
		mounted(){
			setTimeout(()=>{
				if(this.isLogin)
					this.currentBlock=0
      })
		},
		beforeMount(){
			this.throttled=_throttle(this.scrollExec,200)
			this.getFolderList()
			if(this.getApiInfo){
				this.blockData1=[...this.blockData]
			}else {
				this.blockData1=[...this.blockData,{imgUrl:null,addFolder:1,folderName:'新建文件夹'}]
			}
			let _this=this;
			(new Drag(document.body))
				.setFunc({
					dragover:function(e){
						e.dataTransfer.dropEffect = 'copy'
					},
					drop:function(e){
						let files = e.dataTransfer.files
						_this.imgLoad(files)
					}
				})
				.start(["dragenter","dragleave","dragover","drop"])
			document.body.addEventListener('paste',e=>{
				console.log(e)
        if(window.localStorage.getItem('elesJsonForCopy')===null)
	        window.localStorage.setItem('elesJsonForCopy','')
        if(window.localStorage.getItem('elesJsonForCopy')!=='')
        	return
				let {items}=e.clipboardData
				let fileList=[]
				for(let i=0;i<items.length;i++){
					if (items[i].kind==='file'||items[i].type.indexOf('image')>-1) {
						let imageFile = items[i].getAsFile()
						fileList.push(imageFile)
					}
				}
				_this.imgLoad(fileList)
			})
		}
	}
</script>
<style lang="less" scoped>
  @import '../common';

  #leftPanel-upload{
    overflow: hidden;

    .leftPanel-upload-content{
      width: 312px;
      height: 100%;
      /*padding-left: 16px;*/
      box-sizing: border-box;
      position: relative;
      padding-top: 72px;
      overflow-y: auto;
      overflow-x: hidden;

      .leftPanel-upload-showType{
        width: 100%;
        height: 32px;
        padding-left: 16px;
        box-sizing: border-box;
        margin-bottom: 8px;

        .selectTextBlock{
          width: 132px;
          margin-right: 16px;
          float: left;

          &:nth-child(2){
            margin-right: 0;
          }
        }
      }

      .leftPanel-upload-content-prompt{
        position: absolute;
        top:80px;
        left:50%;
        transform: translateX(-50%);
        z-index: 199;
      }

      .leftPanel-upload-content-block{
        float: left;
        margin-top: 12px;
        margin-left: 24px;
      }

      .result-enter-active, .result-leave-active {
        opacity:1;
        transition: opacity .3s ease;
      }
      .result-enter, .result-leave-to{
        opacity:0;
      }

      .leftPanel-upload-content-results{
        position: absolute;
        left:0;
        top: 0;
        width: 312px;
      }

    }

  }
</style>