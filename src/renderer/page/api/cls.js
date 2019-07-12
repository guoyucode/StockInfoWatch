//财联网
import qs from "qs"
import {clone, DateFormat} from "../js/utils";
import {req} from "./common";
import {generalHandlerData2} from "../js/project";
import configData from "../js/config_data";

const url = "https://www.cls.cn/nodeapi/telegraphs?"
const updateUrl = "https://www.cls.cn/nodeapi/roll/get_update_roll_list?"
const reqData = {
    refresh_type: 0,
    rn: 20,
    last_time: "",
    app: "CailianpressWeb",
    os: "web",
    sv: "6.8.0",
    //token: "",
    //sign: "",
}

/*
  财联社网页请求

  https://www.cls.cn/nodeapi/telegraphs?last_time=1562241006&refresh_type=1&rn=20&hasFirstVipArticle=1&app=CailianpressWeb&os=web&sv=6.8.0&token=&sign=
 */
const caiLianSheRequest = data => {
    let d = clone(reqData)

    //获得下一页数据传参
    if(data && data.last_time) {
        d.last_time = data.last_time
        d.refresh_type = 1
    }
    let u = url + qs.stringify(d);
    return req({url: u, method: 'GET'})
}

/*
  财联社网页请求
 */
const caiLianSheUpdateRequest = data => {
    let d = clone(reqData)
    d.last_time = data.last_time
    let u = updateUrl + qs.stringify(d);
    return req({url: u, method: 'GET'})
}


//const app = require('electron').remote.app

let vue = {
    data: [],
    loading: true,
    config: configData.cls,
}


//请求财联社电报数据
export function api_cls_request(next, callback) {
    vue.loading = true

    if(next && next == "refresh" && vue.data && vue.data.length != 0){
        requestUpdateData(next)
        return
    }

    //下一页,点击更多时
    let data = {}
    if(next && next == "next" && vue.data && vue.data.length>0){
        data.last_time = vue.data[vue.data.length-1].ctime
    }

    caiLianSheRequest(data).then(function (res) {
        vue.loading = false
        if(!res || res.error != 0) return;
        res = res.data;
        if(!res || !res.roll_data || res.roll_data.length === 0) return
        let rows = res.roll_data;

        for(let item of rows){
            item.time = formatTime(item.ctime * 1000)
            item.content = item.brief
        }

        console.log("财联网 res-data", rows)
        let d = generalHandlerData2(vue.data, next, rows, (vue.config.enableNotice?"财联社电报":false), "content");
        if(d && callback) {
            callback(d)
            vue.data = d
        }

    })
}

//定时请求
function requestUpdateData(next) {

    caiLianSheUpdateRequest({last_time: vue.data[0].ctime}).then(function (res) {
        if(!res || res.error != 0) return;
        console.log("cls-requestUpdateData", res.data)
        res = res.data;
        if(!res || !res.update_num ||  !res.roll_data || res.roll_data.length === 0) return
        let rows = res.roll_data
        for(let item of rows){
            item.time = formatTime(item.ctime * 1000)
            item.content = item.brief
        }
        generalHandlerData2(vue.data, next, rows, (vue.config.enableNotice?"财联社电报":false), "title")
    })
}

//格式化时间方法
function formatTime(time){
    let date = new Date(time)
    return DateFormat(date)
}

