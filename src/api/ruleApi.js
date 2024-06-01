/**
 * 一些通用规则
 */
const rules = {
  required: v => !!v || '不可为空',
  minLength: v => v.length >= 6 || '至少6位',
  maxLength: v => v.length <= 16 || '最多16位',
  username: v => /^\w*$/.test(v) || '昵称只能是字母、数字或下划线',
  pwd: v => /^\w*$/.test(v) || '密码只能是字母、数字或下划线',
  email: v => /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v) || '邮箱不合法',
  digit: v => /^\d{6}$/.test(v) || '必须为6位数字'
}
/**
 * 规则api
 */
const ruleApi = {
  /**
   * 用户名规则
   */
  usernameRules: [
    rules.required,
    rules.minLength,
    rules.maxLength,
    rules.username
  ],
  /**
   * 邮箱规则
   */
  emailRules: [
    rules.required,
    rules.email
  ],
  /**
   * 密码规则
   */
  pwdRules: [
    rules.required,
    rules.minLength,
    rules.maxLength,
    rules.pwd
  ],
  /**
   * 验证码规则
   */
  codeRules: [
    rules.required,
    rules.digit
  ],
  /**
   * @function
   * @param {String} email 邮箱
   * @description 检测邮箱合法性
   * @return {Boolean} 邮箱是否合法
   */
  checkEmail (email) {
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)
  }
}
export default ruleApi
