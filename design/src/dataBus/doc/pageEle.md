# pageEle接口说明

*使用pageEle暴露的接口需先引入 dataBus/pageEle.js*

所有接口都有形参pageIndex和eleIndex

参数|必选|类型|默认值|说明
:---:|:---:|:---:|:---:|:---:
pageIndex|否|String或int|focusPageIndex|素材所属page的index
eleIndex|否|String或int|focusElementIndex|素材的index

## 画布新增素材

`addElement(eleJson, pageIndex, eleIndex)`

## 画布删除素材

`delElement(pageIndex, eleIndex)`

## 画布复制素材

`copyElement(pageIndex, eleIndex)`

## 改变素材图层

`setElementIndex(type, pageIndex, eleIndex)`