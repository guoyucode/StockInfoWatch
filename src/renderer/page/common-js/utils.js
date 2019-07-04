// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
export const DateFormat = function (date, fmt) { //author: meizz
    if(!fmt) fmt = "yyyy-MM-dd hh:mm:ss";
    var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 复制对象
 * @param srcObj
 * @returns {any}
 */
export const clone = function (srcObj) {
    return JSON.parse(JSON.stringify(srcObj))
}

//数据长度限制
export const dataLenthLimit =function (arr) {
    if (arr.length > 100) {
        for (let i = arr.length - 1; i >= 0; i--) {
            arr.splice(i, 1)
            if (i <= 100) break
        }
    }
}

//通知
export const notification = function(title, body, clickCallback) {
    let self = this
    if (body.length > 50) body = body.substring(0, 50)

    let myNotification = new Notification(title, {
        body: body
    })

    myNotification.onclick = () => {
        let {ipcRenderer: ipc} = require('electron')
        ipc.send("showWindows")
        if(clickCallback) clickCallback(title)
    }
}

/**
 * 合并数据, 新数据添加到target, 旧数据移除
 */
export const mergeData = function (src, target, key) {
    if(!target) target = []
    if(!src || src.length === 0) return

    for (let i = src.length - 1; i >= 0; i--) {
        let row = src[i];
        for (let k2 in target) {
            let d2 = target[k2];
            if (row[key] == d2[key]) {
                src[i] = undefined
            }
        }
        if (src[i]) {
            target.splice(0, 0, src[i])
        }
        src.splice(i, 1)
    }
}
