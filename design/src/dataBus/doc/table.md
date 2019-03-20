
# table

文件目录：databBus/table.js

## 引用
```js
import tableBus from 'dataBus/table.js'
```
## 说明

操作table相关接口

### 1.tableBus.addRow()

描述：给表格添加行。

参数：无

返回值：无

### 2.tableBus.addCol()

描述：给表格添加列。

参数：无

返回值：无

### 3.tableBus.delRow( index )

描述：给表格删除行。

参数：index 行索引

返回值：无

### 4.tableBus.addCol( index )

描述：给表格添加列。

参数：index 列索引

返回值：无

### 5.tableBus.resizeTable( info, elem )

描述：表格变形，包括宽高

参数：[ Object ] info，[ Object ] elem  素材json

info属性列表：

键名|类型|备注
:--|:--|:--
width|Number|视觉宽，即缩放后的宽
height|Number|视觉高，即缩放后的高



