import Vue from 'vue'
import Vuetify from 'vuetify'
import themeApi from '@/api/themeApi'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    dark: false,
    themes: {
      light: localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')) : themeApi.themes[0]
    }
  }
})
