# 所有图表引用

### 例子
```
<template>
  <barChart :json="json"></barChart>
</template>
<script>
import barChart from './chart/bar.vue';

export default {
  components: {
    barChart
  }
}
</script>
```
### 使用说明

**使用时引入文件,并且放入components里.**

**在template中引用,传入json数据.**

**具体的数据格式请参考chartDate.md文件**

### 输入

**` 输入:json数据.`**

### 输出

**`根据引入图表类型不同,返回不同类型的图表.`**

