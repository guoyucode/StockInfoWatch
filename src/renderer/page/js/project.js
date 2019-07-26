import {getDBStore} from "./db";
import configData from "../data_handler/config_data";
import keywordData from "../data_handler/keyword_subscription_data"
import filterData from "../data_handler/filter_data"

let {ipcRenderer: ipc} = require('electron')


/**
 * 读取数据库数据
 * @param key
 * @param callback
 */
export const readData = function(key, callback){
    getDBStore(dbStore => {
        dbStore.select(key, callback)
    })
}

/**
 * 写入数据库数据
 * @param key
 * @param v
 */
export const insertData = function(key, v){
    getDBStore(function (dbStore) {
        dbStore.push(key, v)
    })
}

/**
 * 初始化从主进程传递过来的数据
 */
export const initAlert = function (vue) {
    ipc.on("alert-message", function (e, msg) {
        window.alert(msg)
    })
    ipc.on("show-success-message", function (e, msg) {
        vue.$message.success(msg)
    })
}

/**
 * 刷新快捷键时的操作
 * @param callback
 */
export const refreshAction = function (callback) {
    ipc.on("refresh-shortcut", function (e, msg) {
        $EventBus.$emit("refresh")
        //callback()
    })
}


/**
 * 通用处理数据
 * @param self vue实例=this
 * @param next 请求数据类型: "first" = 第一次执行, "refresh" = 刷新, "setInterval" = 定时器, "next" = 下一页
 * @param newRows 新数据
 * @param dataKey 合并数据时根据哪个key
 * @param notificationTitle 通知标题
 * @param notificationContent_key 通知内容的key
 */
export const generalHandlerData2 = function (data = [], next = "first", newRows = [], notificationTitle = "通知标题") {

    //如果是定时任务,或者是刷新的逻辑,那么设置为未读消息
    let setReaded = !(next && (next == "setInterval" || next == "refresh"))
    for(let item of newRows) if(item.readed == undefined) item.readed = setReaded;
    for(let item of data) if(item.readed == undefined) item.readed = setReaded;

    //第一次请求时直接返回新数据
    if (next == "first") return newRows;

    //合并数据, 加载更多与别的方式合并数据不一样
    if (next == "next") {
        for (let item of newRows) {
            data.push(item)
        }
    } else {
        //合并新数据,合并在后面
        mergeData2(newRows, data)
    }

    //只有定时任务才推送通知,并且有标题(关闭通知开关则不传标题)
    if (next == "setInterval" && notificationTitle) {

        if (!keywordData.enable && newRows.length > 5) notification(notificationTitle, "多于5条消息,请进入应用中查看 !")
        else {
            for (let row of newRows) {

                let b = isExistingKeyword(row);
                let b1 = isExistingFilterData(row);
                if(!b || !b1) continue;

                //如果有一个a标签, 那么先去掉它
                let content = row.content + ""
                let aIndex = content.indexOf("</a>")
                if(aIndex != -1){
                    content = content.substring(aIndex+4)
                }

                //如果有公司名, 先加上公司名
                if(row.companyShortName) content = row.companyShortName + ": " + content

                notification(notificationTitle, content)
            }
        }
    }

    //数据长度限制
    //dataLenthLimit(data)

    return data
}

//是否存在关键字
export const isExistingKeyword = (item) => {

    if (!keywordData.enable) {
        return true;
    }

    let isAt = false;
    let keywordList = keywordData.data;
    for (let keyword of keywordList) {
        if (item.content.indexOf(keyword) != -1 || (item.content2 || "").indexOf(keyword) != -1) {
            isAt = true
        }

        if (item.content2 && item.content2.indexOf(keyword) != -1) {
            isAt = true
        }

        if(item.companyShortName && item.companyShortName.indexOf(keyword) != -1){
            isAt = true
        }
        if(item.authorName && item.authorName.indexOf(keyword) != -1){
            isAt = true;
        }
    }
    return isAt
}

//是否存在过滤词
export const isExistingFilterData= function(item) {
    if(!filterData.enable || filterData.data.length == 0) {
        return true;
    }

    let isAt = false;
    let list = filterData.data;

    for (let keyword of list) {
        if(item.content.indexOf(keyword) != -1) {
            isAt = true;
        };
        if (item.content2 && item.content2.indexOf(keyword) != -1) {
            isAt = true;
        }
        if (item.companyShortName && item.companyShortName.indexOf(keyword) != -1) {
            isAt = true;
        }
        if(item.authorName && item.authorName.indexOf(keyword) != -1){
            isAt = true;
        }
    }
    return isAt
}

const notification = function(title, body) {
    if (body.length > 50) body = body.substring(0, 50)
    let myNotification = new Notification(title, {
        body: body
    })
    myNotification.onclick = () => {
        ipc.send("showWindows")

        // 切换tab
        let titles = ["财联社电报", "云财经", "第一财经直播区", "选股宝"];
        if(titles.includes(title)) configData.common.tabName = "财经新闻"
    }
}


/**
 * 合并数据, 新数据添加到target, 旧数据移除
 */
export const mergeData2 = function (src, target) {
    if (!src || src.length === 0) return

    for (let i = src.length - 1; i >= 0; i--) {
        let row = src[i];
        if (!row) {
            src.splice(i, 1)
            continue
        }
        for (let d2 of target) {
            if (row.src.str == d2.src.str && row.id == d2.id) {
                src[i] = undefined
            }
        }
        if (src[i]) {
            target.splice(0, 0, src[i])
        } else {
            src.splice(i, 1)
        }
    }
}

/**
 * 合并数据, 新数据添加到target, 旧数据移除
 * 只做删除,不做合并
 */
const mergeData3 = function (src, target) {
    if (!src || src.length === 0) return

    for (let i = src.length - 1; i >= 0; i--) {
        let row = src[i];
        if (!row) {
            src.splice(i, 1)
            continue
        }
        for (let d2 of target) {
            if (row.src.str == d2.src.str && row.id == d2.id) {
                src[i] = undefined
            }
        }
        if (src[i]) {
            //target.splice(0, 0, src[i])
        } else {
            src.splice(i, 1)
        }
    }
}

const dataLenthLimit =function (arr, limit = 500) {
    let li = configData.common.dataLimit
    if(li) limit = li
    if (arr.length > limit) {
        for (let i = arr.length - 1; i >= 0; i--) {
            arr.splice(i, 1)
            if (i <= limit) break
        }
    }
}

const mySetInterval_List ={}

//定时器
export function mySetInterval(title = "定时器标题", setInterval_time = 0, reqestFun) {
    let mySetIntervalListElement = mySetInterval_List[title];
    if (mySetIntervalListElement) {
        clearInterval(mySetIntervalListElement)
        mySetInterval_List[title] = null
    }
    if (!setInterval_time) return
    mySetInterval_List[title] = setInterval(function () {
        reqestFun()
    }, setInterval_time * 1000)
}
