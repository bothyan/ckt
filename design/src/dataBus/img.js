import { inArray, getTransformAttr ,setTransformAttr} from "../common/common";
import dataHandle from 'common/dataHandle';
/**
 * 暴露一些常用的方法
 * img的对外api
 */

 const img = {

    /**
     * 设置图片的滤镜 （只是滤镜不是阴影哦)
     * @param {*要修改的值 对象} val 
     * @param {*当前元素所在页面所引默认当前焦点元素 整数型} pageIndex 
     * @param {*当前元素索引默认焦点元素 整数型} ElemIndex 
     */
    setFilter(val, pageIndex,eleIndex){

        let json =dataHandle.getEleJson(pageIndex,eleIndex);
        if(json!=undefined){
            json['data-elem'].filter = val;
        }
    },
    /**
     * 获取图片的滤镜
     * @param {any 元素的所在页面} pageIndex 
     * @param {any 元素的索引} eleIndex 
     */
    getFilter(pageIndex,eleIndex){
        let json =dataHandle.getEleJson(pageIndex,eleIndex);
        if(json!=undefined){
            return json['data-elem'].filter;
        } 
    },
    /**
     * 返回裁切信息 第一次没有裁剪也会计算后返回
     * 
     * @param {any} pageIndex 
     * @param {any} ElemIndex 
     */
    getCutInfo(pageIndex,ElemIndex){
        let json =dataHandle.getEleJson();
        let viewBox =json['data-elem']['viewBox'].split(" ");
        let isCut = json['data-elem']['isCut'];
        let url ='';
        let pageScale = dataHandle.vuexGetters().getPageScale;
        if(json!=undefined){
            url = json['data-elem']['dataImgUrl'];
        }
        let ret = {

        } ;
        ret.imageUrl = url ;//当前图片地址
  
        if(!isCut){
            ret.width = json['data-elem'].width / 2;
            ret.height = json['data-elem'].height / 2;
            ret.x = ret.width / 2;
            ret.y = ret.height / 2;
        }else{

            let data = json['data-elem'];
            let rate = data['width'] / parseFloat(viewBox[2]);
            ret.x = parseFloat(viewBox[0]) * rate;
            ret.y = parseFloat(viewBox[1]) * rate;

            ret.width = parseFloat(viewBox[2]) * rate;
            ret.height = parseFloat(viewBox[3]) * rate;
        }
        let data = json['data-elem'];

        ret.x = ret.x * pageScale;
        ret.y = ret.y * pageScale;
        ret.width = ret.width * pageScale;
        ret.height = ret.height * pageScale;
        ret.isCut = isCut || false;
        ret.reverseType = json.reverseType || [0,0];
        ret.resetInfo = {
            width: data.width,
            height: data.height,
            viewBox: data.viewBox,
            transform: json.transform,
            isCut: ret.isCut
        }

        return ret ;
        
    },
    /**
     * 返回指定图片地址
     * @param {any 需要操作的页面所引} pageIndex 
     * @param {any 需要操作的元素索引} ElemIndex 
     */
    getImgUrl(pageIndex,ElemIndex){
        let json =dataHandle.getEleJson(pageIndex,ElemIndex);
        let url ='';
        if(json!=undefined){
            url =  json['data-elem']['dataImgUrl']||'';
        }
        return url;
    },
    /**
     * 设置图片的地址
     * @param {*需要设置的图片的真实地址} url 
     */
    setImgUrl(url='',pageIndex, eleIndex){

        let json =dataHandle.getEleJson(pageIndex, eleIndex);
       
        if(json!=undefined){
           json['data-elem']['dataImgUrl'] = url;
        }
    },
    /**
     * @param {*裁剪后的位置X} x 
     * @param {*裁剪后的位置y} y 
     * @param {*裁剪后的宽度} width 
     * @param {*裁剪后的高度} height 
     * @param {*需要操作的页面索引 默认焦点元素} pageIndex 
     * @param {*需要操作的元素索引 默认焦点元素} ElemIndex 
     */
    setCutSize(obj, pageIndex, eleIndex){

        let json = dataHandle.getEleJson(pageIndex, eleIndex),
            pageScale = dataHandle.vuexGetters().getPageScale,
            data = json['data-elem'];

        if(json!=undefined){
            if(json['data-elem'].viewBox){
                data.viewBox = `${obj.xScale * data.imgWidth} ${obj.yScale * data.imgHeight} ${obj.widthScale * data.imgWidth} ${obj.heightScale * data.imgHeight}`;
                data.isCut = true ;
                data.width = obj.width / pageScale;
                data.height = obj.height / pageScale;
            }

        }

    },
    resetCutPos(obj) {
        let json = dataHandle.getEleJson( obj.pageIndex, obj.elemIndex );
        json['data-elem'].viewBox = obj.viewBox;
        json['data-elem'].width = obj.width;
        json['data-elem'].height = obj.height;
        json.transform = obj.transform;
        json['data-elem'].isCut = obj.isCut;
    },
    /**
     * 有问题待优化
     * 
     * @param {any} width 
     * @param {any} height 
     */
    initImageViewBox(width, height, pageIndex, eleIndex) {
        let json = dataHandle.getEleJson(pageIndex, eleIndex);
        json['data-elem'].viewBox = `0 0 ${width} ${height}`;
        json['data-elem'].imgWidth = width;
        json['data-elem'].imgHeight = height;
    }

 }
 export default img;