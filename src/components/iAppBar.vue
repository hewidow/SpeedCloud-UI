<template>
  <v-app-bar
    :clipped-left="clippedLeft"
    app
    dense
    elevation="0"
    :style="{borderBottom: 'solid 1px rgba(0,0,0,0.12) !important', backgroundColor: isNotOpacity ? this.$vuetify.theme.themes.light.barOpaque : this.$vuetify.theme.themes.light.bar}"
  >
    <div
      @click="$router.push('/home')"
      style="cursor: pointer"
    >
      <v-img :src="require('../assets/logo3.svg')"></v-img>
    </div>
    <v-spacer></v-spacer>
    <slot name="menu"></slot>
  </v-app-bar>
</template>

<script>
export default {
  name: 'iAppBar',
  props: {
    clippedLeft: {
      type: Boolean,
      default: false
    },
    isNotOpacity: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>
