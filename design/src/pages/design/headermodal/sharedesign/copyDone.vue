<!-- 
author:lfl
time:20170906
miss:复制链接和密码
-->
<template>
	<div>
		<div class="share-design">
			<div class="share-wrap">
				<div class="share-title">私密分享链接已创建</div>
				<div class="share-search">
					<div class="share-serch-proname">
						<input type="textarea" placeholder="作品链接" class="share-writepro" :value="sharelink" readonly ref="sharelink">
						<span class="design-copy">密码：
							<span>{{secrectPassword}}</span>
						</span>

					</div>
					<div class="share-fresh">
						<span>
							<span class="offimg" :class="[{onimg:Active}]" @click="choseActive"></span>
							<span>允许他人拷贝并使用设计
								<i style="opacity:0;">k</i>(该设计内容不会被修改)</span>
						</span><br/>
						<span class="copy-pass" @click="copySuccess" :data-clipboard-text="'链接：'+sharelink+ '密码：'+secrectPassword">复制链接和密码</span>
					</div>
					<div class="share-serch-proname send-pro">
						<mail-input placeholder="输入邮箱地址" name="mail" @inputValue="inputMail" @inputResult="getInputMailResult"></mail-input>
						<span class="design-send" :class="{active:isActive}" @click="sendEmail">发送</span>
					</div>
				</div>
				<div class="share-bottom-button center">
					<div class="chat">
					</div>
					<div class="trangle-wrap">
						<div  @click="goBackTo">
							<img src="../img/trangle.svg">
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>
<script>
import designEvent from 'dataBus/design'
import modal from 'components/modal/modal.vue'
import mailInput from 'components/input/input.vue'
import Clipboard from 'clipboard'
import { mapGetters,mapActions } from 'vuex'
export default {
	name: 'screctShare',
	data() {
		return {
			copysuccess: false,
			Active: false,
			isActive: false
		}
	},
	components: {
		mailInput: mailInput,
		modal: modal
	},
	props: {
		secrectPassword: {
			type: String
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
	},
	methods: {
		...mapActions({
			setMessageShow: 'setMessageShow'
		}),
		//请求邮箱接口
		shareDesignByEmail(query) {
			this.$http.post('/design/shareDesignByEmail', query).then(res => {
				let code = res.body.code
				if (code == 1) {
					this.setMessageShow({ placeHolder: '发送成功', kind: 'success' });
				} else {
					this.setMessageShow({ placeHolder: '发送失败', kind: 'success' });
				}
			}).catch(error => {
				console.log(error)
			})
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
					this.$emit('closeCopyDone')
					this.$emit('goBackToShare')
				}
			}).catch(error => console.log(error))
		},
		copySuccess: function() {
			let _this = this
			var clipboard = new Clipboard('.copy-pass');
			clipboard.on('success', function(e) {
				e.clearSelection();
				_this.$store.dispatch('setMessageShow', { placeHolder: '复制成功', kind: 'success', });
			});
			clipboard.on('error', function(e) {
				_this.$store.dispatch('setMessageShow', { placeHolder: '复制错误', kind: 'error', });
			});
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
		choseActive: function() {
			this.Active = !this.Active;
			let query = {
				d: designEvent.getDesignInfo().designId,
			}
			if (this.Active == true) {
				query.s = 4
				this.updateShareState(query)
			} else {
				query.s = 2
				this.updateShareState(query)
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
	}
}
</script>
<style lang="less" scoped>
@import './copydone.less';
</style>


