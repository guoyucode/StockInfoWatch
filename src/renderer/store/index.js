import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import {createPersistedState} from 'vuex-electron'

import modules from './modules'

let strict = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

let plugins = [
  createPersistedState(),
  //createSharedMutations()
]

//如果不是生产环境, 打印日志
if(strict) plugins.push(createLogger())

export default new Vuex.Store({
  modules,
  plugins: plugins,
  strict: strict
})
