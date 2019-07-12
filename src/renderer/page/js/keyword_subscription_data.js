import {getProxyObject} from "./proxy_util";

let state = {
    data: ["军工"],
    enable: true,
}

let readData = localStorage.getItem("keyword_data")
if(readData){
    state.data = JSON.parse(readData)
}
state.data._set = (k, v) => {
    localStorage.setItem("keyword_data", JSON.stringify(v))
}
state._set = (k, v) => {
    if(k == "enable") localStorage.setItem("keyword_enable", JSON.stringify(v))
}
const keywordData = getProxyObject(state)
export default keywordData

