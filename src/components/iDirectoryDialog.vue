<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    width="500px"
  >
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 200px;" class="py-1">
        <v-treeview
          :open.sync="open"
          :items="items"
          activatable
          :active.sync="active"
          transition
          return-object
          item-key="itemKey"
          loading-icon="mdi-loading"
          :load-children="fetchChildren"
          :disabled="dialogLoading"
          hoverable
          style="cursor:pointer;"
        >
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="item.isDirectory" color="amber">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else :color="item.suffixIcon.color">{{ item.suffixIcon.name }}</v-icon>
          </template>
        </v-treeview>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          elevation="0"
          @click.stop="clickDialog"
          :disabled="active.length === 0 || active.some(item => !item.isDirectory)"
          :loading="dialogLoading"
        >
          确定
        </v-btn>
        <v-btn
          color="error"
          elevation="0"
          @click="closeDialog"
          :disabled="dialogLoading"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { fileApi } from '@/api/fileApi'

export default {
  name: 'iDirectoryDialog',
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    dialogTitle: {
      type: String,
      required: true
    },
    dialogLoading: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      open: [],
      active: [],
      items: [{
        name: '全部文件',
        id: 1,
        isDirectory: true,
        children: [],
        itemKey: fileApi.getItemKey(1)
      }]
    }
  },
  watch: {
    /**
     * 监听open，动态设置active激活项
     */
    open (val, oldVal) {
      if (val.length < oldVal.length) this.active = oldVal.filter((item) => val.indexOf(item) === -1)
      else this.active = val.filter((item) => oldVal.indexOf(item) === -1)
    },
    /**
     * 关闭dialog时初始化
     */
    dialog (val) {
      if (val === false) this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.open = []
      this.active = []
      this.items = [{
        name: '全部文件',
        id: 1,
        isDirectory: true,
        children: [],
        itemKey: fileApi.getItemKey(1),
        active: true
      }]
    },
    /**
     * 异步获取目录
     * @param {Object} item 需要打开的文件项
     * @returns {Promise}
     */
    async fetchChildren (item) {
      return fileApi.goPath(item.id)
        .then((r) => {
          item.children.push(...fileApi.formatFilesData(r.data.data))
        })
        .catch((e) => {
        })
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    clickDialog () {
      this.$emit('clickDialog', this.active[0])
    }
  }
}
</script>

<style scoped>
</style>
