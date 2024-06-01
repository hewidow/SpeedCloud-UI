import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import store from './store'
import message from './components/Message/index.js'
import themeApi from '@/api/themeApi'

Vue.prototype.$message = message
Vue.prototype.$axios = axios

// axios.defaults.baseURL = 'http://101.43.111.132/api'
axios.defaults.baseURL = '/api'
axios.defaults.timeout = 5000

axios.interceptors.request.use(config => {
  console.log(config)
  if (localStorage.getItem('token')) {
    config.headers.token = localStorage.getItem('token')
  }
  return config
}, error => {
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
  console.log(response)
  switch (response.status) {
    default:
  }
  return response
}, function (error) {
  if (axios.isCancel(error)) {
    console.log(error)
    message.info('请求已取消')
  } else if (typeof error.response === 'undefined') {
    console.log(error)
    message.error('连接超时')
  } else {
    console.log(error.response)
    switch (error.response.status) {
      case 401:
        message.warning(error.response.data.data)
        store.commit('setLoginState', null)
        Object.assign(vuetify.framework.theme.themes.light, themeApi.themes[0])
        router.push('/account')
        break
      case 500:
        message.error(error.response.data.data)
        break
      default:
        message.error('未知错误')
    }
  }
  return Promise.reject(error)
})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
