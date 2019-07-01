//import request from 'request'
import axios from "axios"

/****** 创建axios实例 ******/
const req = axios.create({
  //baseURL: process.env.BASE_URL,  // api的base_url
  timeout: 5000  // 请求超时时间
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
      console.log("response:", response)
      //这里根据后端提供的数据进行对应的处理
      if (response.data.result === 'TRUE') {
        return response.data;
      } else {
        console.error(response.data.data.msg);
      }
    },
    error => {  //响应错误处理
      console.error('error: ', error);
      let text = JSON.parse(JSON.stringify(error)).response.status === 404 ? '404' : '网络异常，请重试';
      return Promise.reject(error)
    }
);

const url = "https://www.cls.cn/nodeapi/telegraphs?refresh_type=0&rn=20&token=&app=CailianpressWeb&os=web&sv=6.8.0";

/*
  财联社网页请求
 */
export const caiLianSheRequest = data => {return req({url: url, method: 'GET', data: data})}

const app = require('electron').remote.app
app.on('ready', () => {
    const net = require('electron').remote.net
    const request = net.request(url)
    request.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`)
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
        response.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`)
        })
        response.on('end', () => {
            console.log('No more data in response.')
        })
    })
    request.end()
})

