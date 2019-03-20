<template>
	<div class="share-design">
		<div class="share-wrap" :style="{height:comh,width:comw}">
			<div class="share-title">
				<span>
					<img src="../img/v.png" alt="">智能变换设计</span>
				<span @click="changeToScene">
					<button :class="{active:changeIn, cantclick:!changeIn, upvip:notAvip}" class="change-scene-button">{{changeWords}}</button>
				</span>
			</div>
			<div class="allkinds" :style="{height:comsh}">
				<div class="chat-media" v-for="item in designKinds" :key="item.id" v-if="item.firstKindId != 5">
					<div class="chat-symbol">
						<span class="media-svg">
							<img :src="item.icoUrl + '-1'" alt="设计一级分类图标" class="kindname">
						</span>
						<span>{{item.pKindName}}</span>
					</div>
					<div class="chat-media-all">
						<ul>
							<li v-for="designKind in item.designKind"  :key="designKind.id" class="temp-wrap" >
								<div class="chat-media-item">
									<div class="pic-img">
										<a :class="{canPrint:designKind.isPrint}" class="template-wrap" @click="showModalList(designKind)">
											<img :src="designKind.imgUrl+'@240w_240h.src'">
											<div class="imgmask" v-show="designKind.imgchecked">
												<img src='../img/chose.png' alt="" class="chose">
											</div>
										</a>
									</div>
									<div class="title">
										<span class="pic-title">
											<span class="kind-title">{{designKind.kindTitle}}</span>
											<span v-if="designKind.isPrint" class="print-icon">
												<span v-if="designKind.kindId==12||designKind.kindId==132" class="print-tips">印刷价格：12元/2盒</span>
												<span v-else class="print-tips">可印刷制作</span>
											</span>
										</span>
									</div>
									<div class="size">{{designKind.kindWidth}} * {{designKind.kindHeight}}</div>
								</div>
							</li>
							<div style="clear:both;"></div>
						</ul>
						<hr :style="{width:comw}">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import changeSceneMethod from 'dataBus/page.js'
import designEvent from 'dataBus/design'
export default {
	data() {
		return {
			designKinds: [],
			imgCheckedSum: 0,
			changeWords: '',
			notAvip: false
		}
	},
	components: {
	},
	computed: {
		...mapGetters({
			isVip: 'getIsVip'
		}),
		comw(){
			return document.body.clientWidth*0.75+'px'
		},
		comh(){
			return document.body.clientHeight*0.65+'px'
		},
		comsh(){
					return (document.body.clientHeight*0.65-50)+'px'
		},
		changeIn() {
			if (this.isVip == 2) {
				if (this.imgCheckedSum > 0) {
					return true
				} else {
					return false
				}
			} else {
				return true
			}
		}
	},
	mounted() {
		this.imgCheckedSum = 0
		this.showButtonWord()
	},
	beforeMount() {
		//获取情景类型模板
		this.$http.post('/home/getDesignType').then(response => {
			let result = response.body.result;
			for (let i = 0; i < result.length; i++) {
				if (result[i].firstKindId == '5') {
					result.splice(i, 1);
				}
			}
			//向每一个designkind对象里面添加imgchecked属性判断是否被选中
			for (var i in result) {
				for (var h in result[i].designKind) {
					result[i].designKind[h].imgchecked = false;
				}
			}
			//对控制主nav的数组进行初始化
			this.designKinds = result;
		});
	},
	methods: {
		...mapActions({
			setMessageShow: 'setMessageShow',
			setDialogShow:'setDialogShow'
		}),
		//设计智能变换
		intelligenceConversion(query){
			this.$http.post('/design/intelligenceConversion',query).then(res=>{
				let code = res.body.code
				let designIds = res.body.design_ids
				switch(code){
					case 1:
					this.setMessageShow({ placeHolder: '变换设计成功',kind:'success'})
					setTimeout(()=>{
							//场景变换
							this.setMessageShow({ placeHolder: '请解除窗口拦截',kind:'warning',hideTime:5000})
						for(let i in designIds){
							try{
								let url = window.open();
								url.location = '/design?d='+designIds[i]
							}catch(error){
								console.log(error)
								this.setMessageShow({ placeHolder: '请解除窗口拦截',kind:'warning',hideTime:5000})
							}
						}
						this.$emit('closeChangeScneModal')
					},3000)
						
					break;
					case -3:
					this.setMessageShow({ placeHolder: '设计不存在'})
					break;
					case -5:
					this.setMessageShow({ placeHolder: '获取设计信息出错'})
					break;
					case -6:
					this.setMessageShow({ placeHolder: '智能变换宽高有误'})
					break;
				}
			}).catch(error=>{
				console.log(error)
			})
		},
		showModalList(designKind) {
			if (this.isVip == 1) return;
			//控制选中与不选中以及限制用户选择场景数量
			if (designKind.imgchecked) {
				this.imgCheckedSum--
			} else {
				if (this.imgCheckedSum == 5) {
					this.setMessageShow({ placeHolder: '选择场景太多,请重新选择'});
					return;
				}
				this.imgCheckedSum++
			}
			designKind.imgchecked = !designKind.imgchecked;
		},
		//点击变换场景打开指定的页面
		changeToScene() {
			if(this.changeIn==false)
			return;
			let _this = this
		
			if (_this.isVip == 1) {
				//跳转到充值会员界面
				window.open('/price?p=1')
				return;
			}
			  _this.setDialogShow({
          title: '', // 可选，默认为"提示"
          content:'<span>变换后不能撤销，将会<span style="color:red;">清空撤销步骤</span>，是否继续变换场景</span>',
          funcs:{
            confirm
					}
				})
				function confirm(){
						//获取选中场景的集合与变换
					let scneIds = [];
					for(let i in _this.imgCheckedList){
						scneIds.push(_this.imgCheckedList[i].kindId)
					}
					let query = {
						d:designEvent.getDesignInfo().designId,
						kind_ids:scneIds.toString()
					}
					if(designEvent.getDesignInfo().teamId>0){
						query.tid = designEvent.getDesignInfo().teamId
					}
					_this.intelligenceConversion(query)
				}
			//清空选中的数组防止重复添加
			_this.imgCheckedList = [];
			for (let i in _this.designKinds) {
				let designKind = _this.designKinds[i].designKind;
				for (let j in designKind) {
					if (designKind[j].imgchecked) {
						_this.imgCheckedList.push(designKind[j]);
					}
				}
			}
		},
		showButtonWord() {
			if (this.isVip == 1) {
				this.changeWords = '升级成为会员'
				this.notAvip = true
			} else if (this.isVip == 2) {
				this.changeWords = '变换场景'
			}
		}
	},
	watch: {
		isVip() {
			this.showButtonWord()
		}
	}
}
</script>
<style lang="less" scoped>
@import 'changescene.less';
</style>


