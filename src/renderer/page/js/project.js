import {getDBStore} from "./db";
import configData from "./config_data";
import {delayer} from "./utils";

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
        callback()
    })
}


/**
 * 通用处理数据
 * @param self vue实例=this
 * @param next 请求数据类型: "refresh" = 刷新, "setInterval" = 定时器, "next" = 下一页
 * @param newRows 新数据
 * @param dataKey 合并数据时根据哪个key
 * @param notificationTitle 通知标题
 * @param notificationContent_key 通知内容的key
 */
export const generalHandlerData2 = function (data, next, newRows, notificationTitle) {
    if (!next || next == "first") {
        return newRows;
    }

    // 定时刷新的逻辑,手动刷新,下一页
    // (next && (next == "refresh" || next == "setInterval" || next == "next")

    //合并数据, 加载更多与别的方式合并数据不一样
    if (next == "next") {
        for (let item of newRows) {
            data.push(item)
        }
    } else {
        //合并新数据
        mergeData(newRows, data)
    }

    //只有定时任务才推送通知,并且有标题(关闭通知开关则不传标题)
    if (next == "setInterval" && notificationTitle) {
        if (newRows.length > 5) notification(notificationTitle, "多于5条消息,请进入应用中查看 !")
        else {
            for (let row of newRows) {

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
    dataLenthLimit(data)

    return false
}

const notification = function(title, body) {
    if (body.length > 50) body = body.substring(0, 50)
    let myNotification = new Notification(title, {
        body: body
    })
    myNotification.onclick = () => {
        ipc.send("showWindows")

        // 切换tab
        configData.common.tabName = title
    }
}


/**
 * 合并数据, 新数据添加到target, 旧数据移除
 */
const mergeData = function (src, target) {
    if (!target) target = []
    if (!src || src.length === 0) return

    for (let i = src.length - 1; i >= 0; i--) {
        let row = src[i];
        if (!row) {
            src.splice(i, 1)
            continue
        }
        for (let d2 of target) {
            if (row.id == d2.id) {
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
        reqestFun("setInterval", (d)=>{
            //console.log(title, setInterval_time)
        })
    }, setInterval_time * 1000)
}
