//云财经

import {req} from "./common";
import {clone, DateFormat, delayer} from "../js/utils";
import qs from "qs"
import {generalHandlerData2, mySetInterval} from "../js/project";
import configData from "../js/config_data";

const url = "https://www.yuncaijing.com/news/get_realtime_news/yapi/ajax.html"
const reqData = {
    page: 1,
}

/**
 *

 *
 */

const headers = {
    Host: "www.yuncaijing.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0",
    Accept: "application/json, text/javascript, */*; q=0.01",
    //"Accept-Language: "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
    //"Accept-Encoding: "gzip, deflate, br",
    "Referer": "https://www.yuncaijing.com/insider/main.html",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
    "Connection": "keep-alive",
    "Cookie": "ycj_wafsid=wafsid_6b961dd000c10277386c9e0da1a97b28; ycj_uuid=744f8aba274e31df385d38194c2335a4; ycj_from_url=aHR0cHM6Ly93d3cueXVuY2FpamluZy5jb20vaW5zaWRlci9tYWluLmh0bWw%3D; ycj_locate=aHR0cHM6Ly93d3cueXVuY2FpamluZy5jb20v; Qs_lvt_168612=1562249293; Qs_pv_168612=93653872822095000%2C760707798758774900%2C3849506922787478500; YUNSESSID=v4roiam61ius775qlptcbafo50",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
}

/*
  网页请求
 */
export const yuncaijingRequest = data => {
    let d = clone(reqData)
    if(data && data.page) {
        d.page = data.page
    }
    let d2 = qs.stringify(d)
    return req({url: url, method: 'POST', data: d2, headers: headers})
}

let vue = {
    data: [],
    loading: true,
    config: configData.yuncaijing,
}
let page = 1

//请求数据
export function api_yuncaijing_request(next, callback) {

    //定时器, 只执行一次
    if(!vue.onece){
        let run = delayer(time => { mySetInterval("云财经-定时器", time, api_yuncaijing_request) })
        configData._watch.push({"yuncaijing.setInterval_time": run});
        configData._watch.push({"yuncaijing.enable": (enable) => {
                if(enable) run(configData.yuncaijing.setInterval_time);
                else run(0);
            }})
        vue.onece = true;
        run(configData.yuncaijing.setInterval_time);
    }


    const self = vue
    if(!next || next != "setInterval") self.loading = true
    let data = {}
    if(next && next == "next") data.page = page+1
    yuncaijingRequest(data).then(function (res) {
        self.loading = false
        if(!res || !res.data || res.data.length === 0) {
            callback()
            return
        }
        let rows = res.data;

        for(let item of rows){
            item.time = formatTime(item.inputtime)
            item.content = item.title
            item.content2 = item.description
        }

        console.log("云财经 res-data", next, rows)
        let d = generalHandlerData2(self.data, next, rows, (vue.config.enableNotice?"云财经":false))
        callback(d)
        if(d) {
            vue.data = d
        }
        if(next && next == "next") page+=1
    })

}

//格式化时间方法
function formatTime(inputtime) {
    let d1 = new Date(Number.parseInt(inputtime) * 1000);
    return DateFormat(d1)
}
