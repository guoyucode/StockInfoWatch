import configData from "../data_handler/config_data"

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
export const dataLenthLimit =function (arr, limit = 500) {
    let li = configData.common.dataLimit
    if(li) limit = li
    if (arr.length > limit) {
        for (let i = arr.length - 1; i >= 0; i--) {
            arr.splice(i, 1)
            if (i <= limit) break
        }
    }
}

//通知
export const notification = function(title, body) {
    let self = this
    if (body.length > 50) body = body.substring(0, 50)

    let myNotification = new Notification(title, {
        body: body
    })

    myNotification.onclick = () => {
        let {ipcRenderer: ipc} = window.require('electron')
        ipc.send("showWindows")

        // 切换tab
        configData.common.tabName = title
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
        if(!row) {
            src.splice(i, 1)
            continue
        }
        for (let k2 in target) {
            let d2 = target[k2];
            if (row[key] == d2[key]) {
                src[i] = undefined
            }
        }
        if (src[i]) {
            target.splice(0, 0, src[i])
        }

        if(src[i] == undefined) src.splice(i, 1)
    }
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
export const generalHandlerData = function (self, next, newRows, dataKey, notificationTitle, notificationContent_key) {
    if(!next){
        self.data = newRows
    }

    // 定时刷新的逻辑,手动刷新,下一页
    // (next && (next == "refresh" || next == "setInterval" || next == "next")
    else {

        //合并数据, 加载更多与别的方式合并数据不一样
        if(next == "next"){
            for (let k in newRows) {
                self.data.push(newRows[k])
            }
        } else {
            //合并新数据
            mergeData(newRows, self.data, dataKey)
        }

        //只有定时任务才推送通知,并且有标题(关闭通知开关则不传标题)
        if(next == "setInterval" && notificationTitle){
            if(newRows.length > 5) notification(notificationTitle, "多于5条消息,请进入应用中查看 !")
            else{
                for (let k in newRows) {
                    let row = newRows[k];
                    let content = "通知内容"
                    if(notificationContent_key.keyEval) content = eval(notificationContent_key.keyEval)
                    else content = row[notificationContent_key]
                    notification(notificationTitle, content)
                }
            }
        }
    }

    //数据长度限制
    dataLenthLimit(self.data)
}

/**
 * 延迟器
 */
export const delayer = function(action, delay = 1500) {
    let timer = -1;
    return nv => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            action(nv);
        }, delay);
    };
}


//输入的时间格式为yyyy-MM-dd hh:mm:ss
export const convertDateFromString = function(dateString) {
    if(dateString.length == 16) dateString+=":00"
    let arr1 = dateString.split(" ");
    let sdate = arr1[0].split('-');
    let time = arr1[1].split(":");
    let year = sdate[0] ? Number.parseInt(sdate[0]) : undefined;
    let month = sdate[0] ? Number.parseInt(sdate[1]) : undefined;
    let day = sdate[0] ? Number.parseInt(sdate[2]) : undefined;
    let hours = sdate[0] ? Number.parseInt(time[0]) : undefined;
    let minutes = sdate[0] ? Number.parseInt(time[1]) : undefined;
    let seconds = sdate[0] ? Number.parseInt(time[2]) : undefined;
    let date = new Date(year, month, day, hours, minutes, seconds);
    return date;
}
