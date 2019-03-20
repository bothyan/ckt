# dataHandle

## 说明

功能页保存、撤销相关api的入口文件

## api

### `dataHandle.init(vue)`

dataHandle初始化,必传vue

### `dataHandle.initDesignInfo(designInfo)`

定义designInfo

#### designInfo格式

|参数名|必选|类型|默认值|说明|
|:----    |:---|:----- |:----- |-----   |
|d			|	是				|	string	|		|	设计id	|
|dt			|	否				|	string	|		|	设计标题	|
|eJson		|	是				|	string	|		|	修改协议字符串	|
|k			|	新建设计时必选		|	int		|		|	所使用的设计分类的id	|
|kt			|	新建设计时必选		|	string	|		|	所使用的设计分类的名称	|
|t			|	新建设计返回数据有t时必选	|	int		|		|	所使用的模板id	|
|ow 			|	新建设计/修改设计尺寸时必选		|	string	|		|	设计原始宽度	|
|oh			|	新建设计/修改设计尺寸时必选		|	string	|		|	设计原始高度	|
|mp			|	新建设计时必选   	|	int		|		|	设计的最大页数	|
|sec		        |	新建设计时必选		|	string	|		|	密钥	|
|tid		        |	团队下新建设计时必选	|	int    	|		|	团队ID	|
|tt			|	团队下新建设计的设计若使用的团队模板时必选	|	int		|		|	所使用的团队模板id(与t参数互斥)	|
|c		       |	       保存协作设计时传该参数   	|	boolean  |		|	是否保存团队版下协作的设计	|
|stamp	       |	       保存协作设计时传该参数		|	string	|		|	协作设计的时间戳	|
|dspk	       |是|	string	|		|	保存设计权限码	|

详见[保存设计V4（saveDesignV4）.md](https://coding.net/u/yunheng/p/chuangkit/attachment/775823/preview/2291748)

### `dataHandle.uploadStatusCallBack(cb)`

绑定上传状态更改时的回调，回调参数`cb(value)`,必须在`dataHanle.initDesignInfo`之后调用

### `dataHandle.isUploadCallBack(cb)`

绑定是否上传的回调，回调参数`cb(value)`,必须在`dataHanle.initDesignInfo`之后调用


### `dataHandle.commit(type, event)`

#### 功能说明

把操作步骤进行处理（去重、归类）然后存到暂存区（staging areas）中等待提交

*所有数据操作都必须调用此方法*

#### 参数

参数|类型|是否可为空|备注
---|:---:|:---:|:---:
type|String|否|可选值：element（素材更改）page（page更改）group（组合更改）
event|Object|否|参数说明见下表

##### event说明

参数|类型|是否可为空|备注
---|:---:|:---:|:---:
pageIndex|String|否|当前操作page的索引
eleIndex|String|是|当前操作元素的索引；如果操作element，该值为json数组中的下标，如果操作group，该值为json对象中的key
key|String|是|当前操作的属性；如果当前操作为元素级（或者page级）的操作(修改这级的json)，key值为改元素级（或者page级）的下标
value|String或Object|是|当前操作的属性值；如果当前为添加操作，需要传入新素材或者新页面的全部json；如果为删除操作，可以为空
eventType|Number|否|操作类型，可选值：0.增加;1.修改;2.移动;3.删除;4.改变元素图层（element专有）


例子：

```javascript
   commit('design',{key:'title',value:'新的标题',eventType:1}) //修改
   commit('element',{pageIndex:0,eleIndex:1,key:null,value:{},eventType:0}) //添加
   commit('element',{pageIndex:0,eleIndex:1,key:'width',value:'100px',eventType:1}) //修改
   commit('element',{pageIndex:0,key:1,value:{},eventType:1}) //修改整个elementJson
   commit('element',{pageIndex:0,eleIndex:1,key:'transform',value:'translate(0,0)',eventType:2}) //移动
   commit('element',{pageIndex:0,eleIndex:1,key:null,value:null,eventType:3}) //删除
   commit('element',{pageIndex:0,eleIndex:1,key:null,value:0,eventType:4}) //改变图层（改变element索引）由1改成0
   commit('page',{pageIndex:0,key:null,value:{},eventType:0,pageId:1}) //添加
   commit('page',{pageIndex:0,key:'width',value:'100px',eventType:1}) //修改
   commit('page',{key:0,value:{},eventType:1,pageId:1}) //修改整个PageJson
   commit('page',{pageIndex:0,key:null,value:1,eventType:2}) //移动 改变page索引）由0改成1
   commit('page',{pageIndex:0,key:null,value:null,eventType:3,pageId:1}) //删除
   commit('group',{pageIndex:0,eleIndex:'element_group_1504171168579',key:null,value:{},eventType:0}) //添加
   commit('group',{pageIndex:0,eleIndex:'element_group_1504171168579',key:'width',value:'100px',eventType:1}) //修改
   commit('group',{pageIndex:0,eleIndex:'element_group_1504171168579',key:'transform',value:'translate(0,0)',eventType:2}) //移动
   commit('group',{pageIndex:0,eleIndex:'element_group_1504171168579',key:null,value:null,eventType:3}) //删除
```

#### 返回值

类型|备注
---|:---:
void|没有返回值

### dataHandle.push()

#### 功能说明

把当前暂存区的内容提交保存，设置撤销步骤

#### 参数

无

#### 返回值

### `dataHandle.vuexGetters()`

#### 功能说明

返回vuex的getters

#### 参数

无

#### 返回值

`Object`

### `dataHandle.getEleJson(pageIndex,elemIndex)`

#### 功能说明

返回element的json，无参时默认焦点元素

#### 参数

参数|备注
---|:---:
pageIndex|页索引
elemIndex|元素索引

#### 返回值

`Object`

### `dataHandle.getPageJson(pageIndex)`

#### 功能说明

返回page的json，无参时默认焦点页

#### 参数

参数|备注
---|:---:
pageIndex|页索引

#### 返回值

`Object`

dataHandle
