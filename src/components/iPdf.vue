<template>
  <iframe :src="src" frameborder="0" height="100%" width="100%">
    <p>Your browser does not support iframes.</p>
  </iframe>
</template>

<script>

export default {
  name: 'iPdf',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
