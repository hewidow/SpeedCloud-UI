<template>
  <v-img :src="src" style="position:fixed;top:0;bottom:0;right:0;left:0;z-index:0;"></v-img>
</template>

<script>
export default {
  name: 'iBackgroundImage',
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
