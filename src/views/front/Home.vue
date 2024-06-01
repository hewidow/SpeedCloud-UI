<template>
  <v-app>
    <i-background-image :src="this.$vuetify.theme.themes.light.backgroundImage"></i-background-image>
    <v-navigation-drawer
      clipped
      app
      width="208"
      :style="{backgroundColor: $vuetify.breakpoint.mobile?this.$vuetify.theme.themes.light.navMobile:this.$vuetify.theme.themes.light.nav}"
      class="navText--text"
    >
      <v-list
        nav
        dense
        :dark="this.$vuetify.theme.themes.light.listTextDark === 1"
      >
        <v-list-group
          :value="true"
          no-action
          prepend-icon="mdi-folder"
          color="navTextActive"
        >
          <template v-slot:activator>
            <v-list-item-title>我的文件</v-list-item-title>
          </template>
          <v-list-item
            v-for="(file, id) in files"
            :key="id"
            :to="file.to"
          >
            <v-list-item-title>{{ file.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-item
          v-for="(item ,id) in items"
          :key="id"
          :to="item.to"
          color="navTextActive"
        >
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-title>回收站</v-list-item-title>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-container>
          <v-row dense>
            <v-col>
              <v-progress-linear
                color="blue"
                :value="progressValue"
                rounded
                height="9"
              ></v-progress-linear>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 text-caption font-weight-medium">{{ fileApi.toSizeText(userData.totalSize - userData.availableSize) }} / {{ fileApi.toSizeText(userData.totalSize) }}</v-col>
          </v-row>
        </v-container>
      </template>
    </v-navigation-drawer>
    <i-app-bar
      clipped-left
    >
      <template v-slot:menu>
        <i-user-panel></i-user-panel>
        <i-up-down-panel ref="upDownPanelRef"></i-up-down-panel>
        <i-theme></i-theme>
      </template>
    </i-app-bar>
    <v-main style="background-color: #EEEEEE">
      <v-card class="ma-2 pa-1" elevation="1" :style="{ 'height': cardHeight }">
        <router-view @openUpDownPanel="openUpDownPanel"></router-view>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import iBackgroundImage from '@/components/iBackgroundImage'
import iAppBar from '@/components/iAppBar'
import iUpDownPanel from '@/components/iUpDownPanel'
import iTheme from '@/components/iTheme'
import iUserPanel from '@/components/iUserPanel'
import { fileApi } from '@/api/fileApi'
import { mapMutations } from 'vuex'

export default {
  name: 'Home',
  components: {
    iBackgroundImage,
    iAppBar,
    iUpDownPanel,
    iTheme,
    iUserPanel
  },
  data () {
    return {
      fileApi: fileApi,
      files: [
        {
          title: '全部文件',
          to: 'all'
        },
        {
          title: '图片',
          to: 'photo'
        },
        {
          title: '音乐',
          to: 'music'
        },
        {
          title: '视频',
          to: 'video'
        }
      ],
      items: [
        {
          title: '回收站',
          to: 'recycle'
        }
      ],
      cardHeight: 0
    }
  },
  computed: {
    userData () {
      return this.$store.state.userData || {
        username: 'test',
        email: 'test@qq.com',
        totalSize: 10,
        availableSize: 6,
        themeId: 0
      }
    },
    progressValue () {
      return (100 * (this.userData.totalSize - this.userData.availableSize) / this.userData.totalSize).toFixed(0)
    }
  },
  beforeRouteLeave (to, from, next) {
    if (sessionStorage.getItem('uploadDone') && !JSON.parse(sessionStorage.getItem('uploadDone'))) {
      const answer = window.confirm('还有未完成的上传任务，确定退出？')
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else next()
  },
  created () {
    sessionStorage.setItem('uploadDone', JSON.stringify(true))
    window.addEventListener('beforeunload', this.beforeUnload)
    fileApi.getUserData()
      .then((r) => {
        this.setUserData({
          username: r.data.data.username,
          email: r.data.data.email,
          totalSize: r.data.data.totalSize,
          availableSize: r.data.data.availableSize
        })
      })
      .catch((e) => {
      })
  },
  mounted () {
    window.addEventListener('resize', this.calcCardHeight)
    this.calcCardHeight()
  },
  destroyed () {
    window.removeEventListener('resize', this.calcCardHeight)
    window.removeEventListener('beforeunload', this.beforeUnload)
  },
  methods: {
    ...mapMutations(['setUserData']),
    beforeUnload (e) {
      e = e || window.event
      if (e && sessionStorage.getItem('uploadDone') && !JSON.parse(sessionStorage.getItem('uploadDone'))) {
        e.returnValue = true
      }
      return '好像这个return没什么用'
    },
    openUpDownPanel (files) {
      this.$refs.upDownPanelRef.open(files)
    },
    calcCardHeight () {
      this.cardHeight = (window.innerHeight - 48 - 16 - 1) + 'px' // -1是为了避免总体像素有小数点，向上取整导致window.innerHeight算多了出现页面滚动条
    }
  }
}
</script>

<style scoped>
</style>
