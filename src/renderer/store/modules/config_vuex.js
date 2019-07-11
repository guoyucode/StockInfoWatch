/*设置数据仓库管理*/
import {insertData, readData} from "../../page/js/project";
import {getDBStore} from "../../page/js/db";
import {clone} from "../../page/js/utils";
import {ipcRenderer} from "electron";


const enableTab_bak = {
  cls: true,
  hdy: true,
  dycj: true,
  xuangubao: true,
  yuncaijing: true,
  setting: false,
}

const state = {
  hotKey: "无",
  tabName: "", //切换tab名字
  dataLimit: 500,
  enableTab: {
    cls: false,
    hdy: false,
    dycj: false,
    xuangubao: false,
    yuncaijing: false,
    setting: false,
  },

  refsConfig: {
    cls: {
      setInterval_time: 25,
      enableNotice: true,
    },
    hdy: {
      setInterval_time: 25,
      enableNotice: true,
    },
    dycj: {
      setInterval_time: 25,
      enableNotice: true,
    },
    xuangubao: {
      setInterval_time: 25,
      enableNotice: true,
    },
    yuncaijing: {
      setInterval_time: 25,
      enableNotice: true,
    },
    setting: {
      setInterval_time: 25,
      enableNotice: true,
    },
  }
}

// vue.$store.dispatch("方法名")
const actions = {
  initTabsData: ({commit, state}) =>{

    readData("hotKey", v => {
      if(v == undefined) v = "F5"
      commit("set_hotKey", v)
    })

    //读取显示tab配置
    readData("enableTab", v => {
      if(v == undefined){
        v = clone(enableTab_bak)
      }else{
        if(v.setting == undefined) v.setting = false
      }
      commit("set_enableTab", v)
    })

    //读取当前切换哪个tab
    readData("tabName", v => {
      if(!v) v = "财联社电报"
      commit("set_tabName", v)
    })

    //读取每个页面的配置
    readData("refsConfig", v => {
      if(!v) return
      commit("set_refsConfig", v)
    })

    //读取数据长度
    readData("dataLimit", v => {
      if(!v) return
      commit("set_dataLimit", v)
    })

    //console.log("initTabsData.state", state)
  },
}

const getters = {
  get_hotKey: state => {return state.hotKey},
  get_tabName: state => {return state.tabName},
  get_enableTab: state => {return state.enableTab},
  get_refsConfig: state => {return state.refsConfig},
  get_dataLimit: state => {return state.dataLimit},
}

const mutations = {

  set_hotKey (state, param) {
    //console.log("mutations.setHotKey", param)
    if(!param) return
    insertData("hotKey", param)
    ipcRenderer.send("setHotKey", param)
    state.hotKey = param
  },

  set_tabName (state, v){
    //console.log("mutations.setSwithTab", v)
    if(!v) return
    insertData("tabName", v)
    state.tabName = v
  },

  set_enableTab (state, v) {
    //console.log("mutations.setEnableTab", v)
    if(!v || v == state.enableTab || v == {}) return
    insertData("enableTab", v)
    state.enableTab = v
  },

  set_refsConfig(state, v) {
    //console.log("mutations.setRefsConfig", v)
    if(!v || v == state.refsConfig || v == {}) return
    insertData("refsConfig", v)
    state.refsConfig = v
  },

  set_dataLimit(state, v){
    //console.log("mutations.dataLimit", v)
    insertData("dataLimit", v)
    state.dataLimit = v
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
}

/*const arg = "refresh"
    if (!name || name == "财联社电报") vue.$refs.cls.requestData(arg)
    else if (name == "深交所互动易问答") vue.$refs.hdy.requestData(arg)
    else if (name == "第一财经直播区") vue.$refs.dycj.requestData(arg)
    else if (name == "选股宝") vue.$refs.xuangubao.requestData(arg)
    else if (name == "云财经") vue.$refs.yuncaijing.requestData(arg)*/
