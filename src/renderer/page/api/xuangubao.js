//选股宝

import {req} from "./common";
import {clone, DateFormat} from "../js/utils";
import qs from "qs"
import configData from "../js/config_data";
import {generalHandlerData2} from "../js/project";

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
            item.time = formatTime(item.CreatedAt)
            item.content = item.Title
            item.content2 = item.Summary
        }

        console.log("选股宝 res-data", rows)
        let d = generalHandlerData2(self.data, next, rows, (vue.config.enableNotice?"第一财经直播区":false))
        if(d && callback) {
            callback(d)
            vue.data = d
        }
        markData = {HeadMark: res.HeadMark, TailMark: res.TailMark, TailMsgId: res.TailMsgId}//记号数据
    })
}

//格式化时间方法
function formatTime(str) {
    let s = str.replace("T", " ").replace("Z"," ");
    let d1 = new Date(s);
    let d2 = new Date(d1.getTime() + 8 * 3600 * 1000);
    return DateFormat(d2)
}

