<template>
  <v-app>
    <i-app-bar is-not-opacity>
      <template v-slot:menu>
        <i-user-panel v-if="token"></i-user-panel>
        <v-btn
          text
          @click="$router.push('/account')"
          v-else
        >登录/注册</v-btn>
      </template>
    </i-app-bar>
    <v-main style="background-color: #EEEEEE">
      <v-container class="fill-height align-content-center">
        <v-row>
          <v-col class="text-center">
            <v-img
              src="https://gitee.com/heguangfu/picture-bed/raw/master/200.webp"
              height="200px"
              width="200px"
              class="mx-auto"
            ></v-img>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center">
            <span class="font-weight-bold text-h1">404</span>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import iAppBar from '@/components/iAppBar'
import iUserPanel from '@/components/iUserPanel'
import { mapState } from 'vuex'
export default {
  name: 'NotFound',
  components: {
    iAppBar,
    iUserPanel
  },
  computed: {
    ...mapState(['token'])
  }
}
</script>

<style scoped>

</style>
