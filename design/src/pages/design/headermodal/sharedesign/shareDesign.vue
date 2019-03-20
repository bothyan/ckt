<!-- 
author:LFL
miss:更改查询状态中的code值 调换位置
time:20170906
-->
<template>
	<div>
		<div class="share-design" v-if="!shareAnimation">
			<div class="share-wrap">
				<div class="share-title">分享设计</div>
				<div class="share-search">
					<div class="share-serch-proname">
						<label for="" class="share-proname">作品名称：</label>
						<input type="text" placeholder="输入作品名称" class="share-writepro" v-model="sharetitles" maxlength="20">
						<span class="share-count">{{sharetitles.length}}/20</span><br />
						<span class="design-verify" v-show="verify">作品名称格式有误,请重新输入</span>
					</div>
					<div class="share-fresh center">
						<span>
							<span class="offimg" :class="[{onimg:Active}]" @click="choseActive"></span>
							<span>自动刷新分享内容</span>
						</span>
					</div>
				</div>
				<div class="share-bottom-button center">
					<span class="share-button public" @click="modalShowpublic">
						<span class="sharekinds">公开分享</span><img src="../img/yiwen.png" alt="" class="question"></span>
					<span class="share-button screct" @click="modalShowScrect"><img src="../img/v.png" alt="" class="design-v">
						<span class="sharekinds">私密分享</span><img src="../img/yiwen.png" alt="" class="question" @mouseover="needPassword=true" @mouseout="needPassword=false"></span>
					<p>
						<span class="word" v-show="needPassword">需要密码才能看到设计作品</span>
					</p>
				</div>
			</div>
		</div>
		<div v-else>
			<design-animation></design-animation>
		</div>
	</div>
</template>
<script>
import Modal from 'components/modal/modal.vue'
import shareDesignAnimation from './shareanimation'
import designEvent from 'dataBus/design'
	import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'sharedesign',
	data() {
		return {
			shareAnimation: false,
			modalPublicShare: false,
			needPassword: false,
			modalScrectShare: false,
			Active: false,
			sharetitles:''
		}
	},
	props:{
		sharetitle:{
			type:String
		}
	},
	computed: {
		...mapGetters({
			isVip:'getIsVip',
			teamId:'getTeamId'
		}),
		verify: function() {
			//设计名不能包含以下特殊字符//,/,:,*,?,"",<>,|
			var regStr = /[\/\\\:\*\?\"\<\>\|]/g;
			if (regStr.test(this.sharetitles)) {
				return true
			}
		}
	},
	components: {
		modal: Modal,
		DesignAnimation: shareDesignAnimation
	},
	mounted(){
		this.sharetitles = this.sharetitle
	},
	methods: {
			...mapActions({
				'setMessageShow':'setMessageShow'
			}),
		//获取分享信息
		makeShare(query) {
			this.$http.post('/share/makeShareV3', query).then(res => {
				let code = res.body.rc
				let passwordScret = res.body.p
				switch (code) {
					case 1:
						let queryImg = {
							d: query.d,
							a: query.a
						}
						if(this.teamId>0){
							queryImg.tid = this.teamId
						}
						this.getShareImageState(queryImg,query.ty,passwordScret)
						break;
					case 0:
					case -1:
					case -2:
					this.setMessageShow({ placeHolder: '失败'})
					break;
					case -3:
					this.setMessageShow({ placeHolder: '分享不存在'})
					break;
				}
			}).catch(error => console.log(error))
		},
		//查询生成状态
		getShareImageState(query, ty,passwordScret) {
			this.$http.post('/share/getMakeShareImageStatus', query).then(res => {
				let state = res.body.state
				switch (state) {
					case 3:
						//说明生成了
						if (ty == 1) {
							let data=this.shareAnimation=false
							this.$emit('showPublicLink',data)
							query.a==0?designEvent.setDesignShareState(1):designEvent.setDesignShareState(3)
							
						} else if (ty == 2) {
							let data = this.shareAnimation=false
							this.$emit('secrectParent', {passwordScret,data})
							query.a==0?	designEvent.setDesignShareState(2):designEvent.setDesignShareState(4)
						}
						break;
					case 0:
					case 1:
					case 2:
						setTimeout(() => this.getShareImageState(query, ty, passwordScret), 3000)
						break;
					case 4:
						this.setMessageShow({ placeHolder: '生成失败' })
						break;
				}
			}).catch(error => {
				console.log('error')
			})
		},
		modalPublicCloseShare: function() {
			this.modalPublicShare = false
		},
		//点击公开分享
		modalShowpublic: function() {
			if (this.sharetitles == "") {
				this.setMessageShow({ placeHolder: '请输入作品名称'})
			} else {
				this.$emit('changeDesignTitle',this.sharetitles)
				this.shareAnimation = true
				//关闭模态框叉子
				this.$emit('shuticon', this.shareAnimation)
				let designObj = designEvent.getDesignInfo()
				let query = {
					d: designEvent.getDesignInfo().designId,
					ty: 1,
					ti: this.sharetitles
				}
				if(this.teamId>0){
					query.tid= this.teamId
				}
				if (this.Active == false) {
					query.a = 0
				} else {
					query.a = 1
				}
				this.makeShare(query)
			}
		},
		modalScrectCloseShare: function() {
			this.modalScrectShare = false
		},
		//点击私密分享
		modalShowScrect: function() {
			if(this.isVip ==1){
				this.setMessageShow({ placeHolder: '此功能会会员功能，请升级为会员'})
				return;
			}
			if (this.sharetitles == "") {
				this.setMessageShow({ placeHolder: '请输入作品名称'})
			} else {
				this.$emit('changeDesignTitle',this.sharetitles)
				this.shareAnimation = true
				//关闭模态框叉子
				this.$emit('shuticon', this.shareAnimation)
				let query = {
					d: designEvent.getDesignInfo().designId,
					ty: 2,
					ti: this.sharetitles,
					de: ''
				}
				if(this.teamId>0){
					query.tid= this.teamId
				}
				if (this.Active == false) {
					query.a = 0
				} else {
					query.a = 1
				}
				this.makeShare(query)
			}
		},
		choseActive: function() {
			this.Active = !this.Active;
		}
	}
}
</script>
<style lang="less" scoped>
@import './sharedesign.less';
</style>