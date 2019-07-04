//选股宝

import {req} from "./common";
import {clone} from "../js/utils";
import qs from "qs"

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
