<template>
	<div class="share-design">
		<div class="share-wrap" v-show="activeState">
			<div class="share-title">参加活动</div>
			<div class="share-search">
				<div class="share-serch-proname">
					<label for="" class="share-proname">作品名称：</label>
					<input type="text" placeholder="输入作品名称" class="share-writepro" maxlength="20" v-model="sharetitle">
					<span class="share-count">{{sharetitle.length}}/20</span><br />
					<span class="design-verify" v-show="verify">作品名称格式有误,请重新输入</span>
				</div>
				<div class="share-serch-proname clearfix">
					<label for="" class="share-proname">作品描述：</label>
					<textarea class="description-input" placeholder="输入作品描述" maxlength="40" v-model="sharedes"></textarea>
					<span class="share-areacount">{{sharedes.length}}/40</span><br />
				</div>
				<p class="select-text">选择你要参加的活动</p>
				<div class="select-wrap">
					<drop-down style="width: 300px; margin-left:73px;" 
					:dData="activelist" 
					:trigger="click" 
					@select="selectMenu"
					:hasDone="hasDone"
					>
					</drop-down>
					<div class="join-now" @click="joinImmediately">立即参加</div>
				</div>
			</div>

		</div>
		<modal :modalShow="modalActive" type="modal1" @modalClose="$emit('closeActiveModal')">
			<join-publish :showInputmessage="showInputmessage" :selectmenuId="selectMenuId" @closeActiveModal="activeState=false"></join-publish>
		</modal>
	</div>
</template>
<script>
import dropDown from 'ss-drop-down'
import modal from 'components/modal/modal.vue'
import joinPublish from './joinPublish.vue'
import { mapGetters, mapActions } from 'vuex'
import designEvent from 'dataBus/design'
export default {
	name: 'joinactive',
	data() {
		return {
			sharetitle: '',
			activelist: [],
			click: 'click',
			modalActive: false,
			sharedes: '',
			hasDone:'',
			showInputmessage: '',
			selectMenuId: '',
			activeState:true
		}
	},
	computed: {
		//作品名称验证
		verify: function() {
			//设计名不能包含以下特殊字符//,/,:,*,?,"",<>,|
			var regStr = /[\/\\\:\*\?\"\<\>\|]/g;
			if (regStr.test(this.sharetitle)) {
				return true
			}else{
				return false
			}
		},
		//作品描述

	},
	components: {
		dropDown,
		modal,
		joinPublish
	},
	methods: {
		...mapActions({
			setMessageShow: 'setMessageShow',
		}),
		selectMenu: function(data) {
			this.selectMenuId = data.activityId
		},
		joinImmediately: function() {
			let _this = this
			if (this.sharetitle == "") {
				this.setMessageShow({ placeHolder: '请填写作品名称', kind: 'error' })
				return false
			} else if (this.sharedes == '') {
				this.setMessageShow({ placeHolder: '请填写作品描述', kind: 'error' })
				return false
			} else if (this.selectMenuId == "") {
				this.setMessageShow({ placeHolder: '请选择要参加的活动', kind: 'error' })
				return false
			} else {
				this.$http.post('/activity/publishWork', {
					workName: this.sharetitle,
					workDesc: this.sharedes,
					designId: designEvent.getDesignInfo().designId,//需要从仓库取出
					aid: this.selectMenuId
				}).then(function(res) {
					//这里还需要对状态码进行判断
					let code = res.body.code
					switch (code) {
						case 0:
							_this.setMessageShow({ placeHolder: '此设计已经参加过该活动', kind: 'error' })
							break;
						case 1:
							_this.setMessageShow({ placeHolder: '恭喜,已成功参与', kind: 'success' })
							_this.modalActive = true
							_this.showInputmessage = res.body.workId
							break;
						case 2:
							_this.setMessageShow({ placeHolder: '请输入作品名称和作品描述', kind: 'error' })
							break;
						case 3:
							_this.setMessageShow({ placeHolder: '请先注册/登录', kind: 'error' })
							break;
						case 4:
							_this.setMessageShow({ placeHolder: '作品描述字数超出', kind: 'error' })
							break;

					}
				}).catch(function(error) {
					console.log(error)
				})
			}
		}
	},
	mounted() {
		let _this = this;
		this.$http.post('/activity/list').then(function(res) {
			var result = res.body.page.recordData
			for (let i in result) {
				result[i].des = result[i].activityName
				result[i].dis = result[i].isDone
			}
			result.unshift({
				des: '请选择'
			})
			_this.activelist = result

		}).catch(function(error) {
			console.log(error)
		})
	}
}
</script>
<style lang="less" scoped>
.center {
	text-align: center;
}

.design-verify {
	display: inline-block;
	color: red;
	position: absolute;
	left: 146px;
}

.share-wrap {
	width: 640px;
	height: 400px;
	background-color: #FFFFFF;
	border-radius: 5px;
	color: #808080;
}

.share-title {
	width: 100%;
	height: 80px;
	line-height: 80px;
	text-align: center;
	font-size: 24px;
	color: #626262;
}

.share-proname {
	font-size: 14px;
	margin-top: 15px;
	display: inline-block;
}

.share-serch-proname {
	margin-left: 73px;
	margin-bottom: 18px;
}

.share-search .share-writepro {
	width: 410px;
	height: 42px;
	line-height: 42px;
	border: none;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .08);
	background: #FBFBFB;
	padding-left: 20px;
	color: #808080;
	&::-webkit-input-placeholder {
		color: #cdcdcd;
	}
}

.share-count {
	position: relative;
	right: 42px;
	color: #CFCFCF;
}

.share-areacount {
	position: relative;
	top: 80px;
	color: #CFCFCF;
	left: 445px;
}

.description-input {
	width: 410px;
	float: right;
	box-shadow: 0 3px 10px 0px rgba(0, 0, 0, 0.08);
	border: none;
	resize: none;
	height: 138px;
	padding: 16px;
	line-height: 20px;
	margin-right: 82px;
	color: #808080;
	&::-webkit-input-placeholder {
		color: #cdcdcd;
	}
}

.select-text {
	font-size: 14px;
	line-height: 14px;
	margin-top: 18px;
	margin-left: 73px;
}

.selected-active {
	width: 338px;
	height: 100%;
	float: left;
	position: relative;
	background-color: #FBFBFB;
	box-shadow: 0 3px 10px 0px rgba(0, 0, 0, 0.08);
	cursor: pointer;
	border: none;
	margin-left: 73px;
}

.selected-active-title {
	font-size: 12px;
	line-height: 40px;
	color: #464646;
	padding-left: 10px;
	cursor: pointer;
}

.list-icon {
	width: 16px;
	height: 16px; // background: url() no-repeat -104px -268px;
	position: absolute;
	top: 14px;
	right: 14px;
}

.active-list {
	width: 330px;
	position: absolute;
	top: 40px;
	left: 0px;
	background-color: #FFF;
	max-height: 184px;
	overflow: auto;
	display: none;
}

.active-list li[class*="no-click"] {
	color: #b3b3b3;
}

.join-now {
	width: 138px;
	height: 30px;
	float: right;
	background-color: #07AFFD;
	font-size: 14px;
	color: #FFF;
	line-height: 30px;
	text-align: center;
	cursor: pointer;
	margin-right: 82px;
	&:hover{
		background-image:linear-gradient(90deg,#5ea2ff,#00e3ff);
	}
}

.select-wrap {
	width: 100%;
	height: 40px;
	margin-top: 8px;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: " ";
}

.clearfix:after {
	clear: both;
}

.clearfix {
	*zoom: 1;
}
</style>


