/*设置快捷键*/
import { ipcRenderer } from 'electron'


const state = {
  hotKey: "无",
  hotKey_val: "",
  mainWindow: null,
  callback: null,//刷新时回调
}

const actions = {
  setHotKey ({ commit }, param) {
    if(!param) return
    ipcRenderer.send("setHotKey", param)
    commit('setHotKey', param)
  },
  callback({ commit }, param) {
    commit('callback', param)
  },
}

const mutations = {
  setHotKey (inputState, param) {
    if(!param) return
    state.hotKey = inputState.hotKey = param
  },
  callback (inputState, param) {
    state.callback = inputState.callback = param
  },
  mainWindow(inputState, param) {
    state.mainWindow = inputState.mainWindow = param
    console.debug("store.commit(\"mainWindow\")", !!param)
  },
}

const getters = {
  getHotKey () {
    console.log("getHotKey", state.hotKey)
    return state.hotKey
  }
}


export default {
  state,
  getters,
  actions,
  mutations,
}

/*const arg = "refresh"
    if (!name || name == "财联社电报") vue.$refs.cls.requestData(arg)
    else if (name == "深交所互动易问答") vue.$refs.hdy.requestData(arg)
    else if (name == "第一财经直播区") vue.$refs.dycj.requestData(arg)
    else if (name == "选股宝") vue.$refs.xuangubao.requestData(arg)
    else if (name == "云财经") vue.$refs.yuncaijing.requestData(arg)*/
