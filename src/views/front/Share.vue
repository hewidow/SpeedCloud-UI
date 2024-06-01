<template>
  <v-app>
    <v-progress-linear
      value="100"
      height="3"
      indeterminate
      v-if="bodyLoading === 0"
    ></v-progress-linear>
    <v-img
      :src="backgroundImageUrl"
      contain
      style="position:fixed;top:0;bottom:0;right:0;left:0;z-index:0;"
      v-if="bodyLoading === 1"
    ></v-img>
    <v-img
      :src="require('../../assets/logo3.svg')"
      contain
      :style="$vuetify.breakpoint.mobile ? 'position:fixed;top:10%;bottom:0;right:0;left:25%;z-index:0;width:50%;height:96px' : 'position:fixed;top:10%;bottom:0;right:0;left:41%;z-index:0;width:18%;height:96px'"
      v-if="bodyLoading === 1"
    ></v-img>
    <i-app-bar
      is-not-opacity
      v-if="bodyLoading === 2"
    >
      <template v-slot:menu>
        <i-user-panel v-if="token"></i-user-panel>
        <v-btn
          text
          @click="$router.push('/account')"
          v-else
        >登录/注册</v-btn>
      </template>
    </i-app-bar>
    <v-main v-if="bodyLoading === 1">
      <v-container class="fill-height">
        <v-row justify="center" align="center">
          <v-col cols="12" md="4" sm="6">
            <v-card outlined>
              <v-card-title style="background: linear-gradient(135deg, #8EC5FC, #E0C3FC)">
                <v-avatar
                  color="blue"
                  size="48"
                >
                  <span class="white--text text-h4">{{ sharer.name.slice(0,1).toUpperCase() }}</span>
                </v-avatar>
                <p class="ml-3 white--text">{{ sharer.name }}</p>
              </v-card-title>
              <v-card-text>
                <p class="my-4 font-weight-bold">请输入提取码：</p>
                <v-otp-input
                  style="width: 70%"
                  class="mx-auto"
                  length="4"
                  v-model="code"
                  :disabled="otpLoading !== 0"
                  @finish="submitExtractionCode"
                ></v-otp-input>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="white--text"
                  rounded
                  elevation="0"
                  :disabled="code.length < 4"
                  :fab="otpLoading !== 0"
                  :block="otpLoading === 0"
                  width="36"
                  height="36"
                  :otpLoading="otpLoading === 1"
                  :color="btnColor"
                  @click="submitExtractionCode"
                  style="transition: .5s"
                >
                  <span v-if="otpLoading === 0">提取文件</span>
                  <v-icon v-if="otpLoading === 2">mdi-check-bold</v-icon>
                  <v-icon v-if="otpLoading === 3">mdi-close-thick</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-main v-if="bodyLoading === 2" style="background-color: #EEEEEE">
      <v-container fluid>
        <v-row>
          <v-col cols="12" class="pa-2">
            <v-card elevation="1" class="px-1 pt-1">
              <i-file-browser
                :selected.sync="selected"
                :headers="headers"
                :headers-mobile="headersMobile"
                :desserts="desserts"
                :loading="fileBrowserLoading"
                :no-data-text="noDataText"
                :other-height="48+16"
                hide-search
                @goPath="goPath"
              >
                <template v-slot:top>
                  <v-row dense>
                    <v-col cols="auto">
                      <v-spacer></v-spacer>
                      <i-save :ids="selectedId" :share-id="shareId"></i-save>
                    </v-col>
                  </v-row>
                </template>
              </i-file-browser>
            </v-card>
          </v-col>
<!--          <v-col cols="2" class="pa-2">
            <v-card elevation="1" class="px-1 pt-1" height="100%" style="background: linear-gradient(135deg, #8EC5FC, #E0C3FC)">
              <v-card-title class="justify-center mt-4">
                <v-avatar
                  color="blue"
                  size="48"
                >
                  <span class="white&#45;&#45;text text-h4">{{ sharer.name.slice(0,1) }}</span>
                </v-avatar>
              </v-card-title>
              <v-card-subtitle>
                <p class="white&#45;&#45;text text-h6 font-weight-medium text-center mt-4">{{ sharer.name }}</p>
              </v-card-subtitle>
            </v-card>
          </v-col>-->
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { fileApi } from '@/api/fileApi'
import imageApi from '@/api/imageApi'
import { mapState } from 'vuex'
import iUserPanel from '@/components/iUserPanel'
import iFileBrowser from '@/components/iFileBrowser'
import iSave from '@/components/iSave'
import iAppBar from '@/components/iAppBar'

export default {
  name: 'Share',
  components: {
    iUserPanel,
    iFileBrowser,
    iSave,
    iAppBar
  },
  data () {
    return {
      backgroundImageUrl: imageApi.shareBackground,
      bodyLoading: 0,
      sharer: {
        name: 'test'
      },
      otpLoading: 0,
      code: '',
      shareId: this.$route.query.id,
      headers: [
        {
          text: '文件名',
          value: 'name',
          filterable: true
        },
        {
          text: '大小',
          value: 'size',
          filterable: false
        },
        {
          text: '修改日期',
          value: 'date',
          filterable: false
        }
      ],
      headersMobile: [
        {
          text: '文件名',
          value: 'name',
          filterable: true
        },
        {
          text: '大小',
          value: 'size',
          filterable: false
        }
      ],
      desserts: [],
      selected: [],
      fileBrowserLoading: false,
      noDataText: '你来迟了，文件已经不见啦~'
    }
  },
  computed: {
    ...mapState(['token']),
    btnColor () {
      switch (this.otpLoading) {
        case 2:
          return 'success'
        case 3:
          return 'error'
        default:
          return 'blue'
      }
    },
    selectedId () {
      return this.selected.map(item => item.id)
    }
  },
  created () {
    if (this.shareId) {
      this.bodyLoading = 0
      fileApi.getSharer(this.shareId)
        .then((r) => {
          this.sharer.name = r.data.data.username
          const extractionCode = this.getLocalStorageCode(this.shareId)
          if (extractionCode) {
            fileApi.checkExtractionCode(this.shareId, extractionCode)
              .then((r) => {
                this.bodyLoading = 2
                this.desserts = fileApi.formatFilesData(r.data.data)
              })
              .catch((e) => {
                this.bodyLoading = 1
              })
          } else this.bodyLoading = 1
        })
        .catch((e) => {
          this.$router.push('/404')
        })
    } else {
      this.$router.push('/404')
    }
  },
  methods: {
    /**
     * @function
     * @param {String} id 分享链接id
     * @description 获取本地输入提取码历史
     * @returns {String} 提取码
     */
    getLocalStorageCode (id) {
      const share = localStorage.getItem('share') ? JSON.parse(localStorage.getItem('share')) : {}
      return share[id]
    },
    async submitExtractionCode () {
      this.otpLoading = 1
      fileApi.checkExtractionCode(this.shareId, this.code)
        .then((r) => {
          this.otpLoading = 2
          const share = localStorage.getItem('share') ? JSON.parse(localStorage.getItem('share')) : {}
          share[this.shareId] = this.code
          localStorage.setItem('share', JSON.stringify(share))
          this.bodyLoading = 2
          this.desserts = fileApi.formatFilesData(r.data.data)
        })
        .catch((e) => {
          this.otpLoading = 3
          setTimeout(() => {
            this.otpLoading = 0
          }, 1000)
        })
    },
    goPath (data) {
      this.loading = true
      if (data.id === 1) {
        this.noDataText = '你来迟了，文件已经不见啦~'
        const extractionCode = this.getLocalStorageCode(this.shareId)
        fileApi.checkExtractionCode(this.shareId, extractionCode)
          .then((r) => {
            this.loading = false
            this.desserts = fileApi.formatFilesData(r.data.data)
          })
          .catch((e) => {
            this.loading = false
          })
      } else {
        this.noDataText = '该目录下没有文件'
        fileApi.goSharePath(this.shareId, data.id)
          .then((r) => {
            this.loading = false
            this.desserts = fileApi.formatFilesData(r.data.data)
          })
          .catch((e) => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style>
.v-progress-linear__indeterminate {
  background: linear-gradient(135deg, rgb(142, 197, 252), rgb(224, 195, 252));
}
</style>
