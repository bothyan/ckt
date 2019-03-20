### Switch 开关

#### 概述

在两种状态间切换时用到的开关选择器。

#### API

##### Switch props

属性|说明|类型|默认值
---|---|---|---
value|指定当前是否选中，可以使用 v-model 双向绑定数据|Boolean|false
disabled|禁用开关|Boolean|false
true-value|选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用|String, Number, Boolean|true
false-value|没有选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用|String, Number, Boolean|false

##### Switch events

事件名|说明|返回值
---|---|---
on-change|开关变化时触发，返回当前的状态|	true \| false