# json数据结构

## 1. design结构

``` javascript
{   
  //标题
  "title":"默认标题",
	 
  // pages内容 (是由多个page构成，page结构见2)
  "pages":[
	  ...   
  ],
    
  // 版本号
  "v":"1.0.2",
    
  // 是否出血
  "bleed":"false"
}
```

## 2. page结构

```javascript
{
  // 画布宽度
  "width":"640.0",

  // 画布高度
  "height":"1008.0",

  // elements内容（由多个element构成，element类型为svgImage，svgFrame，img，background，text，chart）
  "elems":[
    ...
  ],

  // elementGroup
  "elegroups":{

  }
}
```

## 3. svgImage结构

```javascript
{
  // 类型
  "data-type":"svgImage",

  // 素材数据
  "data-elem":{

    // 素材id
    "id":"2193544",

    // data-key
    "data-key":"2016/11/28/5b17fcfc-652d-4afe-aae2-a073ee967d7b",

    // 宽
    "width":274.41016333938296,

    // 高
    "height":236.56076950998187,

    // 透明度
    "opacity":1,

    // 颜色，'color-1'指具体哪个svg颜色块
    "data-colors":{
      "color-1":"#20C4CB"
    },

    // viewBox
    "viewBox":"0 0 218 188.8",

    // svg适应拉伸，'ry'指具体哪个缩放块
    "vary":{
      "ry":"scale(1,1)"
    }
  },

  // 素材格式类型
  "data-img-kind":"image/svg+xml",

  // 位置
  "transform":"translate(221.94351179673325,220.6143375680581)",

  // 翻转
  "reverse":" translate(0,0)rotate(0,0,0)"
}
```

## 4. svgFrame结构

```javascript
{
  // 相同属性同上
  "data-type":"svgFrame",
  "data-elem":{
    "id":"1933",
    "data-key":"2015/01/12/1934",
    "width":274.41016333938296,
    "height":328.0308239564429,
    "opacity":1,

    // svgFrame中图片属性
    "data-xhref-imgs":{

      // 'sorb_1'指具体哪个image容器块
      "sorb_1":{
        "data-class":"sorb_1",
        "data-img-key":"2017/05/06/79604fe4-4ccb-46a4-9840-c232dd7e0dcd",

        // image x
        "x":"-302.8329514294127",

        // image y
        "y":"0",

        // image width
        "width":"1530.0979096947628",

        // image height
        "height":"1108",

        // image 置空
        "transform":"",
        
        // image id 
        "id":"4798102"
      }
    },

    // 滤镜（顺序不能乱）
    "filter":{

      // 亮度
      "brightness":0,

      // 对比度
      "contrast":0,

      // 负片冲印
      "crossProcess":0,

      // 模糊度
      "gaussianBlur":0,

      // 饱和度
      "saturation":0,
      
      // 色调
      "tint":0
    },
    "viewBox":"0 0 924.432 1108",
  },
  "data-img-kind":"image/svg+xml",
  "transform":"translate(190.54355716878405,120.45462794918332)",
  "reverse":" translate(0,0)rotate(0,0,0)"
}
```

## 5. img结构

```javascript
{
  "data-type":"img",
  "data-elem":{
    "filter":{
      "brightness":0,
      "contrast":0,
      "crossProcess":0,
      "gaussianBlur":0,
      "saturation":0,
      "tint":0
    },
    "id":"4798102",
    "data-key":"2017/05/06/79604fe4-4ccb-46a4-9840-c232dd7e0dcd",
    "width":274.41016333938296,
    "height":198.71046098003632,
    "opacity":1
  },
  "data-img-kind":"image/jpeg",
  "transform":"translate(97.24410163339384,279.7840290381126)"
  "reverse":" translate(0,0)rotate(0,0,0)"
}
```

## 6.background结构

```javascript
{
  // background 暂时属于img，但是有种特殊情况-纯色背景
  "data-type":"background",
  "data-elem":{
    "filter":{
      "brightness":0,
      "contrast":0,
      "crossProcess":0,
      "gaussianBlur":0,
      "saturation":0,
      "tint":0
    },
    "data-key":"false",
    "width":640,
    "height":1008,
    "opacity":"1",

    // 如果为纯色背景，data-colors[0]为背景的颜色
    "data-colors":{
      "0":"rgb(255, 255, 255)"
    }
  },
  "transform":"translate(0,0)rotate(0,0,0)",
  "reverse":"translate(0,0)rotate(0,0,0)"
}
```

## 7.text结构

```javascript
{
  "data-type":"text",
  "data-elem":{
    "data-key":"",
    "opacity":1,
    "width":212.2105263157895,
    "height":45.735027223230496,

    // 字号
    "font-size":32.01451905626135,

    // 字体
    "font-family":"Microsoft YaHei",

    // 文字颜色
    "fill":"#000",

    // 字间距（1000为一个字体宽度）
    "wspace":0,

    // 行间距（1000为一个字体高度）
    "vspace":0,

    // 对齐方式
    "data-align":"center",
    
    // 斜体
    "data-italic": "true",
    
    // 下划线
    "data-decoration": "true",
    
    // 加粗
    "data-bold": 0.45, 

    // 生成的每个svg text节点的属性（暂时只给后端用）
    "paragraphs":[
      {
        "transform":"translate(0,0)rotate(0,0,0)",
        "autolines":[
          {
            "transform":"translate(0,0)rotate(0,0,0)",
            "contents":[
              {
                "data-txt":"双",
                "x":42.08026315789475,
                "stroke-width":0,
                "fill":"#000",
                "style":"font-size:32.01451905626135px;font-family: Microsoft YaHei;",
                "stroke":"#000"
              },
              {
                "data-txt":"击",
                "x":74.09276315789475,
                "stroke-width":0,
                "fill":"#000",
                "style":"font-size:32.01451905626135px;font-family: Microsoft YaHei;",
                "stroke":"#000"
              },
              {
                "data-txt":"修",
                "x":106.10526315789475,
                "stroke-width":0,
                "fill":"#000",
                "style":"font-size:32.01451905626135px;font-family: Microsoft YaHei;",
                "stroke":"#000"
              },
              {
                "data-txt":"改",
                "x":138.11776315789476,
                "stroke-width":0,
                "fill":"#000",
                "style":"font-size:32.01451905626135px;font-family: Microsoft YaHei;",
                "stroke":"#000"
              }
            ]
          }
        ]
      }
    ]
  },

  // 文字内容
  "html":"双击修改",
  "transform":"translate(213.89473684210526,481.13248638838473)",

  // 文字版本号（新建的都为最新版本号）
  "v":"1.0.1"
}
```

## 8. svgChart结构

```javascript
{
  // 类型
  "data-type":"svgChart",
  // 素材数据
  "data-elem":{
    "data-key":"",
    "opacity":1,
    "id":"",
    "view-width":500,
    "view-height":500,
    "width":492.48671875,
    "height":534.239990234375,
    "viewBox":"9.421875 24 488.578125 530",
    // 图表数据
    "chart-data":[
      [
        "苹果",
        "60"
      ],
      [
        "香蕉",
        "45"
      ],
      [
        "橘子",
        "20"
      ],
      [
        "草莓",
        "40"
      ],
      [
        "西瓜",
        "35"
      ],
      [
        null,
        null
      ],
      [
        null,
        null
      ],
      [
        null,
        null
      ],
      [
        null,
        null
      ],
      [
        null,
        null
      ]
    ],
    // 图表分类
    "chart-kind":"histogram",
    // 数据的颜色
    "chart-colors":[
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
    // 数据颜色分组的id
    "chart-colors-group":0,
    // 标题
    "chart-title":"默认标题",
    // 标题是否显示
    "chart-titleShow":true,
    // 标题颜色
    "chart-titleColor":"#808284",
    // 标题位置
    "chart-titlePosition":"top",
    // x y 坐标轴是否显示
    "chart-axisShow":true,
    // x y 坐标轴的标题是否显示
    "chart-axisTitleShow":true,
    // x 坐标轴标题
    "chart-xAxisTitle":"X轴标题",
    // y 坐标轴标题
    "chart-yAxisTitle":"Y轴标题",
    // y 坐标轴最小值
    "chart-yAxisNumMin":0,
    // 网格虚线是否显示
    "chart-gridShow":true,
    // 图例是否显示
    "chart-legendShow":true,
    // 用来存储网格虚线的d属性
    "chart-grid-dAttrs":[
      "M35,90L465,90",
      "M35,150L465,150",
      "M35,210L465,210",
      "M35,270L465,270",
      "M35,330L465,330",
      "M35,390L465,390",
      "M35,450L465,450"
    ],
    // 图表标题的x属性
    "chart-title-xAttr":"250",
    // 图表标题的y属性
    "chart-title-yAttr":"41",
    // x轴的d属性
    "chart-xAxis-dAttr":"M35,450L465,450",
    // y轴的d属性
    "chart-yAxis-dAttr":"M35,450L35,90",
    // x轴标题tspan节点的x属性
    "chart-xAxis-xAttr":"490",
    // x轴标题tspan节点的y属性
    "chart-xAxis-yAttr":"418",
    // y轴标题的x属性
    "chart-yAxis-xAttr":"35",
    // y轴标题的y属性
    "chart-yAxis-yAttr":"65",
    // 坐标轴刻度节点的x属性集合，以单个空格分隔
    "chart-axis-scale-xAttrs":"25 25 25 25 25 25 25",
    // 坐标轴刻度节点的y属性集合，以单个空格分隔
    "chart-axis-scale-yAttrs":"450 390 330 270 210 150 90",
    // 坐标轴刻度节点的刻度值属性集合，以单个空格分隔
    "chart-axis-scale-numbers":"0 10 20 30 40 50 60",
    // 图例色块的x属性集合，以单个空格分隔
    "chart-legend-color-xAttrs":"106 166 226 286 346",
    // 图例色块的y属性集合，以单个空格分隔
    "chart-legend-color-yAttrs":"490 490 490 490 490",
    // 图例名称的x属性集合，以单个空格分隔
    "chart-legend-text-xAttrs":"126 186 246 306 366",
    // 图例名称的y属性集合，以单个空格分隔
    "chart-legend-text-yAttrs":"504 504 504 504 504",
    // 图例色块大小
    "chart-legend-color-block":12,

    // 数据的组数
    "chart-data-size":5

    // 柱形图/条形图：
    // rect节点的x属性集合，以单个空格分隔
    "chart-notCone-rect-xAttrs":"86.6 155.39999999999998 224.2 293 361.8",
    // rect节点的y属性集合，以单个空格分隔
    "chart-notCone-rect-yAttrs":"90 180 330 210 240",
    // rect节点的width属性集合，以单个空格分隔
    "chart-notCone-rect-widthAttrs":"51.599999999999994 51.599999999999994 51.599999999999994 51.599999999999994 51.599999999999994",
    // rect节点的height属性集合，以单个空格分隔
    "chart-notCone-rect-heightAttrs":"360 270 120 240 210",

    // -锥形图：
    // polygon节点的points属性的json数组
    "chart-cone-polygon-pointsAttrs": ["112.39999999999999,90 86.6,450 138.2,450","181.2,180 155.39999999999998,450 206.99999999999997,450","250,330 224.2,450 275.79999999999995,450"],

    // -折线图/面积图
    // polygon节点的points属性值
    "chart-area-polygon-pointsAttr": "35,450 35,90 142.5,180 250,330 357.5,210 465,240 465,450",
    // 意义： linearGradient节点的id属性值
    "chart-area-defs-linearGradient-idAttr": "1486381232462"

    // ```公共部分```
    // path节点d属性集合，，以单个空格分隔
    "chart-lineArea-path-dAttrs": "M35,90L142.5,180 M142.5,180L250,330 M250,330L357.5,210 M357.5,210L465,240"

  },
  "transform":"translate(68,252)",
  "reverse":"translate(0,0)rotate(0,0,0)"
}
```

## 9.table结构
```javascript
{
  "data-type": "table",
  "data-elem": {
    "col": 2,   //列数
    "row": 2,   //行数
    "width": 1015, //svg宽
    "height": 315,  //svg高
    "opacity": 1,   
    "line-width": 5,  //表格边线宽度
    "viewBox": "0 0 1015 315",
    "row-heights": [150,150],   //各行高
    "col-widths": [500,500],    //各列宽
    "colors": ["#fff","#fff","#ccc","#ccc"],  //颜色表
    "cells": [[     //单元格具体属性，二维数组
      {
        "font-size": 12,
        "font-family": "Microsoft YaHei",
        "wspace": 0,
        "data-align": "center",
        "html": "单元格",
        "ftc": 0,   //字体颜色对应颜色表索引
        "bgc": 1,    //背景色对应颜色索引
        "lc": 2,     //左边线
        "tc": 3,      //上边线
        "rc": 2,      //右边线
        "bc": 3,      //下边线
        "contents": [{  //每个内容属性
          "data-txt": "单",
          "x": 44,
          "stroke-width": 0,
          "fill": "#000",
          "style": "font-size: 44px;font-family:Microsoft YaHei;",
          "stroke": "#000"
        }]
      }
     ]]
  },
  "transform": "translate(100,100)rotate(0,0,0)"    //表格位置属性
}
```
