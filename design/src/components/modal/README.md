### modal 弹框

#### Props

属性|说明|类型|默认值
---|---|---|---
type|类型|String|'modal1'
modalShow|显示与否|Boolean|false
position|上间距|Object|{'top': 0}
closeShow|关闭按钮显示与否|Boolean|true
disable|禁止关闭|Boolean|false

##### type 类型

类型|说明
---|---
modal1|完全自定义对话框
modal3|右侧拉显示对话框
modal4|自定义tag提示(无遮罩)
modal5|底部弹窗
modal6|自定义tag提示

#### 其他

若要自定义modal1尺寸，应该修改`<modal></modal>`里的标签样式，比如：
![moda1用法](https://ws2.sinaimg.cn/large/006tKfTcly1fh84i4an7uj30es02vzkj.jpg)