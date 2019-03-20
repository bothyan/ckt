# svg接口说明

*使用svg暴露的接口需先引入 dataBus/svg.js*

所有接口都有形参pageIndex和eleIndex

参数|必选|类型|默认值|说明
:---:|:---:|:---:|:---:|:---:
pageIndex|否|String或int|focusPageIndex|svg素材所属page的index
eleIndex|否|String或int|focusElementIndex|svg素材的index

## 设置svg颜色

`svg.setSvgColors(pageIndex, eleIndex, colors)`

## 设置svg拉伸数据

`setSvgVary(pageIndex, eleIndex, vary)`

## 设置svg重复拉伸的width

`setSvgRepeatWidth(pageIndex, eleIndex, repeatWidth)`

## 设置svg拉伸类型

`setSvgVaryType(pageIndex, eleIndex, varyType)`