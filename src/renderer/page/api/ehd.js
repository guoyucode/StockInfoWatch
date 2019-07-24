//上证E互动
import {req} from "./common";
import qs from "qs"
import {generalHandlerData2, mySetInterval} from "../js/project";
import configData from "../data_handler/config_data";
import {clone, DateFormat, delayer} from "../js/utils";
import {mergeViewDataHdy} from "../data_handler/view_data_hdy";

const url = "http://sns.sseinfo.com/ajax/feeds.do?";

//查询未读
const unReadUrl = "http://irm.cninfo.com.cn/ircs/index/unread"

/*
  互动易
  data 数据字段解析:
  packageDate: 发布时间
  mainContent: 问题
  attachedContent: 答案

 */
export const interactiveRequest = data => {
    const d = clone(vue)
    d.pageNo = data.page || 1
    return req({url: url, method: 'POST', data: qs.stringify(d)})
}


let vue = {
    type: 11,
    pageSize: 10,
    lastid: -1,
    show: 1,
    page: 1,
}



//格式化时间方法
function formatTime(time) {
    let date = new Date(time)
    return DateFormat(date)
}

//互动易请求
export function api_hdy_request(next, callback) {

    //定时器, 只执行一次
    if(!vue.onece){
        let run = delayer(time => { mySetInterval("互动易-定时器", time, ()=>api_hdy_request("setInterval", callback)) })
        configData._watch.push({"hdy.setInterval_time": run});
        configData._watch.push({"hdy.enable": (enable) => {
                if(enable) run(configData.hdy.setInterval_time);
                else run(0);
            }})
        vue.onece = true;
        run(configData.hdy.setInterval_time);
    }

    const self = vue
    if (!next || next != "setInterval") self.loading = true
    var data = {}
    if (next && next == "next") data.page = vue.page+1
    interactiveRequest(data).then(function (res) {
        self.loading = false
        if(!res || !res.results || res.results.length === 0) {
            callback()
            return
        }
        let rows = res.results;

        for(let item of rows){
            item.src = {str: "深交所互动易", ico: (staticPath + "/img/hdy.ico"), url: "http://irm.cninfo.com.cn"};
            item.id = item.indexId;
            item.time = formatTime(Number.parseInt(item.pubDate))
            item.content = "<a style=\"color: #0077E6;\">问 </a>" + item.mainContent;

            if(item.attachedContent)
            item.content2 = "<div class=\"text item\" v-if=\"item.attachedContent\">" +
                " <a style=\"color: orange;\">答 </a>" + item.attachedContent + "</div>";
        }

        console.log("互动易 res-data", rows)
        let d = generalHandlerData2(self.data, next, rows, (vue.config.enableNotice?"深交所互动易问答":false))
        if (next && next == "next") vue.page+=1
        callback(d)
        if(d) {
            vue.data = d
            mergeViewDataHdy(d)
        }
    }).finally(() => callback())
}

