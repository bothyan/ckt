# 瀑布流组件

## props
属性名|必需|说明
---|---|---
eleData|是|要显示的数据
boxRect|是|容器矩形
listSum|是|要显示的列数

## 使用示例

```javascript
import waterfall from 'waterfall.vue'
const app = new Vue({
  el: '#app',
  data() {
    return {
      // 容器矩形
      boxRect: {
        // 图片的宽度
        width: 224,
        top: 8,
        right: 8,
        left: 8,
        bottom: 65,
        // 每个模板之间的间距
        marginLeft: 8,
        marginTop: 8
      },
      // 数据
      eleData: [],
      // 列数
      listSum: 0
    }
  },
  template: `
      <waterfall 
        :boxRect="boxRect"
        :eleData="eleData"
        :listSum="listSum"
      >
        <template scope="waterfall">
          <div :style="waterfall.listData.boxStyle" class="test">
            <img :style="waterfall.listData.imgStyle">
          </div>
        </template>
      </waterfall>
  `,
  beforeMount () {
    this.$http.get('/mock/designtemplate/getAllTemplates').then(response => {
      // 此条数据应该在进入页面就更改（判断放几列合适）
      this.eleData = response.body.templates.queryDesignTemplateBeanList;
    }, response => {
      console.log('error');
    });
    this.listSum = 7; // 设定要显示的列数
  },
  components: {waterfall}
});

```