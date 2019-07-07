/*设置快捷键*/
import { globalShortcut } from 'electron'

const state = {
  hotKey: "无",
}

const actions = {
  setHotKey ({ commit }, param) {
    commit('setHotKey', param)
  }
}

const mutations = {
  setHotKey (inputState, param) {
    setHotKeyFun(param)
    state.hotKey = inputState.hotKey = param
  },
}

const getters = {
  getHotKey () {
    console.log("getHotKey", state.hotKey)
    return state.hotKey
  }
}

//设置刷新快捷键
const setHotKeyFun = function (hotKey) {
  if (!globalShortcut) return;

  //如果之前注册成功了快捷键,那么解除该快捷键
  if (state.hotKey_val) globalShortcut.unregister(state.hotKey_val)
  if (!hotKey || hotKey == "无") return

  console.log("快捷键注册", hotKey)
  let bool = globalShortcut.register(hotKey, () => {
    console.log("刷新生效了!")
  })
  if (!bool) {
    console.log("设置刷新快捷键: " + hotKey + " 失败,请检查是否有软件快捷键冲突, 或者到设置中重新设置一个不同的快捷键.")
    state.hotKey = state.hotKey_val || "无"
  } else {
    state.hotKey_val = state.hotKey + "";
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
