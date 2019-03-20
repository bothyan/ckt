<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>创客贴 - 制作 - 设计页</title>
</head>
<body>
  <div id="app"></div>
<script>
  window.material_id_index = 0;
  var getQueryString = function(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);

    if(r!=null)return  decodeURIComponent(r[2]); return null;
  }

  var reptile = getQueryString('reptile') || 0;
  
</script>
<script type='text/javascript'>
  var _vds = _vds || [];
  window._vds = _vds;
  (function(){
    _vds.push(['setAccountId', '8c9191eb6b6b4d07']);
    (function() {
      var vds = document.createElement('script');
      vds.type='text/javascript';
      vds.async = true;
      vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
      var s = document.getElementsByTagName('script')[0];
      if(!reptile)
        s.parentNode.insertBefore(vds, s);
    })();
  })();
</script>
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?5344b558457018b9f67f8372a8214151";
  var s = document.getElementsByTagName("script")[0]; 
  if(!reptile)  
    s.parentNode.insertBefore(hm, s);
})();
</script>
<script>
  //公共部分代码， 以下代码在整个页面只需要安装一次即可
  (function (d, s, id) {
      var n = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      s = d.createElement(s);
      s.id = id;
      s.setAttribute('charset', 'utf-8');
      s.src = '//dmp.sina.com.cn/fyr.js';
      //wap 网站请将上一行dmp.sina.com.cn/fyr.js 更替为dmp.sina.cn/wap_fyr.js
      if(!reptile)
        n.parentNode.insertBefore(s, n);
  })(document, 'script', 'fyr-script');
  _fyr = window._fyr || [];
  _fyr.push(['_setAccount', 'n13123']);
</script>
<script>
  //调用
  _fyr.push(['_visit', '1_1']);
</script>
<script src='//kefu.easemob.com/webim/easemob.js?tenantId=20671&hide=false&sat=false' async='async'></script>
<a href='javascript:;' onclick='easemobim.bind({tenantId: 20671})' class="customerServiceBtn"><span class="customerServiceIconBack"><span class="customerServiceIcon"></span></span><span class="customerServiceText">客服</span></a>
<script>
  window.easemobim = window.easemobim || {};
  easemobim.config = {
      hide: true,     //是否隐藏小的悬浮按钮
      autoConnect: true    //自动连接
  };
  window.console.log = function(){}
</script>
</body>
</html>
<style>
  html,body{
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>
