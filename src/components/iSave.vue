<template>
  <div>
    <v-btn
      color="primary"
      :disabled="ids.length === 0"
      @click.stop="openSaveDialog"
      elevation="0"
    >保存到网盘</v-btn>
    <i-directory-dialog
      :dialog="dialog"
      :dialog-title="dialogTitle"
      :dialog-loading="dialogLoading"
      @closeDialog="closeDialog"
      @clickDialog="clickDialog"
    ></i-directory-dialog>
  </div>
</template>

<script>
import iDirectoryDialog from '@/components/iDirectoryDialog'
import { fileApi } from '@/api/fileApi'
import { mapState } from 'vuex'

export default {
  name: 'iSave',
  components: {
    iDirectoryDialog
  },
  props: {
    ids: {
      type: Array,
      required: true
    },
    shareId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      dialogTitle: '保存到',
      dialogLoading: false
    }
  },
  computed: {
    ...mapState(['token'])
  },
  methods: {
    openSaveDialog () {
      if (this.token) {
        this.dialog = true
      } else {
        this.$router.push('/account')
      }
    },
    closeDialog () {
      this.loading = false
      this.dialog = false
    },
    clickDialog (active) {
      this.loading = true
      fileApi.save(this.shareId, this.ids, active.id)
        .then((r) => {
          this.closeDialog()
          this.$message.success('保存成功')
        })
        .catch((e) => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
