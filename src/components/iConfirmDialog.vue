<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="300px"
  >
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text class="py-0">
        <div v-html="dialogHtml"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          elevation="0"
          @click="clickDialog"
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
export default {
  name: 'iConfirmDialog',
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    dialogTitle: {
      type: String,
      required: true
    },
    dialogHtml: {
      type: String,
      required: true
    },
    dialogLoading: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    clickDialog () {
      this.$emit('clickDialog')
    },
    closeDialog () {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>

</style>
