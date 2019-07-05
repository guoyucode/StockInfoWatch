//互动易
import {req} from "./common";
import {clone} from "../js/utils";
import qs from "qs"

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
    d.searchTypes = "1,11,"
    d.pageSize = 20
    d.pageNo = data.page || 1
    return req({url: url, method: 'POST', data: qs.stringify(d)})
}

//const app = require('electron').remote.app

