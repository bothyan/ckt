/**
 * @Author twist
 * @Telphone 17710332616
 * @Date 2017/9/5
 */
import dataHandle from 'common/dataHandle';

let elem = (p,e) => dataHandle.getEleJson(p,e);

/**
* 是否显示标题
* @param Boolean
* */
export function setTitleFlag(Boolean,p,e) {
  elem(p,e)['data-elem']['chart-titleShow'] = Boolean;
}
/**
* 修改标题字体颜色
* @param Str 参数为一个十六进制的颜色
* */
export function setTitleColor(rgb,p,e) {
  elem(p,e)['data-elem']['chart-titleColor'] = rgb;
}
/**
* 修改标题位置
* @param Str 标题位置为:'top'||'bottom'
* */
export function setTitlePosition(Str,p,e) {
  elem(p,e)['data-elem']['chart-titlePosition'] = Str;
}

/**
 * 修改标题名称
 * @param Str 标题名称
 */
export function setTitleName(Str,p,e) {
  elem(p,e)['data-elem']['chart-title'] = Str;
}

/**
 * 修改x轴名称
 * @param Str x轴标题名称
 */
export function setXAxisTitle(Str,p,e) {
  elem(p,e)['data-elem']['chart-xAxisTitle'] = Str;
}

/**
 * 修改y轴名称
 * @param Str y轴标题名称
 */
export function setYAxisTitle(Str,p,e) {
  elem(p,e)['data-elem']['chart-yAxisTitle'] = Str;
}

/**
 * 是否显示轴
 * @param Boolean
 */
export function setAxisFlag(Boolean,p,e) {
  elem(p,e)['data-elem']['chart-axisShow'] = Boolean;
}

/**
 * 是否显示轴标题
 * @param Boolean
 */
export function setAxisTitleShow(Boolean,p,e) {
  elem(p,e)['data-elem']['chart-axisTitleShow'] = Boolean;
}

/**
 * 是否显示网格
 * @param Boolean
 */
export function setGridFlag(Boolean,p,e) {
  elem(p,e)['data-elem']['chart-gridShow'] = Boolean;
}

/**
 * 图表的颜色数组
 * @param list {Array}
 */

export function setChartColorList(list/*Array*/,p,e) {
  elem(p,e)['data-elem']['chart-colors'] = list;
}

/**
 * y轴的最小值
 * @param Number 不可小于0
 * Wraning:暂时砍掉
 */

export function setAxisMin(Number,p,e) {
  elem(p,e)['data-elem']['chart-yAxisNumMin'] = Number;
}

/**
 * y轴的最大值
 * @param Number 必须大于0
 * Wraning:暂时砍掉.
 */

export function setAxisMax(Number,p,e) {
  elem(p,e)['data-elem']['chart-yAxisNumMax'] = Number;
}

/**
 * 修改图表数据
 * @param Array
 */

export function setChartData(Array,p,e) {
  elem(p,e)['data-elem']['chart-data'] = Array;
}

/**
 * 修改图表类型
 * 类型暂时有5种:histogram,cone,bar,line,area
 * @param String
 */

 export function setChartKind(type,p,e){
   elem(p,e)['data-elem']['chart-kind'] = type;
 }

 /**
  * 是否显示图例
  * @param Boolean
  */

  export function setLegendFlag(Boolean,p,e){
    elem(p,e)['data-elem']['chart-legendShow'] = Boolean;
  }
 