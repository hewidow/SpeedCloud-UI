<template>
  <v-form ref="loginFormRef">
    <v-card-text class="pb-0">
      <v-text-field
        v-model="loginForm.user"
        label="用户名"
        prepend-icon="mdi-account"
        outlined
        :rules="ruleApi.usernameRules"
        autocomplete
        dense
      ></v-text-field>
      <v-text-field
        v-model="loginForm.pwd"
        label="密码"
        outlined
        prepend-icon="mdi-lock"
        :append-icon="pwdShow ? 'mdi-eye' : 'mdi-eye-off'"
        :type="pwdShow ? 'text' : 'password'"
        @click:append="pwdShow = !pwdShow"
        :rules="ruleApi.pwdRules"
        autocomplete
        dense
      ></v-text-field>
      <v-btn
        @click="login"
        elevation="1"
        large
        color="primary"
        :loading="submitLoginStatus"
        block
      >登录</v-btn>
    </v-card-text>
  </v-form>
</template>

<script>
import { mapMutations } from 'vuex'
import accountApi from '@/api/accountApi'
import ruleApi from '@/api/ruleApi'
import themeApi from '@/api/themeApi'

export default {
  name: 'iLogin',
  data () {
    return {
      ruleApi: ruleApi,
      loginForm: {
        user: '',
        pwd: ''
      },
      pwdShow: false,
      submitLoginStatus: false
    }
  },
  methods: {
    ...mapMutations(['setLoginState']),
    reset () {
      this.$refs.loginFormRef.resetValidation()
      this.loginForm.user = ''
      this.loginForm.pwd = ''
    },
    login () {
      if (!this.$refs.loginFormRef.validate() || this.submitLoginStatus) return
      this.submitLoginStatus = true
      accountApi.login(this.loginForm)
        .then((r) => {
          this.submitLoginStatus = false
          this.setLoginState({
            token: r.data.data.token,
            userData: {
              username: r.data.data.userDetail.username,
              email: r.data.data.userDetail.email,
              totalSize: r.data.data.userDetail.totalSize,
              availableSize: r.data.data.userDetail.availableSize,
              themeId: r.data.data.userDetail.theme
            },
            themes: themeApi.themes // 可从服务器获取主题r.data.data.themes
          })
          Object.assign(this.$vuetify.theme.themes.light, themeApi.themes[r.data.data.userDetail.theme]) // vuetify设置主题方式
          const beforeRouter = JSON.parse(sessionStorage.getItem('beforeRouter'))
          if (beforeRouter !== '/' && beforeRouter !== '/account') this.$router.push(beforeRouter)
          else this.$router.push('/home') // 根据上一层router决定登录后跳转到home还是返回上一层router
        })
        .catch(() => {
          this.submitLoginStatus = false
        })
    }
  }
}
</script>

<style scoped>

</style>
