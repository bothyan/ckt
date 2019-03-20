import Vue from 'vue'
import Vuex from 'vuex'
import api from './modules/api'
import user from './modules/user'
import logreg from './modules/logreg'
import dialog from './modules/dialog'
import page from './modules/page'
import pageWrap from './modules/pageWrap'
import pageEle from './modules/pageElement.js'
import pageNavigator from './modules/pageNavigator'
import pageList from './modules/pageList'
import guideLine from './modules/guideLine'
import leftPanel from './modules/leftPanel'
import rightPanel from './modules/rightPanel'
import onload from './modules/onload'
import editor from './modules/editor'
import message from './modules/message'
import ColorPicker from './modules/colorPicker'
import LeftPanelAddElement from './modules/leftPanelAddElement'
import toolsBar from './modules/toolsBar'
import design from './modules/design'
import error from './modules/error'
import font from './modules/font'
import key from './modules/key'
import header from './modules/header'
import element from './modules/elements.js'
import hover from './modules/hover.js'
import thirdpartyLogin from './modules/thirdpartyLogin'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    api,
    user,
    logreg,
    dialog,
    page,
    pageWrap,
    pageEle,
    pageNavigator,
    pageList,
    guideLine,
    leftPanel,
    rightPanel,
    onload,
    editor,
    message,
	  ColorPicker,
    LeftPanelAddElement,
    toolsBar,
    design,
    error,
    font,
    key,
    header,
    element,
    hover,
    thirdpartyLogin
  }
})
