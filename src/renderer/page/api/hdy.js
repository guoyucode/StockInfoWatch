//互动易
import {req} from "./common";
import qs from "qs"
import {generalHandlerData2, mySetInterval} from "../js/project";
import configData from "../data_handler/config_data";
import {DateFormat, delayer} from "../js/utils";
import {mergeViewDataHdy} from "../data_handler/view_data_hdy";

const url = "http://irm.cninfo.com.cn/ircs/index/search";

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
    const d = {}
    d.searchTypes = "11,"
    d.pageSize = 20
    d.pageNo = data.page || 1
    return req({url: url, method: 'POST', data: qs.stringify(d)})
}


let vue = {
    data: [],
    loading: true,
    page: 1,
    config: configData.hdy,
}


//事件接收
export const init_hdy_api = function () {

    //刷新
    $EventBus.$on("refresh", () => {if (configData.common.tabName == "互动问答") api_hdy_request("refresh")})
    $EventBus.$on("hdy-next", () => api_hdy_request("next"));

    //定时器, 只执行一次
    let run = delayer(time => {
        mySetInterval("互动易-定时器", time, () => api_hdy_request("setInterval", () => {
        }))
    })
    configData._watch.push({"hdy.setInterval_time": run});
    configData._watch.push({
        "hdy.enable": (enable) => {
            if (enable) run(configData.hdy.setInterval_time);
            else run(0);
        }
    })
    run(configData.hdy.setInterval_time);


    //执行一次
    api_hdy_request();

}


//互动易请求
function api_hdy_request(next = "frist") {

    if (!configData.hdy.enable) return

    const self = vue
    if (!next || next != "setInterval") self.loading = true
    var data = {}
    if (next && next == "next") data.page = vue.page+1
    interactiveRequest(data).then(function (res) {
        self.loading = false
        if(!res || !res.results || res.results.length === 0) {
            $EventBus.$emit("refresh-hdy-complete", false)
            return
        }
        let rows = res.results;

        for(let item of rows){
            item.src = {str: "深交所互动易", ico: (staticPath + "/img/hdy.ico"), url: "http://irm.cninfo.com.cn"};
            item.id = item.indexId;
            let time = Number.parseInt(item.pubDate);
            item.time = DateFormat(new Date(time))
            item.content = "<a style=\"color: #0077E6;\">问 </a>" + item.mainContent;

            if(item.attachedContent)
            item.content2 = "<div class=\"text item\" v-if=\"item.attachedContent\">" +
                " <a style=\"color: orange;\">答 </a>" + item.attachedContent + "</div>";
        }

        console.log("互动易 res-data", rows)
        let d = generalHandlerData2(self.data, next, rows, (vue.config.enableNotice?"深交所互动易问答":false))
        if (next && next == "next") vue.page+=1
        $EventBus.$emit("refresh-hdy-complete", true, d)
        vue.data = d
    })
}

