<!--
    created by lfl,2017/9/5
    miss:保存设计功能以及id替换
-->
<template>
  <div id="designTitle">
    <div class="designTitleBack"></div>
    <a :href="leftLogoLink" class="leftLogoA">
      <div class="leftLogo" :style="leftLogo"></div>
    </a>
    <div v-if="isLogin || apiInfo" class="noRightIn">
      <div class="design_kind_title">
        <div class="design_kind_name" id="design_kind_name"></div>
        <div class="design_kind_size" id="design_kind_size"></div>
      </div>
      <div v-if="apiInfo && apiInfo['data-allow-login'] == 1" class="api-login-wrap">
        <div v-if="userInfo && userInfo.isTmpUser">
          临时用户<span @click="apiRegister" class="api-register">注册</span>or<span @click="apiLogin" class="api-login">登录</span>
        </div>
        <div v-else class="api-user-name">{{ decodeURIComponent(userInfo.nickname) || userInfo.email }}<div @click="apiLogout" class="api-logout">注销</div></div>
      </div>
      <div v-else class="design_title" id="design_title"><input id="design_title_input"
                                                         maxlength="20"
                                                         placeholder='点击此处设置作品名称'
                                                         @blur="saveDesignTitle"
                                                         @focus="cancelFoucus"
                                                         autocomplete="off"
                                                         v-model="showTitle"
      ></div>
      <div class="cooperate_power_text">由于作者的设置，您对该设计只拥有浏览权限</div>

   <!-- 导航配置-->
    <div class="ckt-nav clearfix">
      <div class="design-bar design_file fl headerEnterLeft">
        <span class="design_file_icon"></span>
        <span class="design_file_title" @mouseenter="getPageSize">&nbsp;&nbsp;文件
          <span class="point-out-circle" name="design_page_file_btn">
            <span class="bigCircle"></span>
            <span class="smallCircle"></span>
          </span>
        </span>
        <ul class="design_file_list">
          <li class="design_present_size" :title="'当前尺寸为 ：'+ designWidth + ' *'+designHeight">当前尺寸为 ： {{designWidth}} * {{designHeight}}</li>
          <hr>
          <li class="design_open" v-if="!apiInfo" @click="openDesign">打开设计</li>
          <li class="design_save" @click="saveDesign">保存</li>
          <li class="design_copy" v-if="!apiInfo" @click="saveAs">另存为</li>
          <hr v-if="!apiInfo">
          <li class="design_size_move" v-if="!apiInfo || apiInfo && apiInfo['data-change'] == 1" @click="showPageSize">画布尺寸调整</li>
          <li class="design_change_sence" v-if="!apiInfo" @click="showChangeScene">
            <span class="posting_mydesign_icon sence-same-icon"></span>
            <span class="change_sence_title">智能变换尺寸</span>
          </li>
          <li v-if="!apiInfo" class="design_set" @click="importOwnDesign">
            <span class="posting_mydesign_icon sence-same-icon"></span>
            <span class="change_sence_title">导入设计</span>
          </li>
        </ul>
      </div>
		  <div class="undo design-bar-btn fl headerEnterLeft" title="撤销" @click="designUndo">
        <span class="span_img nav-icon"></span>撤销
      </div>
      <div class="redo design-bar-btn fl headerEnterLeft" title="重做" @click="designRedo">
        <span class="redo_img nav-icon"></span>重做
      </div>
   
      <div v-if="apiInfo" class="api-finish design-bar-btn print-position fr btn_design headerEnterLeft" style="animation-delay: 850ms" title="完成" @click="apiFinishDesign" :class="{cantSave:getQueLength}" :data="isExit">
        <span class="api-finish-img nav-icon"></span>完成
      </div>
      <div v-show="isPrint&& !apiInfo" class="print design-bar-btn print-position fr btn_design headerEnterLeft" style="animation-delay: 800ms" title="印刷" @click="toPrintDesign" :class="{cantSave:getQueLength,noPrint:cantprint}" :data="isExit">
        <span class="down_img nav-icon"></span>去印刷
      </div>
       <div v-show="!apiInfo" class="download  design-bar-btn fr headerEnterLeft" style="animation-delay: 750ms" title="下载" @click="showDownLoad" :class="{btn_design:cantprint,cantSave:getQueLength,'print-download':isPrint}" :data="isExit">
        <span class="down_img nav-icon"></span>下载
      </div>
        <div v-show="!apiInfo" class="export design-bar-btn fr headerEnterLeft" style="animation-delay: 700ms"  title="发布分享" @click="shareOwnDesign"  :class="{cantSave:getQueLength,'print-export':isPrint}" :data="isExit">
        <span class="share_img nav-icon"></span>
        <span>发布分享</span>
        <!--<ul class="share-join" v-show="shareJoin">
          <li class="share-design-li" @click="shareOwnDesign">分享设计</li>
          <li class="active-design-li" @click="joinActive">参加活动</li>
        </ul>-->
      </div>
      <a v-show="pptScene && !apiInfo" class="ppt-play design-bar-btn fr btn_design headerEnterLeft" style="animation-delay: 650ms" title="播放" :href="toUrl" target="_blank" :class="{cantSave:getQueLength}" :data="isExit">
        <a class="ppt_play nav-icon" ></a>播放
      </a>
      <div v-show="setAsTemplateShow" class="team-play design-bar-btn fr btn_design headerEnterLeft" style="animation-delay: 600ms" title="设置为模板" @click="setAsTemplate" :class="{cantSave:getQueLength,'print-team':isPrint}" :data="isExit">
        <span class="team_temp nav-icon"></span>设置为模板
      </div>
       <div v-show="teamWorkSetButtonShow" class="team-coper design-bar-btn fr btn_design headerEnterLeft" style="animation-delay: 550ms" title="协作权限设置" @click="teamWorkSetShow=true" :class="{cantSave:getQueLength}" :data="isExit">
        <span class="team_coper nav-icon"></span>协作权限设置
      </div>
         <div>
           <!-- 升级会员-->
        <div class="upvip show-vip fr btn_design headerEnterLeft" v-show="isVip==1 && !apiInfo">
          <span  @click="upToVipMember" @mouseenter="whyToBe=true" @mouseout="whyToBe=false" class="up_member">升级会员</span>
                <div class="vip-equal" v-show="whyToBe">
              <div class="trangle"></div>
              <ul class="design_vip_list upvip-list">
                 <li class="design_vip_why" >为什么加入VIP?</li>
                  <div class="divhr"></div>
                    <li class="design_open vip-icon tp1">
                       <div class="vip-left">
                        <img src="./img/group5.svg" alt="">
                      </div>
                      <div class="vip-right">
                      <span class="mr1">专属模板</span><br>
                        <span>10000+付费模板无限使用</span>
                      </div>
                    </li>
                  <li class="design_open vip-icon tp2">
                    <div class="vip-left">
                      <img src="./img/group7.svg" alt="">
                   </div>
                   <div class="vip-right">
                     <span class="mr1">版权字体</span><br>
                    <span class="mr2">40+会员专属字体</span>
                   </div>
                  </li>
                  <li class="design_open vip-icon tp3">
                     <div class="vip-left">
                       <img src="./img/group4.svg" alt="">
                     </div>
                     <div class="vip-right">
                       <span class="mr3">文件夹管理</span><br>
                      <span class="mr4">云端储存轻松管理</span>
                    </div>
                  </li>
                   <li class="design_open vip-icon tp4">
                    <div class="vip-left">
                      <img src="./img/xz.svg" alt="">
                    </div>
                    <div class="vip-right">
                      <span class="mr5">智能变换尺寸</span><br>
                      <span>一个设计，秒变多个尺寸</span>
                   </div>
                  </li>
                   <li class="design_open vip-icon tp5">
                    <div class="vip-left">
                      <img src="./img/group6.svg" alt="">
                   </div>
                    <div class="vip-right">
                     <span class="mr6">更多权益</span><br>
                     <span class="mr7">更多会员权益，等你发现</span>
                    </div>
                 </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
      <span v-show="!apiInfo || !(apiInfo && apiInfo['data-auto-save'] == 0)" class="save-time">{{saveTimes}}</span>
    </div>
    <div v-else id="afterLogin">
      <div id="afterLoginCanDownload">当前用户仅供设计体验，注册后可进行分享、保存与下载等更多功能
        <span class="register-btn" @click="signInkit">注册</span>
        or
        <span id="login-btn" class="login-btn" @click="logInkit">登录</span>
      </div>
    </div>
    <!-- 下载作品模态框 -->
    <modal :modalShow="downModalShow" type="modal1" @modalClose="modalClose" :closeShow="shutCrossIcon">
      <down-load
        @closeAnimation="closeAnimation"
        @shuticon="guanBicon"
        :navData="navData"
        @showQrcodeIcon="shutCrossIcon=true"
        @closePrintModal="downModalShow=false"
      ></down-load>
    </modal>
    <!-- 智能变换设计弹框 -->
    <modal :modalShow="changeSceneModalShow" type="modal1" @modalClose="modalCloseChangeScene">
      <change-scene @closeChangeScneModal="changeSceneModalShow=false"></change-scene>
    </modal>
    <!-- 分享设计模态框
    <modal :modalShow="shareModalShow" type="modal1" @modalClose="modalCloseShare" :closeShow="shutCrossIcon">
      <share-design v-show="shareDesignPage"
                    @secrectParent="secrectParent"
                    @shuticon="shutIcon"
                    @showPublicLink="showPublicLink"
                    @showQrcodeIcon="shutCrossIcon=true"
                    :sharetitle="showTitle"
                    @changeDesignTitle="changeDesignTitle"
      ></share-design>
      <copy-link
        v-show="publicSharePage"
        :sharetitle="showTitle"
        @closeCopyLink="closeCopyLink"
        @goBackToShare="shareDesignPage=true"
        @closeCodeModal="closeCodeModal"></copy-link>
      <copy-done v-show="secrectSharePage" :secrectPassword="secrectPassword"
                 @closeCopyDone="secrectSharePage=false"
                 @goBackToShare="shareDesignPage=true"
      ></copy-done>
    </modal>-->
    <!--置入我的设计模态框 -->
    <modal :modalShow="myDesignModalShow" type="modal1" @modalClose="modalCloseMyDseign">
      <import-design @closeWaterFall="closeWaterFall"></import-design>
    </modal>
    <!--参加活动模态框 -->
    <modal :modalShow="joinActiveModalShow" type="modal1" @modalClose="modalCloseMyJoin">
      <join-active @closeActiveModal="closeActiveModal"></join-active>
    </modal>
    <!--发布分享-->
    <publish-share v-show="publishShareShow" :show="publishShareShow" @closeShare="publishShareShow = false"></publish-share>
    <!--等待分享生成动画-->
    <share-animation v-show="shareAnimationShow"></share-animation>
    <!--调整画布尺寸弹窗 -->
    <modal type="modal6" :modalShow="pageSizeModalShow" @modalClose="modalClosePage" :position="position">
      <div class="canvas-adjustment-wrap now-set" id="changePageSize">
        <div class="canvas-adjustment">
          <input class="new-size width-size" type="text" v-model="currentSizeWidth">
          <span class="size-unit">{{unit}}</span>
          <span class="size-icon"></span>
          <input class="new-size height-size" type="text" v-model="currentSizeHeight">
          <span class="size-unit">{{unit}}</span>
          <span class="new-size-cancel" @click.stop="pageSizeModalShow=false">
            <span class="cancel-icon btn-icon"></span>
          </span>
          <span class="new-size-confirm" @click.stop="changePageSize">
            <span class="confirm-icon btn-icon"></span>
          </span>
        </div>
      </div>
    </modal>
    <!--另存为弹窗 -->
    <modal :modalShow="saveModalShow" type="modal1" @modalClose="modalCloseSave">
      <join-save @cancelModal="cancelModal" @sureToSave="sureToSave" @changeDesignTitle="changeDesignTitle"></join-save>
    </modal>
    <!-- 画布尺寸调整对话框-->
    <modal :modalShow="dialogModalShow" type="modal1" @modalClose="modalCloseSave">
      <ckt-dialog></ckt-dialog>
    </modal>
    <!-- 去印刷动画 -->
    <modal type="modal1" :closeShow="iconShow" :modalShow="printModal" @modalClose="printPage?printModal=true:printModal=false">
      <to-print-animation v-show="printPage"></to-print-animation>
      <!-- <save-print-now v-show="!printPage"
                      :designId="printId"
                      @closePrintModal="printModal=false"
      ></save-print-now> -->
    </modal>
    <modal
      type="modal1"
      :modalShow="teamWorkSetShow"
      @modalClose="teamWorkSetShow=false"
    >
      <teamWorkSet></teamWorkSet>
    </modal>

  </div>
</template>
<script>
import downLoad from 'pages/design/headermodal/download/downLoad'
import changeScene from 'pages/design/headermodal/changescene/changeScene'
import modal from 'components/modal/modal.vue'
import shareDesign from 'pages/design/headermodal/sharedesign/shareDesign'
import importDesign from 'pages/design/headermodal/importdesign/importDesign'
import copyLink from 'pages/design/headermodal/sharedesign/copyLink'
import copyDone from 'pages/design/headermodal/sharedesign/copyDone'
import joinActive from 'pages/design/headermodal/joinactive/joinActive'
import joinSave from 'pages/design/headermodal/savedesign/joinSave'
import cktDialog from 'components/dialog/dialog.vue'
import { mapGetters, mapActions } from 'vuex'
import pagechange from '../../dataBus/page'
import designEvent from 'dataBus/design'
import dataHandle from 'common/dataHandle'
import pageEvent from '../../dataBus/pageEle'
import toPrintAnimation from 'pages/design/headermodal/print/toPrintAnimation'
// import savePrintNow from 'pages/design/headermodal/print/savePrint.vue';
import teamWorkSet from 'pages/design/headermodal/teamWorkSet/teamWorkSet.vue'
import publishShare from 'pages/design/headermodal/publishShare/publishShare.vue'
import shareAnimation from 'pages/design/headermodal/publishShare/shareanimation.vue'
export default {
  name: 'header',
  components: {
    downLoad,
    modal,
    changeScene,
    shareDesign,
    importDesign,
    copyLink,
    copyDone,
    joinActive,
    joinSave,
    cktDialog,
    toPrintAnimation,
    // savePrintNow,
    teamWorkSet,
    publishShare,
    shareAnimation
  },
  data() {
    return {
      printId:'',
      iconShow:false,
      downList: false,
      printPage:true,
      shareJoin: false,
      downModalShow: false,
      changeSceneModalShow: false,
      shareModalShow: false,
      myDesignModalShow: false,
      joinActiveModalShow: false,
      publicSharePage: false,
      secrectSharePage: false,
      shareDesignPage: true,
      sharetitle: '',
      pageSizeModalShow: false,
      saveModalShow: false,
      dialogModalShow:false,
      teamWorkSetShow: false,
      designWidth: '',
      designHeight: '',
      currentSizeHeight:'',
      currentSizeWidth:'',
      secrectPassword: '',
      shutCrossIcon: true,
      unit: '',
      whyToBe:false,
      uploading:'',
      getQueLength:false,
      cantprint:false,
      publishShareShow: false,
      shareAnimationShow: false,
      quelengthInpage:'',
      position: {
        top: 40
      },
      designName:'',
      navData: [{
				list: '图片',
				showFlag: 1
			}, {
				list: 'PDF印刷',
				showFlag: -1
			}, {
				list: 'PPT文件',
				showFlag: -1
      }],
      showTitle:'',
      uploadstatus:'',
      printModal:false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo',
      isLogin: 'getIsLogin',
      isVip:'getIsVip',
      focusElemIndex:'getFocusElemIndex',
      designTitle:'getDesignTitle',
      saveTimes:'getSaveTimes',
      apiInfo: 'getApiInfo',
      teamId:'getTeamId',
      teams:'getTeams',
      designInfo:'getDesignInfo',
	    saveSuccessMessageFlag:'getSaveSuccessMessageFlag'
    }),
    teamWorkSetButtonShow(){
      if(this.teamId>0){
        if(this.designInfo.isExist&&this.designInfo.ido){
          return true
        }else if(!this.designInfo.isExist){
          return true
        }else{
          return false
        }
      }
      return false
    },
	  setAsTemplateShow(){
    	if(this.teamId>0){
    		let role='Worker'
    		this.teams.forEach(team=>{
    			if(team.teamId===this.teamId)
				    role=team.teamRoleEnum
        })
        if(role!=='Worker'){
    			return true
        }
        return false
      }
    	return false
    },
    toUrl(){
      return '/show?d='+designEvent.getDesignInfo().designId+'&kindId='+designEvent.getDesignInfo().designKindId
    },
    isExit(){
      if(designEvent.getDesignInfo().isExist){
        this.getQueLength = false
      }else{
        this.getQueLength = true
      }
    },
    isPrint(){
        return designEvent.getDesignInfo().isPrint?true:false
    },
    pptScene(){
      return designEvent.getDesignInfo().designKindId==1||designEvent.getDesignInfo().designKindId==39?true:false
    },
    leftLogo() {
      if(this.apiInfo) {
        return {
          'background-image': 'url(' + this.apiInfo['data-logo'] + ')',
          'background-size': 'contain',
          'background-position': '0 0'
        }
      } else {
        return ''
      }
    },
    leftLogoLink() {
      if(this.apiInfo) {
        return 'javascript:void(0)'
      } else {
        return '/startdesign';
      }
    }
  },
  methods: {
    //引入提示信息
    ...mapActions({
      setMessageShow: 'setMessageShow',
      showLogreg: 'setLogregShow',
      setErrorShow:'setErrorShow',
      setDialogShow:'setDialogShow',
      setDesignTitle:'setDesignTitle',
      setSaveTimes:'setSaveTimes',
      setShareUrl: 'setShareUrl',
      setShareState: 'setDesignShareState',
	    setSaveSuccessMessageFlag:'setSaveSuccessMessageFlag'
    }),
    // api登录
    apiLogin() {
      let confirm = () => {
        this.showLogreg(1);
      }
      let cancel = () => {
        this.pageSizeModalShow = false;
      }
      this.setDialogShow({
        title: '', // 可选，默认为"提示"
        content:'<span>切换账号后当前画布上的设计会消失哦</span>',
        funcs:{
          confirm,
          cancel
        }
      })
    },
    // api注册
    apiRegister () {
      this.showLogreg(2);
    },
    apiLogout() {

    },
    setAsTemplate(){
      this.$http.post('/designtemplate/setAsTeamTemplate',{ids:this.designInfo.designId,tid:this.teamId,c:!!this.designInfo.ic})
        .then(res=>{
          if(res.data.body){
            switch (res.data.body.code){
              case 1:
                this.setMessageShow({placeHolder:'设置成功',kind:'success'})
                break
              case 0:
                this.setMessageShow({placeHolder:'设置失败'})
                break
              case -1:
                this.setMessageShow({placeHolder:'设置失败,权限不足'})
                break
              default:
                this.setMessageShow({placeHolder:'设置失败'})
            }
          }
        },err=>{
          console.log('网络出错')
        })
    },
    //添加图片印刷任务
    getDownData(queryconfig){
      queryconfig.tid = this.teamId ? this.teamId : 0;
      this.$http.post('/design/addMakeImageTask',queryconfig).then(res=>{
        let code = res.body.code,
          apiError;
        switch (code) {
          case 1:
            //查询图片生成状态
            let getState = {
              d: queryconfig['d'],
              type: queryconfig['type']
            }
            this.getImageState(getState)
            break;
          case -1:
            apiError = '参数错误';
            this.setMessageShow({ placeHolder: '参数错误' })
            this.$emit('closeAnimation', this.downLoadAnimation)
            break;
          case -2:
            apiError = '权限不足';
            this.setMessageShow({ placeHolder: '权限不足' })
            this.$emit('closeAnimation', this.downLoadAnimation)
            break;
          case -3:
            apiError = '图片类型错误';
            this.setMessageShow({ placeHolder: '图片类型错误' })
            this.$emit('closeAnimation', this.downLoadAnimation)
            break;
          case -4:
            apiError = '登录超时';
            this.setMessageShow({ placeHolder: '登录超时' })
            this.$emit('closeAnimation', this.downLoadAnimation)
            break;
        }
        if(this.apiInfo && code < 0) {
          this.printPage = false
          this.iconShow = true
          window.parent.postMessage({
            'cktMessage': true,
            'kind': -1,
            'design-id': queryconfig['d'],
            'error': '生成设计缩略图错误,' + apiError
          }, "*");
        }
      }).catch(error=>{
        console.log(error)
      })
    },
    //查询图片生成状态
    getImageState(query) {
      query.tid = this.teamId ? this.teamId : 0;
      this.$http.post('/design/getMakeImageState', query).then(res => {
        let code = res.body.state
        switch (code) {
          case 0:
          case 1:
          case 2:
            setTimeout(() => this.getImageState(query), 3000)
            break;
          case 3:
            // this.printPage = false
            // this.iconShow = true
            //说明生成了
            this.printModal = false
             window.open('/orderdetails?d='+designEvent.getDesignInfo().designId)
            if(this.apiInfo) {
              window.parent.postMessage({
                'cktMessage': true,
                'kind': 2,
                'thumb-urls': res.body.thumbUrls,
                'design-id': query.d,
                'thumb-exp': res.body.exp
              }, "*");
            }
            break;
          case 4:
            this.printPage = false
            this.iconShow = true
            this.setMessageShow({ placeHolder: '登录超时' })
            if(this.apiInfo) {
              window.parent.postMessage({
                'cktMessage': true,
                'kind': -1,
                'design-id': query.d,
                'error': '生成设计缩略图错误，登录超时'
              }, "*");
            }
            break;
        }
      }).catch(error => {
        console.log(error)
      })
    },
    toPrintDesign(){
       pagechange.elementBlur()
       if(this.getQueLength==true){
          this.setMessageShow({ placeHolder: '正在保存设计' })
        return;
       }else{
          if(this.cantprint!==true)
        this.printModal = true
        this.printPage = true
        this.iconShow = false
        let designObj = designEvent.getDesignInfo()
        let id = designObj.designId
        this.printId = id
        let query = {
          d:id,
          type:13
        }
        this.getDownData(query)
       }
    },
    apiFinishDesign() {
      this.printModal = true
      this.printPage = true
      this.iconShow = false
      let designObj = designEvent.getDesignInfo()
      let id = designObj.designId
      this.printId = id
      let query = {
        d:id,
        type:1
      }
      this.getDownData(query)
    },
    upToVipMember(){
      window.open('/price?p=1')
    },
    //登录创客贴
    logInkit() {
      this.showLogreg(1)
    },
    //注册创客贴
    signInkit() {
      this.showLogreg(2)
    },
    changeDesignTitle(data){
      this.showTitle = data
    },
    getPageSize() {
      this.designWidth = designEvent.getDesignInfo().designWidthWithUnit
      // console.log(designEvent.getDesignInfo())
      this.designHeight = designEvent.getDesignInfo().designHeightWithUnit
    },
    //传递动画信息
    guanBicon() {
      this.shutCrossIcon = false
    },
    //关闭导入设计瀑布流模态框
    closeWaterFall() {
      this.myDesignModalShow = false
    },
    closeCopyLink() {
      this.publicSharePage = false
    },
    //输入框获取焦点的时候让当前元素失去焦点
    cancelFoucus(){
      pagechange.elementBlur()
      document.querySelector('#design_title_input').setAttribute('placeholder','')
    },
    closeActiveModal(){
      this.joinActiveModalShow=false
    },
    //关闭二维码
    closeCodeModal(){
      this.shareModalShow=false
    },
    showPublicLink(data) {
      //添加上叉子标记并显示出copylink内容
      this.getAnimationState = data
      this.shutCrossIcon = true
      this.shareDesignPage = false
      this.secrectSharePage = false
      this.publicSharePage = true
    },
    //分享私密弹窗
    secrectParent(data) {
      this.shutCrossIcon = true
      this.secrectSharePage = true
      this.shareDesignPage = false
      this.secrectPassword=data.passwordScret
      this.getAnimationState = data.data
    },
    //点击下载出现的模态框
    showDownLoad() {
      pagechange.elementBlur()
      if(this.getQueLength==false){
        this.downModalShow = true
        if(designEvent.getDesignInfo().designKindId==1||designEvent.getDesignInfo().designKindId==39){
          this.navData = [
            {
              list: '图片',
              showFlag: 1
            },
            {
              list: 'PDF印刷',
              showFlag: -1
            },
            {
              list: 'PPT文件',
              showFlag: -1
            }
          ]
        }else{
          this.navData=[
            {
              list: '图片',
              showFlag: 1
            },
            {
              list: 'PDF印刷',
              showFlag: -1
            }
          ]
        }
      }else{
        this.setMessageShow({ placeHolder: '正在保存设计' })
        return;
      }
    },
    modalClose() {
      //这里需要判断是否是动画状态
      if (this.shutCrossIcon==true) {
        this.downModalShow = false
      } else {
        this.downModalShow = true
      }
    },
    //点击智能变换设计出现的模态框
    showChangeScene() {
      this.changeSceneModalShow = true
    },
    modalCloseChangeScene() {
      this.changeSceneModalShow = false
    },
    //  点击发布分享下拉框显示与隐藏
    showHideShare() {
      if(this.getQueLength==false){
        this.shareJoin =  true
      }else{
        this.shareJoin = false
      }
    },
    hideHideShare(){
      this.shareJoin = false
    },
    shutIcon(data) {
      this.getAnimationState = data
      this.shutCrossIcon = false
    },
    //点击发布分享后在点击分享出现的模态框
    //这里需要判断是否是动画显示状态
    modalCloseShare() {
      if(this.getAnimationState!=true)
        this.shareModalShow = false
    },
    shareOwnDesign() {
      if(this.getQueLength)
        return;
      pagechange.elementBlur();
      //查询该设计是否被分享过
      let designInfo = this.designInfo;
      let shareState;
      if(typeof designInfo.shareState === 'number') {
        shareState = designInfo.shareState;
      } else if(typeof designInfo.shareState === 'object') {
        shareState = designInfo.shareState.state;
      }
//      if(shareState){
//        this.setShareUrl(`${window.location.protocol}//${window.location.hostname}/sharedesign?d=${this.designInfo.designId}`);
//        this.publishShareShow = true;
//      } else {
        // 添加生成过程loading
      this.shareAnimationShow = true;
      let data = {
        d: designInfo.designId,
        a: 1,
        ty: 1,
        ti: this.designTitle || '未命名'
      }
      if(this.teamId) {
        data.tid = this.teamId;
        data.c = !!designInfo.ic;
      }
      this.$http
          .post('/share/makeShareV3', data)
          .then(res =>  {
            let code = res.body.rc,
            passwordScret = res.body.p;
            switch(code) {
              case 1: let query = {
                            d: data.d,
                          a: data.a
                          };
                      if(this.teamId) {
                        data.tid = this.teamId;
                        data.c = !!designInfo.ic;
                      }
                      this.getShareImageState(query, data.ty, passwordScret);
                      break;
              case 0:
              case -1:
              case -2: this.setMessageShow({ placeHolder: '失败'})
                      break;
              case -3: this.setMessageShow({ placeHolder: '分享不存在'})
                      break;
            }
          })
//      }
    },
    getShareImageState(query, ty, passwordScret) {
      this.$http.post('/share/getMakeShareImageStatus', query).then(res => {
        let state = res.body.state
        switch (state) {
          case 3:
          //说明生成了
            this.shareAnimationShow=false;
            this.setShareUrl(`${window.location.protocol}//${window.location.hostname}/sharedesign?d=${this.designInfo.designId}`);
            this.publishShareShow = true;
            this.setShareState(1);
            break;
          case 0:
          case 1:
          case 2:
            setTimeout(() => this.getShareImageState(query, ty, passwordScret), 3000);
            break;
          case 4:
            this.setMessageShow({ placeHolder: '生成失败' })
            break;
            case 5:
            alert('抱歉，系统检测到您的设计(id:' + query.d + ')分享出错。请您联系创客贴服务QQ:2316289865或致电创客贴服务电话:400-871-8211，我们会第一时间帮助您解决遇到的问题。创客贴的成长期待您的帮助和反馈。')
            break;
        }
      }).catch(error => {
        console.log(error);
        console.log('error')
      })
    },
    importOwnDesign() {
      this.myDesignModalShow = true
    },
    modalCloseMyDseign() {
      this.myDesignModalShow = false
    },
    //点击参加活动弹出活动模态框
    joinActive(){
      this.joinActiveModalShow = true
    },
    modalCloseMyJoin() {
      this.joinActiveModalShow = false
    },
    //画布尺寸调整弹窗
    showPageSize() {
      pagechange.elementBlur()
      this.pageSizeModalShow = true
      this.currentSizeWidth = Number.parseInt(designEvent.getDesignInfo().designWidthWithUnit.slice(0,-2));
      this.currentSizeHeight = Number.parseInt(designEvent.getDesignInfo().designHeightWithUnit.slice(0,-2))
      this.unit = designEvent.getDesignInfo().unit;
    },
    //关闭画布尺寸调整弹窗
    modalClosePage() {
      this.pageSizeModalShow = false
    },
    //打开设计
    openDesign(event) {
      if (event.button != 0) return false
      window.open('/designmanage');
    },
    //另存为
    saveAs() {
      this.saveModalShow = true
       pagechange.elementBlur()
      window.localStorage.removeItem('button')
    },
    //关闭另存为弹窗
    modalCloseSave() {
      this.saveModalShow = false
    },
    //取消另存为
    cancelModal() {
      this.saveModalShow = false
    },
    //复制设计的方法
    copyDesign(query,data){
      this.$http.post('/design/copyDesign',query).then(res=>{
        let newId = res.data.body.newDesignIds&&res.data.body.newDesignIds[0]
        let param = {
          folder_id: data.selectSum!==undefined?data.selectSum.folder_id:0,
          design_ids: `['${newId}']`
        }
        this.moveDesign(param)
      }).catch(error=>{
        console.log(error)
      })
    },
    //确定另存为
    sureToSave(data) {
      let _this = this
      let designObj = designEvent.getDesignInfo()
      let id = designObj.designId
      //另存为
      //复制设计
      let param = {
        designId:id,
        title:data.sharetitle
      }
      if(_this.teamId > 0 ){
        param.tid = _this.teamId
        param.c = true
      }
      this.copyDesign(param,data)
    },
    //移动文件夹的方法
    moveDesign(query){
      this.$http.post('/design/moveDesign',query).then(res=>{
        this.setMessageShow({ placeHolder: '另存为成功', kind: 'success' })
        this.saveModalShow = false
      }).catch(error=>{
      })
    },
    saveDesign() {
      //保存步骤数组
      if(this.quelengthInpage==0)
      if(this.apiInfo) {
        this.setMessageShow({placeHolder:'成功保存设计',kind:'success',hideTime:'4000'})
      } else {
        this.setMessageShow({placeHolder:'成功保存设计到<a href="/designmanage" style="color:#07aefc;">设计管理</a>',kind:'success',hideTime:'4000'})
      }
      dataHandle.update()
      this.setSaveSuccessMessageFlag(true)
    },
    saveDesignTitle(){
      document.querySelector('#design_title_input').setAttribute('placeholder','点击此处设置作品名称')
      console.log(this.showTitle)
      if(this.showTitle=="") return;
      this.setDesignTitle(this.showTitle)
      dataHandle.commit('design',{
        key:'title',
        value:this.showTitle||'',
        eventType:1
      }).push()
    },
    designUndo(){
      dataHandle.undo()
      pagechange.elementBlur()
    },
    designRedo(){
      dataHandle.redo()
      pagechange.elementBlur()
    },
    changePageSize() {
      //改变画布尺寸的方法
      let _this = this
      let computedWidth = Number.parseInt(this.currentSizeWidth)
      let computedHeight = Number.parseInt(this.currentSizeHeight)
      //根据单位来对数据进行判断
      if(designEvent.getDesignInfo().unit=='px'){
        if(computedWidth<40||computedHeight<40||computedWidth>10000||computedHeight>25000){
          this.setMessageShow({ placeHolder: '宽高只能为数字,最小为40*40，最大为10000*25000'})
          return ;
        }
      }else if(designEvent.getDesignInfo().unit=='mm'){
        if(computedWidth<15||computedHeight<15||computedWidth>2000||computedHeight>2000){
          this.setMessageShow({ placeHolder: '宽高只能为数字,最小为15*15，最大为2000*2000'})
          return ;
        }
      }else{
        if(computedWidth<1.5||computedHeight<1.5||computedWidth>200||computedHeight>200){
          this.setMessageShow({ placeHolder: '宽高只能为数字,最小为1.5*1.5，最大为200*200'})
          return ;
        }
      }
      //无厘米
      let unit = designEvent.getDesignInfo().unit,
        oldWidth = Number.parseInt(designEvent.getDesignInfo().designWidthWithUnit.slice(0,-2)),
        oldHeight = Number.parseInt(designEvent.getDesignInfo().designHeightWithUnit.slice(0,-2));
      if(this.currentSizeWidth<oldWidth || this.currentSizeHeight<oldHeight){
        this.setDialogShow({
          title: '', // 可选，默认为"提示"
          content:'<span>新尺寸小于原尺寸，将对画布进行裁剪，超出画布的元素将<span style="color:red;">丢失</span>，并且将会<span style="color:red;">清空撤销步骤</span>，是否继续尺寸调整</span>',
          funcs:{
            confirm,
            cancel
          }
        })
      }else if(this.currentSizeWidth>oldWidth || this.currentSizeHeight>oldHeight){
        //  console.log('123')
        this.setDialogShow({
          title: '', // 可选，默认为"提示"
          content:'<span>调整尺寸后不能撤销，<span style="color:red;">将会清空撤销步骤</span>，是否继续调整尺寸</span>',
          funcs:{
            confirm,
            cancel
          }
        })
      }else{
        this.pageSizeModalShow = false
      }
      function confirm (){
        _this.pageSizeModalShow = false;
        // pagechange.setPageWH(computedWidth, computedHeight,unit, true)
        pagechange.setPageWH({
          newWidth: computedWidth,
          newHeight: computedHeight,
          unit: unit,
          resetBackground: true
        })
        _this.setMessageShow({ placeHolder: '画布尺寸调整成功',kind:'success'})
        _this.cantprint = true
        dataHandle.commit('design',{
          key: 'wh',
          value: {
            ow: pagechange.getPageWHWithUnit().pageWidth,
            oh: pagechange.getPageWHWithUnit().pageHeight
          },
          eventType: 1
        }).push();
        dataHandle.update();
      }
      function cancel(){
        _this.pageSizeModalShow = false;
      }
    },
    closeAnimation() {
      this.downModalShow = false
    }
  },
  mounted() {
       //this.setErrorShow(3)
  },
  beforeMount(){
    dataHandle.addIsUploadCallBack((v)=>{
      this.uploading=v
      if(v === true) {
	      this.setSaveTimes('保存中...')
        window.parent.postMessage({
          'cktMessage': true,
          'kind': 1,
          'design-id': designEvent.getDesignInfo().designId
        }, "*");
      }
    })
    dataHandle.addUploadStatusCallBack((v)=>{
        this.uploadstatus = v
    })
    dataHandle.addPushQueueLengthCallBack((v)=>{
      this.quelengthInpage=v
    })
  },
  watch:{
    quelengthInpage(v){
        if(this.quelengthInpage>0){
          this.getQueLength = true
       this.setSaveTimes('有步骤尚未保存')
      }else if(this.quelengthInpage==0){
        switch(this.uploadstatus){
        case 1:
        case 0:
        break;
        case -4:
        this.setErrorShow(3)
        break;
        default:
        this.setErrorShow(1)
      }
      }
    },
    uploadstatus(v){
      switch(v){
        case 1:
        case 0:
          if(this.saveSuccessMessageFlag) {
            if(this.apiInfo) {
              this.setMessageShow({placeHolder:'成功保存设计',kind:'success',hideTime:'4000'})
            } else {
              this.setMessageShow({placeHolder:'成功保存设计到<a href="/designmanage" style="color:#07aefc;">设计管理</a>',kind:'success',hideTime:'4000'})
            }
          }
          this.setSaveSuccessMessageFlag(false)
          if(this.quelengthInpage>0){
            this.getQueLength = true
            this.setSaveTimes('有步骤尚未保存')
          }else if(this.quelengthInpage==0){
            this.setSaveTimes('保存完成!')
             setTimeout(()=>{
          let time = new Date();
          let minutes = time.getMinutes();
          if (minutes < 10) {
              minutes = '0' + minutes;
          }
          this.setSaveTimes(`今天 ${time.getHours()} : ${minutes} 更新`)
        },1000)
        this.getQueLength = false
      }
        break;
        case -4:
        this.setErrorShow(3)
        break;
        case -106:
        this.setErrorShow(9)
        break;
        default:
        this.setErrorShow(1)
      }
    },
    designTitle(n,o){
        if(n!=o){
            this.showTitle = n
        }
    }
  }
}
</script>
<style lang="less" scoped>
  @import 'header.less';
</style>