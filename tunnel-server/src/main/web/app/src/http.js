import axios from 'axios';
import {message} from 'antd';


let http = axios.create({
   // baseURL: '/',
  baseURL: '//localhost:8080',
   //  baseURL: '//optimus-pts2.prepub.souche-inc.com',
   //  baseURL: '//optimus-pts.prepub.souche-inc.com',
    withCredentials : true
});

http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.withCredentials = true;
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    return  response.data;

}, function (error) {
    if (error.response && error.response.data && error.response.data.message){
        message.error(error.response.data.message)
    }else {
        message.error("服务端内部异常！")
    }
    // 对响应错误做点什么
    return Promise.reject(error);
});






export default http;
