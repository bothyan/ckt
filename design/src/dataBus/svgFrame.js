import dataHandle from 'common/dataHandle';
import { getTransformAttr, inArray } from 'common/common.js';
import pageBus from 'dataBus/page'



let lastSvgFrameSorbs = null; //储存上次sorb信息
let currentSvgFrameIndex = -1;
const svgFrame = {

// 设置当前操作的svgFrame索引
setCurrentSvgFrameIndex(index){
    currentSvgFrameIndex = index;
    if(index==-1) {
      //解决兼容性问题 Safari误触发
      lastSvgFrameSorbs=null
    }
},
// 获取当前正在被操作的svgFrame索引
getCurrentSvgFrameIndex(){
    return currentSvgFrameIndex;
},
/**
 * svgframe操作的时候hoveIn执行的方法
 * @param {any} sorbIndex 
 * @param {any} elementId 
 * @param {any} event 
 * @returns 
 */
svgFrameImgHoverIn(sorbIndex, elementId,event) {

    let target = event.target;
    let pageIndex = dataHandle.vuexGetters().getFocusPageIndex;
    let ImgElemIndex = dataHandle.vuexGetters().getHoveredElemIndex;
    let elemIndex = pageBus.getElementIndexbyId(elementId);
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);
    let getImgInfo = dataHandle.getEleJson(pageIndex, ImgElemIndex);
    let pageScale = dataHandle.vuexGetters().getPageScale;

    if (getImgInfo['data-type'] != 'img') {
        return;
    }
    let ImgInfo = getImgInfo['data-elem'];
    currentSvgFrameIndex = elemIndex;
    let reg = new RegExp('xlink:href\=\"\#([^\"]*)\"', 'g');
    reg.test(document.getElementById(target.parentElement.getAttribute('clip-path').replace('url(#','').replace(')','')).innerHTML);
    let smallNodeBBox = document.getElementById(RegExp.$1).getBBox();

    //当前拖动元素的图片地址（已经加载完）
    let tempImgUrl = ImgInfo['dataImgUrl'];
    let imgId = ImgInfo['id'],
    imgHeight = ImgInfo.imgHeight,
    imgWidth = ImgInfo.imgWidth ,
    imgX = 0 ,
    imgY = 0;

    if (smallNodeBBox.width/ smallNodeBBox.height  <= ImgInfo.imgWidth / ImgInfo.imgHeight) //原图片宽高比例 大于 图片框宽高比例  
    {  
        imgWidth = smallNodeBBox.height  * (ImgInfo.imgWidth / ImgInfo.imgHeight);  
        imgHeight  = smallNodeBBox.height;   //以框的高度为标准  
        imgY = smallNodeBBox.y;
        imgX = -( imgWidth - smallNodeBBox.width ) / 2 + smallNodeBBox.x;
    }   
    else {   //原图片宽高比例 小于 图片框宽高比例  
        imgWidth = smallNodeBBox.width;   //以框的宽度为标准  
        imgHeight = smallNodeBBox.width * (ImgInfo.imgHeight / ImgInfo.imgWidth);
        imgX = smallNodeBBox.x;
        imgY = -( imgHeight - smallNodeBBox.height ) / 2  + smallNodeBBox.y;
    }  
      
    lastSvgFrameSorbs = JSON.stringify(elem['data-elem']['data-xhref-imgs'])||"{}";
    if (ImgInfo['data-key']==undefined){
        ImgInfo['data-key'] = undefined;
    }
    // getImgInfo
    let fakeData = {};
        fakeData['sorb_'+sorbIndex] = {
        "data-class": "sorb_" + sorbIndex,
        "data-img-key": ImgInfo['data-key'],
        imgUrl:tempImgUrl,
        x: imgX,
        y: imgY,
        width: imgWidth,
        height: imgHeight,
        transform: '',
        id: imgId,
        fromLeft:true
    };
    let imgList = {};
    imgList['sorb_' + sorbIndex] = {
        tempImgUrl : tempImgUrl
    }
    // elem['data-elem']['data-xhref-imgs']['sorb_' + sorbIndex] = fakeData['sorb_' + sorbIndex];
    elem['data-elem']['data-xhref-imgs'] = { ...JSON.parse(lastSvgFrameSorbs), ...fakeData }
    // Object.assign(elem['data-elem']['data-xhref-imgs'],fakeData)  ;
    elem['data-elem']['imgList'] = imgList; 
    // elem['data-elem']['data-xhref-imgs'] = JSON.parse(JSON.stringify(elem['data-elem']['data-xhref-imgs']));

},
/**
 * 
 * 设置移出事件
 * @param {any} sorbIndex 
 * @param {any} elementId 
 */
svgFrameImgHoverOut(sorbIndex, elementId) {
    
    let pageIndex = dataHandle.vuexGetters().getFocusPageIndex;
    
    let elemIndex = pageBus.getElementIndexbyId(elementId);
    let elem = dataHandle.getEleJson(pageIndex, elemIndex);
    // let oldSorb = JSON.parse(JSON.stringify( elem['data-elem']['data-xhref-imgs']['sorb_'+sorbIndex]))
    // elem['data-elem']['data-xhref-imgs']['sorb_'+sorbIndex] = {};
    if (lastSvgFrameSorbs !== null) {

        elem['data-elem']['data-xhref-imgs'] = JSON.parse(lastSvgFrameSorbs);
        elem['data-elem']['imgList'] = null; 
        lastSvgFrameSorbs = null;
    }
    
    currentSvgFrameIndex = -1;
},
/**
 * 获取拖入的缩略图
 */
getTempImgUrl(sorbIndex, pageIndex, eleindex){
    let elem = dataHandle.getEleJson(pageIndex, eleindex);
    if (elem ==undefined) return false;
    let imgList = elem['data-elem']['imgList'];
    if(imgList == undefined) return false;
    if (imgList[sorbIndex]==undefined) return false;
    return imgList[sorbIndex].tempImgUrl;
},
/**
 * 移除TempImgUrl的值
 * @param {*} sorbIndex 
 */
removeTempImgUrl(sorbIndex, pageIndex,eleindex){

    let elem = dataHandle.getEleJson(pageIndex, eleindex);
    if(!elem) return;
    let imgList =elem['data-elem']['imgList']   ;
    if(!imgList) return;
    delete imgList[sorbIndex];

},
/**
 * //设置viewBox
 * @param {String} val 设置的值 ['0 0 0 0']
 * @param {int} pageIndex 当前索引
 * @param {int} eleIndex 当前操作元素索引
 */
setViewBox(val,pageId,eleIndex){
    let elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    if(elem!=undefined){
      elem['data-elem'].viewBox = val;   
      dataHandle.commit('element',{
          pageId,
        eleIndex,
        key: 'viewBox',
        value: val,
        eventType: 1
      }).push(true);
    }
      
},
/**
 * 设置颜色
 * @param {obejct} val 
 * @param {any} pageIndex 
 * @param {any} eleIndex 
 */
setColors(val,pageId,eleIndex){
    let elem;
    if (typeof (pageId) != 'string') {
        elem = dataHandle.getEleJson(pageId, eleIndex);
    } else {
        elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    }
    if(elem!=undefined)
       elem['data-elem']['data-colors'] = val;
},
/**
 * 设置编辑框的背景图片信息
 * 
 */
setEditBoxBackgroundImg(img,sorb_id,pageIndex, eleIndex){
    // let elem = dataHandle.getEleJson(pageIndex, eleIndex);
    // if(elem!=undefined){
    //     let sorb = elem['data-elem']['data-xhref-imgs'][sorb_id];
    //     if(sorb !=undefined){
    //         // sorb['EditorImg'] = img;
    //     }
    // }   
},
/**
 * s设置sorb属性
 * 
 * @param {any} key 
 * @param {any} val 
 * @param {any} pageIndex 
 * @param {any} elemIndex 
 */
setSorb(val,pageId,eleIndex){
    let elem;
    if (typeof (pageId) != 'string') {
        elem = dataHandle.getEleJson(pageId, eleIndex);
    } else {
        elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
    }
    if(!elem) return;
    if(!elem['data-elem']['data-xhref-imgs']){
        elem['data-elem']['data-xhref-imgs'] ={};
     }

     //设置整个对象
    elem['data-elem']['data-xhref-imgs'] = val;

 
},
  /**
   * 设置内部图片的彼位置大小
   * @param {* 更改的值 } val 
   * 示例：
   * {     
   *   "x":"-56.2098109130485",
   *   "y":"0.09303927421569824",
   *   "width":"501.7886128434386",
   *   "height":"334.5257568359375",
   *}
   * @param {* 当前元素所在页面索引 默认焦点元素} pageIndex 
   * @param {* 当前元素所在页面索引 默认焦点元素} pageIndex 
   * @param {* 当前元素所在索引 默认焦点元素} elemIndex 
   */
  setSvgFrameImgInfo(val,childIndex ,pageIndex, eleIndex) {
    let json = dataHandle.getEleJson(pageIndex, eleIndex);
    // console.log(val);
    if (json != undefined) {
      let imgs =json['data-elem']['data-xhref-imgs'];
      if(imgs!=undefined){
        imgs['sorb_'+childIndex] = Object.assign(imgs['sorb_'+childIndex],val);
      }
    }
  },
/**
 * 获取当前焦点元素的裁剪框信息
 * @param {number } pageIndex 
 * @param {number } eleIndex 
 * @param {number >=1} childIndex 
 * @returns object 
 */
  getSvgFrameCutInfo(pageIndex, eleIndex, childIndex , targetNode){
    let json = dataHandle.getEleJson(pageIndex, eleIndex),
        pageScale = dataHandle.vuexGetters().getPageScale,
        data = json['data-elem'],
        viewBox = json['data-elem']['viewBox'].split(" "),
        reverseType = json.reverseType || [0, 0];
    
    if(childIndex==undefined||data==undefined)
        return false;

    let ret={
        x:0,
        y:0,
        width:0,
        height:0,
        left:0,
        top:0,
        imgWidth:0,
        imgHeight:0,
        imgUrl:'',
        scale: 1,
        pageIndex,
        eleIndex,
        childIndex
      } 
    data = json['data-elem'];
      
    if(data['data-xhref-imgs']["sorb_"+childIndex]) {

      let sorb = data['data-xhref-imgs']["sorb_"+childIndex]; 
      let rate = data['width'] / parseFloat(viewBox[2]);
      let translate = getTransformAttr(json.transform, 'translate').map( item => parseFloat(item));
      let rotate = parseFloat(getTransformAttr(json.transform, 'rotate')[0]);
      let width = parseFloat(data.width),
          height = parseFloat(data.height);
  
      let TheNode = targetNode;

      let reg = new RegExp('xlink:href\=\"\#([^\"]*)\"', 'g');
      reg.test(document.getElementById(TheNode.parentElement.getAttribute('clip-path').replace('url(#','').replace(')','')).innerHTML);
      let smallNodeBBox = document.getElementById(RegExp.$1).getBBox();
     
      let BBox  =  TheNode.getBBox();  //图片box

      let imgRate = smallNodeBBox.width / BBox.width,
          imgHeight = sorb['height'] * rate,
          imgWidth = sorb['width'] * rate;
      
      ret.zhiyuanx = smallNodeBBox.x * rate * pageScale;
      ret.zhiyuany = smallNodeBBox.y * rate * pageScale;

      let disX = (BBox.x + BBox.width / 2) * rate - width / 2,   //图片相对于svgFrame中心横向距离
          disY = (BBox.y + BBox.height / 2) * rate - height / 2; //图片相对于svgFrame中心纵向距离 

      if(reverseType[0]) {
        disX = -disX;    //横向翻转
      }
      if(reverseType[1]) {
        disY = -disY;    //纵向翻转 
      }

      let result = _getPositon(disX, disY, rotate);   //旋转之后

      disX = result.x;
      disY = result.y;


      ret.left = (translate[0] + disX + (width - imgWidth) / 2) * pageScale;
      ret.top = (translate[1] + disY + (height - imgHeight) / 2) * pageScale;


      ret.x = (smallNodeBBox.x - BBox.x) * rate * pageScale; //裁剪框相对于editer框的X
      ret.y = (smallNodeBBox.y - BBox.y) * rate * pageScale; //裁剪框相对于editer框的Y

      ret.width = parseFloat(smallNodeBBox.width) * pageScale * rate; //裁剪框的宽度
      ret.height = parseFloat(smallNodeBBox.height) * pageScale * rate;

      ret.imgWidth = imgWidth  * pageScale; //裁剪editer的宽度
      ret.imgHeight = imgHeight * pageScale;

      ret.scale = rate;
      ret.imgUrl = TheNode.getAttribute('xlink:href');
      ret.reverseType = reverseType;
    }

    return ret;
  },

  /**
   * 通过点击裁剪或双击editor直接设置裁剪信息
   * 
   */
  setFrameCutInfo() {
    let vuexGetters = dataHandle.vuexGetters(),
        vStore = dataHandle.$vue.$store,
        eleJson = dataHandle.getEleJson(),
        pageIndex = vuexGetters.getFocusPageIndex,
        eleIndex = vuexGetters.getFocusElemIndex,
        focusNode = document.getElementById(eleJson.eleid);

    let imgs = eleJson['data-elem']['data-xhref-imgs'],
        keys = Object.keys(imgs),
        childIndex,
        targetNode;

    for(let i=0,l=keys.length; i < l; i++) {
      let check = imgs[keys[i]];
      if(check.id || (check['data-img-kind'] && check['data-img-kind'] != 'false')) {
        childIndex = keys[i].split('_')[1];
        targetNode = focusNode.querySelector('.'+keys[i]);
        break;
      }
    }
    if(!targetNode) {
      return;
    }
    vStore.dispatch('setFrameClipInfo', this.getSvgFrameCutInfo(pageIndex, eleIndex, childIndex, targetNode));
    vStore.dispatch('setFrameClip', true);
  },
  
  /**
   * 获取svgFrame滤镜图片
   * 
   * @returns  滤镜图片地址
   */
  getSvgFrameFilterImg() {
    let vuexGetters = dataHandle.vuexGetters(),
        eleJson = dataHandle.getEleJson();

    let imgs = eleJson['data-elem']['data-xhref-imgs'],
        keys = Object.keys(imgs);
        
    for(let i=0,l=keys.length; i < l; i++) {
        let check = imgs[keys[i]];
       
        if (check.id || (check['data-key'] && check['data-key'] != 'false') || (check['data-img-key'] && check['data-img-key'] != 'false')) {
            
            return check.imgUrl;
        }
    }
  },
  /**
   * 设置变形
   * @param {any} pageIndex 
   * @param {any} eleIndex 
   */
  setVary(val,pageIndex, eleIndex,){
    let elem = dataHandle.getEleJson(pageIndex, eleIndex);
    elem['data-elem'].vary = val;
  },
    /**
   * 设置svg变形的类型默认为等比
   * @param pageIndex
   * @param eleIndex
   * @param varyType  变化的种类
   */
  setVaryType(pageId, eleIndex, varyType = 'db') {
      let elem;
      if (typeof (pageId) != 'string') {
          elem = dataHandle.getEleJson(pageId, eleIndex);
      } else {
          elem = dataHandle.getEleJsonByPageId(pageId, eleIndex);
      }
    elem['varyType'] = varyType;
  },

};


function _getPositon(disX, disY, rotate) {
  let r = Math.sqrt(disX*disX + disY*disY, 2),
      angle;

  if(disY === 0) {
    if(disX < 0) {
      angle = 180;
    }
    else {
      angle = 0;
    }
  }
  else {
    angle = Math.atan( disX / disY) * 180 / Math.PI;
    //算出现在素材中心相对于组合旋转中心的角度
    if(disY > 0) {
      angle = 90 - angle;
    } else {
      angle = 270 - angle;
    }
  }
  angle = (angle + rotate) % 360;

  return {
    x: r * Math.cos(angle / 180 * Math.PI),
    y: r * Math.sin(angle / 180 * Math.PI)
  }

}

export default svgFrame;