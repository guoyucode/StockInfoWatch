import {getDBStore} from "./db";

let {ipcRenderer: ipc} = require('electron')


/**
 * 读取数据库数据
 * @param key
 * @param callback
 */
export const readData = function(key, callback){
    getDBStore(dbStore => {
        dbStore.select(key, v => {
            if(v != undefined) callback(v);
        })
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
