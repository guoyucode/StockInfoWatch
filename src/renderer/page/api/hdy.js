//互动易
import axios from "axios"
import qs from "qs"

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
        console.error('error: ', error)
        return error
    }
);

const url = "http://irm.cninfo.com.cn/ircs/index/search";

//查询未读
const unReadUrl = "http://irm.cninfo.com.cn/ircs/index/unread"

/*
  互动易
  data 数据字段解析:
  packageDate: 发布时间
  mainContent: 问题
  attachedContent: 答案

 */
export const interactiveRequest = data => {
    if(!data) data = {}
    data.searchTypes = "1,11,"
    data.pageSize = 10
    data.pageNo = data.pageNo || 0
    return req({url: url, method: 'POST', params: qs.stringify(data)})
}

//查询刷新数据
export const interactiveUnReadRequest = data => {
    data.souceType = "1,11,"
    data.refreshTime = data.refreshTime
    let params = qs.stringify(data);
    return req({url: unReadUrl, method: 'POST', data: params})
}


//const app = require('electron').remote.app

