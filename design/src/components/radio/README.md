### Radio 单选框

#### 概述

基本组件-单选框。主要用于一组可选项单项选择，或者单独用于切换到选中状态。

#### 代码示例

```
// 单独使用
// 使用 v-model 可以双向绑定数据。
<template>
    <Radio v-model="single">Radio</Radio>
</template>
<script>
    export default {
        data () {
            return {
                single: false
            }
        }
    }
</script>
```

```
// 组合使用
// 使用RadioGroup实现一组互斥的选项组。在组合使用时，Radio 使用 label 来自动判断。
// 每个 Radio 的内容可以自定义，如不填写则默认使用 label 的值。
<template>
    <RadioGroup v-model="animal">
        <Radio label="猫"></Radio>
        <Radio label="狗"></Radio>
        <Radio label="猪"></Radio>
    </RadioGroup>
</template>
<script>
    export default {
        data () {
            return {
                animal: '猫'
            }
        }
    }
</script>
```

#### API

##### Radio props

属性|说明|类型|默认值
---|---|---|---
value|只在单独使用时有效。可以使用`v-model`双向绑定数据|Boolean|false
label|只在组合使用时有效。指定当前选项的 value 值，组合会自动判断当前选择的项目|String \| Number|-
disabled|是否禁用当前项|Boolean|false
true-value|选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用|String, Number, Boolean|true
false-value|没有选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用|String, Number, Boolean|false

##### Radio events
事件名|说明|返回值
---|---|---
on-change|在选项状态发生改变时触发，返回当前状态。通过修改外部的数据改变时不会触发|...

##### RadioGroup props

属性|说明|类型|默认值
value|指定当前选中的项目数据。可以使用`v-model`双向绑定数据|String \| Number|-

##### RadioGroup events

事件名|说明|返回值
---|---|---
on-change|在选项状态发生改变时触发，返回当前选中的项。通过修改外部的数据改变时不会触发|...

**参考自[iView](https://www.iviewui.com/components/radio)**