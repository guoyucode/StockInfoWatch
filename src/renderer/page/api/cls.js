//财联网
import qs from "qs"
import {clone, DateFormat, delayer} from "../js/utils";
import {req} from "./common";
import {generalHandlerData2, mySetInterval} from "../js/project";
import configData from "../data_handler/config_data";
import {mergeViewData, viewData} from "../data_handler/view_data"

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

    //定时器, 只执行一次
    if(!vue.onece){
        let run = delayer(time => { mySetInterval("财联社电报-定时器", time, ()=>api_cls_request("setInterval", callback)) })
        configData._watch.push({"cls.setInterval_time": run});
        configData._watch.push({"cls.enable": (enable) => {
            if(enable) run(configData.cls.setInterval_time);
            else run(0);
            api_cls_request(undefined, callback)
        }})
        vue.onece = true;
        run(configData.cls.setInterval_time);
    }

    if(!configData.cls.enable) return;

    if(next && next == "refresh" && vue.data && vue.data.length > 0){
        requestUpdateData(next, callback)
        return
    }

    //下一页,点击更多时
    let data = {}
    if(next && next == "next" && vue.data && vue.data.length>0){
        data.last_time = vue.data[vue.data.length-1].ctime
    }

    caiLianSheRequest(data).then(function (res) {
        vue.loading = false
        if(!res || res.error == undefined || res.error != 0 || !res.data) return;
        if(!res || !res.data.roll_data || res.data.roll_data.length === 0) return;

        let rows = res.data.roll_data;
        for(let item of rows){
            item.src = {str: "财联杜电报", ico: (staticPath + "/img/cls.ico"), url: "https://www.cls.cn"};
            item.time = formatTime(item.ctime * 1000)
            item.content = item.brief
        }

        console.log("财联网 res-data", rows)
        let d = generalHandlerData2(vue.data, next, rows, (vue.config.enableNotice?"财联社电报":false), "content");
        callback(d)
        if(d) {
            vue.data=d;
            mergeViewData(d);
        }
    }).finally(() => callback())
}

//定时请求
function requestUpdateData(next, callback) {

    caiLianSheUpdateRequest({last_time: vue.data[0].ctime}).then(function (res) {
        console.log("cls-requestUpdateData", res.data)
        if(!res || res.error != 0) return;
        res = res.data;
        if(!res || !res.update_num ||  !res.roll_data || res.roll_data.length === 0) return
        let rows = res.roll_data
        for(let item of rows){
            item.src = {str: "财联杜电报", ico: (staticPath + "/img/cls.ico"), url: "https://www.cls.cn"};
            item.time = formatTime(item.ctime * 1000)
            item.content = item.brief
        }
        let d = generalHandlerData2(vue.data, next, rows, (vue.config.enableNotice?"财联社电报":false));
        callback(d)
    }).finally(() => callback())
}

//格式化时间方法
function formatTime(time){
    let date = new Date(time)
    return DateFormat(date)
}

