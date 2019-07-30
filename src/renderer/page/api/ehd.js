//上证E互动
import {req} from "./common";
import qs from "qs"
import {generalHandlerData2, mySetInterval} from "../js/project";
import configData from "../data_handler/config_data";
import {clone, DateFormat, delayer} from "../js/utils";
import {mergeViewDataHdy} from "../data_handler/view_data_hdy";

const url = "http://sns.sseinfo.com/ajax/feeds.do?";

/*
  互动易
  data 数据字段解析:
  packageDate: 发布时间
  mainContent: 问题
  attachedContent: 答案

 */
export const interactiveRequest = data => {
    const d = clone(params)
    d.page = data.page || 1
    let u = url + qs.stringify(d)
    console.log("ehd-url", u)
    return req({url: u, method: 'GET'})
}

let params = {
    type: 11,
    pageSize: 20,
    lastid: -1,
    show: 1,
    page: 1,
}


let vue = {
    config: configData.ehd,
    data: [],
}



export const init_ehd_api = function () {

    //事件接收
    $EventBus.$on("refresh", () => {if(configData.common.tabName == "互动问答") api_ehd_request("refresh")})
    $EventBus.$on("hdy-next", () => api_ehd_request("next"));

    //定时器, 只执行一次
    let run = delayer(time => { mySetInterval("上证E互动-定时器", time, ()=>api_ehd_request("setInterval")) })
    configData._watch.push({"ehd.setInterval_time": run});
    configData._watch.push({"ehd.enable": enable => run(enable?configData.ehd.setInterval_time:enable)});
    run(configData.ehd.setInterval_time);

    //执行
    api_ehd_request();

}

//上证E互动
function api_ehd_request(next = "first") {

    if (!configData.ehd.enable) return;

    const self = vue
    if (next != "setInterval") self.loading = true
    let data = {}
    if (next == "next") data.page = params.page+1
    interactiveRequest(data).then(function (res) {
        self.loading = false
        if(!res) {
            $EventBus.$emit("refresh-hdy-complete", false)
            return
        }
        let rows = convObj(res);
        console.log("上证E互动parseFromString", rows)

        let d = generalHandlerData2(self.data, next, rows, (vue.config.enableNotice?"上证E互动":false))
        if (next && next == "next") params.page+=1
        $EventBus.$emit("refresh-hdy-complete", true, d);
        if(d) vue.data = d
    }).catch(e => {
        $EventBus.$emit("refresh-hdy-complete", false);
    })
}

//
const convObj = function (res) {
    var el = document.createElement('html');
    el.innerHTML = res;
    let msgList = el.getElementsByClassName("m_feed_item");
    let rows = []
    if (!msgList || msgList.length == 0) {
        el.remove();
        return rows;
    }
    for (let item of msgList) {
        let row = {};
        rows.push(row);
        row.id = "ehd_" + item.getAttribute("id");

        let userElement = item.getElementsByClassName("m_feed_face")[0];
        let userA = userElement.getElementsByTagName("a")[0];
        row.uid = userA.getAttribute("uid");
        row.authorName = userA.getAttribute("title");

        let b = item.getElementsByClassName("m_feed_txt")[0];
        let b1 = b.getElementsByTagName("a")[0];
        row.companyShortName = b1.innerText.substring(1)
        let text = b.innerText;
        let content = text.substring(text.indexOf(")")).trim().substring(1)
        row.content = `<a style=\"color: #0077E6;\">问 </a>${content}`

        let content2Ele = item.getElementsByClassName("m_qa")[0].getElementsByClassName("m_feed_txt")[0];
        let content2 = content2Ele.innerText.trim();
        row.content2 = `<div class='text item' v-if='item.attachedContent'><a style='color: orange;'>答 </a>${content2}</div>`

        row.src = {str: "上证E互动", ico: (staticPath + "/img/ehd.ico"), url: "http://sns.sseinfo.com/"};

        let t = item.getElementsByClassName("m_feed_from")[0].getElementsByTagName("span")[0].innerText;
        row.t = t;
        row.time = formartTime(t);
    }
    el.remove();
    return rows;
}

const formartTime = function (v) {

    let minutesAgo = v.indexOf("分钟前");
    let hourBefor = v.indexOf("小时前");
    let yesterday = v.indexOf("昨天");

    if (minutesAgo != -1) {
        let str = v.substring(0, minutesAgo);
        let vInt = Number.parseInt(str);
        let cur = new Date().getTime() - (vInt * 1000);
        return DateFormat(new Date(cur))
    } else if (hourBefor != -1) {
        let str = v.substring(0, hourBefor);
        let vInt = Number.parseInt(str);
        let cur = new Date().getTime() - (vInt * 60 * 1000);
        return DateFormat(new Date(cur))
    } else if (yesterday != -1) {
        let str = v.substring(yesterday + 4);
        let tStrs = str.split(":");
        let vInt = Number.parseInt(tStrs[0]);
        let vInt2 = Number.parseInt(tStrs[1]);
        let cur = new Date().getTime() - (12 * 60 * 1000);
        let date1 = new Date(cur);
        let date2 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDay(), vInt, vInt2);
        return DateFormat(date2);
    } else if (v.length == 12) {
        let mouth = v.substring(0, 2);
        let day = v.substring(3, 5);
        let hours = v.substring(7, 9);
        let sece = v.substring(10, 12);
        let date = new Date(new Date().getFullYear(), mouth, day, hours, sece, 0);
        return DateFormat(new Date(date))
    }
    return v
}
