<template>
  <v-form ref="registerFormRef">
    <v-card-text class="pb-0">
      <v-text-field
        v-model="registerForm.username"
        label="昵称"
        prepend-icon="mdi-account"
        outlined
        :rules="ruleApi.usernameRules"
        autocomplete
        dense
      ></v-text-field>
      <v-form ref="emailRef">
        <v-text-field
          v-model="registerForm.email"
          label="邮箱"
          prepend-icon="mdi-email"
          outlined
          :rules="ruleApi.emailRules"
          autocomplete
          dense
        ></v-text-field>
      </v-form>
      <v-input
        v-model="registerForm.code"
        prepend-icon="mdi-counter"
        :rules="ruleApi.codeRules"
        class="align-baseline mb-2"
        dense
      >
        <template v-slot:default>
          <v-otp-input
            v-model="registerForm.code"
            length="6"
            type="number"
            plain
          ></v-otp-input>
        </template>
        <template v-slot:append>
          <v-btn
            color="primary"
            @click="sendCode"
            elevation="0"
            outlined
            :loading="sendCodeStatus === 1"
            :disabled="sendCodeStatus === 2"
            width="104px"
            class="text-caption font-weight-medium"
          >{{sendCodeStatus === 2 ? countdown + 's 后重新获取' : '发送验证码' }}</v-btn>
        </template>
      </v-input>
<!--      <v-text-field
        v-model="registerForm.code"
        label="验证码"
        prepend-icon="mdi-counter"
        :rules="ruleApi.codeRules"
        outlined
        dense
      >
        <template v-slot:append>
          <v-btn
            color="primary"
            @click="sendCode"
            elevation="0"
            text
            height="24px"
            :loading="sendCodeStatus === 1"
            :disabled="sendCodeStatus === 2"
          >{{sendCodeStatus === 2 ? countdown + 's 后重新获取' : '发送验证码' }}</v-btn>
        </template>
      </v-text-field>-->
      <v-text-field
        v-model="registerForm.pwd"
        label="密码（6-16位，只能包含数字、字母或下划线）"
        outlined
        prepend-icon="mdi-lock"
        :append-icon="pwdShow1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="pwdShow1 ? 'text' : 'password'"
        @click:append="pwdShow1 = !pwdShow1"
        :rules="ruleApi.pwdRules"
        autocomplete
        dense
      ></v-text-field>
      <v-text-field
        v-model="registerForm.rPwd"
        label="重复密码"
        outlined
        prepend-icon="mdi-lock"
        :append-icon="pwdShow2 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="pwdShow2 ? 'text' : 'password'"
        @click:append="pwdShow2 = !pwdShow2"
        :rules="[pwdRepeated]"
        autocomplete
        dense
      ></v-text-field>
      <v-btn
        @click="register"
        elevation="1"
        large
        color="primary"
        :loading="submitRegisterStatus"
        block
      >注册</v-btn>
    </v-card-text>
  </v-form>
</template>

<script>
import accountApi from '@/api/accountApi'
import ruleApi from '@/api/ruleApi'
export default {
  name: 'iRegister',
  data () {
    return {
      ruleApi: ruleApi,
      registerForm: {
        username: '',
        email: '',
        code: '',
        pwd: '',
        rPwd: ''
      },
      pwdShow1: false,
      pwdShow2: false,
      submitRegisterStatus: false,
      sendCodeStatus: 0, // 三种状态，0->可发送验证码，1->正在发送验证码，2->发送验证码成功
      countdown: 0,
      timer: null
    }
  },
  methods: {
    reset () {
      this.$refs.registerFormRef.resetValidation()
      this.$refs.emailRef.resetValidation()
      this.registerForm.username = ''
      this.registerForm.email = ''
      this.registerForm.code = ''
      this.registerForm.pwd = ''
      this.registerForm.rPwd = ''
    },
    pwdRepeated () {
      return this.registerForm.pwd === this.registerForm.rPwd || '两次输入的密码必须相同'
    },
    countTime () {
      if (this.countdown === 0) {
        this.sendCodeStatus = 0
        clearInterval(this.timer)
      } else --this.countdown
    },
    validate () {
      return this.$refs.registerFormRef.validate() && this.$refs.emailRef.validate()
    },
    sendCode () {
      if (!this.$refs.emailRef.validate() || this.sendCodeStatus) return
      this.sendCodeStatus = 1
      accountApi.sendCode(this.registerForm.email, accountApi.codeType.REGISTER)
        .then((r) => {
          this.sendCodeStatus = 2
          this.countdown = 60
          this.timer = setInterval(() => { this.countTime() }, 1000)
        })
        .catch(() => {
          this.sendCodeStatus = 0
        })
    },
    register () {
      if (!this.validate() || this.submitRegisterStatus) return
      this.submitRegisterStatus = true
      accountApi.register(this.registerForm)
        .then((r) => {
          this.submitRegisterStatus = false
          this.$message.success('注册成功')
          this.$emit('setStep', accountApi.step.LOGIN)
        })
        .catch(() => {
          this.submitRegisterStatus = false
        })
    }
  }
}
</script>

<style scoped>

</style>
