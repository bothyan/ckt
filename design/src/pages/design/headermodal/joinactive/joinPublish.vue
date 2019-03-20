<template>
	<div>
		<div class="share-design" v-if="!copyCodeShow">
			<div class="share-wrap">
				<div class="share-title">你的作品已经发布成功</div>
				<div class="share-search">
					<div class="share-serch-proname">
						<input type="text" placeholder="分享链接" class="share-writepro" :value="sharelink" readonly>
						<span class="design-copy designWidth" @click="copySuccess" :data-clipboard-text="sharelink">复制</span>
						<a class="design-copy designOnnet" :href="sharelink" target="_blank">在网页上打开</a>
					</div>
				</div>
				<div>
					<a class="design-copy design-lookactive" :href="hasJoined" target="_blank">查看参加的活动</a>
				</div>
				<div class="share-bottom-button center">
					<share-tool :shareTitle="sharetitle" :shareContent="sharecontent" :shareLink="sharelink" :ownImg="ownimg" @showqcode="showqcode"></share-tool>
				</div>
			</div>
		</div>
		<div v-else>
				<div class="qrcode-page">
					<span class="weixin-text">打开微信"扫一扫"</span>
					<qrcode :qrcodeurl="weixinShareUrl" size="150"></qrcode>
				</div>
		</div>
	</div>
</template>
<script>
import sharetool from '../sharedesign/shareTool.vue'
import qrcode from 'components/qrcode/qrcode.vue'
import modal from 'components/modal/modal.vue'
import Clipboard from 'clipboard'
export default {
	name: 'joinActive',
	data() {
		return {
			needPassword: false,
			copysuccess: false,
			Active: false,
			isActive: false,
			copyCodeShow: false,
			qrcodeShow: true,
			weixinShareUrl: '',
			qrcodetype: 'modal1',
			shutCrossIcon: false,
			sharecontent: '我参加了本次活动,快来给点赞,我和奖品就差个你了~'
		}

	},
	components: {
		shareTool: sharetool,
		qrcode: qrcode,
		modal: modal
	},
	props: {
		sharetitle: '',
		showInputmessage: '',
		selectmenuId: {
			type: null
		}
	},
	methods: {
		showqcode() {
			this.copyCodeShow = true
			this.$emit('closeActiveModal')
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
		}
	},
	computed: {
		sharelink: function() {
			return window.location.origin + '/activecenter/share?workId=' + this.showInputmessage
		},
		hasJoined: function() {
			return '/activecenter/active?id=' + this.selectmenuId + '&order=0&pageNo=1'
		},
		ownimg() {
			return 'https://imgpub.chuangkit.com/design/2017/09/05/16432551_thumb?1504602201000'
		}
	},
	watch: {

	}
}
</script>
<style lang="less" scoped>
.center {
	text-align: center;
}

.qrcode-page {
	width: 200px;
	height: 200px;
	background-color: #fff;
	text-align: center;
	padding-top: 16px;
	border-radius: 4px;
	box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .08);
	p {
		margin-top: 8px;
	}
}

.weixin-text {
	display: inline-block;
	margin-bottom: 8px;
}

.share-wrap {

	width: 640px;

	height: 400px;

	background-color: #FFFFFF;

	border-radius: 5px;
}

.chat {
	height: 117px;
	line-height: 117px;
	span {
		display: inline-block;
		&:nth-child(2) {
			margin: 0 56px;
		}
	}
}

.share-title {

	width: 100%;

	height: 120px;

	line-height: 120px;

	text-align: center;

	font-size: 24px;

	color: #626262;
}

.share-proname {

	font-size: 14px;

	color: #626262;
}

.share-search {
	margin-top: -10px;
	.joinShare {
		margin-left: 73px;
	}
}

.share-serch-proname {

	margin-top: 13px;

	margin-left: 73px;
	.designWidth {
		width: 85px;
	}
	.designOnnet {
		width: 136px;
	}
}

.share-search .share-writepro {
	width: 250px;
	height: 42px;
	line-height: 42px;
	border: 1px solid #F3F3F3;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .08);
	background: #FBFBFB;
	padding-left: 20px;
	color: #CECECE;
	&::-webkit-input-placeholder {
		color: #cdcdcd;
	}
}

.design-copy {
	height: 40px;
	display: inline-block;
	line-height: 40px;
	text-align: center;
	background: #07AEFC;
	color: #fff;
	font-size: 14px;
	margin-left: 24px;
	cursor: pointer;
	&:hover {
		background-image:linear-gradient(90deg,#5ea2ff,#00e3ff);
	}
}

.design-lookactive {
	width: 160px;
	position: relative;
	left: 50%;
	margin-left: -80px;
	margin-top: 30px;
}
</style>


