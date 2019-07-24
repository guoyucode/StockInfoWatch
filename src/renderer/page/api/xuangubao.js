//选股宝

import {req} from "./common";
import {clone, DateFormat, delayer} from "../js/utils";
import qs from "qs"
import configData from "../data_handler/config_data";
import {generalHandlerData2, mySetInterval} from "../js/project";
import {mergeViewData} from "../data_handler/view_data";

const url = "https://api.xuangubao.cn/api/pc/msgs?"
const reqData = {
    subjids: "9,10,723,35,469,821",
    limit: 30,
    tailmark: "",
    msgIdMark: "",
}

/*
  网页请求
 */
export const xuangubaoRequest = data => {
    let d = clone(reqData)
    if(data && data.TailMsgId) {
        d.tailmark = data.TailMark
        d.msgIdMark = data.TailMsgId
    }
    let u = url + qs.stringify(d)
    return req({url: u, method: 'GET'})
}

let vue = {
    data: [],
    loading: true,
    config: configData.xuangubao,
}

let markData = null //下次提交的记号数据

//请求数据
export function api_xuangubao_request(next, callback) {

    //定时器, 只执行一次
    if(!vue.onece){
        let run = delayer(time => { mySetInterval("选股宝-定时器", time, ()=>api_xuangubao_request("setInterval", callback)) })
        configData._watch.push({"xuangubao.setInterval_time": run});
        configData._watch.push({"xuangubao.enable": (enable) => {
                if(enable) run(configData.xuangubao.setInterval_time);
                else run(0);
            }})
        vue.onece = true;
        run(configData.xuangubao.setInterval_time);
    }

    const self = vue
    if(!next || next != "setInterval") self.loading = true
    let data = {}
    if(next && next == "next" && markData && markData.TailMsgId) {
        data.TailMark = markData.TailMark
        data.TailMsgId = markData.TailMsgId
    }
    xuangubaoRequest(data).then(function (res) {
        self.loading = false
        if(!res || !res.NewMsgs || res.NewMsgs.length === 0) return
        let rows = res.NewMsgs;

        for(let item of rows){
            item.id = item.Id
            item.time = formatTime(item.CreatedAt)
            item.content = item.Title
            item.content2 = item.Summary
            item.src = {str: "选股宝", ico: (staticPath + "/img/xuangubao.png"), url: "https://xuangubao.cn"};
        }

        console.log("选股宝 res-data", rows)
        let d = generalHandlerData2(self.data, next, rows, (vue.config.enableNotice?"第一财经直播区":false))
        callback(d)
        if(d) {
            vue.data = d
            mergeViewData(d);
        }

        if(res.TailMsgId)
         markData = {HeadMark: res.HeadMark, TailMark: res.TailMark, TailMsgId: res.TailMsgId}//记号数据

    }).finally(() => callback())
}

//格式化时间方法
function formatTime(str) {
    let s = str.replace("T", " ").replace("Z"," ");
    let d1 = new Date(s);
    let d2 = new Date(d1.getTime() + 8 * 3600 * 1000);
    return DateFormat(d2)
}

