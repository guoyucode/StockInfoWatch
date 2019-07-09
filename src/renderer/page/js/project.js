let {ipcRenderer: ipc} = require('electron')

/**
 * 初始化数据库数据
 * @param vue vue实例
 * @param key 唯一的key,例如: cls
 */
export const initDB = function(vue, key){
    vue.dbStore.select(key + ".setInterval_time", v => {
        if(v != undefined) vue.setInterval_time = v;
    })
    vue.dbStore.select(key + ".enableNotice", v => {
        if(v != undefined) vue.enableNotice = v;
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
