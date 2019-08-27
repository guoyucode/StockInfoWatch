import axios from "axios"
//import http from "axios/lib/adapters/http"//这是nodejs接口
import http from "./http"//这是nodejs接口
import xhr from "axios/lib/adapters/xhr" //浏览器对象
// 打印出xhr对象, 什么情况? 怀疑是webpack打包的问题?

//设置默认请求头
axios.defaults.headers['Accept'] = '*/*';
axios.defaults.headers["Referer"] = "*";
axios.defaults.headers["Sec-Fetch-Mode"] = "";

// axios使用node.js-API
/**
 * 创建axios实例
 **/
export const req = axios.create({
    adapter: http, //axios使用node.js-API
    timeout: 10 * 1000  // 请求超时时间
});

/**
 * 请求拦截器
 */
req.interceptors.request.use(config => {
    
    //config.headers['Referer'] = 'https://www.cls.cn/'
    //config.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0'
    return config;
}, error => {  //请求错误处理
    Promise.reject(error)
})

/**
 * respone拦截器==>对响应做处理
 */
req.interceptors.response.use(
    response => {
        //这里根据后端提供的数据进行对应的处理
        if (response.status && response.status === 200) {
            return response.data;
        } else {
            console.error(response);
            return response
        }
    },
    error => {  //响应错误处理
        console.error('error: ', error)
        return Promise.reject(error)
    }
);
