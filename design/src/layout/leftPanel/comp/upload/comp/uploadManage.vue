<template>
  <div class="leftPanel-upload-manage" ref="dom">

    <div class="leftPanel-upload-manage-top">
      <div class="leftPanel-upload-manage-top-line1">
        <span
          class="selectTextBlock"
          @click="uploadClick"
        >
          电脑上传图片
        </span>
        <upload
          :fid="currentFid"
          :tid="isTeam?teamId:0"
          :file="dragImgData"
          id="uploadMaterial"
          @progress="uploadImageProgressCtrl"
          @imgData="uploadImageCtrl"
          @uploadSuccess="uploadImageSuccess"
          @uploadFail="uploadFail"
          @readFileStart="loadFinish=false"
          @uploadStart="loadFinish=true"
        ></upload>
        <span
          class="selectTextBlock"
          @click="uploadByQRcode"
        >
          手机上传图片
        </span>
        <div class="leftPanel-upload-manage-top-line1-manage" @click="uploading||(manage=!manage)" :class="{active:manage}">
          <span></span>
          <span>{{manage?'退出':'管理'}}</span>
        </div>
      </div>
      <div class="leftPanel-upload-manage-top-line2">
        <p>支持上传20M以下的png、jpeg格式文件</p>
        <p><a href="http://edu.chuangkit.com/forum.php?mod=viewthread&tid=587" target="_blank">上传失败？点击查看原因</a></p>
      </div>
    </div>
    <div class="leftPanel-upload-manage-content">
      <div class="leftPanel-upload-manage-content-ctrl"
           :class="{active:manage}">
        <span>移动至：</span>
        <dropDown
          class="drop-down"
          :data="selectOpt" :reSet="reSet" @select="moveItem"
          :optionWidth="146"
          :dropDownDisabled="operDisabled"
        ></dropDown>
        <div
          class="del"
          :class="{disabled:operDisabled}"
          @click="!operDisabled&&delConfirm()"
        ></div>
      </div>
      <div class="leftPanel-upload-manage-content-waterfall">
        <waterfall
          class="leftPanel-upload-manage-content-waterfall-waterfall"
          :waterfallWidth="280"
          :propData="propData"
          :maxDiff="20"
        >
          <template scope="waterfall">
            <item
              :data="waterfall.listData"
              @select="e=>{selectedCtrl(e,waterfall.listData)}"
              :addToPageCtrl="addToPageCtrl[waterfall.listData.index]"
              :showMore="waterfall.listData.sourceData.showMore"
              :selectStart="manage"
              :selected="waterfall.listData.sourceData.selected"
              @updateMountedIndex="updateMountedIndex"
            ></item>
          </template>
        </waterfall>
        <div class="leftPanel-upload-manage-content-waterfall-noMore" v-show="isLastPage">
          <span>已经没有更多了</span>
        </div>
        <div class="leftPanel-result-loading"
             v-show="loading"
        ></div>
        <div class="leftPanel-result-full"
             v-show="!loadFinish"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
	import dropDown from 'components/dropDown/dropDown.vue'
	import waterfall from 'ss-waterfall'
	import {searchAllMaterialsByKind} from '../../searchAllMaterialsByKind'
	import item from './uploadManageBlock.vue'
	import upload from './uploadFunc.vue'
	import {mapGetters,mapActions} from 'vuex'
	import modal from 'components/modal/modal.vue'

	export default {
		name:'leftPanel-upload-manage',
		data(){
			return{
				recordData:[],
				propData:[],
				pageNo:1,
				pageTotal:1,
				loading:false,
				manage:false,
				reSet:false,
				uploadButton:false,
				currentFid:null,
				uploading:false,
				uploadingCount:[],//上传计数
				loadFinish:false,
				hasEdit:false,
				isLastPage:false,
				dragImgFlag:false,
				addToPageCtrl:[],
        hasMountedIndex:0,
        updateCount:0
			}
		},
		props:{
			folderList:{},
			current:{},
			position:{},
			scroll:{},
			dragImgData:{},
			getUploadImgCtrl:{},
			isTeam:{}
		},
		methods:{
      updateMountedIndex(index){
        if(index>this.hasMountedIndex)
          this.hasMountedIndex=index
      },
			uploadClick(){
				document.getElementById('uploadMaterial').click()
			},
			refresh(){
				this.$nextTick(()=>{
					console.log('refresh!!!')
					this.pageNo=1
					this.manage=false
//				this.recordData=[]
					this.getMaterialsInFolder(this.currentFid,true)
				})
			},
			getMaterialsInFolder(fid,f){
				this.loading=true
				this.$http.post('/material/getMaterialsInFolder',{pageNo:this.pageNo,fid,tid:this.isTeam?this.teamId:0,w:200,pageSize:20})
					.then(e=>{
						if(e.data.body){
							if(e.data.body.page){
								this.loading=false
								if(f){
									this.recordData=e.data.body.page.recordData
								}else {
									if(e.data.body.page.recordData.length===0){
										this.isLastPage=true
										return
									}
									this.recordData.push(...e.data.body.page.recordData)

								}
                this.isLastPage=this.recordData.length%20!==0
								this.pageTotal=e.data.body.page.pageTotal
							}
						}
					},err=>{
						this.setMessageShow({placeHolder:'网络出错',kind:'error'})
						console.log(err)
					})
			},
			selectedCtrl(el,{index}){
				let array=[]
				this.propData.forEach((e,i)=>{
					array[i]={...e,showMore:false,selected:i===index?el:this.propData[i].selected}
				})
				this.propData=array
			},
			delConfirm(){
				let _this=this
				this.$emit('delItem',{text:'确定要删除选定素材吗？',func:delFunc})
				function delFunc() {
					_this.delItem(_this)
				}
			},
			delItem(_this){
				let {query,index}=_this.computeItem()
				let len = query.m_ids.split(',').length
				_this.$http.post('/material/delMaterials',{...query,tid:_this.isTeam?_this.teamId:0})
					.then(e=>{
						if(e.data.body){
							let code=e.data.body.code
							switch (code){
								case 1:
									_this.recordData=_arraySplice(_this.recordData,index)
									_this.hasEdit=true
									_this.refresh()
									_this.$emit('folderMaterialCounts',-len)
									this.setMessageShow({placeHolder:'删除成功',kind:'success'})
									break
								case 0:
									this.setMessageShow({placeHolder:'删除失败',kind:'error'})
									break
								case -2:
									this.setMessageShow({placeHolder:'请登录',kind:'error'})
									this.showLogreg(1)
									break
								case -3:
									this.setMessageShow({placeHolder:'删除失败',kind:'error'})
									console.warn('参数错误')
									break
								case -4:
									this.setMessageShow({placeHolder:'删除失败',kind:'error'})
									console.warn('权限不足')
									break
							}
						}
					},err=>{
						this.setMessageShow({placeHolder:'网络出错',kind:'error'})
						console.log(err)
					})
			},
			moveItem({id}){
				let {query,index}=this.computeItem()
				this.reSet=!this.reSet
				this.$http.post('/material/moveMaterials',{...query,tid:this.isTeam?this.teamId:0,nfid:id})
					.then(e=>{
						if(e.data.body){
							let code=e.data.body.code
							switch (code){
								case 1:
									this.recordData=_arraySplice(this.recordData,index)
									this.hasEdit=true
									this.setMessageShow({placeHolder:'移动成功',kind:'success'})
									this.refresh()
									break
								case 0:
									this.setMessageShow({placeHolder:'移动失败',kind:'error'})
									break
								case -2:
									this.setMessageShow({placeHolder:'请登录',kind:'error'})
									this.showLogreg(1)
									break
								case -3:
									this.setMessageShow({placeHolder:'移动失败',kind:'error'})
									console.warn('参数错误')
									break
								case -4:
									this.setMessageShow({placeHolder:'移动失败',kind:'error'})
									console.warn('权限不足')
									break
							}
						}
					},err=>{
						console.log(err)
						this.setMessageShow({placeHolder:'网络出错',kind:'error'})
					})
			},
			computeItem(){
				let a=[],index=[]
				this.propData.forEach((e,i)=>{
					if(e.selected){
						a.push(e.mid)
						index.push(i)
					}
				})
//        console.log(index)
				return {query:{fid:this.folderList[this.current].folderId,m_ids:a.join(',')},index}
			},
			uploadByQRcode(){
				let fid=this.folderList[this.current].folderId
				this.$http.post('/material/getUploadToken',{fid,tid:this.isTeam?this.teamId:0})
					.then(res=>{
						if(res.data.body){
							let data=res.data.body
							if(data.code===1){
								let src = window.location.protocol + '//' + window.location.hostname + '/upload?t=' + data.token
								this.setQrCodeUrl(src)
								this.setQrCodeShow(true)
							}else {
								this.setMessageShow({placeHolder:'素材上传令牌获取失败',kind:'error'})
							}
						}
					},err=>{
						console.log(err)
						this.setMessageShow({placeHolder:'网络出错',kind:'error'})
					})
			},
			uploadImageCtrl(imgList){
				let array=[]
				this.uploading=true
				imgList.forEach(e=>{
					array.push({
						imgUrl:e.base64,
						uploadId:e.id,
						uploadProgress:0,
						width:e.rect.w,
						height:e.rect.h,
						selected:false,
					})
					this.uploadingCount.push(1)
				})
				this.hasEdit=true
				this.propData.unshift(...array)
			},
			uploadImageProgressCtrl({progress,id}){
				console.log(progress,id)
				let array=[]
				this.propData.forEach(e=>{
					array.push({
						...e,
						uploadProgress:id===e.uploadId?progress:e.uploadProgress
					})
				})
				this.propData=array
			},
			uploadImageSuccess({dt,mid,w,h,fid,ik,url,id}){
				this.uploadingCount.pop()
				this.uploading=!(this.uploadingCount.length===0)
				let array=[]
				this.propData.forEach(e=>{
					if(id===e.uploadId){
						array.push({...e,dt,mid,w,h,fid,ik,url,uploadProgress:100})
					}else {
						array.push(e)
					}
				})
				this.propData=array
				array=[]
				this.$nextTick(()=>{
				  this.hasMountedIndex+=1
          this.updateCount+=1
					this.propData.forEach(e=>{
						if(id===e.uploadId){
							array.push({...e,dt,mid,w,h,fid,ik,url,uploadId:false,showMore:false,selected:false,hasMountedIndex:this.hasMountedIndex})
						}else{
							array.push({...e,hasMountedIndex:this.hasMountedIndex})
						}
					})
					this.propData=array;
//					(this.uploadingCount.length===0)&&this.refresh()
					this.$emit('folderMaterialCounts',1)
					if(this.dragImgFlag) {
						this.$set(this.addToPageCtrl,0,!this.addToPageCtrl[0])
						this.dragImgFlag=false
					}
				})

			},
      //失败时剔除
      uploadFail({id}){
        this.uploadingCount.pop()
        this.uploading=!(this.uploadingCount.length===0)
        let array=[]
        this.propData.forEach(e=>{
          if(id!==e.uploadId){
            array.push(e)
          }
        })
        this.setMessageShow({placeHolder:'网络出错,上传失败',kind:'error'})
        this.propData=array
      },
			...mapActions({
				setQrCodeShow:'setQrCodeShow',
				setQrCodeUrl:'setQrCodeUrl',
				setMessageShow:'setMessageShow',
				showLogreg:'showLogreg'
			})
		},
		computed:{
			selectOpt(){
				let sel=this.folderList[this.current].folderName,opt=[]
				this.currentFid=this.folderList[this.current].folderId
				this.folderList.forEach((e,i)=>{
					opt.push({dis:false,des:e.folderName,
						sel:i===this.current,id:e.folderId})
				})

				return {sel,opt,id:null}
			},
			//禁止操作
			operDisabled(){
				let a=true
				this.propData.forEach(e=>{
					if(e.selected)
						a=false
				})
				return a
			},
			...mapGetters({
				teamId:'getTeamId',
				isVip:'getIsVip',
				isLogin:'getIsLogin',
				qrCodeShow:'getQrCodeShow',
//				getUploadImgCtrl:'getUploadImgCtrl'
			}),
//      isLastPage(){
//	      return !Number.isInteger(this.propData.length/10)
//      }
		},

		watch:{
			getUploadImgCtrl(){
				this.uploadButton=!this.uploadButton
			},
			recordData(){
				let array=[]
        let {hasMountedIndex} = this
				this.recordData.forEach((e,i)=>{
					if(i<this.propData.length){
						array[i]={...e,imgUrl:e.imgurl,width:e.w,height:e.h,showMore:false,selected:!!this.propData[i].selected,hasMountedIndex}
					}else {
						array[i]={...e,imgUrl:e.imgurl,width:e.w,height:e.h,showMore:false,selected:false,hasMountedIndex}
					}
				})
				this.loadFinish=false
				_imageLoaded(array)
					.then(()=>{
						this.loadFinish=true
					})
				this.propData=array
			},
			dragImgData(v){
				if(v&&v!=='')
					this.dragImgFlag=true
			},
			propData(){
//				this.isLastPage=(this.propData.length-this.updateCount)%20!==0
				this.$nextTick(()=>{
					this.$emit('resize',this.$refs.dom.offsetHeight)
					if(this.$refs.dom.offsetHeight+this.position.top<this.position.parentHeight
						&&!this.isLastPage&&!this.loading&&!this.uploading){
						this.pageNo+=1
					}
				})
			},
			qrCodeShow(v){
				if(!v){
					this.refresh()
				}
			},
			manage(){
				if(this.manage===false){
					let array=[]
					this.recordData.forEach((e,i)=>{
						array[i]={...e,imgUrl:e.imgurl,width:e.w,height:e.h,showMore:false,selected:false}
					})
					this.propData=array
				}
				this.$nextTick(()=>{
					this.$emit('resize',this.$refs.dom.offsetHeight)
				})
			},
			pageNo(v,o){
				if(v>o&&o>0)
					this.getMaterialsInFolder(this.currentFid)
			},
			scroll(){
				if(!this.isLastPage&&!this.loading&&!this.uploading){
					this.pageNo+=1
				}
			},
		},
		mounted(){
			this.$nextTick(()=>{
				this.$emit('resize',this.$refs.dom.offsetHeight)
			})
//			this.test(7,null,this.pageNo,true)
			this.getMaterialsInFolder(this.currentFid,true)
		},
		components:{
			dropDown,waterfall,item,upload,modal
		}
	}

	//用于数组删除指定下标项
	function _arraySplice(array,index) {
		let arr=[]
		array.forEach(e=>{
			arr.push(e)
		})
		for(let i=index.length-1;i>=0;i--){
			arr.splice(index[i],1)
		}
		return arr
	}

	function _imageLoaded(arr) {
		let arrs=[]
		arr.forEach(({imgUrl})=>{
			arrs.push(
				function () {
					return new Promise((resolve,reject)=>{
						let img= new Image
						img.src=imgUrl
						img.onload=e=>{
							resolve()
						}
					})
				}
			)
		})

		return Promise.all(arrs)
	}
</script>
<style lang="less" scoped>
  @import "./uploadManage";
</style>