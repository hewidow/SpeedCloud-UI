<template>
  <v-menu
    bottom
    offset-y
    :close-on-content-click="false"
    :min-width="$vuetify.breakpoint.mobile ? '90%' : '500px'"
    :max-width="$vuetify.breakpoint.mobile ? '90%' : '500px'"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        ref="btnRef"
      >
        <v-icon color="barText">mdi-swap-vertical</v-icon>
      </v-btn>
    </template>
    <v-sheet class="pa-1">
      <v-card-title class="pa-2">
        上传完成（{{ files.filter(item => fileApi.isInAfterUpload(item.state)).length + '/' + files.length }}）
      </v-card-title>
      <v-divider class="pb-1"></v-divider>
      <v-card class="pa-0 overflow-y-auto" max-height="300px" elevation="0">
        <v-card-text class="pa-0">
          <div v-if="files.length === 0" class="text-center pa-2">
            <span>暂时还没有要上传的文件呢~</span>
          </div>
          <v-list v-else>
            <v-list-item
              v-for="(item,id) in files"
              :key="id"
            >
              <v-list-item-avatar>
                <v-icon :color="item.suffixIcon.color">{{ item.suffixIcon.name }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  <v-progress-linear
                    :value="Math.floor(item.loaded / item.size * 100)"
                    class="my-2"
                    stream
                    buffer-value="0"
                    v-if="fileApi.isInUpload(item.state)"
                  ></v-progress-linear>
                  <v-row>
                    <v-col class="text-start">{{ fileApi.toSizeText(item.size) }}</v-col>
                    <v-col class="text-end primary--text" v-if="item.state === fileApi.state.UPLOAD">{{ fileApi.toSizeText(item.speed) }}/s</v-col>
                    <v-col class="text-end primary--text" v-else>{{ fileApi.getStateText(item.state) }}</v-col>
                  </v-row>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action v-if="!fileApi.isInAfterUpload(item.state)">
                <v-row>
                  <v-btn
                    icon
                    :disabled="!fileApi.isInUpload(item.state)"
                    @click="uploadContinue"
                    v-if="item.state === fileApi.state.PAUSE"
                  >
                    <v-icon color="primary">mdi-play-circle</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    :disabled="!fileApi.isInUpload(item.state)"
                    @click="uploadPause"
                    v-else
                  >
                    <v-icon color="primary">mdi-pause-circle</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    @click="cancel(id)"
                  >
                    <v-icon color="primary">mdi-close-circle</v-icon>
                  </v-btn>
                </v-row>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-sheet>
  </v-menu>
</template>

<!--suppress JSValidateJSDoc -->
<script>
import { fileApi } from '@/api/fileApi'
import SparkMD5 from 'spark-md5'
export default {
  name: 'iUpDownPanel',
  data () {
    return {
      fileApi: fileApi,
      files: [],
      currentCalcMD5: 0, // 当前正在计算MD5的下标，采取数组顺序存储，从前往后计算md5
      currentUpload: 0 // 当前正在上传的文件下标
    }
  },
  computed: {
    uploadDone () {
      return this.currentUpload >= this.files.length
    }// 是否上传完成
  },
  watch: {
    /**
     * @function
     * @param {Number} val 当前下标
     * @param {Number} oldVal 上一个下标
     * @description 完成后释放资源
     */
    currentUpload (val, oldVal) {
      if (oldVal < this.files.length) {
        this.files[oldVal].file = null
        this.files[oldVal].chunkList = []
        this.files[oldVal].chunkListMD5 = []
        this.files[oldVal].chunkListLoaded = []
        this.files[oldVal].source = null
      }
    },
    /**
     * @function
     * @description 在sessionStorage设置上传状态，在路由跳转时会根据此状态弹出再次确认的对话框
     */
    uploadDone () {
      sessionStorage.setItem('uploadDone', JSON.stringify(this.uploadDone))
    }
  },
  methods: {
    /**
     * @function
     * @param {Number} id 对应file的下标
     * @param {Number} state 文件状态
     * @description 设置文件状态
     */
    setFileState (id, state) {
      this.files[id].state = state
    },
    /**
     * @function
     * @param {Number} id 对应file的下标
     * @param {String} md5 md5码
     * @description 设置文件md5
     */
    setFileMD5 (id, md5) {
      this.files[id].md5 = md5
    },
    /**
     * @function
     * @param {Number} id 对应file的下标
     * @param {File[]} chunkList 分块二进制流
     * @param {String[]} chunkListMD5 分块二进制流md5
     * @description 设置分块二进制流和分块md5，并初始化分块上传进度为0，还初始化时间戳
     */
    setChunkList (id, chunkList, chunkListMD5) {
      this.files[id].chunkList = chunkList
      this.files[id].chunkListMD5 = chunkListMD5
      this.files[id].chunkListLoaded = new Array(chunkList.length).fill(0)
      this.files[id].befTimestamp = Date.now()
    },
    /**
     * @function
     * @param {Number} id 对应file的下标
     * @param {Number} idx 对应chunk的下标
     * @param {Number} loaded 该chunk当前已上传字节数
     * @description 设置文件上传进度
     */
    setFileProgress (id, idx, loaded) {
      if (this.files[id].chunkListLoaded[idx] < loaded) {
        this.files[id].loaded += loaded - this.files[id].chunkListLoaded[idx]
        this.files[id].chunkListLoaded[idx] = loaded
        const nowTimestamp = Date.now()
        if (nowTimestamp - this.files[id].befTimestamp >= 1000) { // 隔1秒更新一次速度
          this.files[id].speed = Math.floor((this.files[id].loaded - this.files[id].befLoaded) / (Date.now() - this.files[id].befTimestamp) * 1000)
          this.files[id].befTimestamp = nowTimestamp
          this.files[id].befLoaded = this.files[id].loaded
        }
      }
    },
    /**
     * @function
     * @param {Number} id 对应file的下标
     * @param {CancelTokenSource} source axios的CancelTokenSource
     * @description axios的CancelTokenSource
     */
    setSource (id, source) {
      this.files[id].source = source
    },
    /**
     * @function
     * @param {Number} id 对应file的下标
     * @description 取消上传
     */
    cancelUpload (id) {
      if (this.files[id].source) {
        this.files[id].source.cancel()
      }
    },
    /**
     * @function
     * @param {File[]} files input文件或文件夹
     * @description 打开此Panel并传入文件files，需要有个PointerEvent，没有会报错
     */
    open (files) {
      this.$refs.btnRef.$emit('click', new PointerEvent('', {}))
      for (const file of files) {
        this.uploadFile(file)
      }
    },
    /**
     * @function
     * @param {File} file input文件流
     * @description 将文件信息存入files
     */
    uploadFile (file) {
      this.files.push({
        file: file, // 文件流
        name: file.name, // 文件名
        suffixIcon: fileApi.getSuffixData(fileApi.getSuffix(file.name)).icon, // 根据后缀名生成相应图标
        speed: 0, // 上传速度
        chunkList: [], // 分块二进制流
        chunkListMD5: [], // 分块的md5
        chunkListLoaded: [], // 每个分块上传的字节数，初始为0
        md5: '', // 整体文件的md5
        loaded: 0, // 当前整体已经上传字节数
        size: file.size, // 文件总大小
        befLoaded: 0, // 上次已经上传的字节数，计算上传速度
        befTimestamp: 0, // 上次的时间戳，计算上传速度
        state: fileApi.state.WAIT, // 当前文件状态
        source: null // cancelToken的source
      })
      this.calcMD5()
    },
    /**
     * @function
     * @description 将从createChunk中获得的md5进行查询，判断是否能极速上传
     */
    calcMD5 () {
      while (this.currentCalcMD5 < this.files.length && !fileApi.isInCalcMD5(this.files[this.currentCalcMD5].state)) ++this.currentCalcMD5
      if (this.currentCalcMD5 < this.files.length && this.files[this.currentCalcMD5].state === fileApi.state.WAIT) {
        const id = this.currentCalcMD5
        this.setFileState(id, fileApi.state.CALC)
        const file = this.files[id].file
        this.createChunk(file, id, (chunkList, chunkListMD5, md5) => {
          this.setFileState(id, fileApi.state.REQUEST)
          this.setFileMD5(id, md5)
          console.log(chunkList, md5)
          fileApi.quickUpload(file.name, file.webkitRelativePath, md5, file.size)
            .then((r) => {
              if (!fileApi.isInAfterUpload(this.files[id].state)) {
                this.setFileState(id, fileApi.state.WAIT_UPLOAD)
                if (r.data.data.fileId === null || r.data.data.fileSize === -1) {
                  // 服务器不存在相同的文件
                  this.setChunkList(id, chunkList, chunkListMD5)
                  this.setFileState(id, fileApi.state.WAIT_UPLOAD)
                } else {
                  // 服务器存在相同的文件
                  this.setFileState(id, fileApi.state.DONE)
                }
              }
              this.upload()
            })
            .catch(() => {
              if (!fileApi.isInAfterUpload(this.files[id].state)) this.setFileState(id, fileApi.state.ERROR)
              this.upload()
            })
          this.calcMD5()
        }, () => {
          this.calcMD5()
          this.upload()
        })
      }
    },
    /**
     * @function
     * @param {File} file input文件流
     * @param {Number} id file对应在store中的下标
     * @param {Function} callbackDone 计算完成的回调
     * @param {Function} callbackCancel 取消计算的回调
     * @returns {File[]} chunkList 分块后的二进制流
     * @returns {String[]} chunkListMD5 分块后的二进制流md5
     * @returns {String} md5 整体文件的md5 分块后的二进制流
     * @description 为文件创建分块
     */
    createChunk (file, id, callbackDone, callbackCancel) {
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      const chunks = Math.ceil(file.size / fileApi.chunkSize)
      let currentChunk = 0
      const spark = new SparkMD5.ArrayBuffer()
      const fileReader = new FileReader()
      const chunkList = []
      const chunkListMD5 = []
      fileReader.onload = (e) => {
        console.log('正在计算 进度: ' + (currentChunk + 1) + '/' + chunks)
        const sparkChunk = new SparkMD5.ArrayBuffer()
        sparkChunk.append(e.target.result)
        chunkListMD5.push(sparkChunk.end())
        sparkChunk.destroy()
        spark.append(e.target.result)
        currentChunk++
        if (this.files[id].state !== fileApi.state.CALC) {
          callbackCancel()
          return
        }
        if (currentChunk < chunks) {
          loadNext()
        } else {
          callbackDone(chunkList, chunkListMD5, spark.end())
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
        chunkList.push(blobSlice.call(file, start, end))
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
      }
      loadNext()
    },
    /**
     * @function
     * @description 文件发送控制，和计算md5一样一次只能计算一个，即并发一个
     */
    upload () {
      while (this.currentUpload < this.files.length && fileApi.isInAfterUpload(this.files[this.currentUpload].state)) ++this.currentUpload
      if (this.currentUpload < this.files.length && (this.files[this.currentUpload].state === fileApi.state.WAIT_UPLOAD)) {
        const id = this.currentUpload
        this.setFileState(id, fileApi.state.UPLOAD)
        fileApi.getChunkList(new Array(this.files[id].chunkList.length).fill(0), this.files[id].md5)
          .then((res) => {
            if (fileApi.isInAfterUpload(this.files[id].state)) {
              this.upload()
              return
            }
            const existChunkList = res.data.data
            const source = this.$axios.CancelToken.source()
            this.setSource(id, source)
            this.sendRequest(id, existChunkList)
              .then(() => {
                this.setFileState(id, fileApi.state.DONE)
                this.upload()
              })
              .catch(() => {
                if (this.files[id].state === fileApi.state.PAUSE) return
                if (this.files[id].state !== fileApi.state.CANCEL) {
                  this.setFileState(id, fileApi.state.ERROR)
                }
                this.upload()
              })
          })
          .catch(() => {
            if (!fileApi.isInAfterUpload(this.files[id].state)) this.setFileState(id, fileApi.state.ERROR)
            this.upload()
          })
      }
    },
    /**
     * @function
     * @param {Number} id 文件在store中的下标id
     * @param {Number[]} existChunkList 存在的分块
     * @param {Number} max 最大并发请求数
     * @param {Number} retry 最大重试次数
     * @description 发送分块请求
     */
    async sendRequest (id, existChunkList, max = fileApi.uploadChunkLimit, retry = fileApi.uploadRetry) {
      return new Promise((resolve, reject) => {
        let loaded = 0
        this.files[id].speed = 0
        existChunkList.forEach(i => {
          loaded += this.files[id].chunkList[existChunkList[i]].size
        })
        this.files[id].befLoaded = this.files[id].loaded = loaded
        this.files[id].chunkListLoaded.fill(0)
        this.files[id].befTimestamp = Date.now()
        const file = this.files[id]
        const len = file.chunkList.length - existChunkList.length
        let counter = 0
        const retryArr = new Array(len).fill(0)
        const state = {
          DONE: 0,
          WAIT: 1,
          UPLOAD: 2,
          ERROR: 3 // need retry
        }
        const stateArr = new Array(len).fill(state.WAIT)
        const indexArr = (Array.from({ length: file.chunkList.length })).map((v, k) => k).filter(i => existChunkList.indexOf(i) === -1)
        const findIdc = () => {
          for (let i = 0; i < len; ++i) {
            if (stateArr[i] === state.WAIT || stateArr[i] === state.ERROR) return i
          }
          return -1
        }
        const start = async () => {
          while (counter < len && max > 0) { // 有空位的情况下，有重试id或者还有未传的
            if (fileApi.state.PAUSE === this.files[id].state || fileApi.isInAfterUpload(this.files[id].state)) {
              reject(new Error('取消任务'))
              return // 用户操作暂停或取消了
            }
            const idc = findIdc() // 新数组下标
            if (idc === -1) return
            const idx = indexArr[idc] // 原始文件分片下标
            stateArr[idc] = state.UPLOAD
            --max
            const formData = new FormData()
            console.log('正在发送 进度: ' + (counter + 1) + '/' + len + ' 之前已存在：' + existChunkList.length + '个分片')
            formData.append('file', file.chunkList[idx])
            formData.append('num', file.chunkList.length.toString())
            formData.append('index', idx.toString())
            formData.append('partMd5', file.chunkListMD5[idx])
            formData.append('fullPath', file.file.webkitRelativePath)
            formData.append('nodeName', file.file.name)
            formData.append('size', file.file.size)
            formData.append('fullMd5', file.md5)
            fileApi.upload(
              formData,
              file.source.token,
              (progressEvent) => {
                this.setFileProgress(id, idx, progressEvent.loaded)
              })
              .then((r) => {
                stateArr[idc] = state.DONE
                ++max
                ++counter
                if (counter === len) resolve()
                start()
              })
              .catch((e) => {
                console.log('第' + idc + '个分片错误，已重试次数：' + retryArr[idc] + '，最大重试次数：' + retry)
                stateArr[idc] = state.ERROR
                ++retryArr[idc]
                if (retryArr[idc] > retry) reject(new Error('超出重试次数'))
                else {
                  ++max
                  start()
                }
              })
          }
        }
        start()
      })
    },
    /**
     * @function
     * @description 暂停发送
     */
    uploadPause () {
      const id = this.currentUpload
      this.cancelUpload(id)
      this.setFileState(id, fileApi.state.PAUSE)
    },
    /**
     * @function
     * @description 继续发送
     */
    uploadContinue () {
      const id = this.currentUpload
      this.setFileState(id, fileApi.state.WAIT_UPLOAD)
      this.upload()
    },
    /**
     * @function
     * @param {Number} id 文件在store中的下标id
     * @description 取消上传文件
     */
    cancel (id) {
      this.cancelUpload(id)
      this.setFileState(id, fileApi.state.CANCEL)
      this.upload()
    }
  }
}
</script>

<style scoped>
</style>
