<template>
  <v-app>
    <v-carousel
      v-model="carousel"
      :show-arrows="false"
      hide-delimiters
      hide-delimiter-background
      cycle
      style="position:fixed;top:0;bottom:0;right:0;left:0;z-index:0;"
      height="100%"
    >
      <v-carousel-item
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
      >
        <div style="position:fixed;top: 60%;left: 20%" class="font-weight-medium white--text text-h3">
          <p style="white-space: pre-wrap;line-height:125%">{{ item.text }}</p>
        </div>
      </v-carousel-item>
    </v-carousel>
    <v-app-bar
      color="rgba(0,0,0,0)"
      app
      dense
      elevation="0"
    >
      <div
        @click="$router.push('/')"
        style="cursor: pointer"
      >
        <v-img :src="require('../../assets/logo2.svg')"></v-img>
      </div>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height">
        <v-row justify="end" :class="$vuetify.breakpoint.mobile? 'align-self-start': 'align-self-center'">
          <v-col cols="12" sm="6" md="6" lg="4" xl="3">
            <v-card elevation="1">
              <v-card-title class="text-h5 font-weight-medium">{{ currentTitle }}</v-card-title>
              <v-window v-model="step">
                <v-window-item :value="accountApi.step.FORGET">
                  <i-forget ref="forgetRef" @setStep="setStep"></i-forget>
                </v-window-item>
                <v-window-item :value="accountApi.step.LOGIN">
                  <i-login ref="loginRef"></i-login>
                </v-window-item>
                <v-window-item :value="accountApi.step.REGISTER">
                  <i-register ref="registerRef" @setStep="setStep"></i-register>
                </v-window-item>
              </v-window>
              <v-card-actions>
                <v-row dense>
                  <v-col>
                    <v-btn
                      text
                      :color="preColor"
                      @click="preGo()"
                    >{{preText}}</v-btn>
                  </v-col>
                  <v-col
                    class="text-end"
                  >
                    <v-btn
                      text
                      :color="nxtColor"
                      @click="nxtGo()"
                    >{{nxtText}}</v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-sheet height="64px">
        <v-container class="fill-height">
          <v-row align="center" justify="center" class="text-center">
            <v-col class="pa-0">
              <v-btn @click="downloadApp" color="grey-light" elevation="0" height="48px" width="48px" outlined x-small>
                <div>
                  <v-icon>mdi-android</v-icon>
                  <div>安卓</div>
                </div>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script>
import iLogin from '@/components/iLogin'
import iForget from '@/components/iForget'
import iRegister from '@/components/iRegister'
import { mapState } from 'vuex'
import imageApi from '@/api/imageApi'
import accountApi from '@/api/accountApi'

export default {
  name: 'Login',
  components: {
    iLogin,
    iForget,
    iRegister
  },
  data () {
    return {
      accountApi: accountApi,
      step: accountApi.step.LOGIN,
      carousel: 0,
      items: imageApi.carousel,
      color: ['error', 'primary', 'primary'],
      text: ['忘记密码', '登录', '注册']
    }
  },
  watch: {
    step: function (val, oldVal) {
      if (val !== oldVal) {
        switch (oldVal) {
          case accountApi.step.FORGET:
            this.$refs.forgetRef.reset()
            break
          case accountApi.step.LOGIN:
            this.$refs.loginRef.reset()
            break
          case accountApi.step.REGISTER:
            this.$refs.registerRef.reset()
            break
        }
      }
    }
  },
  computed: {
    ...mapState(['token']),
    preColor () {
      return this.color[(this.step + this.color.length - 1) % this.color.length]
    },
    nxtColor () {
      return this.color[(this.step + 1) % this.color.length]
    },
    preText () {
      return this.text[(this.step + this.text.length - 1) % this.text.length]
    },
    nxtText () {
      return this.text[(this.step + 1) % this.text.length]
    },
    currentTitle () {
      return this.text[this.step]
    }
  },
  created () {
    window.addEventListener('keydown', this.keyDown)
  },
  destroyed () {
    window.removeEventListener('keydown', this.keyDown)
  },
  methods: {
    downloadApp () {
      window.open('https://gitee.com/heguangfu/picture-bed/raw/master/SpeedCloud.apk', '_blank')
    },
    keyDown (e) {
      if (e.key === 'Enter' && this.step === accountApi.step.LOGIN) {
        this.$refs.loginRef.login()
      }
    },
    setStep (step) {
      this.step = step
    },
    preGo () {
      this.step = (this.step + this.color.length - 1) % this.color.length
    },
    nxtGo () {
      this.step = (this.step + 1) % this.color.length
    }
  }
}
</script>

<style scoped>

</style>
