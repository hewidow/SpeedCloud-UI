<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="500px"
  >
    <v-card>
      <v-card-title>分享</v-card-title>
      <v-card-text class="py-0" style="height: 120px">
        <v-container v-if="isShareLink === 2">
          <v-row>
            <v-col>
              <v-textarea
                v-model="shareLink"
                id="i-share-dialog-copy"
                outlined
                hide-details
                dense
                readonly
                no-resize
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-else>
          <v-row class="align-center">
            <v-col class="text-center" cols="auto">
              <v-subheader class="text-no-wrap">有效期</v-subheader>
            </v-col>
            <v-col cols="6" md="4">
              <v-select
                v-model="selected"
                :items="items"
                outlined
                hide-details
                dense
                single-line
                menu-props="auto"
                return-object
                :disabled="isShareLink === 1"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          elevation="0"
          @click="copyShareLink"
          v-if="isShareLink === 2"
        >复制链接</v-btn>
        <v-btn
          color="primary"
          elevation="0"
          @click="generateShareLink"
          :loading="isShareLink === 1"
          v-else
        >生成分享链接</v-btn>
        <v-btn
          color="error"
          elevation="0"
          :disabled="isShareLink === 1"
          @click="closeDialog"
        >
          {{ (isShareLink === 2 ? '关闭' : '取消') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { fileApi } from '@/api/fileApi'

export default {
  name: 'iShareDialog',
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    ids: {
      type: Array,
      required: true,
      default: () => { return [] }
    }
  },
  data () {
    return {
      isShareLink: 0, // 三种状态，0->未生成分享链接，1->正在生成分享链接，2->生成分享链接成功
      items: [
        {
          text: '1天',
          value: 0
        },
        {
          text: '3天',
          value: 1
        },
        {
          text: '7天',
          value: 2
        }/*,
        {
          text: '永久有效',
          value: 3
        }
        */
      ],
      selected: {
        text: '3天',
        value: 1
      },
      shareLink: '分享链接：\nhttps://pan.baidu.com/s/xxxxxxxxxxxxxx\n提取码：f67f'
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
      this.isShareLink = 0
    },
    generateShareLink () {
      this.isShareLink = 1
      fileApi.share(this.ids, this.selected.value)
        .then((r) => {
          this.isShareLink = 2
          this.shareLink = `分享链接：\n${window.location.protocol}//${window.location.host}`
          if (window.location.port !== '') this.shareLink += `:${window.location.port}`
          this.shareLink += `/share?id=${r.data.data.uniqueId}\n提取码：${r.data.data.checkCode}`
        })
        .catch((e) => {
          this.isShareLink = 0
        })
    },
    copyShareLink () {
      document.getElementById('i-share-dialog-copy').select()
      document.execCommand('copy')
      this.$message.success('复制成功')
    }
  }
}
</script>

<style>
#i-share-dialog-copy {
  padding-bottom: 6px;
}
</style>
