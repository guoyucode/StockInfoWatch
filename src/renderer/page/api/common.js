import axios from "axios"

/**
 * 创建axios实例
 **/
export const req = axios.create({
    //baseURL: process.env.BASE_URL,  // api的base_url
    timeout: 50 * 1000  // 请求超时时间
});

/**
 * 请求拦截器
 */
req.interceptors.request.use(config => {
    config.headers['Accept'] = '*/*';
    //config.headers['Referer'] = 'https://www.cls.cn/'
    config.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0'
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