# input 组件

## props

属性名|属性类型|默认值|说明
---|---|---|---
boxWidth|String, Number|0|@suti
maxlength|String, Number|无|输入内容最大长度
value|String, Number|空|传入的value值
name|String|'usr'|对应不同输入值检测，选择其一：'mail','pw','tel','usr','yzm','teamName'；若只检测空值，可自定义名称，如：'文件夹名称'，错误提示相应的为：“请输入文件夹名称”
paddingLeft|String, Number|0|左内边距
placeholder|String|空|占位符
type|String|'text'|三选一： 'text', 'textarea', 'password'
width|String, Number|350|输入框宽度
autofocus|Boolean|false|页面加载时自动获得焦点

## 邮箱联想提示

### 显示前提

- input 组件 name 为 'usr' 或 'mail'

- 输入了 '@'


### 隐藏方式

- 点击任一项或页面空白处

- 按回车键、Tab 键

- 用户输入的域名与联想项完全匹配

### 使用

- 上、下方向键选择，回车填入选中项并隐藏联想提示
