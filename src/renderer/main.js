import Vue from 'vue'
import App from './App'
import router from './router'
//import store from './store'
import configData from "./page/js/config_data"

//饿了么UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.config.async = false
//Vue.prototype.$store = store
Vue.prototype.$configData = configData

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
//  store,
  template: '<App/>'
}).$mount('#app')
