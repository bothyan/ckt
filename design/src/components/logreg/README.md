### 组件关系

logreg > signComp > signIn & signUp & retrieve

logreg 为页面

signComp 供其他页面调用

### Vuex 状态管理

方法：`setLogregShow`

变量|值|说明
---|---|---
show|false|不显示登录组件
show |1|显示登录
show |2|显示注册
show |3|显示找回密码
