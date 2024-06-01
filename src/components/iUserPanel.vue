<template>
  <v-menu
    bottom
    min-width="150px"
    rounded
    offset-y
    open-on-hover
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
      >
        <v-avatar
          color="blue"
          size="36"
        >
          <span class="white--text text-h5">{{ userData.username.slice(0,1).toUpperCase() }}</span>
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-list-item-content class="justify-center">
        <div class="mx-auto text-center">
          <v-avatar
            color="blue"
          >
            <span class="white--text text-h5">{{ userData.username.slice(0,1).toUpperCase() }}</span>
          </v-avatar>
          <h3 class="my-2">{{ userData.username }}</h3>
          <p class="text-caption mt-1">
            {{ userData.email }}
          </p>
          <!--              <v-divider class="my-2"></v-divider>
                        <v-btn
                          depressed
                          rounded
                          text
                        >
                          编辑账户
                        </v-btn>-->
          <v-divider class="my-2"></v-divider>
          <v-btn
            depressed
            rounded
            text
            @click="checkLogout"
          >
            退出登录
          </v-btn>
        </div>
      </v-list-item-content>
    </v-card>
  </v-menu>
</template>

<script>
import { mapMutations } from 'vuex'
import themeApi from '@/api/themeApi'
import accountApi from '@/api/accountApi'

export default {
  name: 'iUserPanel',
  computed: {
    userData () {
      return this.$store.state.userData || {
        username: 'test',
        email: 'test@qq.com'
      }
    }
  },
  methods: {
    ...mapMutations(['setLoginState']),
    checkLogout () {
      if (sessionStorage.getItem('uploadDone') && !JSON.parse(sessionStorage.getItem('uploadDone'))) {
        const answer = window.confirm('还有未完成的上传任务，确定退出？')
        if (answer) this.logout()
      } else this.logout()
    },
    logout () {
      accountApi.logout()
      this.setLoginState(null)
      Object.assign(this.$vuetify.theme.themes.light, themeApi.themes[0])
      this.$router.push('/account')
    }
  }
}
</script>

<style scoped>

</style>
