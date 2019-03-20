<!-- 
author:lfl
time:20170906
-->

<template>
	<div>
		<div class="share-design" v-if="!copyCodeShow">
			<div class="share-wrap">
				<div class="share-title">公开分享链接已创建</div>
				<div class="share-search">
					<div class="share-serch-proname">
						<input type="textarea" placeholder="分享链接" class="share-writepro" :value="sharelink" ref="sharelink" readonly>
						<span class="design-copy" @click="copySuccess" :data-clipboard-text="sharelink">复制</span>
					</div>
					<div class="share-fresh">
						<span>
							<span class="offimg" :class="[{onimg:Active}]" @click="choseActive"></span>
							<span>允许他人拷贝并使用设计（该设计内容不会被修改）</span>
						</span>
					</div>
					<div class="share-serch-proname send-pro">
						<!-- <input type="text" placeholder="邮箱地址" class="share-writepro" @keydown="isActive=true"> -->
						<mail-input placeholder="输入邮箱地址" name="mail" @inputValue="inputMail" @inputResult="getInputMailResult"></mail-input>
						<span class="design-send" :class="{active:isActive}" @click="sendEmail">发送</span>
					</div>
				</div>
				<div class="share-bottom-button center">
					<share-tool :shareTitle="sharetitle" :shareContent="sharecontent" :shareLink="sharelink" :ownImg="ownimg" @showqcode="showqcode"></share-tool>
					<div class="trangle-wrap">
						<div  @click="goBackTo">
							<img src="../img/trangle.svg">
						</div>
					</div>
				</div>

			</div>
		</div>
		<div v-else>
			<modal :type="qrcodetype" :modalShow="qrcodeShow" @modalClose="()=>$emit('closeCodeModal')" :closeShow="shuticon">
				<div class="qrcode-page">
					<span class="weixin-text">打开微信"扫一扫"</span>
					<qrcode :qrcodeurl="weixinShareUrl" size="150"></qrcode>
				</div>
			</modal>
		</div>
	</div>
</template>
<script>
import sharetool from './shareTool.vue'
import mailInput from 'components/input/input.vue'
import { mapGetters, mapActions } from 'vuex'
import qrcode from 'components/qrcode/qrcode.vue'
import modal from 'components/modal/modal.vue'
import designEvent from 'dataBus/design'
import Clipboard from 'clipboard'
export default {
	name: 'copylink',
	data() {
		return {
			Active: false,
			copyCodeShow: false,
			isActive: false,
			qrcodeShow: true,
			shuticon: true,
			qrcodetype: 'modal1',
			sharecontent: '这里有海量免费的素材和模板，只要会用鼠标拖拉拽，就可以用几分钟的时间轻松搞定海报、朋友圈封面、PPT、名片！学生党、微商、运营小编、社交达人们快来和我一起分享你的设计和创意吧！创客贴——设计从未如此简单有趣。'
		}

	},
	components: {
		shareTool: sharetool,
		mailInput: mailInput,
		qrcode: qrcode,
		modal: modal
	},
	props: {
		sharetitle: ''
	},
	methods: {
		...mapActions({
			setMessageShow: 'setMessageShow'
		}),
		//请求邮箱接口
		shareDesignByEmail(query) {
			this.$http.post('/design/shareDesignByEmail', query).then(res => {
				let code = res.body.code
				if(code==1){
					this.setMessageShow({ placeHolder: '发送成功', kind: 'success' });
				}else{
					this.setMessageShow({ placeHolder: '发送失败', kind: 'success' });
				}
			}).catch(error => {
				console.log(error)
			})
		},
		//停止分享
		goBackTo(){
			let query = {
				d:designEvent.getDesignInfo().designId,
				ty:0
			}
			this.makeShare(query)
		},
		makeShare(query) {
			this.$http.post('/share/makeShareV3', query).then(res => {
				let code = res.body.rc
				if(code==1){
					this.$emit('closeCopyLink')
					this.$emit('goBackToShare')
				}
			}).catch(error => console.log(error))
		},
		//更新分享状态
		updateShareState(query) {
			this.$http.post('/share/updatePublishState', query).then(res => {
				let code = res.body.code
				switch (code) {
					case 0:
						this.setMessageShow({ placeHolder: '更新分享状态错误！' });
						break;
					case -2:
						//说明未登录
						break;
					case 1:
						this.setMessageShow({ placeHolder: '更新分享状态成功！', kind: 'success' });
						break;
				}
			}).catch(error => {
				this.setMessageShow({ placeHolder: '更新分享状态错误！' });
				console.log(error)
			})
		},
		showqcode() {
			this.copyCodeShow = true
		},
		copySuccess: function() {
			let _this = this
			var clipboard = new Clipboard('.design-copy');
				clipboard.on('success', function(e) {
				e.clearSelection();
				_this.$store.dispatch('setMessageShow', { placeHolder: '复制成功', kind: 'success', });
			});
			clipboard.on('error', function(e) {
				_this.$store.dispatch('setMessageShow', { placeHolder: '复制错误', kind: 'error', });
			});
		},
		choseActive: function() {
			this.Active = !this.Active;
			let query = {
				 d: designEvent.getDesignInfo().designId
			}
			if (this.Active == true) {
				query.s = 3
				this.updateShareState(query)
			} else {
				query.s = 1
				this.updateShareState(query)
			}
		},
		inputMail(val) { // 取得输入的邮箱
			this.inputUsrValue = val;
		},
		getInputMailResult(data) {
			if (data == 'success') {
				this.isActive = true
			} else {
				this.isActive = false
			}
		},
		sendEmail() {
			let query = {
				email: this.inputUsrValue,
				designId: designEvent.getDesignInfo().designId
			}
			if (this.teamId > 0) {
				query.tid = this.teamId
			}
			this.shareDesignByEmail(query)

		}
	},
	computed: {
		...mapGetters({
			teamId:'getTeamId'
		}),
		sharelink() {
			let designid = designEvent.getDesignInfo().designId
			return window.location.protocol+'//'+window.location.hostname+'/mod/share/share.html?d=' + designid
			
		},
		ownimg() {
			return 'https://imgpub.chuangkit.com/design/2017/09/05/16432551_thumb?1504602201000'
		},
		weixinShareUrl(){
			let designid = designEvent.getDesignInfo().designId
			return 	window.location.protocol+'//'+window.location.hostname+'/mod/share/share.html?d=' + designid
		}
	}
}
</script>
<style lang="less" scoped>
@import 'copylink.less';
</style>


