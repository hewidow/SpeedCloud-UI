<template>
  <v-data-table
    v-model="selected"
    :headers="$vuetify.breakpoint.mobile?headersMobile:headers"
    :items="desserts"
    item-key="id"
    show-select
    hide-default-footer
    :loading="loading"
    loading-text="正在加载...请稍后"
    no-data-text="回收站空空如也~"
    no-results-text="没有搜索到相应的内容"
    :items-per-page="-1"
    :search="search"
    fixed-header
    :height="tableBodyHeight"
    mobile-breakpoint="-1"
    checkbox-color="primary"
  >
    <template v-slot:top>
      <div style="height: 92px">
        <v-row dense class="ma-0">
          <v-col>
            <i-confirm-dialog
              :dialog="recycleDialog.open"
              :dialog-title="recycleDialog.title"
              :dialog-html='recycleDialog.html'
              :dialog-loading="recycleDialog.loading"
              @clickDialog="recycle"
              @closeDialog="recycleDialog.open = false"
            ></i-confirm-dialog>
            <v-btn
              color="btn"
              class="btnText--text"
              elevation="0"
              @click.stop="recycleDialog.open = true"
              :disabled="selectedId.length === 0"
            >还原</v-btn>
            <i-confirm-dialog
              :dialog="removeDialog.open"
              :dialog-title="removeDialog.title"
              :dialog-html='removeDialog.html'
              :dialog-loading="removeDialog.loading"
              @clickDialog="remove"
              @closeDialog="removeDialog.open = false"
            ></i-confirm-dialog>
            <v-btn
              color="btn"
              class="btnText--text ml-2"
              elevation="0"
              @click.stop="removeDialog.open = true"
              :disabled="selectedId.length === 0"
            >彻底删除</v-btn>
          </v-col>
        </v-row>
        <v-row dense class="ma-0">
          <v-col class="align-self-center justify-self-center">
            <span v-show="selected.length > 0">已选中{{ selected.length }}个文件或文件夹</span>
          </v-col>
          <v-col class="align-self-center" cols="8" md="4">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="搜索您的文件"
              single-line
              outlined
              dense
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
    </template>
    <template v-slot:item.name="{ item }">
      <v-icon :color="item.suffixIcon.color">{{ item.suffixIcon.name }}</v-icon>
      {{ item.name }}
    </template>
    <template v-slot:item.size="{ item }">
      {{ item.sizeText }}
    </template>
    <template v-slot:item.effTime="{ item }">
      {{ calcTime(getEffectiveTime(item.delDateMinuteStamp)) }}
    </template>
  </v-data-table>
</template>

<script>
import { fileApi } from '@/api/fileApi'
import iConfirmDialog from '@/components/iConfirmDialog'

export default {
  name: 'Recycle',
  components: {
    iConfirmDialog
  },
  data () {
    return {
      nowTime: Math.floor(Date.now() / (60 * 1000)),
      loading: false,
      recycleDialog: {
        open: false,
        loading: false,
        title: '确认还原',
        html: '<div class="text-center">确认还原选中的文件？</div>'
      },
      removeDialog: {
        open: false,
        loading: false,
        title: '确认彻底删除',
        html: '<div class="text-center">确认<span class="red--text">彻底删除</span>选中的文件？</div>'
      },
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
          text: '删除时间',
          value: 'delDate',
          filterable: false
        },
        {
          text: '有效时间',
          value: 'effTime',
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
          text: '有效时间',
          value: 'effTime',
          filterable: false
        }
      ],
      items: [
        /*
        {
          id: 1,
          name: 'Frozen Yogurt',
          size: 159,
          delDate: '2021/12/3 11:20',
          delDateMinuteStamp: Math.floor(new Date('2021/11/23 12:53').getTime() / (60 * 1000)),
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
          delDate: '2021/12/3 11:20',
          delDateMinuteStamp: Math.floor(new Date('2021/11/23 13:49').getTime() / (60 * 1000)),
          suffix: 'folder',
          suffixIcon: {
            name: 'mdi-music',
            color: 'primary'
          },
          sizeText: '159B'
        }
        */
      ],
      search: '',
      selected: [],
      timer: null,
      tableBodyHeight: 0
    }
  },
  computed: {
    selectedId () {
      return this.selected.map(item => item.id)
    },
    desserts () {
      return this.items.filter(item => this.getEffectiveTime(item.delDateMinuteStamp) > 0)
    }
  },
  watch: {
    desserts (val, oldVal) {
      if (val.length === oldVal.length) return
      this.selected = this.selected.filter(item => val.indexOf(item) !== -1)
    }
  },
  created () {
    /* 当为整分钟数时，开始1分钟更新一次，减轻更新压力 */
    this.timer = setInterval(() => {
      if (Math.floor(Date.now() / 1000) % 60 === 0) {
        clearInterval(this.timer)
        this.nowTime = Math.floor(Date.now() / (60 * 1000))
        this.timer = setInterval(() => {
          this.nowTime = Math.floor(Date.now() / (60 * 1000))
        }, 60 * 1000)
      }
    }, 1000)
    this.getRecycleFiles()
  },
  mounted () {
    window.addEventListener('resize', this.calcTableBodyHeight)
    this.calcTableBodyHeight()
  },
  destroyed () {
    if (this.timer) clearInterval(this.timer)
    window.removeEventListener('resize', this.calcTableBodyHeight)
  },
  methods: {
    /**
     * @function
     * @param {Number} delDateMinuteStamp 分钟戳
     * @description 根据当前分钟戳和所给参数计算剩余分钟
     * @returns {Number} 剩余分钟数
     */
    getEffectiveTime (delDateMinuteStamp) {
      return fileApi.validMinutesPeriod - (this.nowTime - delDateMinuteStamp)
    },
    calcTime (val) {
      return Math.floor(val / 1440) + '天' + Math.floor(val % 1440 / 60) + '小时' + Math.floor(val % 60) + '分钟'
    },
    getRecycleFiles () {
      this.loading = true
      fileApi.getRecycleFiles()
        .then((r) => {
          this.loading = false
          this.items = fileApi.formatFilesData(r.data.data)
        })
        .catch((e) => {
          this.loading = false
        })
    },
    recycle () {
      this.recycleDialog.loading = true
      fileApi.recycle(this.selectedId)
        .then((r) => {
          this.recycleDialog.loading = false
          this.recycleDialog.open = false
          this.getRecycleFiles()
        })
        .catch((e) => {
          this.recycleDialog.loading = false
        })
    },
    remove () {
      this.removeDialog.loading = true
      fileApi.remove(this.selectedId)
        .then((r) => {
          this.removeDialog.loading = false
          this.removeDialog.open = false
          this.getRecycleFiles()
        })
        .catch((e) => {
          this.removeDialog.loading = false
        })
    },
    calcTableBodyHeight () {
      this.tableBodyHeight = (window.innerHeight - 48 - 92 - 24) + 'px'
    }
  }
}
</script>

<style scoped>

</style>
