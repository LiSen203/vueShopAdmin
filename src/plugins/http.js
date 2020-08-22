// 使用axios做成插件模块
import axios from 'axios'
const MyHttpServer = {}
MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  // 添加实列方法
  Vue.prototype.$http = axios
}
// 拦截器-向服务端发请求需要token
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
export default MyHttpServer
