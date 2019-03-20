# SVG素材所有拉伸情况说明

- 'hx' : 只能横向拉伸
- 'hx_def' : 横向复制
- 'zx' : 只能纵向拉伸
- 'zx_def' : 纵向复制
- 'hs' : 可横向纵向拉伸
- 'ry' : 可横向纵向拉伸（scale缩放）
- 'db' : 只可等比

## svg拉伸改变方式

### 'hx'横向拉伸

- 改变#n的scale跟translate
- 改变#ne的translate

### 'hx_def'横向复制

- 改变rect[class=repeat]的width

### ‘zx’纵向拉伸

- 改变#w的scale跟translate
- 改变#sw的translate

### 'zx_def'纵向复制

- 改变rect[class=repeat]的height

### 'hs'横向纵向拉伸

#### 横向时

- 改变#n，#c和#s的scale跟translate
- 改变#ne，#e和#se的translate

#### 纵向时

- 改变#w，#c和#e的scale跟translate
- 改变#sw，#s和#se的translate

### ‘ry’

- 改变#ry的scale
