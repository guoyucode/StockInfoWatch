//第一财经

import {req} from "./common";
import {clone, DateFormat, delayer} from "../js/utils";
import qs from "qs"
import configData from "../js/config_data";
import {generalHandlerData2, mySetInterval} from "../js/project";
import {api_cls_request} from "./cls";

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

let vue = {
    data: [],
    loading: true,
    enableNotice: true,
    config: configData.dycj,
}

let page = 1


//请求数据
export function api_dycj_request(next, callback) {

    //定时器, 只执行一次
    if(!vue.onece){
        let run = delayer(time => { mySetInterval("第一财经-定时器", time, api_dycj_request) })
        configData._watch.push({"dycj.setInterval_time": run});
        configData._watch.push({"dycj.enable": (enable) => {
                if(enable) run(configData.dycj.setInterval_time);
                else run(0);
            }})
        vue.onece = true;
        run(configData.dycj.setInterval_time);
    }

    const self = vue
    if(!next || next != "setInterval") self.loading = true
    let data = {}
    if(next && next == "next") data.page = page+1
    dycjRequest(data).then(function (res) {
        self.loading = false
        console.log("第一财经 res-data", res)
        if(!res || !(res instanceof Array) || res.length === 0) return
        let rows = res;

        for(let item of rows){
            item.time = item.datekey + " " + item.hm
            item.content = item.newcontent
        }

        let d = generalHandlerData2(self.data, next, rows, (vue.config.enableNotice?"第一财经直播区":false), "content")
        callback(d)
        if(d){
            vue.data = d
        }
        if(next && next == "next") page += 1
    })
}


