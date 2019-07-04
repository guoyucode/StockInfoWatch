//第一财经

import {req} from "./common";
import {clone} from "../js/utils";
import qs from "qs"

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
