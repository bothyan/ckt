<template>
	<div class="share-design">
		<div class="share-wrap">
			<div class="share-title">
				<span>
					<img src="../img/v.png" alt="">导入我的设计</span>
			</div>
			<div class="slide-wrap" v-show="mydesignListfile">
				<div class="design-chose">
					<div class="check-design clearfix">
						<span class="fl design-mydesign">
							<label for="">我的设计:</label>
							<drop-down :dData="getFilelist" @select="selectFile" style="margin-top:25px;" :hasFolderIcon="true">
							</drop-down>
						</span>
						<span class="design-order fr">
							<label for="">排序:</label>
							<drop-down :dData="order" @select="selectOrder" style="margin-top:25px;">
							</drop-down>
						</span>
						<span class="fr">
							<label for="">场景:</label>
							<drop-down :dData="getScenelist" @select="selectScene" style="margin-top:25px;">
							</drop-down>
						</span>
					</div>

				</div>
				<div class="mydesignWater">
					<water-fall id="result1" :boxRect="boxRect" :eleData="blockdata" :listSum="listSum" style="height:600px;" v-if="waterFallDom">
						<template scope="fall1">
							<comp is="designBlock" :key="new Date().getTime()" :blockData="waterfall1.listData" @showMorePage="showMorePage" @showPageUrl="showPageUrl" @sendToId="sendToId" @closeWaterModal="$emit('closeWaterFall')"></comp>
						</template>
					</water-fall>
					<div v-if="noDesign">
						<div class="no-design">
							<img src="../img/noDesign.svg" alt="">
							<p>还未创建任何设计</p>
						</div>
					</div>
					<div class="pagination-wrap" v-if="designPageCount > 1">
						<span class="text">本页默认显示16条</span>
						<page-nation :count="designPageCount" :current="designPageIndex" @jumpUrl="jumpUrl"></page-nation>
					</div>
				</div>
			</div>
			<div class="slide-design" v-show="checkIndesign">
				<p class="goback" @click="goBack">
					<span class="gobackTo">
						<返回</span>
				</p>
				<div class="mydesignWater">
					<div class="mydesignSingle" v-for="(item,index) in dataList" :key="item" @click="setinPage(index)">
						<div class="design-block-cont">
							<div class="block-wrap">
								<img :src="item" alt="" class="design-block-image">
								<div class="setMask">
									<a class="design-info">点击置入我的设计
									</a>
								</div>
							</div>
						</div>
					</div>
					<!-- 分页 -->
					<!-- <div class="pagination-wrap" v-if="designPageCount > 1">
						<span class="text">本页默认显示16条</span>
						<page-nation :count="designPageCount" :current="designPageIndex" @jumpUrl="jumpUrl"></page-nation>
					</div> -->
				</div>

			</div>
		</div>
	</div>
</template>
<script>
import dropDown from 'ss-drop-down'
import waterFall from 'components/waterfall/waterfall.vue'
import designBlock from './designBlock.vue'
import pageNation from 'components/pagination/pagination.vue'
import designEvent from 'dataBus/design'
import designSetInPage from 'dataBus/page.js'
import { mapActions, mapGetters } from 'vuex'
import dataHandle from 'common/dataHandle'
import pageList from 'dataBus/pageList.js'
let {updatePageThumb} = pageList
export default {
	data() {
		return {
			getScenelist: [],
			getFilelist: [],
			order: [
		
				{ kindTitle: '创建时间', time_order: 0, des: '创建时间' },
				{ kindTitle: '修改时间', time_order: 1, des: '修改时间' }
			],
			boxRect: {
				// 图片的宽度
				width: 200,
				top: 8,
				right: 8,
				left: 8,
				bottom: 66,
				// 每个模板之间的间距
				marginLeft: 8,
				marginTop: 8
			},
			listSum: 4,
			blockdata: [],
			// 设计列表的当前页数
			designPageIndex: 1,
			// 设计列表的每页数量
			designPageSize: 10,
			mydesignListfile: true,
			checkIndesign: false,
			pageCount: Number,
			dataList: [],
			noDesign:false,
			waterFallDom:true,
			designPageCount:Number

		}

	},
	components: {
		waterFall,
		designBlock,
		pageNation,
		dropDown

	},
	mounted() {

	},
	beforeMount() {
		//获取情景类型模板
		this.getDesignType()
		//获取文件夹
		this.getMyDesignFile()

	},
	methods: {
		...mapActions({
			setMessageShow: 'setMessageShow'
		}),
		 // 查询设计是否已应用新的保存方式
    applyNewSave(designId) {
			console.log(this.morePageId)
      this.$http.post('/design/appliedNewSave', {d: designId}).then((response) => {
        // 操作的状态码 （-1参数错误；0未应用；1已应用）
				let code = response.body.code;
				//已经应用
        if(code === 1) {
				this.sendToId(this.morePageId)
        } else if(code === 0) {
          setTimeout(() => {
            this.applyNewSave(designId);
          }, 1000);
        } else {
          this.setErrorShow(3);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
		getPartialJsonById(query,index){
				this.$http.post('/design/getPartialJsonById',query).then(res=>{
						//console.log(res.body.partialJsonMap[`${query.page_ids}`])
						if(res.body.code==-1||res.body.code==-3){
								this.setMessageShow({ placeHolder: '权限不足无法导入设计' })
								return;
						}
						let newJson = JSON.parse(res.body.partialJsonMap[`${query.page_ids}`])
						let thumb = this.dataList[index]
						let sliceIndex = thumb.indexOf('@230w')
						thumb = thumb.substring(0, sliceIndex)
						pageList.updatePageThumb(thumb,this.pageIndex)
						designSetInPage.setPageJson(newJson,this.pageIndex)
						this.setMessageShow({ placeHolder: '置入设计成功', kind: 'success' })
						this.$emit('closeWaterFall')
						designSetInPage.elementBlur()
			 	//触发保存操作
						dataHandle.commit('element',{
							eventType:5,
							pageIndex:dataHandle.vuexGetters().getFocusPageIndex,
							value:newJson
						}).push()

				}).catch(error=>{

				})
		},
		sendToId(data) {
			this.morePageId = data
			let query ={
				d:this.morePageId,
				udspk:0
			}
			this.$http.post('/design/getDesignV4',query).then(res=>{
					this.pageJsonids = res.body.pageJsonIds
								 if(res.body.error) {
								if(res.body.error == '非beta环境') {
									// 设计没有应用新的保存方式
									this.applyNewSave(query.d);
									return;
								}
								this.setErrorShow(3);
								return;
        		}
			}).catch(error=>{
					console.log(error)
			})

		},
		//说明是多页
		setinPage(index) {
			let query = {
				type:1,
				_dataType:'json',
				page_ids:this.pageJsonids&&this.pageJsonids[index]
			}
			if(designEvent.getDesignInfo().teamId>0){
				query.tid = designEvent.getDesignInfo().teamId
			}
			this.getPartialJsonById(query,index)
		},
		eleDatas(query) {
			//设置默认请求参数获取所有数据fold:0kind:0time:2
			if (!query) {
				query = {
					page_drag: true,
					pageNo: 1,
					pageSize: 15,
					kind_id: 0,
					time_order: 0,
					folder_id: 0
				}
			}
			this.$http.post('/design/queryUserDesigns', query).then(response => {
				if (response.body.list) {
						this.blockdata = response.body.list
						this.allMyPageCount = response.body.totalCount
						let nu = Number.parseInt(this.allMyPageCount / 16),
						ni = this.allMyPageCount % 16;
						this.designPageCount = nu - (-(ni != 0 ? 1 : 0));
					this.waterFallDom=true
						this.noDesign = false
				} else if(response.body.code==-4) {
						//说明没有设计添加默认图片
					this.designPageCount=0
					this.noDesign = true
					this.waterFallDom=false
				}

			}).catch(function(error) {
				console.log(error)
			})
		},
		//点击场景筛选数据
		selectScene: function(data) {
			console.log(data)
			this.secscne = data.kindId
			let query = {
				page_drag: true,
				pageNo: this.designPageIndex,
				pageSize: 15,
				kind_id: data.kindId,
				time_order: this.secorder || 0,
				folder_id: this.secfile || 0
			}
			this.eleDatas(query)
		},
		//点击排序筛选数据
		selectOrder: function(data) {
			this.secorder = data.time_order
			let query = {
				page_drag: true,
				pageNo: this.designPageIndex,
				pageSize: 15,
				kind_id: this.secscne || 0,
				time_order: data.time_order,
				folder_id: this.secfile || 0
			}
			this.eleDatas(query)
		},
		//点击我的设计筛选数据
		selectFile: function(data) {
			this.secfile = data.folder_id
			let query = {
				page_drag: true,
				pageNo: this.designPageIndex,
				pageSize: 15,
				kind_id: this.secscne || 0,
				time_order: this.secorder || 0,
				folder_id: data.folder_id
			}
			this.eleDatas(query)
		},
		showMorePage: function(data) {
			//显示多页的页面
			this.mydesignListfile = false
			this.checkIndesign = true
			this.pageCount = data
		},
		showPageUrl: function(data) {
			this.choseid = data
			//自身
			let pop = data + '@230w_100Q_1x'
			let pageUrlList = [];
			for (var i = 1; i < this.pageCount; i++) {
				this.choseThisPage = i
				pageUrlList.push(data + '_' + i + '@230w_100Q_1x')
			}
			//头部添加一个自身缩略图
			pageUrlList.unshift(pop)
			this.dataList = pageUrlList
		},
		goBack: function() {
			this.mydesignListfile = true
			this.checkIndesign = false
		},
		getDesignType() {
			//获取情景类型模板
			this.$http.post('/home/getDesignType').then(response => {
				 let length = response.body.result.length,
        inner_length,
				results = [];
				for (let i = 0; i < length; i++) {
      			inner_length = response.body.result[i].designKind.length;
						for (let j = 0; j < inner_length; j++) {
							results.push(response.body.result[i].designKind[j]);
						}
				}
			for(let i = 0; i<results.length;i++){
					results[i].des = results[i].kindTitle
			}
				results.unshift({
					des: '全部',
					sel: '全部',
					kindId: 0
				})
				this.getScenelist = results
			});
		},
		//获取我的设计文件夹
		getMyDesignFile() {
			this.$http.post('/design/queryUserFolders').then(
				(response) => {
					let result = response.body.folderList;
					for (let i in result) {
						result[i].des = result[i].folder_name
					}
					//添加默认文件夹
					result.unshift({
						des: '默认文件夹',
						sel: '默认文件夹',
						folder_id: 0
					})
					this.getFilelist = result
				}
			).catch(
				error => console.log(error)
				)
		},
		//翻页
		jumpUrl: function(page) {
			this.designPageIndex = page;
			//发起数据请求
				let query = {
				page_drag: true,
				pageNo: this.designPageIndex,
				pageSize: 15,
				kind_id: this.secscne || 0,
				time_order: this.secorder || 0,
				folder_id: this.secfile || 0
			}
			this.eleDatas(query)
		}
	},
	mounted() {
		this.eleDatas()
	},
	computed: {
		...mapGetters({
			pageIndex:'getFocusPageIndex'
		})
	},
	watch: {

	}
}
</script>
<style lang="less" scoped>
@import 'importdesign.less';
</style>


