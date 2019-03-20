
# editor

文件目录：databBus/editor.js

## 引用
```js
import editorBus from 'dataBus/editor.js'
```
## 说明

操作editor相关接口

### 1.editorBus.setEditorState()

描述：通过当前画布及当前焦点素材设置editor属性，包括宽高、位置。

参数：无

返回值：无

### 2.editor.getEditorClickTarget( option )

描述：获取操作框点击时穿透element索引

参数: [Object] option

option属性值：

键名|类型|备注
:---|:---|:---
left|Number|操作框离画布左边距离
top|Number|操作框离画布上边距离

>注：上述数值均为视觉数值，即画布进行缩放后的数值。

### 3.editorBus.setEditorStateBySelect()

描述：通过框选素材设置editor属性，包括宽高、位置。

参数：无

返回值：无