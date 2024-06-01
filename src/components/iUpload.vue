<template>
  <v-menu
    offset-y
    open-on-hover
    :open-on-click="false"
  >
    <input type="file" id="file" class="input-file" @change="uploadFiles">
    <input type="file" id="files" class="input-file" @change="uploadFiles" webkitdirectory multiple>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="btn"
        elevation="0"
        v-bind="attrs"
        v-on="on"
        class="pa-0 btnText--text"
      >
        <label for="file" class="input-file-label text-center" style="width: 96px;line-height: 36px;">
          <v-icon left>
            mdi-cloud-upload
          </v-icon>
          上传
        </label>
      </v-btn>
    </template>
    <v-list>
      <v-list-item link class="pa-0">
        <label for="file" class="input-file-label primary--text text-body-2 text-center" style="width: 96px;line-height: 48px;">
          上传文件
        </label>
      </v-list-item>
      <v-list-item link class="pa-0">
        <label for="files" class="input-file-label primary--text text-body-2 text-center" style="width: 96px;line-height: 48px;">
          上传文件夹
        </label>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>

export default {
  name: 'iUpload',
  data () {
    return {
    }
  },
  methods: {
    /**
     * @function
     * @param {Event} e input触发事件
     * @description 将input中的文件或文件夹按单个文件处理上传
     */
    uploadFiles (e) {
      if (!e.target.files) return
      this.$emit('openUpDownPanel', e.target.files)
      e.target.value = null
    }
  }
}
</script>

<style scoped>
.input-file {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.input-file-label {
  cursor: pointer;
  margin: 0 auto;
}
</style>
