import Vue from 'vue'
import MessageVue from '@/components/Message/Message'
import Vuetify from 'vuetify'

const MessageConstructor = Vue.extend(MessageVue) // 直接将Vue组件作为Vue.extend的参数

let nId = 1
/**
 * 创建Message实例
 */
const Message = (options) => {
  const id = 'message-' + nId++
  options = options || {}
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  const MessageInstance = new MessageConstructor({
    data: options
  })
  MessageInstance.$vuetify = new Vuetify().framework
  MessageInstance.id = id
  MessageInstance.vm = MessageInstance.$mount() // 挂载但是并未插入dom，是一个完整的Vue实例
  MessageInstance.vm.visible = true
  MessageInstance.dom = MessageInstance.vm.$el
  document.body.appendChild(MessageInstance.dom) // 将dom插入body
  MessageInstance.dom.style.zIndex = id // 后插入的Message组件z-index加一，保证能盖在之前的上面
  return MessageInstance.vm
}
/**
 * 创建四种常用message，使用方法message.success('your message')
 */
['success', 'warning', 'info', 'error'].forEach(type => {
  Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return Message(options)
  }
})

export default Message
