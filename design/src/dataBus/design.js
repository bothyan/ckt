/*
 * design接口
 * @Author: bianhao 
 * @Date: 2017-09-05 15:10:50 
 * @Last Modified by: bianhao
 * @Last Modified time: 2017-09-27 15:14:31
 */

import dataHandle from 'common/dataHandle';

const design = {

    /**
     * 设置design基础信息
     * @param {Object} options 
     */
    setDesignInfo(options) {
        if (options == undefined) return;

        let vuexActions = dataHandle.vuexActions();
        let designInfo = {
            // designId
            designId: options.d,
            // 模板库设计三级分类ID
            thirdKindId: options.tk,
            // 设计高
            designHeight: options.h,
            // 设置宽
            designWidth: options.w,
            // 设计分类id
            designKindId: options.k,
            // 设计分类width
            designWidthWithUnit: Number.isInteger(parseFloat(options.ow)) ? parseFloat(options.ow).toString() + options.ow.substr(-2) : parseFloat(options.ow).toFixed(2) + options.ow.substr(-2),
            // 设计分类height
            designHeightWithUnit: Number.isInteger(parseFloat(options.oh)) ? parseFloat(options.oh).toString() + options.oh.substr(-2) : parseFloat(options.oh).toFixed(2) + options.oh.substr(-2),
            // 单位
            unit: /px/.test(options.ow) ? 'px' : (/cm/.test(options.ow) ? 'cm' : 'mm'),
            // 设计分类名
            designKindTitle: options.kt,
            // 最大页数
            maxPageNum: options.mp,
            // 出血值
            bleedValue: parseFloat((parseFloat(options.bv * 0.3937008 * 30)).toFixed(8)),
            dspk: options.dspk,
            // fontFamily背景图
            fontbackgroundUrl: options.ffiUrl,
            // fontFamily白色背景图
            fontWriteBackgroundUrl: options.ffiwUrl,
            // 字体列表
            fontList: options.lsff,
            imgHost: options.imgHost,
            isExist: options.isExist,
            // 是否打印
            isPrint: options.isPrint,
            sec: options.sec,
            pageThumbnails: options.thumbnails,
            // 是否分享
            shareState: options.shareState,
            // 分享密码
            sharePwd: options.sharePwd,
            // 分享后是否自动更新内容
            iaus: options.iaus,
            title: options.title,
            ...options
        };


        vuexActions.setDesignInfo[0](designInfo);
    },

    /**
     * 修改design的宽高
     * @param {String} width 
     * @param {String} height 
     */
    setDesignWHWithUnit(width, height) {
        let vuexActions = dataHandle.vuexActions();

        vuexActions.setDesignWHWithUnit[0]({
            width: width,
            height: height
        })
    },

    setDesignShareState(state) {
        let vuexActions = dataHandle.vuexActions();

        vuexActions.setDesignShareState[0]({
            state: state
        })
    },

    /**
     * 取得designInfo
     * @returns {Object} designInfo
     */
    getDesignInfo() {
        let vuexGetters = dataHandle.vuexGetters();
        return vuexGetters.getDesignInfo;
    },
    /**
     * [getFontBackUrl 获取字体背景图片地址]
     * @return {[String]} [imgurl]
     */
    getFontBackUrl() {
        let vuexGetters = dataHandle.vuexGetters();
        return vuexGetters.getDesignInfo.fontWriteBackgroundUrl;
    },
    /**
     * 取得当前可用的font列表
     * @returns 
     */
    getFontList() {
        let vuexGetters = dataHandle.vuexGetters();
        return vuexGetters.getDesignInfo.fontList;
    },

    /**
     * 设置是否出血 
     * @param {any} bleed 
     */
    setIsBleed(isbleed) {
        let vuexActions = dataHandle.vuexActions();
        vuexActions.setIsBleed[0](isbleed || false);
    },

    getIsBleed() {
        let vuexGetters = dataHandle.vuexGetters();
        return vuexGetters.getIsBleed;
    },

    /**
     * 从designInfo取得用于保存的参数
     * @export
     * @param {Object} options designInfo
     * @returns {Object} designData
     */
    getSaveDesignDataFromDesignInfo(options) {
        let saveDesignData = {};

        saveDesignData.d = options.designId;
        saveDesignData.udspk = 1;

        if (options.designWidthWithUnit) saveDesignData.ow = options.designWidthWithUnit;
        if (options.designHeightWithUnit) saveDesignData.oh = options.designHeightWithUnit;
        if (options.templateId) saveDesignData.t = options.templateId;
        if (options.designKindTitle) saveDesignData.kt = options.designKindTitle;
        if (options.sec) saveDesignData.sec = options.sec;
        if (options.designKindId) saveDesignData.k = options.designKindId;
        if (options.maxPageNum) saveDesignData.mp = options.maxPageNum;
        if (options.bleedValue) saveDesignData.bv = options.bleedValue;
        if (options.teamId) saveDesignData.tid = options.teamId;
        if (options.teamTemplateId) saveDesignData.tt = options.teamTemplateId;
        if (options.thirdKindId) saveDesignData.tk = options.thirdKindId;

        return saveDesignData;
    }

}

export default design;