//财联网
import qs from "qs"
import {clone} from "../js/utils";
import {req} from "./common";

const url = "https://www.cls.cn/nodeapi/telegraphs?"
const updateUrl = "https://www.cls.cn/nodeapi/roll/get_update_roll_list?"
const reqData = {
    refresh_type: 0,
    rn: 20,
    last_time: "",
    app: "CailianpressWeb",
    os: "web",
    sv: "6.8.0",
    //token: "",
    //sign: "",
}

/*
  财联社网页请求

  https://www.cls.cn/nodeapi/telegraphs?last_time=1562241006&refresh_type=1&rn=20&hasFirstVipArticle=1&app=CailianpressWeb&os=web&sv=6.8.0&token=&sign=
 */
export const caiLianSheRequest = data => {
    let d = clone(reqData)

    //获得下一页数据传参
    if(data && data.last_time) {
        d.last_time = data.last_time
        d.refresh_type = 1
    }
    let u = url + qs.stringify(d);
    console.log("财联社网页请求-url", u)
    return req({url: u, method: 'GET'})
}

/*
  财联社网页请求
 */
export const caiLianSheUpdateRequest = data => {
    let d = clone(reqData)
    d.last_time = data.last_time
    let u = updateUrl + qs.stringify(d);
    return req({url: u, method: 'GET'})
}


//const app = require('electron').remote.app

