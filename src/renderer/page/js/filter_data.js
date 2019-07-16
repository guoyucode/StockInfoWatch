import {getProxyObject} from "./proxy_util";

let state = {
    data: ["科技"],
    enable: false,
}

let readData = localStorage.getItem("filter_data")
if(readData){
    state.data = JSON.parse(readData)
}

let enable = localStorage.getItem("filter_enable")
if(enable != undefined && enable != null){
    state.enable = JSON.parse(enable)
}


state.data._set = (k, v) => {
    localStorage.setItem("filter_data", JSON.stringify(v))
}
state._set = (k, v) => {
    if(k == "enable") localStorage.setItem("filter_enable", JSON.stringify(v))
}
const filterData = getProxyObject(state)
export default filterData

