### 确认取消对话框

#### 概述

显示一个带有标题和提示内容，并有确认、取消按钮的对话框

#### 使用说明

*注：该组件须配合Vux使用，ssfe专用*

##### 显示对话框

```
import { mapGetters, mapActions } from 'vuex'
...
methods: {
  ...mapActions({
    setDialogShow: 'setDialogShow'
  })
}
...
// 回调函数
let _this = this;
function confirm() {
  console.log(_this.userInfo);
}
function cancel() {
  console.log('取消处理');
}
// 设置显示内容
this.setDialogShow({
  title: 'XXX', // 可选，默认为"提示"
  content:'回调测试',
  btnTexts: ['自定义取消按钮的文字', '自定义确认按钮的文字'],
  funcs: {
    // 回调函数（可选）
    // 若存在则名称必须为以下二者之一
    confirm,
    cancel
  }
});
```