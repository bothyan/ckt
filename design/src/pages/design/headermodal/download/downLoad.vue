<!--
author:lfl
miss:从仓库取出设计id和页码总数更改code值
explain:下载功能组件包括下载弹窗和下载动画
time:2017.9.1
 -->
<template>
	<div>
		<div class="share-design" v-if="!downLoadAnimation">
			<div class="share-wrap">
				<div class="share-title">下载作品</div>
				<div class="share-search">
					<div class="share-search-proname">
						<tab :flag.sync='tabsShowFlag' :navtitle='navTitle' :navdata='navData' @choseindex="choseindex">
							<div class="tabs-body">
								<div v-if='navData[0].showFlag>0'>
									<div class="tab-pic">
										<div>
											<check-radio @choseVal="choseVal" ref="picinput"></check-radio>
										</div>

									</div>
								</div>
								<div v-if='navData[1].showFlag>0'>
									<div class="tab-pic">
										<pdf-radio @choseValPdf="choseValPdf" ref="pdfinput"></pdf-radio>
									</div>
								</div>
								<div v-if='navData[2] && navData[2].showFlag>0'>
									<div class="tab-pic">
										<ppt-radio @choseValppt="choseValPpt" ref="pptinput"></ppt-radio>
									</div>
								</div>
							</div>
						</tab>
					</div>
					<div class="share-search-proname send-pro ">
						<span class="design-send suredownload" @click.stop="sureDownLoad(1)">确认下载</span><br/>
						<span class="down-to-phone" @click.stop="sureDownLoad(2)" v-if='navData[0].showFlag>0'>下载到手机</span>
						<a class="go-to-font" href="http://pan.baidu.com/s/1qXIsNGK" target="_blank" v-if='navData[2] && navData[2].showFlag>0'>本地没有字体？</a>
					</div>
				</div>
				<div class="share-bottom-button center">
				</div>
					<div v-if="navData[1] && navData[1].showFlag>0&&designInfo.isPrint==true">
						<div class="cktprint-content">
							<span>超高性价比</span>
							<span>极速发货</span>
							<span>质量保证</span>
							<span class="have-try" @click="goToprint">去印刷</span>
						</div>
					</div>
			</div>
	
		</div>
		
		<div v-else-if ="phoneCodeShow">
				<div class="qrcode-page">
					<qrcode :qrcodeurl="weixinShareUrl" size="150"></qrcode>
						<span class="weixin-text">使用微信扫一扫，扫码下载</span>
				</div>
		</div>
		<div v-else>
			<load-animation
			:changeAnimationWords="changeAnimationWords"
			:waitAnimationWords="waitAnimationWords"></load-animation>
		</div>
	</div>
</template>
<script>
import tab from 'components/tab/tab.vue' //引入组件
import checkRadio from './checkradio.vue'
import pdfRadio from './radiopdf.vue'
import pptRadio from './radioppt.vue'
import { mapGetters, mapActions } from 'vuex'
import loadAnimation from './downloadanimation'
import designEvent from 'dataBus/design'
import qrcode from 'components/qrcode/qrcode.vue'
import modal from 'components/modal/modal.vue'
export default {
	name: 'downLoad',
	components: {
		tab,
		checkRadio,
		pdfRadio,
		pptRadio,
		loadAnimation,
		modal,
		qrcode
	},
	data() {
		return {
			downLoadAnimation: false,
			tabsShowFlag: true,
			navTitle: '',
			phoneCodeShow:false,
			qrcodeShow: true,
			shuticon: false,
			weixinShareUrl: '',
			qrcodetype: 'modal1',
			changeAnimationWords:'',
			waitAnimationWords:''
		
		}
	},
	computed: {
		...mapGetters({
			teamId:'getTeamId',
			designInfo:'getDesignInfo'
		})
	},
	props:{
		navData:{
			type:Array
		}
	},
	methods: {
		...mapActions({
			setMessageShow: 'setMessageShow'
		}),
		goToprint(){
			this.$emit('closePrintModal')
			 window.open('/orderdetails?d='+designEvent.getDesignInfo().designId)
		},
		choseindex(data) {
			this.chosetype = data
		},
		//添加图片下载任务
		getDownData(queryconfig,type) {
			this.downLoadAnimation = true
			this.phoneCodeShow = false
			this.$emit('shuticon')
			queryconfig.tid = this.teamId ? this.teamId : 0
			this.$http.post('/design/addMakeImageTask', queryconfig).then(res => {
				let code = res.body.code
				switch (code) {
					case 1:
						//查询图片生成状态
						let getState = {
							d: queryconfig['d'],
							type: queryconfig['type'],
							tid: queryconfig['tid']
						}
						
						type==1?getState.resultType=0:getState.resultType=1
						//这里需要判断点击的是哪个按钮
						this.getImageState(getState,type)
						break;
					case -1:
						this.setMessageShow({ placeHolder: '参数错误' })
						this.$emit('closeAnimation', this.downLoadAnimation)
						this.$emit('showQrcodeIcon')
						break;
					case -2:
						this.setMessageShow({ placeHolder: '权限不足' })
						this.$emit('closeAnimation', this.downLoadAnimation)
						this.$emit('showQrcodeIcon')
						break;
					case -3:
						this.setMessageShow({ placeHolder: '图片类型错误' })
						this.$emit('closeAnimation', this.downLoadAnimation)
						this.$emit('showQrcodeIcon')
						break;
					case -4:
						this.setMessageShow({ placeHolder: '登录超时' })
						this.$emit('closeAnimation', this.downLoadAnimation)
						this.$emit('showQrcodeIcon')
						break;

				}
			}).catch(error => {
				console.log(error)
			})
		},
		//查询图片生成状态
		getImageState(query,type) {
			let _this = this
      query.tid = this.teamId ? this.teamId : 0;
			this.$http.post('/design/getMakeImageState', query,type).then(res => {
				console.log(query)
				let code = res.body.state
				switch (code) {
					case 0:
					case 1:
					case 2:
						setTimeout(() => this.getImageState(query,type), 3000)
						if(query.type==4){
							//改变动画内容
							// setTimeout(function(){
							// 	_this.changeAnimationWords = ''
							// },1000)
							setTimeout(function(){
								_this.changeAnimationWords = '如页数/内容较多生成时间会较长(10min左右)'
								_this.waitAnimationWords = '请稍等...'
							},10000)
						}
						break;
					case 3:
						//说明生成了
						if(type==1){
							this.$emit('closeAnimation')
							//触发浏览器下载行为
							let url = res.body.url
							var a = document.createElement('a');
							a.href = url;
							a.download = "proposed_file_name";
							a.click();
							//控制模态框叉子的出现
							this.$emit('showQrcodeIcon')
						}else{
								this.phoneCodeShow = true
								this.$emit('showQrcodeIcon')
								//this.weixinShareUrl = 'https://www.chuangkit.com/download?did='+query.d+'&type='+query.type+'&token='+res.body.token
								this.weixinShareUrl = window.location.protocol+'//'+window.location.hostname+'/download?did='+query.d+'&type='+query.type+'&token='+res.body.token
						}
						break;
					case 4:
						this.setMessageShow({ placeHolder: '登录超时' })
						break;
					case 5:
						this.$emit('closeAnimation')
						alert('抱歉，系统检测到您的设计(id:' + query.d + ')下载出错。请您联系创客贴服务QQ:2316289865或致电创客贴服务电话:400-871-8211，我们会第一时间帮助您解决遇到的问题。创客贴的成长期待您的帮助和反馈。')
						break;
					case 6:
						this.setMessageShow({ placeHolder: '没有该任务信息' })
						break;
				}
			}).catch(error => {
				console.log(error)
			})
		},
		sureDownLoad(type) {
			//这里需要多方面判断分三个场景
			//1.用户选择图片场景
					if (typeof (this.chosetype) == "undefined" || this.chosetype.list == "图片") {
					if(this.$refs.picinput.checkNum()==false){
						return;
					}else{
						this.getDownData(this.choseData,type)
					}
					
				}
				//用户选择pdf场景
				else if (this.chosetype.list == "PDF印刷") {
					if(this.$refs.pdfinput.checkNum()==false){
						return;
					}else{
						this.getDownData(this.choseDatapdf,type)
					}
					
				}
				//用户选择ppt场景
				else {
					if(this.$refs.pptinput.checkNum()==false){
						return;
					}else{
						this.getDownData(this.choseDatappt,type)
					}
					
				}
			
		
		},
		//选择图片场景传递的值
		choseVal(data) {
			this.choseData = data
		},
		//选择ppt场景传递的值
		choseValPdf(data) {
			this.choseDatapdf = data
		},
		//选择pdf场景传递的值
		choseValPpt(data) {
			this.choseDatappt = data
		}
	},
	mounted() {
	
	},
	watch: {

	}
}


</script>
<style lang="less" scoped>
@import 'download.less';
.qrcode-page {
  width: 200px;
  height: 200px;
  background-color: #fff;
  text-align: center;
  padding-top: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0, .08);
  span {
    margin-top: 8px;
  }
}
.weixin-text{
  display:inline-block;
  margin-bottom:8px;
}
</style>
