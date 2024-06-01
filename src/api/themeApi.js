import axios from 'axios'
/**
 * 主题api
 */
const themeApi = {
  /**
   * 主题集合
   * @type {VuetifyTheme[]}
   */
  themes: [
    /**
     * 主题信息
     * @typedef {Object} VuetifyTheme
     * @property {String} nav 侧边栏背景颜色
     * @property {String} navMobile 手机侧边栏颜色，因为手机侧边栏是弹出式的
     * @property {String} navText 侧边栏文本颜色
     * @property {String} navTextActive 侧边栏选项激活颜色
     * @property {String} bar 顶部栏背景颜色
     * @property {String} barOpaque 顶部栏不透明颜色
     * @property {String} barText 顶部栏文本颜色
     * @property {String} btn 手按钮背景颜色
     * @property {String} btnText 按钮文本颜色
     * @property {Number} listTextDark 用于将侧边栏的v-list-item上的文字改为白色，0为false，1为true，vuetify不允许在此处有Boolean的值
     * @property {String} backgroundImage 用户主页面背景url
     * @property {String} icon 更换主题界面展示的缩略图url
     * @property {String} name 更换主题界面展示的主题名字
     */
    {
      nav: '#FFFFFF',
      navMobile: '#FFFFFF',
      navText: '#000000',
      navTextActive: '#1976D2',
      bar: '#FFFFFF',
      barOpaque: '#FFFFFF',
      barText: '#424242',
      btn: '#1976D2',
      btnText: '#FFFFFF',
      listTextDark: 0,
      backgroundImage: '',
      icon: require('../assets/theme/default/icon.png'),
      name: '默认'
    },
    {
      nav: '#2f2f2f',
      navMobile: '#2f2f2f',
      navText: '#FFFFFF',
      navTextActive: '#FFFFFF',
      bar: '#2f2f2f',
      barOpaque: '#2f2f2f',
      barText: '#FFFFFF',
      btn: '#2f2f2f',
      btnText: '#FFFFFF',
      listTextDark: 1,
      backgroundImage: '',
      icon: require('../assets/theme/black/icon.png'),
      name: '经典黑'
    },
    {
      nav: '#FFFFFF00',
      navMobile: '#4F3F81',
      navText: '#FFFFFF',
      navTextActive: '#FFFFFF',
      bar: '#4F3F8100',
      barOpaque: '#4F3F81',
      barText: '#FFFFFF',
      btn: '#6A1B9A',
      btnText: '#FFFFFF',
      listTextDark: 1,
      backgroundImage: require('../assets/theme/star/bg.png'),
      icon: require('../assets/theme/star/icon.png'),
      name: '星空'
    }
  ],
  /**
   * @function
   * @param {Number} id 唯一标识主题
   * @description 设置主题
   * @return {Promise} axios.post()
   */
  setThemeId (id) {
    return axios.post('updateMe', {
      theme: id
    })
  }
}
export default themeApi
