//淘股吧

import {req} from "./common";
import {clone, DateFormat, delayer} from "../js/utils";
import qs from "qs"
import configData from "../data_handler/config_data";
import {generalHandlerData2, mySetInterval} from "../js/project";

const url = "https://www.taoguba.com.cn/newIndex/getZh?"
const reqData = {
    pageNo: 1,
}

/*
  第一财经网页请求
 */
export const dataRequest = data => {
    let d = clone(reqData)
    if(data && data.pageNo) {
        d.pageNo = data.pageNo
    }
    let u = url + qs.stringify(d)
    return req({url: u, method: 'GET'})
}

let vue = {
    data: [],
    loading: true,
    enableNotice: true,
    config: configData.taoguba,
}

let pageNo = 1


//请求数据
export function api_taoguba_request(next, callback) {

    //定时器, 只执行一次
    if(!vue.onece){
        let run = delayer(time => { mySetInterval("淘股吧-定时器", time, ()=>api_taoguba_request("setInterval", callback)) })
        configData._watch.push({"taoguba.setInterval_time": run});
        configData._watch.push({"taoguba.enable": (enable) => {
                if(enable) run(configData.taoguba.setInterval_time);
                else run(0);
            }})
        vue.onece = true;
        run(configData.taoguba.setInterval_time);
    }

    const self = vue
    if(!next || next != "setInterval") self.loading = true
    let data = {}
    if(next && next == "next") data.pageNo = pageNo+1
    dataRequest(data).then(function (res) {
        self.loading = false
        console.log("淘股吧 res-data", res)
        if(!res || res.errorCode != 0 || res.status != true || !res.dto || !res.dto.list || res.dto.list.length == 0) return
        let rows = res.dto.list;

        for(let item of rows){
            let id = 0;
            if(item.req) id = item.dateTime + item.req;
            else if(item.topicID) id = item.topicID;
            else id = item.dateTime;
            item.id = id
            item.time = DateFormat(new Date(item.dateTime));
            item.content = item.subject
            item.content2 = item.subinfo
            item.authorName = item.userName
            item.src = {str: "淘股吧", ico: (staticPath + "/img/taoguba.ico"), url: "http://www.taoguba.com.cn"};
        }

        let d = generalHandlerData2(self.data, next, rows, (vue.config.enableNotice?"淘股吧":false))
        callback(d)
        if(d) vue.data = d
        if(next && next == "next") pageNo += 1
    }).catch(e => {
        $EventBus.$emit("refresh-news-complete", false);
    })
}


