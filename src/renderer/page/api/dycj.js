//第一财经接口
import axios from "axios"
import qs from "qs"
import {clone} from "../common-js/utils";

/****** 创建axios实例 ******/
const req = axios.create({
    //baseURL: process.env.BASE_URL,  // api的base_url
    timeout: 50 * 1000  // 请求超时时间
});

/*请求拦截器*/
req.interceptors.request.use(config => {
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
}, error => {  //请求错误处理
    Promise.reject(error)
})


/****** respone拦截器==>对响应做处理 ******/
req.interceptors.response.use(
    response => {
        //这里根据后端提供的数据进行对应的处理
        if (response.status === 200) {
            return response.data;
        } else {
            console.error(response);
        }
    },
    error => {  //响应错误处理
        console.log('error: ', error)
        return error
    }
);

const url = "https://www.yicai.com/api/ajax/getbrieflist?"
const reqData = {
    page: 1,
    pagesize: 20,
    type: 0,
}

/*
  第一财经网页请求
 */
export const dycjRequest = data => {
    let d = clone(reqData)
    if(data && data.page) {
        d.page = data.page
    }
    let u = url + qs.stringify(d)
    return req({url: u, method: 'GET'})
}
