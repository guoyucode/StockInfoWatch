//第一财经

import {req} from "./common";
import {clone, DateFormat, delayer} from "../js/utils";
import qs from "qs"
import configData from "../data_handler/config_data";
import {generalHandlerData2, mySetInterval} from "../js/project";
import {api_cls_request} from "./cls";
import {mergeViewData} from "../data_handler/view_data";

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

/**
 * 初始化接口
 */
export const init_api_dycj = function () {

    //事件接收
    $EventBus.$on("refresh", () => { if(configData.common.tabName == "财经新闻") api_dycj_request("refresh") })
    $EventBus.$on("news-next", () => api_dycj_request("next"));

    //定时器
    let run = delayer(time => mySetInterval("第一财经-定时器", time, ()=>api_dycj_request("setInterval")))
    configData._watch.push({"dycj.setInterval_time": run});
    configData._watch.push({"dycj.enable": enable => run(enable?configData.dycj.setInterval_time:enable)})
    run(configData.dycj.setInterval_time);

    api_dycj_request();
}


//请求数据
function api_dycj_request(next = "first") {

    if(!configData.dycj.enable) return;

    const self = vue
    if(!next || next != "setInterval") self.loading = true
    let data = {}
    if(next && next == "next") data.page = page+1
    dycjRequest(data).then(function (res) {
        self.loading = false
        console.log("第一财经 res-data", res)
        if(!res || !(res instanceof Array) || res.length === 0) {
            $EventBus.$emit("refresh-news-complete", false);
            return
        }
        let rows = res;

        for(let item of rows){
            item.id = "dycj_" + item.id;
            item.src = {str: "第一财经", ico: (staticPath + "/img/dycj.ico"), url: "https://www.yicai.com"};
            item.time = item.datekey.replace(new RegExp("\\.",'g'), "-") + " " + item.hm
            item.content = item.newcontent
        }

        let d = generalHandlerData2(self.data, next, rows, (vue.config.enableNotice?"第一财经直播区":false))
        $EventBus.$emit("refresh-news-complete", true, d);
        if(next && next == "next") page += 1
    }).catch(e => {
        $EventBus.$emit("refresh-news-complete", false);
    })
}


