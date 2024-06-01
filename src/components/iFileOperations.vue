<template>
  <div>
    <v-btn
      :x-small="$vuetify.breakpoint.mobile"
      v-for="(button, id) in buttons"
      :key="id"
      color="btn"
      elevation="0"
      @click.stop="button.click"
      tile
      outlined
      :class="getButtonClass(id)"
      :disabled="!button.rule()"
    >{{ button.text }}</v-btn>
    <i-directory-dialog
      :dialog="directoryDialog"
      :dialog-title="directoryDialogTitle"
      :dialog-loading="directoryDialogLoading"
      @clickDialog="clickDirectoryDialog"
      @closeDialog="closeDirectoryDialog"
    ></i-directory-dialog>
    <v-dialog
      v-model="inputDialog"
      persistent
      width="500px"
    >
      <v-card>
        <v-card-title>{{ inputDialogTitle }}</v-card-title>
        <v-card-text class="py-0">
          <v-text-field
            v-model="inputDialogText"
            outlined
            dense
            hide-details
            :disabled="inputDialogLoading"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            elevation="0"
            @click="clickInputDialog"
            :loading="inputDialogLoading"
          >
            确定
          </v-btn>
          <v-btn
            color="error"
            elevation="0"
            @click="closeInputDialog"
            :disabled="inputDialogLoading"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <i-confirm-dialog
      :dialog="confirmDialog"
      :dialog-title="confirmDialogTitle"
      :dialog-html="confirmDialogHtml"
      :dialog-loading="confirmDialogLoading"
      @clickDialog="clickConfirmDialog"
      @closeDialog="closeConfirmDialog"
    ></i-confirm-dialog>
    <i-share-dialog
      :dialog="shareDialog"
      :ids="ids"
      @closeDialog="closeShareDialog"
    ></i-share-dialog>
  </div>
</template>

<script>
import { fileApi } from '@/api/fileApi'
import iDirectoryDialog from '@/components/iDirectoryDialog'
import iConfirmDialog from '@/components/iConfirmDialog'
import iShareDialog from '@/components/iShareDialog'
import { mapState } from 'vuex'

export default {
  name: 'iFileOperations',
  components: {
    iDirectoryDialog,
    iConfirmDialog,
    iShareDialog
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: () => { return [] }
    }
  },
  computed: {
    ...mapState(['token']),
    ids () {
      return this.items.map(item => item.id)
    }
  },
  data () {
    return {
      fileOperationsIndexGroup: {
        CREATE_INDEX: 0,
        RENAME_INDEX: 1,
        COPY_INDEX: 2,
        MOVE_INDEX: 3,
        DELETE_INDEX: 4,
        SHARE_INDEX: 5,
        DOWNLOAD_INDEX: 6
      },
      fileOperationsIndex: 0,
      active: undefined,
      directoryDialog: false,
      directoryDialogTitle: '',
      directoryDialogLoading: false,
      inputDialog: false,
      inputDialogTitle: '',
      inputDialogText: '',
      inputDialogLoading: false,
      confirmDialog: false,
      confirmDialogTitle: '',
      confirmDialogHtml: '',
      confirmDialogLoading: false,
      shareDialog: false,
      buttons: [
        {
          text: '新建',
          click: () => {
            this.setFileOperationsIndex(this.fileOperationsIndexGroup.CREATE_INDEX)
            this.openDirectoryDialog('新建文件夹到')
          },
          rule: () => this.ids.length === 0
        },
        {
          text: '重命名',
          click: () => {
            this.setFileOperationsIndex(this.fileOperationsIndexGroup.RENAME_INDEX)
            this.openInputDialog('重命名为', this.items[0].name)
          },
          rule: () => this.ids.length === 1
        },
        {
          text: '复制',
          click: () => {
            this.setFileOperationsIndex(this.fileOperationsIndexGroup.COPY_INDEX)
            this.openDirectoryDialog('复制到')
          },
          rule: () => this.ids.length > 0
        },
        {
          text: '移动',
          click: () => {
            this.setFileOperationsIndex(this.fileOperationsIndexGroup.MOVE_INDEX)
            this.openDirectoryDialog('移动到')
          },
          rule: () => this.ids.length > 0
        },
        {
          text: '删除',
          click: () => {
            this.setFileOperationsIndex(this.fileOperationsIndexGroup.DELETE_INDEX)
            this.openConfirmDialog(
              '确认删除',
              '<div class="text-center">确认要把所选文件放入回收站吗？</div>\n<div class="text-center">删除的文件可在<span class="red--text">10天</span>内通过回收站还原</div>'
            )
          },
          rule: () => this.ids.length > 0
        },
        {
          text: '分享',
          click: this.share,
          rule: () => this.ids.length > 0
        },
        {
          text: '下载',
          click: this.download,
          rule: () => this.ids.length === 1
        }
      ]
    }
  },
  methods: {
    getButtonClass (id) {
      if (id === 0 && id + 1 === this.buttons.length) return 'rounded-l rounded-r'
      else if (id === 0) return 'rounded-l'
      else if (id + 1 === this.buttons.length) return 'rounded-r'
      return ''
    },
    setFileOperationsIndex (index) {
      this.fileOperationsIndex = index
    },
    openDirectoryDialog (title) {
      this.directoryDialogTitle = title
      this.directoryDialog = true
    },
    closeDirectoryDialog () {
      this.directoryDialogLoading = false
      this.directoryDialog = false
    },
    clickDirectoryDialog (active) {
      this.active = active
      switch (this.fileOperationsIndex) {
        case this.fileOperationsIndexGroup.CREATE_INDEX:
          this.closeDirectoryDialog()
          this.openInputDialog('新建文件夹名为', '')
          break
        case this.fileOperationsIndexGroup.COPY_INDEX:
          this.copy()
          break
        case this.fileOperationsIndexGroup.MOVE_INDEX:
          this.move()
          break
      }
    },
    openInputDialog (title, text) {
      this.inputDialogTitle = title
      this.inputDialogText = text
      this.inputDialog = true
    },
    closeInputDialog () {
      this.inputDialogLoading = false
      this.inputDialog = false
    },
    clickInputDialog () {
      switch (this.fileOperationsIndex) {
        case this.fileOperationsIndexGroup.CREATE_INDEX:
          this.create()
          break
        case this.fileOperationsIndexGroup.RENAME_INDEX:
          this.rename()
          break
      }
    },
    openConfirmDialog (title, html) {
      this.confirmDialogTitle = title
      this.confirmDialogHtml = html
      this.confirmDialog = true
    },
    closeConfirmDialog () {
      this.confirmDialogLoading = false
      this.confirmDialog = false
    },
    clickConfirmDialog () {
      switch (this.fileOperationsIndex) {
        case this.fileOperationsIndexGroup.DELETE_INDEX:
          this.delete()
          break
      }
    },
    closeShareDialog () {
      this.shareDialog = false
    },
    refreshData () {
      this.$emit('refreshData', this.active)
      this.active = undefined
    },
    create () {
      this.inputDialogLoading = true
      fileApi.create(this.active.id, this.inputDialogText)
        .then((r) => {
          this.closeInputDialog()
          this.refreshData()
        })
        .catch((e) => {
          this.inputDialogLoading = false
        })
    },
    rename () {
      this.inputDialogLoading = true
      fileApi.rename(this.ids[0], this.inputDialogText)
        .then((r) => {
          this.closeInputDialog()
          this.refreshData()
        })
        .catch((e) => {
          this.inputDialogLoading = false
        })
    },
    copy () {
      this.directoryDialogLoading = true
      fileApi.copy(this.ids, this.active.id)
        .then((r) => {
          this.closeDirectoryDialog()
          this.refreshData()
        })
        .catch((e) => {
          this.directoryDialogLoading = false
        })
    },
    move () {
      this.directoryDialogLoading = true
      fileApi.move(this.ids, this.active.id)
        .then((r) => {
          this.closeDirectoryDialog()
          this.refreshData()
        })
        .catch((e) => {
          this.directoryDialogLoading = false
        })
    },
    delete () {
      this.confirmDialogLoading = true
      fileApi.delete(this.ids)
        .then((r) => {
          this.closeConfirmDialog()
          this.refreshData()
        })
        .catch((e) => {
          this.confirmDialogLoading = false
        })
    },
    share () {
      this.shareDialog = true
    },
    download () {
      const url = fileApi.download(this.token, this.ids[0])
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', this.items[0].name) // 自定义下载文件名（example.txt）
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style scoped>

</style>
