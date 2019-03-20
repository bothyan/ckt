# chart图表数据结构
```
{
  "data-key": "",
  "opacity": 1,
  "id": "",
  "view-width": 500,
  "view-height": 500,
  "width": 500,
  "height": 500,
  "chart-data": [
    {
      "name": "苹果",
      "value": 40
    },
    {
      "name": "香蕉",
      "value": 30
    },
    {
      "name": "橘子",
      "value": 20
    },
    {
      "name": "元岗",
      "value": 40
    },
    {
      "name": "志远",
      "value": 70
    }
  ],
  "chart-kind": "histogram",
  "chart-colors": [
    "#158C99",
    "#1BAFA1",
    "#E9A72C",
    "#4E545B",
    "#717B87",
    "#1B88BA",
    "#639080",
    "#92C4D9",
    "#3E5B79",
    "#A7B4C4"
  ],
  "chart-title": "默认标题",
  "chart-titleShow": true,
  "chart-titleColor": "#808284",
  "chart-titlePosition": "top",
  "chart-axisShow": true,
  "chart-axisTitleShow": true,
  "chart-xAxisTitle": "X轴标题",
  "chart-yAxisTitle": "Y轴标题",
  "chart-gridShow": true,
  "chart-legendShow": true
}
```

### 属性说明:

width(type:Number):图表外层svg的实际宽度;

height(type:Number):图表外层svg的实际高度;

view-width(type:Number):vieBox视图宽度;

view-height(type:Number):vieBox视图高度;

chart_data(type:Object):图表数据;

chart-kind(type:String):图表类型;

图表类型有:histogram(锥形图),cone(条形图),line(折线图),area(面积图),bar(柱状图)

chart-colors(type:Array):图表颜色数组;

chart-titleShow(type:Boolean):图表标题是否显示;

chart-title(type:String):图表的默认标题;

chart-titleColor(type:String):图表标题的字体颜色;

chart-titlePosition(type:String):图表标题的位置;

chart-axisShow(type:Boolean):图表轴是否显示;

chart-axisTitleShow(type:Boolean):图表轴名称是否显示;

chart-xAxisTitle(type:String):图表的X轴名称;

chart-yAxisTitle(type:String):图表的Y轴名称;

chart-gridShow(type:Boolean):图表网格是否显示;

chart-legendShow(type:Boolean):图表图例是否显示.





