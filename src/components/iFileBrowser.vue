<template>
  <v-data-table
    :value="selected"
    @input="updateSelected"
    :headers="$vuetify.breakpoint.mobile?headersMobile:headers"
    :items="desserts"
    item-key="id"
    show-select
    hide-default-footer
    :loading="loading"
    loading-text="正在加载...请稍后"
    :no-data-text="noDataText"
    no-results-text="没有搜索到相应的内容"
    :items-per-page="-1"
    :search="search"
    fixed-header
    :height="fileBrowserHeaderHeight"
    mobile-breakpoint="-1"
    checkbox-color="primary"
    @click:row="rowClick"
  >
    <template v-slot:top>
      <div ref="tableHeaderRef">
        <slot name="top"></slot>
        <v-row dense class="ma-0">
          <v-col class="align-self-center" cols="auto">
            <v-breadcrumbs
              :items="paths"
              large
              class="py-0"
            >
              <template v-slot:item="{ item }">
                <v-breadcrumbs-item
                  @click="goPath(item)"
                  :disabled="item.disabled"
                  href="#"
                >
                  {{ item.name }}
                </v-breadcrumbs-item>
              </template>
              <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>
          </v-col>
          <v-col class="align-self-center justify-self-center" v-show="!$vuetify.breakpoint.mobile">
            <span v-show="selected.length > 0">已选中{{ selected.length }}个文件或文件夹</span>
          </v-col>
          <v-col class="align-self-center" cols="4" v-show="!$vuetify.breakpoint.mobile && !hideSearch">
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
  </v-data-table>
</template>

<script>

import { fileSuffix } from '@/api/fileApi'

export default {
  name: 'iFileBrowser',
  props: {
    selected: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    headersMobile: {
      type: Array,
      required: true
    },
    desserts: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    hideSearch: {
      type: Boolean,
      default: false
    },
    noDataText: {
      type: String,
      default: '该目录下没有文件'
    },
    otherHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      fileBrowserHeaderHeight: 0,
      paths: [],
      search: ''
    }
  },
  created () {
    this.goPath({
      id: 1,
      name: '全部文件'
    })
  },
  mounted () {
    window.addEventListener('resize', this.calcFileBrowserHeaderHeight)
    this.$nextTick(() => {
      this.calcFileBrowserHeaderHeight()
    }) // 等待DOM渲染完成再获取
  },
  destroyed () {
    window.removeEventListener('resize', this.calcFileBrowserHeaderHeight)
  },
  methods: {
    rowClick (data, item) {
      if (data.type === fileSuffix.FOLDER.type) this.goPath(data)
      else if (data.type === fileSuffix.PHOTO.type) this.goPhoto(data)
      else this.goPlay(data)
    },
    goPath (data) {
      data = data || this.paths[this.paths.length - 1]
      this.updateSelected([])
      const pathsId = this.paths.map(item => item.id)
      const pos = pathsId.indexOf(data.id)
      // 设置文件浏览器头部面包屑导航
      if (pos === -1) {
        // 新路径
        if (this.paths.length) this.paths[this.paths.length - 1].disabled = false
        this.paths.push({ ...data, ...{ disabled: true } })
      } else {
        // 老路径
        this.paths.splice(pos + 1)
        this.paths[this.paths.length - 1].disabled = true
      }
      this.$emit('goPath', data)
    },
    goPlay (data) {
      this.$emit('goPlay', data)
    },
    goPhoto (data) {
      this.$emit('goPhoto', data)
    },
    updateSelected (arr) {
      this.$emit('update:selected', arr)
    },
    calcFileBrowserHeaderHeight () {
      this.fileBrowserHeaderHeight = (window.innerHeight - this.$refs.tableHeaderRef.offsetHeight - this.otherHeight) + 'px'
    }
  }
}
</script>

<style>
.v-data-table__selected {
  background: #E4EFFA !important;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  cursor: pointer;
  color: #1976D2;
}
</style>
