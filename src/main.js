// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// axios
import MyServerHttp from '@/plugins/http.js'
// 引入elemntUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import router from './router'

// 使用elementui/axios插件
Vue.use(ElementUI)
Vue.use(MyServerHttp)
// Vue.config.productionTip = false
// Vue.prototype.axios = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
