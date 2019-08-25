import {getProxyObject} from "./proxy_util";

let state = {
    data: ["垃圾分类"],
    enable: false,
}

let readData = localStorage.getItem("keyword_data")
if(readData){
    state.data = JSON.parse(readData)
}

let keyword_enable = localStorage.getItem("keyword_enable")
if(keyword_enable != undefined && keyword_enable != null){
    state.enable = JSON.parse(keyword_enable)
}


state.data._set = (k, v) => {
    localStorage.setItem("keyword_data", JSON.stringify(v))
}
state._set = (k, v) => {
    if(k == "enable") localStorage.setItem("keyword_enable", JSON.stringify(v))
}
const keywordData = getProxyObject(state)
export default keywordData

