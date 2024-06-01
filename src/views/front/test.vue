<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <input type="file" id="files" ref="filesRef" multiple webkitdirectory>上传
          <v-btn @click="upload">上传</v-btn>
          <input type="file" id="file" ref="fileRef" multiple>上传
          <v-btn @click="upload">上传</v-btn>
          <v-btn @click="clear">清空</v-btn>
          <v-icon color="rgb(33,115,70)">mdi-microsoft-excel</v-icon>
          <v-btn @click="showMenu = true" icon ref="hgf">open menu</v-btn>
          <v-card color="black">
            <i aria-hidden="true" class="v-icon mdi mdi-lightbulb-on white--text"></i>
          </v-card>
          <v-menu
            v-model="showMenu"
            bottom
            offset-y
            max-width="100"
            :close-on-content-click="false"
          >
            <v-list>
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { fileApi } from '@/api/fileApi'
import SparkMD5 from 'spark-md5'

export default {
  name: 'test',
  data () {
    return {
      snackbar: false,
      options: {
        inline: false,
        button: true,
        navbar: false,
        title: false,
        toolbar: true,
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: true,
        fullscreen: true,
        keyboard: true
      },
      images: [
        'https://picsum.photos/200/200',
        'https://picsum.photos/300/200',
        'https://picsum.photos/250/200'
      ],
      showPhoto: false,
      items: [
        { title: 'Click 12412412412411111Me' },
        { title: 'Click12412412412411111Me12412412412411111Me Me' },
        { title: 'Click12412412412411111Me12412412412411111Me Me' },
        { title: 'Click12412412412411111Me12412412412411111Me12412412412411111Me12412412412411111Me12412412412411111Me Me 2' }
      ],
      showMenu: false,
      loading: 0,
      select: [1, 2],
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
      open: [],
      active: [],
      selectedItem: 0,
      percent: 0,
      ff: null,
      x: 0,
      y: 0
    }
  },
  created () {
    window.vue = this
  },
  mounted () {
  },
  methods: {
    show () {
    },
    ccc () {
      this.$message.success('123')
    },
    test () {
      const source = this.$axios.CancelToken.source()
      console.log(source)
      this.$axios.post('check', 'e60ebcd145a609ee03d14a9febeb6236', {
        cancelToken: source.token
      })
    },
    createChunk (file) {
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      const chunks = Math.ceil(file.size / fileApi.chunkSize)
      let currentChunk = 0
      const spark = new SparkMD5.ArrayBuffer()
      const fileReader = new FileReader()
      const chunkList = []
      fileReader.onload = function (e) {
        // console.log('read chunk nr', currentChunk + 1, 'of', chunks)
        chunkList.push(e.target.result)
        spark.append(e.target.result)
        currentChunk++
        if (currentChunk < chunks) {
          loadNext()
        } else {
          // console.log(chunkList, spark.end())
          return {
            chunkList: chunkList,
            md5: spark.end()
          }
          // console.log('finished loading')
          // console.info('computed hash', )
        }
      }
      fileReader.onerror = function () {
        console.warn('oops, something went wrong.')
      }

      function loadNext () {
        const start = currentChunk * fileApi.chunkSize
        const end = ((start + fileApi.chunkSize) >= file.size) ? file.size : start + fileApi.chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
      }

      loadNext()
    },
    getToken () {
      const CancelToken = this.$axios.CancelToken
      const source = CancelToken.source()
      console.log(source, 1)
      console.log(source.token, 2)
    },
    upload () {
      const ff = this.$refs.filesRef.files
      // this.createChunk(ff[0])
      console.log(ff)
      /*
      const formData = new FormData()
      for (let i = 0; i < ff.length; ++i) {
        formData.append('file', ff[i])
      }
      formData.append('userId', '123')
      formData.append('parentId', '/')
      fileApi.upload(formData, this.$axios.CancelToken.source().token, (progressEvent) => {
        const completeVal = (progressEvent.loaded / progressEvent.total) * 100 || 0
        console.log(progressEvent.loaded, progressEvent.total)
        this.percent = completeVal
      })
        .then((res) => {
          console.log(res)
        })
        .catch((r) => {
          console.log(r)
        })
        */
    },
    clear () {
      console.log(this.$refs.fileRef)
      this.$refs.fileRef.value = ''
    }
  }
}
</script>

<style scoped>

</style>
