import axios from 'axios'
/**
 * 用户api
 */
const accountApi = {
  /**
   * account界面三种状态
   * @property {Number} FORGET 忘记密码
   * @property {Number} LOGIN 登录
   * @property {Number} REGISTER 注册
   */
  step: {
    FORGET: 0,
    LOGIN: 1,
    REGISTER: 2
  },
  /**
   * 发送邮箱验证码时的两种状态
   * @property {Number} REGISTER 注册
   * @property {Number} FORGET 忘记密码
   */
  codeType: {
    REGISTER: 0,
    FORGET: 1
  },
  /**
   * @function
   * @param {Object} form 登录表单
   * @param {String} form.user 账号
   * @param {String} form.pwd 密码
   * @description 登录接口
   * @return {Promise} axios.post()
   */
  login (form) {
    return axios.post('login', {
      username: form.user,
      password: form.pwd
    })
  },
  /**
   * @function
   * @param {String} email 邮箱
   * @param {codeType} type 密码
   * @description 发送验证码接口
   * @return {Promise} axios.post()
   */
  sendCode (email, type) {
    return axios.post('checkCode', {
      email: email,
      type: type
    })
  },
  /**
   * @function
   * @param {Object} form 登录表单
   * @param {String} form.username 账号
   * @param {String} form.email 邮箱
   * @param {String} form.code 验证码
   * @param {String} form.pwd 密码
   * @description 注册接口
   * @return {Promise} axios.post()
   */
  register (form) {
    return axios.post('register', {
      username: form.username,
      email: form.email,
      checkCode: form.code,
      password: form.pwd
    })
  },
  /**
   * @function
   * @param {Object} form 登录表单
   * @param {String} form.email 邮箱
   * @param {String} form.code 验证码
   * @param {String} form.pwd 密码
   * @description 忘记密码接口
   * @return {Promise} axios.post()
   */
  forget (form) {
    return axios.post('reset', {
      email: form.email,
      checkCode: form.code,
      password: form.pwd
    })
  },
  /**
   * @function
   * @description 登出接口
   * @return {Promise} axios.get()
   */
  logout () {
    return axios.get('logout')
  }
}
export default accountApi
