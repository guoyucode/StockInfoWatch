import Vue from 'vue'
import App from './App'
import router from './router'
import vView from 'vue-view-lazy'
import {update} from "./page/js/update"
//import store from './store'
//import configData from "./page/js/config_data"

Vue.use(vView)

//饿了么UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.config.async = true
Vue.prototype.$eventBus = new Vue() //事件总线
//Vue.prototype.$store = store
//Vue.prototype.$configData = configData

window.staticPath = require('path').join(__static);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
//  store,
  template: '<App/>',
  mounted() {
    update(this);
  },
}).$mount('#app')
