/*设置数据仓库管理*/
import {ipcRenderer} from "electron";
import {getProxyObject} from "./proxy_util";


const state = {

    common: {
        hotKey: "F5",
        tabName: "财联社电报", //切换tab名字
        dataLimit: 500,
    },

    cls: {
        enable: true,
        setInterval_time: 25,
        enableNotice: true,
    },

    hdy: {
        enable: true,
        setInterval_time: 25,
        enableNotice: true,
    },

    dycj: {
        enable: true,
        setInterval_time: 25,
        enableNotice: true,
    },

    xuangubao: {
        enable: true,
        setInterval_time: 25,
        enableNotice: true,
    },

    yuncaijing: {
        enable: true,
        setInterval_time: 25,
        enableNotice: true,
    },

    setting: {
        enable: true,
    },
}

for (let k in state) {
    let r = localStorage.getItem("config_" + k);
    if (r != null) state[k] = JSON.parse(r)
    let v = state[k];

    //添加set方法
    v.set = (k2, v2) => {
        console.log("proxy.set2", k2, v2)
        if (v2 == undefined) return
        if (k2 == "hotKey") ipcRenderer.send("setHotKey", v2)
        localStorage.setItem("config_" + k, JSON.stringify(state[k]))
    }

    /*数据库存储
    getDBStore(store => {
        store.select("config_" + k, r => {
            let cls = state[k];
            if (r != undefined) state[k] = r
            cls["set"] = (k2, v) => {
                console.log("proxy.set2", k2, v)
                if (v == undefined) return
                if (k == "hotKey") ipcRenderer.send("setHotKey", v)
                insertData("config_" + k, state[k])
            }
        })
    })
    */

}

state["set"] = (k, v) => {
    console.log("proxy.set1", k, v)
    if (v == undefined) return
    localStorage.setItem("config_" + k, JSON.stringify(v))
    //let any = clone(v);
    //insertData("config_" + k, any)
}

ipcRenderer.send("setHotKey", state.common.hotKey)

export default getProxyObject(state)


//存储对象
//localStorage.setItem(obj, JSON.stringify(obj));

// 获取存储的对象
//JSON.parse(localStorage.getItem(obj))
