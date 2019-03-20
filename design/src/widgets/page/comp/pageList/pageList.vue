<template>
  <div  @mousedown.left.stop=""
        :class="{'strait-list-wrap': pageListClose, 'onload': onload}"
        class="page-list-wrap"
        id="pageList"
  >
    <div @click.left="changePageShow" :class="{'close': pageListClose}" class="rightPanel-mainContent-toggle"></div>
    <div class="strait-list">
      <div class="top-block">
        <div class="page-icon"></div>
      </div>
      <ul class="page-list"
          :class="{'page-move' : moveIndex >= 0}"
          :style="{top: straitPageTop + 'px'}"
          ref="straitPageList"
      >
        <li v-for="(pageId, i) in pageIdList"
            @click=""
            @mousedown.left.stop="nodeMouseDown($event, i)"
            :style="straitPageStyle(i)"
            :class="{
              'now-click': focusPageIndex == i,
              'move': moveIndex == i && pageListClose,
              'move-slow':  moveIndex != i &&  moveIndex >= 0
            }"
            class="page-li"
            draggable="false"
        >
          <div :class="{open: operateOpenIndex == i}" @click.stop="" @mousedown.stop="" class="page-operate">
            <span @mousedown.left.stop="pageCopy(i)" class="copy-icon-wrap operate-item" title="复制此页"><span class="copy-icon operate-icon"></span></span>
            <span @mousedown.left.stop="pageDel(i)" class="del-icon-wrap operate-item" title="删除此页"><span class="del-icon operate-icon"></span></span>
          </div>
          <p class="page-no">{{i + 1}}</p>
          <div v-if="allPageSaving || indexPageSaving === i" class="page-sving">
            <div class="saving-img"></div>
          </div>
        </li>
      </ul>
      <div v-show="pageSum <= maxPage"
           @click="pageAdd" class="page-add" title="添加新页"
      >
        <span class="add-icon"></span>
      </div>
    </div>
    <div class="wide-list">
      <div class="top-switch">
        <span class="page-icon"></span>
        <span class="text">页面</span>
      </div>
      <ul class="page-list"
          :class="{'page-move' : moveIndex >= 0}"
          :style="{top: widePageTop + 'px'}"
          ref="widePageList"
      >
        <li  v-for="(pageId, i) in pageIdList"
             @click=""
             @mousedown.left.stop="nodeMouseDown($event, i)"
             :style="widePageStyle(i)"
             :class="{
              'now-click': focusPageIndex == i,
              'move': moveIndex == i && !pageListClose,
              'move-slow':  moveIndex != i &&  moveIndex >= 0
            }"
             class="page-li"
             draggable="false"
        >
          <div v-if="pageThumbUrl(i)" class="page-content">
            <img :src="pageThumbUrl(i)" :class="{'img-loading': pageThumbList[i] && pageThumbList[i].thumbnailsUrl.length == 0}" draggable="false">
          </div>
          <div v-else class="no-thumb-wrap" :style="{'padding-top': (widePageHeight - 36) / 2 + 'px'}">
            <div class="no-thumb">
              <div class="no-thumb-icon"></div>
              <p class="no-thumb-text">缩略图暂未生成</p>
            </div>
          </div>
          <span @mousedown.left.stop="pageCopy(i)" class="copy-icon" title="复制此页"></span>
          <span @mousedown.left.stop="pageDel(i)" class="del-icon" title="删除此页"></span>
          <span class="page-no">{{i + 1}}</span>
          <div  v-if="allPageSaving || indexPageSaving === i"
                :style="{height: widePageHeight - 12 + 'px'}"
                class="page-saving"
          >
            <span class="saving-img" :style="{top: widePageHeight / 2 - 6 - 18 + 'px'}"></span>
          </div>
        </li>
      </ul>
      <div  v-show="pageSum <= maxPage"
            :style="{opacity: allPageSaving ? 0.6 : 1}"
            @click="pageAdd"
            class="page-add"
            title="添加新页"
      >
        <span class="add-content">
          <span class="add-icon"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  @import "./pageList.less";
</style>

<script>

	import dataHandle from 'common/dataHandle'
  import pageHandle from 'dataBus/page'
  import textHandle from 'dataBus/text'
	import pageListHandle from 'dataBus/pageList'
	import webSocket from 'dataBus/webSocket'
	import designHandle from 'dataBus/design'
	import {mapGetters, mapActions} from 'vuex'

	export default {
		data() {
			return {
				ws: null,
				pageLiWidth: 160,
				dragOldPage: null,
				dragEnterPage: null,
				operateOpenIndex: null,
				moveIndex: -1,
				moveX: 0,
				moveY: 0,
				widePageTop: 42,
				straitPageTop: 54,
				onload: true,
				doNotOpt:false
			}
		},
		props: {

		},
		beforeMounted() {

		},
		mounted() {

			let designInfo = designHandle.getDesignInfo();

			let thumbList = designInfo.pageThumbnails,
				pageSum = this.pageSum || 1,
				pageThumbList = [];

			for (let i = 0; i < pageSum; i++) {
				if(thumbList && thumbList[i]) {
					pageThumbList.push({
						pageId: parseInt(100000 * Math.random()),
						taskId: thumbList[i].thumbnailsTaskId || 0,
						thumbnailsUrl: thumbList[i].thumbnailsUrl ? thumbList[i].thumbnailsUrl : ''
					});
				} else {
					pageThumbList.push({
						pageId: parseInt(100000 * Math.random()),
						taskId: 0,
						thumbnailsUrl: ''
					});
				}
			}

			console.log(pageThumbList);

			if(pageThumbList[0].thumbnailsUrl.length > 0) this.setPageNavigatorThumb(pageThumbList[0].thumbnailsUrl);
			this.setPageThumbList(pageThumbList);
			pageListHandle.resetPageListStyle();
			webSocket.addCallBack(1, this.updateTaskId);
			webSocket.addCallBack(2, this.webSocketCallBack);

			this.$nextTick(()=>{
				this.onload = false;
				// if(!designInfo.isExist) {
				//   this.savePageThumb();
				// }
			});

		},
		computed: {
			...mapGetters({
				pages: 'getPagesJson',
				pageWidth: 'getPageWidth',
				pageHeight: 'getPageHeight',
				pageSum: 'getPageSum',
				maxPage: 'getMaxPage',
				focusPageIndex: 'getFocusPageIndex',
				pageListClose: 'getPageListClose',
				pageThumbList: 'getPageThumbList',
				designSaveTime: 'getDesignSaveTime',
				widePageStyleList: 'getWidePageStyleList',
				straitPageStyleList: 'getStraitPageStyleList',
				blankClick: 'getBlankClick',
				pageIdList: 'getPageIdList',
				foucsPageId: 'getFocusPageId',
				allPageSaving: 'getAllPageSaving',
				indexPageSaving: 'getIndexPageSaving',
				isLogin: 'getIsLogin',
				pageReady: 'getPageReady',
				widePageHeight: 'getWidePageHeight',
        userInfo: 'getUserInfo',
        templateInfo: 'getTemplateInfo',
        textEdit: 'getTextEdit',
        focusElemIndex: 'getFocusElemIndex'
			})
		},
		watch: {
			designSaveTime() {
				this.$nextTick(()=>{
					this.makePageThumbWS();
				});
			},
			pageThumbList(v) {
				// if(this.onload) return;
				// if(!this.isLogin) return;
				// this.savePageThumb();
			},
			blankClick() {
				this.operateOpenIndex = null;
			},
			pageWidth() {
				pageListHandle.resetPageListStyle();
			},
			pageHeight() {
				pageListHandle.resetPageListStyle();
			},
			pageIdList(v) {
				let drag = false;
				for (let i = 0; i < v.length; i++) {
					if(v[i] == 0) {
						drag = true;
						break;
					}
				}
				this.setAllPageSaving = drag;
			},
      isLogin(v) {
        // 用户登录后补全pageId
        if(!v) return;
        let userId = this.userInfo.userId.toString(),
            pageIdList = JSON.parse(JSON.stringify(this.pageIdList));
        if(pageIdList[0] && pageIdList[0].length != 16) {
          return;
        }
        while(userId.length <= 7) {
          userId = '0' + userId;
        }
        for (let i = 0; i < pageIdList.length; i++) {
          pageIdList[i] = pageIdList[i] + userId;
        }
        this.setPageIdList(pageIdList);
      }
		},
		methods: {
			...mapActions({
				setPagesJson: 'setPagesJson',
				setFocusPageIndex: 'setFocusPageIndex',
				setPageListClose: 'setPageListClose',
				setEditorShow: 'setEditorShow',
				setTableEditorShow: 'setTableEditorShow',
				setMessageShow: 'setMessageShow',
				setPageNavigatorThumb: 'setPageNavigatorThumb',
				setPageThumbList: 'setPageThumbList',
				setWidePageStyleList: 'setWidePageStyleList',
				setStraitPageStyleList: 'setStraitPageStyleList',
				setDialogShow: 'setDialogShow',
				setLogregShow: 'setLogregShow',
				setAllPageSaving: 'setAllPageSaving',
				setIndexPageSaving: 'setIndexPageSaving',
        setPageIdList: 'setPageIdList'
			}),

			widePageStyle(index) {
				if(!this.widePageStyleList || !this.widePageStyleList[index]) return;
				let page = this.widePageStyleList[index];
				return {
					height: page.height + 'px',
					left: page.left + 'px',
					top: page.top + 'px'
				}
			},

			straitPageStyle(index) {
				if(!this.straitPageStyleList || !this.straitPageStyleList[index]) return;
				let page = this.straitPageStyleList[index];
				return {
					height: page.height + 'px',
					left: page.left + 'px',
					top: page.top + 'px'
				}
			},

			nodeMouseDown(eve, oldIndex) {
				if(oldIndex == this.indexPageSaving || this.allPageSaving) return;
				let startX = eve.clientX,
					startY = eve.clientY,
					_this = this,
					newIndex = oldIndex;

				let straitTop = this.$refs.straitPageList.scrollTop;
				let wideTop = this.$refs.widePageList.scrollTop;
				this.straitPageTop = this.straitPageTop - straitTop;
				this.widePageTop = this.widePageTop - wideTop;

				this.moveIndex = oldIndex;
				this.pageSelect(oldIndex);

				window.addEventListener('mousemove', nodeMousemove);
				window.addEventListener('mouseup', nodeMouseup);

				let pageRectList = this.pageListClose ? this.straitPageStyleList : this.widePageStyleList,
					pageListWidth = pageRectList[0].width,
					movePage = pageRectList[oldIndex];

				function nodeMousemove(eve) {
					let xLength = eve.clientX - startX;
					let yLength = eve.clientY - startY;
					startX = eve.clientX;
					startY = eve.clientY;
					_this.moveX = xLength;
					_this.moveY = yLength;
					movePage.top = movePage.top + yLength;
					movePage.left = movePage.left + xLength;

					if(movePage.left >= -pageListWidth && movePage.left <= pageListWidth) {

						newIndex = oldIndex;
						for (let i = 0; i < _this.pageSum; i++) {
							if(movePage.top < pageRectList[i].top && oldIndex < i) {
								pageRectList[i].top = pageRectList[i].height * i;
							}
							if(movePage.top > pageRectList[i].top && oldIndex > i) {
								pageRectList[i].top = pageRectList[i].height * i;
							}
							if(movePage.top < pageRectList[i].top && oldIndex > i) {
								pageRectList[i].top = pageRectList[i].height * (i + 1);
								newIndex = Math.min(newIndex, i);
							}
							if(movePage.top > pageRectList[i].top && oldIndex < i) {
								pageRectList[i].top = pageRectList[i].height * (i - 1);
								newIndex = Math.max(newIndex, i);
							}
						}

					}

					if(_this.pageListClose) {
						_this.setStraitPageStyleList(pageRectList);
					} else {
						_this.setWidePageStyleList(pageRectList);
					}

				}

				function nodeMouseup(eve) {
					window.removeEventListener('mousemove', nodeMousemove);
					window.removeEventListener('mouseup', nodeMouseup);
					_this.moveIndex = -1;
					_this.movePage(oldIndex, newIndex);
					_this.straitPageTop = 54;
					_this.widePageTop = 42;
					pageListHandle.resetPageListStyle();
				}

			},

			movePage(oldIndex, newIndex) {
				if(oldIndex == newIndex||this.doNotOpt) return;

				dataHandle.update();
				// 更新画布Json
				pageHandle.setPageIndex(oldIndex, newIndex);
				// 更新画布缩略图列表
				pageListHandle.movePageThumb(oldIndex, newIndex);
				this.setFocusPageIndex(newIndex);
				let commit = ()=> {
					dataHandle.commit(
						'page',
						{
							pageIndex: oldIndex,
							value: newIndex,
							pageId: this.pageIdList[newIndex],
							eventType: 2
						}).push();
				}
				if(this.pageIdList[newIndex] == 0) {
					dataHandle.update(commit);
				} else {
					commit();
				}
				dataHandle.update();

				this.$nextTick(()=>{
					this.savePageThumb();
				});

			},

			// 点击选择画布
			pageSelect(index, drag,notFresh) {
				if(index == this.indexPageSaving || this.allPageSaving) return;
				if(index == this.focusPageIndex && !drag) return;
        // 如果当前画布有文字正在编辑 单独处理
        if(this.textEdit) {
          textHandle.setUpdateFlagByPageId(true, this.foucsPageId, this.focusElemIndex);
        }
				pageHandle.elementBlur();
				this.setEditorShow(false);
				this.setTableEditorShow(false);
				this.operateOpenIndex = null;
				// 设置焦点画布
				this.setFocusPageIndex(index);
				let thumbUrl = this.pageThumbList[index] ? this.pageThumbList[index].thumbnailsUrl : '';
				this.setPageNavigatorThumb(thumbUrl);
        if(!this.isLogin && this.templateInfo && !this.pages[index]) {
          // 用户未登录并通过模板创建的设计
          this.setIndexPageSaving(index);
          pageHandle.queryTemplateJson(index);
          return;
        }
				//pageReady是重加载标志如果pageReady为false即使pageJson存在也需要重新加载
				if((!this.pages[index]||this.pageReady[index]===false)&&!notFresh) {
					this.setIndexPageSaving(index);
					pageHandle.queryPageJson([index]);
				}
			},

			// 增加画布
			pageAdd() {
				if(this.allPageSaving||this.doNotOpt) return;
				if(this.pageSum >= this.maxPage) {
					this.setMessageShow({
						placeHolder:'页数达到上限！'
					});
					return;
				}

				dataHandle.update();
				let newIndex = this.focusPageIndex + 1;
				// 更新画布缩略图列表
				pageListHandle.addPageThumb('', newIndex);
				pageListHandle.resetPageNo();
				this.savePageThumb();

				let pageJson = pageHandle.getBlankPageJson();
				let newPageId = pageHandle.getNewPageId()
				let newPage = pageHandle.addPage(pageJson, newIndex,newPageId);

				pageListHandle.resetPageListStyle();

				this.pageSelect(newIndex,undefined,true);
				this.operateOpenIndex = null;
				let commit = ()=> {
					dataHandle.commit(
						'page',
						{
							pageIndex: newIndex,
							pageId: newPageId,
							value: null,
							eventType: 0
						}).push();
				}
				if(this.pageIdList[newIndex] == 0) {
					dataHandle.update(commit);
				} else {
					commit();
				}
				dataHandle.update();

			},

			// 删除画布
			pageDel(index) {

				if(index == this.indexPageSaving || this.allPageSaving||this.doNotOpt) return;
				if(this.pageSum === 1) {
					this.setMessageShow({
						placeHolder:'最后一页不能删除！'
					});
					return;
				}

				let pageId = this.pageIdList[index];

				let confirm = ()=> {
					dataHandle.update();

					let newFocus;

					if(index <= this.focusPageIndex) {
						newFocus = index - 1;
						// this.setFocusPageIndex(index - 1);
						if(index == this.pageSum - 1) {
							this.pageSelect(index - 1);
						}
					} else {
						newFocus = this.focusPageIndex;
					}
					newFocus = newFocus < 0 ? 0 : newFocus;

					// 更新画布缩略图列表
					pageListHandle.delPageThumb(index);
					pageHandle.delPage(index);
					pageListHandle.resetPageNo();
					this.savePageThumb();

					pageListHandle.resetPageListStyle();
					this.operateOpenIndex = null;

					this.pageSelect(newFocus, true);

					let commit = ()=> {
						dataHandle.commit(
							'page',
							{
								pageIndex: index,
								pageId: pageId,
								value: null,
								eventType: 3
							}).push();
					}
					if(this.pageIdList[index] == 0) {
						dataHandle.update(commit);
					} else {
						commit();
					}
					dataHandle.update();
					this.setMessageShow({
						placeHolder:'画布删除成功！',
						kind: 'success'
					});

				}

				this.setDialogShow({
					content: '删除页面后画布会消失哦！',
					btnTexts: ['取消', '继续删除'],
					funcs: {
						confirm
					}
				});

			},

			// 复制画布
			pageCopy(index) {

				if(index == this.indexPageSaving || this.allPageSaving||this.doNotOpt) return;
				// pageList收起时点击侧边栏打开复制和删除按钮
				// if(this.pageListClose && this.operateOpenIndex != index) {
				//   this.operateOpenIndex = index;
				//   return;
				// }

				if(this.pageSum >= this.maxPage) {
					this.setMessageShow({
						placeHolder:'页数达到上限！'
					});
					return;
				}

				// this.setIndexPageSaving(index)

				dataHandle.update();
				pageListHandle.addPageThumb('', index + 1);
				pageListHandle.resetPageNo();

				if(index < this.focusPageIndex) this.setFocusPageIndex(this.focusPageIndex + 1);

				let newPageId = pageHandle.getNewPageId()
				let newPage = pageHandle.copyPage(index,newPageId);

				pageListHandle.resetPageListStyle();

				// let pageSvg;
				// if(index == this.focusPageIndex) {
				//   pageSvg = this.getPageSvg();
				// }

				this.pageSelect(index + 1);

				this.savePageThumb(index + 1,undefined,index);

				// this.operateOpenIndex = null;

				let commit = ()=> {
					dataHandle.commit(
						'page',
						{
							pageIndex: index + 1,
							pageId: newPageId,
							targetPageId: this.pageIdList[index],
							value: JSON.parse(JSON.stringify(newPage)),
							eventType: 0
						}).push();
				}

				if(this.pageIdList[index] == 0) {
					dataHandle.update(commit);
				} else {
					commit();
				}
				dataHandle.update();

			},

			// 切换pageList显示方式
			changePageShow() {

				this.setPageListClose(!this.pageListClose);
				this.operateOpenIndex = null;

			},

			// 画布缩略图
			pageThumbUrl(index) {
				return this.pageThumbList[index] && this.pageThumbList[index].thumbnailsUrl ? this.pageThumbList[index].thumbnailsUrl + '@136w' + '?v=' + new Date().getTime() : '';
			},

			// 更新缩略图taskId
			updateTaskId(params) {

				if(!params.taskId) return;
				let pageId = params.pageId,
					taskId = params.taskId,
					code = params.code,
					pageThumbList = this.pageThumbList;

				//遍历画布找到服务器推送信息的画布
				for (let i = 0; i < pageThumbList.length; i++) {
					if(pageThumbList[i].pageId == pageId) {
						if(code === 1) {
							pageThumbList[i].taskId = taskId;
							this.savePageThumb();
						} else {
							pageThumbList[i].making = false;
							if(pageThumbList[i].pageSvg && i === this.focusPageIndex) {
								this.makePageThumbWS();
							}
							console.log('请求生成画布缩略图错误！')
						}
						break;
					}
				}
				this.setPageThumbList(pageThumbList);

			},

			webSocketCallBack(params) {

				//信息类型为生成右侧缩略图结果
				let pageId = params.pageId,
					url = params.thumbnailUrl ? params.thumbnailUrl : '',
					pageThumbList = this.pageThumbList,
					code = params.code,
					pageThumb;

				//遍历画布找到服务器推送信息的画布
				for (let i = 0; i < pageThumbList.length; i++) {

					if(pageThumbList[i].pageId == pageId) {
						//画布找到
						pageThumb = JSON.parse(JSON.stringify(pageThumbList[i]));
						//解除画布正在生成缩略图的状态
						pageThumb.making = false;

						if(code == 200){
							pageThumb.pageId = pageId;
							pageThumb.thumbnailsUrl = url;
							pageThumbList.splice(i, 1, pageThumb);
							this.setPageThumbList(pageThumbList);
							if(i == this.focusPageIndex) this.setPageNavigatorThumb(url);
						}

						//判断画布变化,发送缩略图申请
						if(pageThumb.pageSvg) {
							let data = {
								reqtype: 1,
								params: {
									rid: pageThumb.taskId,
									pid: pageThumb.pageId,
									content: pageThumb.pageSvg
								}
							};
							pageThumb.making = true;
							pageThumb.pageSvg = null;
							data = JSON.stringify(data);
							data = data.replace(/NS1\:/g, '');
							webSocket.send(data);
						}

						break;
					}

				}

			},

			getPageSvg() {
				let pageSvg,
					images,
					href;

				try {
					pageSvg = document.getElementById('pageSvg').cloneNode(true)
				} catch(error) {
					console.error('保存画布缩略图 复制svg出错！' + error)
				}

				images = pageSvg.getElementsByTagName('image');
				for (let i = 0; i < images.length; i++) {
					href = images[i].href.baseVal;
					if(href != undefined) {
						if(!/http/.test(href)) {
							href = window.location.protocol + href;
						}
						images[i].setAttribute('href', href);
					}
				}
				pageSvg = pageSvg.outerHTML;
				pageSvg = pageSvg.replace(/\&nbsp/g, ' ');
				return pageSvg;
			},

			// websocket 请求生成画布缩略图
			makePageThumbWS(page_svg) {

				let _this = this,
					state = webSocket.state(),
					pageThumbList = _this.pageThumbList,
					pageThumb,
					pageSvg;

				pageSvg = page_svg || this.getPageSvg();

				pageThumb = pageThumbList[this.focusPageIndex];

				if(pageThumb.pageId == 0) {
					return;
				}

				if(state.OPEN == 1 && state.readyState == 1 && !pageThumb.making) {
					var data = {
						reqtype: 1,
						params: {
							rid: pageThumb.taskId,
							pn: this.focusPageIndex,
							pid: pageThumb.pageId,
							content: pageSvg
						}
					};
					data = JSON.stringify(data);
					data = data.replace(/NS1\:/g, '');
          if(data && data.length / 1024 / 1024 >= 5) {
            console.log('缩略图大于5MB,取消生成！')
            return;
          }
					pageThumb.making = true;
					pageThumb.pageSvg = null;
					webSocket.send(data);
				} else {
					pageThumb.pageSvg = pageSvg;
				}
				this.setPageThumbList(pageThumbList);

				pageSvg = null;

			},

			// 保存画布缩略图信息
			savePageThumb() {
				if(this.onload||!this.isLogin) return;
				this.doNotOpt=true
				pageListHandle.savePageThumb(
					Array.from(arguments)[0],
					Array.from(arguments)[1],
					Array.from(arguments)[2],
					()=>{
						this.doNotOpt=false
					});
			}

		}
	}
</script>
