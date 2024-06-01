import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
    userData: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null,
    themes: localStorage.getItem('themes') ? JSON.parse(localStorage.getItem('themes')) : null
  },
  mutations: {
    setLoginState (state, data) {
      if (data === null) {
        state.token = null
        state.userData = null
        state.themes = null
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
        localStorage.removeItem('themes')
        localStorage.removeItem('theme')
        sessionStorage.removeItem('uploadDone')
      } else {
        state.token = data.token
        state.userData = data.userData
        state.themes = data.themes
        localStorage.setItem('token', data.token)
        localStorage.setItem('userData', JSON.stringify(data.userData))
        localStorage.setItem('themes', JSON.stringify(data.themes))
        localStorage.setItem('theme', JSON.stringify(data.themes[data.userData.themeId]))
        sessionStorage.setItem('uploadDone', JSON.stringify(true))
      }
    },
    setUserData (state, userData) {
      state.userData = userData
      localStorage.setItem('userData', JSON.stringify(userData))
    }
  },
  actions: {},
  modules: {}
})
