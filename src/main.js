import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/common.less'
import moment from 'moment'
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.filter('timer', function (value) {
  return moment(value * 1000).format('YYYY-MM-DD HH-mm-ss')
})
// 配置axios的基准地址, 效果: 将来所有的请求, 会自动在前面拼接上路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log(config)
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response)
  response = response.data

  if (response.meta.status === 401) {
    response.meta.msg = '尊敬的用户, 您的登陆状态已过期, 请重新登陆'
    localStorage.removeItem('token')
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
