//云财经

import {req} from "./common";
import {clone} from "../js/utils";
import qs from "qs"

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