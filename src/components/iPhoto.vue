<template>
  <v-fade-transition
    hide-on-leave
  >
    <v-card
      elevation="0"
      rounded="0"
      color="rgba(0,0,0,0.95)"
      height="100%"
      width="100%"
      style="position:fixed;top:0;bottom:0;left:0;right:0;z-index: 101"
      class="white--text"
      v-if="value"
    >
      <v-card-title style="height: 48px" class="align-content-center">
        <span>{{ title }}</span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          color="white"
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: calc(100% - 48px - 48px)" class="pb-0 d-flex align-center">
        <v-img
          :src="src"
          contain
          max-height="100%"
          :style="{ transform: `rotate(${deg * 90}deg)` }"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-card-text>
      <v-card-actions style="height: 48px">
        <v-spacer></v-spacer>
        <v-btn
          icon
          color="white"
          @click="rotate"
        >
          <v-icon>mdi-rotate-right-variant</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-fade-transition>
</template>

<script>
// 图片查看未使用此组件，使用了第三方库viewer.js
export default {
  name: 'iPhoto',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    src: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      deg: 0
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    rotate () {
      this.deg = (this.deg + 1) % 4
    }
  }
}
</script>

<style scoped>

</style>
