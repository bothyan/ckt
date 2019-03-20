<template>
  <div id="ss-upload">
    <input type="file" :id="id" style="display: none" @change="change" accept="image/jpeg,image/png,image/gif" ref="ssUpload" :multiple="multiple">
  </div>
</template>
<style></style>
<script>
	import CryptoJS from 'crypto-js'
	import {mapActions} from 'vuex'

	class upload{
		constructor({base64,id,rect},_this){
			this.__proto__=_this
			this.dataBin=atob(base64.split(',')[1])
			this.buffer = new Uint8Array(this.dataBin.length)
			for (let i = 0 ;i < this.dataBin.length ;i++) {
				this.buffer[i] = this.dataBin.charCodeAt(i)
			}
			this.blob = new Blob([this.buffer.buffer], {type: 'image/jpg'})
			computeMD5.apply(this).then(e=>{
				this.preUploadMaterial(e,id,rect)
			})

			function computeMD5(){
				return new Promise((resolve,reject)=>{
					let md5Instance = CryptoJS.algo.MD5.create()
					let reader = new FileReader()
					reader.readAsBinaryString(this.blob)
					reader.onload = (e)=> {
						md5Instance.update(CryptoJS.enc.Latin1.parse(e.target.result))
						let md5Value = md5Instance.finalize()
						resolve({md5:md5Value,blob:this.blob})
					}
				})
			}
		}

	}
	export default{
		data(){
			return{uploadList:[]}
		},
		props:{
			tid:{},
			fid:{
				default:0
			},
			ctrl:{},
			file:{},
			multiple:{
				default:true
			},
			id:{
				default:Date.now()
			}
		},
		methods:{
			...mapActions({
				setMessageShow:'setMessageShow'
			}),
			change(){
				let fileList=this.$refs.ssUpload.files,task=[]
				if(fileList.length===0){
					this.$emit('uploadEnd')
					return
				}
				for(let i=0;i<fileList.length;i++){
					let file=fileList[i]
					console.log(file.size/1048576,'MB')
					if(file.size>1048576*20){
						this.setMessageShow({placeHolder:'仅支持上传20M以下的图片',kind:'error'})
						break
					}
					this.$emit('readFileStart')
					task.push(fR(fileList,i))
				}
				Promise.all(task).then(resolve=>{
					this.$refs.ssUpload.value=null
          this.uploadStart()
					this.$emit('imgData',resolve)
					resolve.forEach(e=>{
						this.uploadList.push(new upload(e,this))
					})
				})

				function fR(fileList,i) {
					return new Promise((resolve,reject)=>{
						let fr=new FileReader(),id=Date.now()+''+i
						fr.readAsDataURL(fileList[i])
						fr.onload=(e)=>{
							let base64=e.target.result,img=new Image()
							img.src=base64
							img.onload=e=>{
								resolve({base64,id,rect:{w:img.width,h:img.height}})
							}
						}
					})
				}
			},
			//上报个人/团队素材的上传结果
			reportUpload(p,s,id,{w,h}){
				this.$http.post('/material/reportUploadMaterial',{p,s,fid:this.fid,tid:this.tid,w,h}).then(res=>{
					let {dt,mid,w,h,fid,ik,code,url}=res.data.body
					switch (code){
						case 1:this.$emit('uploadSuccess',{dt,mid,w,h,fid,ik,url,id});break
						default:this.$emit('uploadFail', {id})
					}
				},e=>{
          this.$emit('uploadFail', {id})
					console.log('err')
				})
			},
			//上传素材
			uploading(OSSAccessKeyId,policy,Signature,key,host,md5,file,id,rect){
				let fd=new FormData
				fd.append('OSSAccessKeyId',OSSAccessKeyId)
				fd.append('policy',policy)
				fd.append('Signature',Signature)
				fd.append('key',key)
				fd.append('Content-MD5',md5)
				fd.append('file',file)

				this.$http({url:'//'+host,method:'post',data:fd,onUploadProgress:this.progress.bind(this,id)}).then(res=>{
					this.reportUpload(policy,Signature,id,rect)
				},e=>{
					console.log('err')
				})
			},
			progress(id,e){
				this.$emit('progress',{progress:Math.round( (e.loaded * 100) / e.total ),id})
			},
			// 开始上传
			uploadStart() {
				this.$emit('uploadStart')
			},
			// 上传成功
			uploadSuccess(e) {
				this.$emit('uploadSuccess',e)
			},
			//获取个人/团队素材的上传地址
			preUploadMaterial({md5,blob},id,rect){
				let fd=new FormData
				fd.append('md5',md5)
				fd.append('file',blob.slice(0, 10))
				fd.append('fid',this.fid)
				fd.append('tid',this.tid)

				this.$http.post('/material/preUploadMaterial',fd).then(res=>{
					if(res.data.body.uploadPms) {
						var {accessid,policy,signature,fileKey,host,md5}=res.data.body.uploadPms
					}else {
						var {dt,mid,w,h,fid,ik,url} = res.data.body
					}

					switch (res.data.body.code){
						case 1:this.uploadSuccess({dt,mid,w,h,fid,ik,url,id});break
						case 0:this.uploading(accessid,policy,signature,fileKey,host,md5,blob,id,rect);break
						default:this.$emit('uploadFail', {id})
					}

				},e=>{
					console.log(e)
				})
			}
		},
		watch:{
			ctrl(to){
				let input=this.$refs.ssUpload
				input.click()
			},
			file(base64){
				if(base64){
					let img=new Image()
					img.src=base64
					let id=Date.now()+'0'
					img.onload=()=>{
            let data={
              base64,
              id,
              rect:{w:img.width,h:img.height}
            }
						this.$emit('imgData',[data])
						this.uploadStart()
						new upload(data,this)
					}
				}
			}
		}
	}
</script>
