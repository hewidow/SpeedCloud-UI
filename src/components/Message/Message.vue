<template>
  <v-app style="height: 0;width: 0">
<!--    vuetify组件需要v-app包裹才能生效-->
    <v-snackbar
      v-model="visible"
      :color="typeColor[type]"
      elevation="0"
      :timeout="duration"
    >
      <v-icon>
        {{ typeIcon[type] }}
      </v-icon>
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          @click="visible = false"
          text
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'Message',
  data () {
    return {
      visible: false, // 是否可见
      type: 'info', // message 类型
      message: '', // 信息
      duration: 3000, // 关闭时长(ms)
      typeColor: {
        info: '#2196F3',
        error: '#FF5252',
        warning: '#FFC107',
        success: '#4CAF50'
      }, // 不同类型的颜色
      typeIcon: {
        info: 'mdi-information-outline',
        error: 'mdi-close-circle-outline',
        warning: 'mdi-alert-circle-outline',
        success: 'mdi-check-circle-outline'
      } // 不同类型的图标
    }
  },
  mounted () {
    this.remove() // 挂载的时候开始计时
  },
  methods: {
    remove () {
      setTimeout(() => {
        this.$destroy()
        this.$el.parentNode.removeChild(this.$el)
      }, this.duration + 500) // 延迟0.5s从DOM中移除
    }
  }
}
</script>

<style scoped>

</style>
