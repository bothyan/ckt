
import dataHandle from 'common/dataHandle.js';
import { getTransformAttr } from 'common/common.js';


const hoverBus = {
  /**
   * 通过素材索引数组返回hover框信息
   * 
   * @param {Array} arr
   * @return {Array} hover信息
   *    [{
   *       left,
   *       top,
   *       width,
   *       height,
   *       rotate,
   *       lock
   *    }]
   */
  getHoverInfoByArr(arr) {
    let elems = dataHandle.getPageJson().elems,
        pageScale = dataHandle.vuexGetters().getPageScale,  
        reto = [];
    arr.forEach(item => {
      let elem = elems[item],
        transform = elem.transform,
        translate = getTransformAttr(transform, 'translate').map(item => parseFloat(item)),
        rotate = getTransformAttr(transform, 'rotate').map(item => parseFloat(item))[0];
      reto.push({
        left: translate[0] * pageScale,
        top: translate[1] * pageScale,
        width: parseFloat(elem['data-elem'].width) * pageScale,
        height: parseFloat(elem['data-elem'].height) * pageScale,
        rotate,
        lock: elem['data-elem'].lock
      })
    })
    return reto;
  },
  setHoverArr(arr) {
    let hArr = this.getHoverInfoByArr(arr);
    dataHandle.$vue.$store.dispatch('setHoverArr', hArr);
  },
  setHoverShow(bv) {
    dataHandle.$vue.$store.dispatch('setHoverShow', bv);
  }
}

export default hoverBus