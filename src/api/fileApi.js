import axios from 'axios'
/**
 * 文件大小单位
 * @type {String[]}
 */
const sizeUnit = ['B', 'KB', 'MB', 'GB']
/**
 * 文件后缀信息
 * @property {Object} FORMAT 格式名字
 * @property {Number} FORMAT.type 格式唯一标识符
 * @property {String[]} FORMAT.accept 匹配的后缀
 * @property {Object} FORMAT.icon 图标信息
 * @property {String} FORMAT.icon.name 图标名字
 * @property {String} FORMAT.icon.color 图标颜色
 */
const fileSuffix = {
  FOLDER: {
    accept: ['folder'],
    icon: {
      name: 'mdi-folder',
      color: 'amber'
    }
  },
  VIDEO: {
    accept: ['mp4', 'mkv', 'avi', 'rmvb'],
    icon: {
      name: 'mdi-video',
      color: 'deep-purple lighten-1'
    }
  },
  MUSIC: {
    accept: ['mp3'],
    icon: {
      name: 'mdi-music',
      color: 'pink'
    }
  },
  PHOTO: {
    accept: ['jpg', 'jpeg', 'png', 'gif'],
    icon: {
      name: 'mdi-image',
      color: 'green'
    }
  },
  COMPRESS: {
    accept: ['zip', 'rar', '7z'],
    icon: {
      name: 'mdi-zip-box',
      color: 'orange'
    }
  },
  EXE: {
    accept: ['exe'],
    icon: {
      name: 'mdi-floppy',
      color: 'blue'
    }
  },
  PDF: {
    accept: ['pdf'],
    icon: {
      name: 'mdi-file-pdf-box',
      color: 'rgb(255,123,128)'
    }
  },
  WORD: {
    accept: ['doc', 'docx'],
    icon: {
      name: 'mdi-microsoft-word',
      color: 'rgb(43,87,154)'
    }
  },
  EXCEL: {
    accept: ['xls', 'xlsx'],
    icon: {
      name: 'mdi-microsoft-excel',
      color: 'rgb(33,115,70)'
    }
  },
  POWERPOINT: {
    accept: ['ppt', 'pptx'],
    icon: {
      name: 'mdi-microsoft-powerpoint',
      color: 'rgb(183,71,42)'
    }
  },
  DEFAULT: {
    accept: [],
    icon: {
      name: 'mdi-file',
      color: 'grey'
    }
  }
}
// 生成fileSuffix.FORMAT.type唯一标识符
Object.keys(fileSuffix).forEach((key, index) => {
  fileSuffix[key].type = index
})
/**
 * 文件操作api
 */
const fileApi = {
  /**
   * 删除文件后保存在回收站的有效期，用于隐藏获取前是未过期但之后过期了的文件
   */
  validMinutesPeriod: 10 * 24 * 60,
  /**
   * 上传文件的分片大小（单位字节）
   */
  chunkSize: 20 * 1024 * 1024,
  /**
   * 并发上传分片的数量
   */
  uploadChunkLimit: 1,
  /**
   * 单个分片上传失败的重试次数
   */
  uploadRetry: 2,
  /**
   * 文件上传状态标识符
   * @property {Number} WAIT 等待计算MD5
   * @property {Number} CALC 计算MD5中
   * @property {Number} REQUEST 请求上传
   * @property {Number} WAIT_UPLOAD 等待上传
   * @property {Number} UPLOAD 正在上传
   * @property {Number} PAUSE 上传暂停
   * @property {Number} DONE 上传完成
   * @property {Number} CANCEL 上传取消
   * @property {Number} ERROR 上传失败
   */
  state: {
    WAIT: 0,
    CALC: 1,
    REQUEST: 2,
    WAIT_UPLOAD: 3,
    UPLOAD: 4,
    PAUSE: 5,
    DONE: 6,
    CANCEL: 7,
    ERROR: 8
  },
  /**
   * 文件上传状态展示文本
   * @type {String[]}
   */
  stateText: ['等待计算MD5', '计算MD5中', '请求上传', '等待上传', '正在上传', '上传暂停', '上传完成', '上传取消', '上传失败'],
  /**
   * 文件上传状态集合
   * @property {Number[]} calcMD5 计算MD5的状态集合
   * @property {Number[]} upload 正在上传的状态集合
   * @property {Number[]} afterUpload 上传之后的状态集合
   */
  stateGroup: { // 如果用函数，每次调用需要加个()，太麻烦了
    calcMD5: [0, 1],
    upload: [4, 5],
    afterUpload: [6, 7, 8]
  },
  /**
   * @function
   * @param {Number} state 状态唯一标识符
   * @description 获取上传状态的文本
   * @return {String} 文本
   */
  getStateText (state) {
    return this.stateText[state]
  },
  /**
   * @function
   * @param {Number} state 状态唯一标识符
   * @description 判断是否在计算MD5的状态集合
   * @return {Boolean} 是否在状态集合
   */
  isInCalcMD5 (state) {
    return this.stateGroup.calcMD5.indexOf(state) !== -1
  },
  /**
   * @function
   * @param {Number} state 状态唯一标识符
   * @description 判断是否在正在上传的状态集合
   * @return {Boolean} 是否在状态集合
   */
  isInUpload (state) {
    return this.stateGroup.upload.indexOf(state) !== -1
  },
  /**
   * @function
   * @param {Number} state 状态唯一标识符
   * @description 判断是否在上传之后的状态集合
   * @return {Boolean} 是否在状态集合
   */
  isInAfterUpload (state) {
    return this.stateGroup.afterUpload.indexOf(state) !== -1
  },
  /**
   * @function
   * @param {Number} size 大小
   * @description 文件大小转文本
   * @return {String} 文件大小文本
   */
  toSizeText (size) {
    if (size === -1) return '-'
    for (let i = 0; i + 1 < sizeUnit.length; ++i) {
      if (size < 1024) return size.toString() + sizeUnit[i]
      size /= 1024
      size = Number(size.toFixed(1))
    }
    return size.toString() + sizeUnit[sizeUnit.length - 1]
  },
  /**
   * @function
   * @param {String} suffix 后缀
   * @description 获取匹配到的后缀信息
   * @return {Object} 后缀信息
   */
  getSuffixData (suffix) {
    for (const key in fileSuffix) {
      if (fileSuffix[key].accept.indexOf(suffix) !== -1) return fileSuffix[key]
    }
    return fileSuffix.DEFAULT
  },
  /**
   * @function
   * @param {String} filename 名字
   * @description 截取后缀
   * @return {String} 后缀，无返回空字符串
   */
  getSuffix (filename) {
    const pos = filename.lastIndexOf('.')
    return pos === -1 ? '' : filename.substring(pos + 1)
  },
  /**
   * @function
   * @param {String} filename 名字
   * @description 截取前缀
   * @return {String} 前缀，无返回原字符串
   */
  getPrefix (filename) {
    const pos = filename.lastIndexOf('.')
    return pos === -1 ? filename : filename.substring(0, pos)
  },
  /**
   * @function
   * @param {Object[]} arr 后端传回的文件信息数组
   * @description 格式化文件信息
   * @return {Object[]} 格式化后的数组
   */
  formatFilesData (arr) {
    const newArr = []
    for (const item of arr) {
      const size = item.fileSize === null ? -1 : item.fileSize
      const suffixData = item.isDirectory ? fileSuffix.FOLDER : this.getSuffixData(this.getSuffix(item.nodeName))
      const file = {
        id: item.nodeId,
        name: item.nodeName,
        size: size,
        date: item.createTime,
        type: suffixData.type,
        suffixIcon: suffixData.icon,
        sizeText: this.toSizeText(size),
        isDirectory: item.isDirectory,
        delDate: item.deleteTime,
        delDateMinuteStamp: item.deleteTime ? Math.floor(new Date(item.deleteTime).getTime() / (60 * 1000)) : 0,
        itemKey: this.getItemKey(item.nodeId) // 解決v-treeView缓存了itemKey导致再次打开时无法重新获取
      }
      if (file.isDirectory) {
        Object.assign(file, {
          children: []
        })
      }
      newArr.push(file)
    }
    return newArr
  },
  /**
   * @function
   * @param {Number} id 文件唯一标识符
   * @description 根据文件唯一标识符和日期一起生成供vuetify treeView组件使用的itemKey
   * @return {String} itemKey
   */
  getItemKey (id) {
    const len = 5
    return (Array(len).join('0') + id).slice(-len) + Date.now()
  },
  /* 以上为工具 */
  /* 以下为API */
  /**
   * @function
   * @param {String} name 文件名
   * @param {String} path 文件全路径
   * @param {String} md5 文件md5
   * @param {Number} size 文件大小
   * @description 检查是否可以快速上传
   * @return {Promise} axios.post()
   */
  quickUpload (name, path, md5, size) {
    return axios.post('checkFile', {
      md5: md5,
      fullPath: path,
      nodeName: name,
      size: size
    })
  },
  /**
   * @function
   * @param {Number[]} index 不知道为啥要传这个参数
   * @param {String} md5 文件md5
   * @description 获取服务器上已经有的分片标号
   * @return {Promise} axios.post()
   */
  getChunkList (index, md5) {
    return axios.post('checkAgain', {
      index: index,
      fullMd5: md5
    })
  },
  /**
   * @function
   * @param {FormData} formData 上传文件的表单
   * @param {CancelToken} cancelToken 取消token
   * @param {function} callback 上传进度回调函数
   * @description 根据文件唯一标识符和日期一起生成供vuetify treeView组件使用的itemKey
   * @return {Promise} axios.post()
   */
  upload (formData, cancelToken, callback) {
    return axios.post('upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: function (progressEvent) {
        if (progressEvent.lengthComputable) {
          callback(progressEvent)
        }
      },
      cancelToken: cancelToken,
      timeout: 0 // 设置无超时时间
    })
  },
  /**
   * @function
   * @param {Number} id 文件id
   * @description 获取该文件夹下的目录
   * @return {Promise} axios.get()
   */
  goPath (id) {
    return axios.get('queryChildren', {
      params: {
        nodeId: id
      }
    })
  },
  /**
   * @function
   * @param {Number} parentId 新建文件夹的父目录id
   * @param {String} name 新建文件夹的名字
   * @description 新建文件夹
   * @return {Promise} axios.post()
   */
  create (parentId, name) {
    return axios.post('createNode', {
      parentId: parentId,
      nodeName: name
    })
  },
  /**
   * @function
   * @param {Number} id 重命名的文件id
   * @param {String} newName 新名字
   * @description 重命名文件
   * @return {Promise} axios.post()
   */
  rename (id, newName) {
    return axios.post('renameNode', {
      nodeId: id,
      newName: newName
    })
  },
  /**
   * @function
   * @param {Number} srcIds 需要复制的文件id数组
   * @param {Number} dstId 目的文件夹id
   * @description 复制文件
   * @return {Promise} axios.post()
   */
  copy (srcIds, dstId) {
    return axios.post('copyNode', {
      srcNodeId: srcIds,
      dstNodeId: dstId
    })
  },
  /**
   * @function
   * @param {Number} srcIds 需要移动的文件id数组
   * @param {Number} dstId 目的文件夹id
   * @description 移动文件
   * @return {Promise} axios.post()
   */
  move (srcIds, dstId) {
    return axios.post('moveNode', {
      srcNodeId: srcIds,
      dstNodeId: dstId
    })
  },
  /**
   * @function
   * @param {Number[]} ids 需要删除的文件id数组
   * @description 删除文件
   * @return {Promise} axios.post()
   */
  delete (ids) {
    return axios.post('deleteNode', ids)
  },
  /**
   * @function
   * @param {Number[]} ids 需要分享的文件id数组
   * @param {Number} type 分享有效期选项
   * @description 获取分享链接
   * @return {Promise} axios.post()
   */
  share (ids, type) {
    return axios.post('share', {
      srcNodeIds: ids,
      type: type
    })
  },
  /**
   * @function
   * @param {String} token 用户token
   * @param {Number} id 需要下载的文件id
   * @description 获取下载链接
   * @return {String} 拼接好的下载链接
   */
  download (token, id) {
    return `${window.location.protocol}//${window.location.host}/api/download?token=${token}&nodeId=${id}&online=0`
  },
  /**
   * @function
   * @param {String} token 用户token
   * @param {Number} id 需要在线观看的文件id
   * @description 获取在线观看链接
   * @return {String} 拼接好的观看链接
   */
  play (token, id) {
    return `${window.location.protocol}//${window.location.host}/api/download?token=${token}&nodeId=${id}&online=1`
  },
  /**
   * @function
   * @param {Number} id 需要在线观看的视频文件id
   * @description 获取在线观看视频的链接
   * @return {Promise} axios.get()
   */
  playVideo (id) {
    return axios.get('playVideo', {
      params: {
        nodeId: id
      }
    })
  },
  /**
   * @function
   * @description 获取回收站的文件
   * @return {Promise} axios.get()
   */
  getRecycleFiles () {
    return axios.get('recycle')
  },
  /**
   * @function
   * @param {Number[]} ids 需要还原的文件id数组
   * @description 还原回收站的文件
   * @return {Promise} axios.post()
   */
  recycle (ids) {
    return axios.post('recovery', ids)
  },
  /**
   * @function
   * @param {Number[]} ids 需要彻底删除的文件id数组
   * @description 还原回收站的文件
   * @return {Promise} axios.post()
   */
  remove (ids) {
    return axios.post('deleteFinal', ids)
  },
  /**
   * @function
   * @param {String} shareId 分享链接的id
   * @param {String} code 提取码
   * @description 检查提取码是否正确
   * @return {Promise} axios.post()
   */
  checkExtractionCode (shareId, code) {
    return axios.post('check', {
      uniqueId: shareId,
      checkCode: code
    })
  },
  /**
   * @function
   * @param {String} shareId 分享链接的id
   * @description 获取分享者信息
   * @return {Promise} axios.post()
   */
  getSharer (shareId) {
    return axios.post('travel', {
      uniqueId: shareId
    })
  },
  /**
   * @function
   * @param {String} shareId 分享链接的id
   * @param {String} nodeId 需要打开文件夹的id
   * @description 获取分享的文件夹下的目录
   * @return {Promise} axios.post()
   */
  goSharePath (shareId, nodeId) {
    return axios.post('queryChildren', {
      uniqueId: shareId,
      nodeId: nodeId
    })
  },
  /**
   * @function
   * @param {String} shareId 分享链接的id
   * @param {Number[]} ids 需要保存的文件id数组
   * @param {Number} id 保存至用户目录的文件夹id
   * @description 分享链接的文件保存
   * @return {Promise} axios.post()
   */
  save (shareId, ids, id) {
    return axios.post('save', {
      uniqueId: shareId,
      srcNodeId: ids,
      dstNodeId: id
    })
  },
  /**
   * @function
   * @description 获取用户最新的信息，用于更新存储空间用量情况
   * @return {Promise} axios.get()
   */
  getUserData () {
    return axios.get('me')
  }
}
export {
  fileSuffix,
  fileApi
}
