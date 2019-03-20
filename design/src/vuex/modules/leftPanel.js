import * as types from '../mutation-types'

const state = {
  leftPanelClose: false,
  leftPanelIndex:2,
  leftPanelSearchType:1,
  showFilter: false,
  showQrCode:false,
	qrCodeUrl:'',
  vipTemplateImgUrl:[],
  templateChange:true,
  uploadImgCtrl:false,
  leftPanelMenuList:[
	  {name:'search',text:'检索'},
	  {name:'template',text:'模板'},
	  {name:'material',text:'素材'},
	  {name:'font',text:'文字'},
	  {name:'background',text:'背景'},
	  {name:'chart',text:'小工具'},
	  {name:'upload',text:'上传'},
  ]
}

const getters = {
  getLeftPanelClose: state => state.leftPanelClose,
  getLeftPanelIndex: state => state.leftPanelIndex,
  getLeftPanelSearchType: state => state.leftPanelSearchType,
  getShowFilter: state => state.showFilter,
  getQrCodeShow: state => state.showQrCode,
  getQrCodeUrl: state => state.qrCodeUrl,
	getTemplateImgUrl: state => state.vipTemplateImgUrl,
  getTemplateChange: state => state.templateChange,
  getUploadImgCtrl: state => state.uploadImgCtrl,
  getLeftPanelMenuList: state => state.leftPanelMenuList
}

const mutations = {
  [types.SET_LEFT_PANEL_CLOSE] (state, leftPanelClose) {
    state.leftPanelClose = leftPanelClose
  },
  [types.SET_LEFT_PANEL_INDEX] (state, e) {
    state.leftPanelIndex = e
  },
  [types.SET_LEFT_PANEL_SEARCH_TYPE] (state,e){
    state.leftPanelSearchType=e
  },
  [types.SET_SHOWFILTER] (state, e) {
    state.showFilter = e;
  },
  [types.SET_QRCODESHOW] (state, e) {
    state.showQrCode = e;
  },
  [types.SET_QRCODEURL] (state, e) {
    state.qrCodeUrl = e;
  },
  [types.SET_TEMPLATEIMGURL] (state,e){
    state.vipTemplateImgUrl=e
  },
  [types.SET_TEMPLATECHANGE] (state,e){
    state.templateChange=e
  },
  [types.SET_IMGUPLOAD] (state,e){
    state.uploadImgCtrl=e
  }
}

const actions = {
  setLeftPanelClose({commit}, leftPanelClose) {
    commit(types.SET_LEFT_PANEL_CLOSE, leftPanelClose)
  },
  setLeftPanelIndex({commit}, e) {
    commit(types.SET_LEFT_PANEL_INDEX, e)
  },
  setLeftPanelSearchType({commit},e) {
    commit(types.SET_LEFT_PANEL_SEARCH_TYPE,e)
  },
  setShowFilter({commit}, e) {
    commit(types.SET_SHOWFILTER, e);
  },
	setQrCodeShow({commit},e){
    commit(types.SET_QRCODESHOW,e)
  },
	setQrCodeUrl({commit},e){
    commit(types.SET_QRCODEURL,e)
  },
	setTemplateImgUrl({commit},e){
    commit(types.SET_TEMPLATEIMGURL,e)
  },
  setTemplateChange({commit},e){
    commit(types.SET_TEMPLATECHANGE,e)
  },
	setUploadImgCtrl({commit},e){
    commit(types.SET_IMGUPLOAD,e)
  },
  setLeftPanelMenuList({commit},e){
    commit(types.SET_LEFT_PANEL_MENU_LIST,e)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
