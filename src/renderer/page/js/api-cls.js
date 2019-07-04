//import request from 'request'
import axios from "axios"
import qs from "qs"
import {clone} from "./utils";

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
            return response.data.data;
        } else {
            console.error(response);
        }
    },
    error => {  //响应错误处理
        console.log('error: ', error)
        return error
    }
);

const url = "https://www.cls.cn/nodeapi/telegraphs?"
const updateUrl = "https://www.cls.cn/nodeapi/roll/get_update_roll_list?"
const reqData = {
    last_time: "",
    refresh_type: 0,
    rn: 20,
    hasFirstVipArticle:	1,
    app: "CailianpressWeb",
    os: "web",
    sv: "6.8.0",
    token: "",
    sign: "",
}

/*
  财联社网页请求
 */
export const caiLianSheRequest = data => {
    let d = clone(reqData)
    if(data && data.cls_next_time) {
        d.last_time = data.cls_next_time
        d.refresh_type = 1
    }
    let u = url + qs.stringify();
    return req({url: u, method: 'GET'})
}

/*
  财联社网页请求
 */
export const caiLianSheUpdateRequest = data => {
    let d = clone(reqData)
    d.last_time = data.cls_last_time
    let u = updateUrl + qs.stringify(d);
    return req({url: u, method: 'GET'})
}


//const app = require('electron').remote.app

