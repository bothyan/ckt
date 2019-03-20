import Vue from 'vue'
import Axios from 'axios'
import global_config from './global_config'

Vue.prototype.$http = Axios

// 拦截器配置
Axios.interceptors.request.use(function(request) {

  // 本地mock测试
  if(global_config.env === 'development') {
    request.method = 'GET';
    //让加载svg不受代理限制
    if(!request.url.match('/imgpub\.chuangkit\.com/')){
      // 把post的form data转换成get参数
      let rquestion = /\?/,
        url = request.url,
        j = 0,
        request_body = '';

      for(let i in request.data) {
        j === 0 ? request_body = rquestion.test(url) ? '&' : '?' : request_body;
        j !== 0 ? request_body+='&' : '';
        request_body += i + '=' + encodeURIComponent(request.data[i]);
        j++;
      }

      request.url = '/mock' + url + request_body;
    }

  } else {
    // 服务器环境

    // 正常请求不用先发OPTIONS
    if(request.method == 'post' || request.method == 'POST')
      request.headers={
        'Content-Type': 'application/x-www-form-urlencoded'
      }

	  request.transformRequest=[function (data) {
    	if(data instanceof FormData) return data
		  let ret = '';
		  for (let it in data) {
			  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
		  }
      ret = ret.substring(0, ret.length - 1);
		  return ret
	  }]

    let url = request.url;
    if(/^\/\//.test(url)) {
      request.url=url
    }else {
      let api = window.api ? '&api=1' : ''
      let apiToken = window.apiToken ? '&api_token=' + window.apiToken : ''
	    request.url = global_config.APIDOMAIN + url + '.do?_dataType=json' + api + apiToken
      request.withCredentials = true;
    }

  }

  return request;
}, function(error) {
  return Promise.reject(error);
});

Axios.interceptors.response.use(function(response) {

  // 本地mock测试
  if(global_config.env === 'development') {
    response.body = response.data[0];
  } else {
    response.body = response.data.body;
  }

  return response;
}, function(error) {
  return Promise.reject(error);
});