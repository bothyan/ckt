<template>
  <section id="ckt-design" @mousedown.left="blankClick">
    <!-- header -->
    <transition name="headerEnter">
      <header v-show="layoutOnload" id="kit-header">
        <ckt-header></ckt-header>
      </header>
    </transition>
    <div class="container">
      <!-- 左侧菜单 -->
      <transition name="leftPanelEnter">
        <left-panel v-show="layoutOnload"></left-panel>
      </transition>
      <!-- 右侧画布容器 -->
      <right-panel v-if="layoutOnload"></right-panel>
    </div>
    <textarea id="changeHeightTextarea"></textarea>
  </section>
</template>

<script>
import cktHeader from 'layout/header/header'
import leftPanel from 'layout/leftPanel/leftPanel'
import rightPanel from 'layout/rightPanel/rightPanel'
import { mapGetters, mapActions } from 'vuex'
import dataHandle from 'common/dataHandle'
import {getBaseLineFromTop,cookie2object} from 'common/common'
import designEvent from 'dataBus/design'
import userEvent from 'dataBus/user'
import pageEvent from 'dataBus/page'
import webSocket from 'dataBus/webSocket'

export default {
  name: 'design',
  components:{
    cktHeader,
    leftPanel,
    rightPanel
  },
  props: {
    userInfo: {
      default: () => {
        return {}
      }
    },
    isLogin: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    	oldCookie:'',
      cookie:''
    }
  },
  computed: {
    ...mapGetters({
      layoutOnload: 'getLayoutOnload',
      apiInfo: 'getApiInfo',
      teamId: 'getTeamId',
      apiToken: 'getApiToken'
      //isLogin: 'getIsLogin'
    })
  },
  watch: {
    isLogin(val) {
      dataHandle.setIsLogin&&dataHandle.setIsLogin(val);
      if(val){
	      userEvent.setCollectedMaterialIds();
        this.cookie=cookie2object(document.cookie)
//        console.log(this.cookie,this.oldCookie)
        if(window.api) return;
        if(
        	this.cookie['SEC_SESSION']!==this.oldCookie['SEC_SESSION']||
        	this.cookie['Sec_User_id']!==this.oldCookie['Sec_User_id']
        )
          webSocket.reconnect(true)
      }
    }
  },
  created() {
	  this.oldCookie=cookie2object(document.cookie)
  },
  mounted() {
    //判断用户的浏览器信息是否提示浏览器兼容性
    let _this = this;
    let ua = navigator.userAgent.toLowerCase();
    let CheckBrowserAndSheild = {
      ua : navigator.userAgent.toLowerCase(),
      maySafari : ua.indexOf("safari"),
      mayLowIe : ua.indexOf("msie"),
      mayIe11 : ua.indexOf("trident"),
      mayEdge : ua.indexOf("edge"),
      mayfirefox : ua.search("firefox"),
      mayQQ : ua.indexOf("qqbrowser"),
      mayChrome : ua.indexOf("chrome"),
      maySouGou:ua.indexOf('se 2.x'),
      mayLieBao:ua.indexOf('lbbrowser'),
      canUse : ua.search(/(2345explorer|ubrowser|coolnovo|theworld|qbrowser|metasr|bidubrowser|maxthon|lbbrowser)/i),
      checkBrowserVision(){
        //chrome浏览器
        if(this.mayChrome > 0){
          var vision = this.ua.match(/chrome\/([\d.]+)/);
          vision = vision[1].substring(0, 2);
          if(vision < 35){
             _this.setErrorShow(7);
          }
        }else if(this.maySafari > 0){//safari
          var vision = this.ua.match(/version\/([\d.]+)/);
          vision = vision[1].substring(0, 3);
          if(vision < 8.1){
              _this.setErrorShow(7);
          }
        }else if(this.mayfirefox > 0){//火狐
          var vision = this.ua.match(/firefox\/([\d.]+)/);
            vision = vision[1].substring(0, 2);
            if(vision <= 56){
              _this.setErrorShow(7);
            }
        }else if(this.mayQQ > 0){//qq浏览器
          var vision = this.ua.match(/qqbrowser\/([\d.]+)/);
          vision = vision[1].substring(0, 1);
          if (vision <= 8) {
            _this.setErrorShow(7);
          }
        }else if(this.mayLowIe>0){//低版本ie
           _this.setErrorShow(7);
        }else if(this.mayEdge>0){
          var vision = this.ua.match(/edge\/([\d.]+)/);
          vision = vision[1].substring(0,5)
          if(vision<=40.12){
            _this.setErrorShow(7);
          }
        }else if(this.maySouGou>0){//搜狗浏览器
          var vision = this.ua.match(/chrome\/([\d.]+)/);
          vision = vision[1].substring(0, 2);
          if(vision< 35){
            _this.setErrorShow(7);
          }
        }else if(this.mayLieBao>0){//猎豹
          var vision = this.ua.match(/chrome\/([\d.]+)/);
          vision = vision[1].substring(0, 2);
          if(vision< 35){
            _this.setErrorShow(7);
          }
        }
      }
    }
    CheckBrowserAndSheild.checkBrowserVision();

    // getBaseLineFromTop();

    this.queryDesign();

    window.onresize = () => {
      this.setWindowResize(new Date().getTime());
    }

  },
  methods:{
    ...mapActions({
      setPageWidth: 'setPageWidth',
      setPageHeight: 'setPageHeight',
      setLayoutOnload: 'setLayoutOnload',
      setBlankClick: 'setBlankClick',
      setErrorShow: 'setErrorShow',
      setDesignTitle: 'setDesignTitle',
      setWindowResize: 'setWindowResize',
      setPageIdList: 'setPageIdList',
      setMessageShow: 'setMessageShow',
      setApiToken: 'setApiToken',
      setAllPageSaving: 'setAllPageSaving',
	    setTeamId: 'setTeamId',
	    setTeamStamp: 'setTeamStamp',
	    showLogreg: 'showLogreg',
      setTemplateInfo: 'setTemplateInfo',
    }),
    // 从当前地址取得designInfo
    getDesignInfoFromLink() {
      let query = this.$route.query;
      let options = {};
      // 设计id
      options.designId = query.d;
      // 出血值
      options.bleedValue = query.bv;
      // 设计分类id
      options.designKindId = query.k;
      options.designWidthWithUnit = query.w;
      options.designHeightWithUnit = query.h;
      options.designKindTitle = query.kt;
      // 最大页码
      options.maxPageNum = query.mp;
      options.sec = query.sec;
      // 模版id
      options.templateId = query.t;
      // 团队id
      options.teamId = query.tid;
      // 团队模版id
      options.teamTemplateId = query.tt;
      // 模板库设计三级分类ID
      options.thirdKindId = query.tkid;

      return options;
    },

    // 空白点击
    blankClick() {
      this.setBlankClick(new Date().getTime());
    },

    // 查询设计是否已应用新的保存方式
    applyNewSave(designId) {
      this.$http.post('/design/appliedNewSave', {d: designId}).then((response) => {
        // 操作的状态码 （-1参数错误；0未应用；1已应用）
        let code = response.body.code;
        if(code === 1) {
          this.queryDesign();
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

    // 获取设计
    queryDesign() {
      let designInfo = this.getDesignInfoFromLink();
      let saveDesignData = designEvent.getSaveDesignDataFromDesignInfo(designInfo);
      let queryData = {...saveDesignData,tid:designInfo.teamId!==undefined?designInfo.teamId:0};
      if(this.apiToken) queryData.api_token = this.apiToken;
      this.$http.post('/design/getDesignV4', queryData).then((response) => {

        if(response.body.error) {
          if(response.body.error == '非beta环境') {
            // 设计没有应用新的保存方式
            this.applyNewSave(saveDesignData.d);
            return;
          } else if(response.body.error == '设计尚未创建完成') {
            this.setLayoutOnload(true);
            this.setErrorShow(3);
            return;
          }
          this.setLayoutOnload(true);
          this.setErrorShow(3);
          return;
        }

        // 初始化designInfo
        designEvent.setDesignInfo(response.body);
        webSocket.init(designInfo.teamId!==undefined?designInfo.teamId:0);
        if(designInfo.thirdKindId) {
          response.body.k = designInfo.designKindId;
        }
        dataHandle.initDesignInfo(response.body);

        this.setDesignTitle(response.body.title || '');
        this.setPageWidth(parseFloat(response.body.w));
        this.setPageHeight(parseFloat(response.body.h));

        let newPageIdList = [];

        // 新建设计设置保存
        let ob = 0,
            turnOnBleedSave = false;
        // 是否新建的设计
        if(!response.body.isExist) {
          // 是否是出血场景
          if(response.body.bv > 0) {
            // 是否模板创建
            if(designInfo.templateId || designInfo.teamTemplateId) {
              // 模板json是否已经出血
              if(response.body.templateBleed === 1) {
                ob = 1;
              } else {
                ob = 0;
                turnOnBleedSave = true;
              }
            } else {
              ob = 0;
              turnOnBleedSave = true;
            }
          }
          // 不存在的设计需要先保存
          dataHandle.saveDesign(this.isLogin, {ob});
        }

        // 设置画布出血及保存出血
        if(response.body.isExist) {
          designEvent.setIsBleed(response.body.bleed);
        } else {
          // 设计是否需要出血
          if(response.body.bv > 0) {
            designEvent.setIsBleed(true);
            // 是否需要保存出血状态
            if(turnOnBleedSave) {
              pageEvent.pageBleedOnSetPageWH();
              let commit = ()=> {
                dataHandle.commit(
                  'design',
                  {
                    key: 'bleed',
                    value: 1,
                    eventType: 0
                  }).push();
                dataHandle.update();
              }
              dataHandle.setInPageCallBackQueue(commit);
            } else {
              let commit = ()=> {
                this.setAllPageSaving(false);
              }
              dataHandle.setInPageCallBackQueue(commit);
            }
          } else {
            designEvent.setIsBleed(false);
            let commit = ()=> {
              this.setAllPageSaving(false);
            }
            dataHandle.setInPageCallBackQueue(commit);
          }
        }

        // 设置画布信息
        if(response.body.isExist) {

          if(response.body.pageJsonIds) {
            let i = 0;
            while(response.body.pageJsonIds[i]) {
              newPageIdList.push(response.body.pageJsonIds[i]);
              ++i;
            }
          } else {
            newPageIdList.push(0);
          }

        } else if(designInfo.templateId || designInfo.teamTemplateId) {
          // 模板创建的设计在新建画布的请求返回成功之前不能获取画布json
          if(this.isLogin) this.setAllPageSaving(true);
          
          let pageId,
              j = 0,
              templateCommit = designInfo.templateId ? 2 : 3;
          while(response.body.pageJsonIds[j]) {
            pageId = pageEvent.getNewPageId(j);
            newPageIdList.push(pageId);
            dataHandle.commit(
              'page',
              {
                pageIndex: j,
                pageId: pageId,
                targetPageId: response.body.pageJsonIds[j],
                value: null,
                eventType: 0,
                isTemplate: templateCommit
              });
              ++j;
              this.setTemplateInfo({
                bleed: response.body.templateBleed === 1 ? true : false,
                ids: response.body.pageJsonIds
              });
          }

          // dataHandle.setInPageCallBackQueue(()=>{
          //   this.setAllPageSaving(false);
          // });

        } else if(designInfo.designKindId) {
          if(this.isLogin) this.setAllPageSaving(true);

          let pageId = pageEvent.getNewPageId();
          newPageIdList.push(pageId);
          dataHandle.commit(
            'page',
            {
              pageIndex: 0,
              pageId: pageId,
              value: null,
              eventType: 0
            });

        }
        this.setPageIdList(newPageIdList);

        dataHandle.push(true);

        // 设置画布json
        pageEvent.initPageJson({
          json: response.body.firstPageJson,
          width: response.body.w,
          height: response.body.h,
          firstPageId: newPageIdList[0]
        });

        // 设置layout onload状态
        this.setLayoutOnload(true);
        //更新dataHandle的镜像json
        dataHandle.updateDesignJson();

	      let getDesignCooperativeStamp=()=>{
		      this.$http.post('/design/getDesignCooperativeStamp',{d:response.body.d,tid:designInfo.teamId})
			      .then(res=>{
				      if(res.body){
				        if(res.body.stamp){
                  this.setTeamStamp(res.body.stamp)
                  setTimeout(()=>{
                    getDesignCooperativeStamp()
                  },15000)
                }else {
                  switch (res.body.code){
                    case 1:

                      break
                    case -1:
                    case -4:
                      this.setMessageShow({placeHolder:'获取协作设计时错误！',hideTime:2500})
                      this.setErrorShow(10)
                      break
                    case -2:
                      this.setMessageShow({placeHolder:'未登录！'})
                      this.showLogreg(1)
                      setTimeout(()=>{
                        getDesignCooperativeStamp()
                      },15000)
                      break
                    case -3:
                      this.setMessageShow({placeHolder:'你没有权限编辑此作品！',hideTime:2500})
                      this.setErrorShow(10)
                      break
                    case -5:
                      this.setMessageShow({placeHolder:'成员“'+decodeURIComponent(res.body.name)+'”正在编辑此设计',hideTime:2500})
                      this.setErrorShow(10)
                      break
                  }
                }
				      }
			      })
	      }

        if(response.body.ic){
	        getDesignCooperativeStamp()
        }

      }).catch((error) => {
        console.log(error);
      });
    }

  }
}

</script>

<style lang="less" scoped>
@import 'design.less';
#kit-header{
  position: absolute;
  top: 0;
  left:0;
  width: 100%;
  height:50px;
}

.container{
  padding-top: 50px;
  height: 100%;
}

.leftPanelEnter-enter-active {
  transition: transform .5s cubic-bezier(0.25, 0.1, 0, 1.04), opacity .5s;
}
.leftPanelEnter-enter {
  transform: translate(-366px, 0px);
  opacity: 0;
}
.headerEnter-enter-active {
  transition: transform .5s cubic-bezier(0.25, 0.1, 0, 1.04), opacity .5s;
}
.headerEnter-enter {
  transform: translate(0px, -50px);
  opacity: 0;
}

</style>
