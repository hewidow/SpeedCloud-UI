<template>
  <i-file-browser
    :selected.sync="selected"
    :headers="headers"
    :headers-mobile="headersMobile"
    :desserts="desserts"
    :loading="loading"
    :other-height="48+24"
    @goPath="goPath"
    @goPlay="goPlay"
    @goPhoto="goPhoto"
    ref="fileBrowserRef"
  >
    <template v-slot:top>
      <v-row dense class="ma-0">
        <v-col cols="auto">
          <i-upload @openUpDownPanel="openUpDownPanel"></i-upload>
        </v-col>
        <v-col cols="auto">
          <i-file-operations :items="selected" @refreshData="refreshData"></i-file-operations>
        </v-col>
      </v-row>
    </template>
  </i-file-browser>
</template>

<script>
import { fileApi } from '@/api/fileApi'
import iFileBrowser from '@/components/iFileBrowser'
import iUpload from '@/components/iUpload'
import iFileOperations from '@/components/iFileOperations'
import Viewer from 'viewerjs'
import { mapState } from 'vuex'

export default {
  name: 'All',
  components: {
    iFileBrowser,
    iUpload,
    iFileOperations
  },
  data () {
    return {
      loading: false,
      selected: [],
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
      desserts: [
        /*
        {
          id: 1,
          name: 'Frozen Yogurt',
          size: 159,
          date: '2021/10/18 13:25',
          suffix: 'exe',
          suffixIcon: {
            name: 'mdi-music',
            color: 'primary'
          },
          sizeText: '159B'
        },
        {
          id: 2,
          name: '我的资源',
          size: 123123213,
          date: '2021/10/18',
          suffix: 'folder'
        }
        */
      ]
    }
  },
  computed: {
    ...mapState(['token'])
  },
  methods: {
    openUpDownPanel (files) {
      this.$emit('openUpDownPanel', files)
    },
    goPath (data) {
      this.loading = true
      fileApi.goPath(data.id)
        .then((r) => {
          this.loading = false
          this.desserts = fileApi.formatFilesData(r.data.data)
        })
        .catch((e) => {
          this.loading = false
        })
    },
    goPlay (data) {
      const play = this.$router.resolve({
        path: '/play',
        query: {
          id: data.id,
          name: data.name,
          type: data.type
        }
      })
      window.open(play.href, '_blank') // 打开一个新的标签页
    },
    goPhoto (data) {
      const image = new Image()
      image.src = fileApi.play(this.token, data.id)
      image.alt = data.name
      const viewer = new Viewer(image, {
        keyboard: false,
        navbar: false,
        toolbar: {
          zoomIn: true,
          zoomOut: true,
          oneToOne: true,
          reset: true,
          prev: false,
          play: true,
          next: false,
          rotateLeft: true,
          rotateRight: true,
          flipHorizontal: true,
          flipVertical: true
        },
        hidden: () => {
          viewer.destroy()
        }
      })
      viewer.show()
    },
    refreshData (data) {
      this.$refs.fileBrowserRef.goPath(data)
    }
  }
}
</script>

<style scoped>
</style>
