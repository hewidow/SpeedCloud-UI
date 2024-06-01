<template>
  <v-bottom-sheet
    width="100%"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-on="on"
        v-bind="attrs"
        icon
      >
        <v-icon color="barText">mdi-palette</v-icon>
      </v-btn>
    </template>
    <v-sheet
      color="rgba(0,0,0,0.85)"
    >
      <v-card
        color="rgba(0,0,0,0)"
        class="text-center mx-auto"
        width="70%"
        elevation="0"
      >
        <v-card-title class="white--text">选择主题</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="4"
                v-for="(theme, index) of themes"
                :key="index"
              >
                <v-hover>
                  <template v-slot:default="{ hover }">
                    <v-card
                      width="128"
                      style="cursor: pointer"
                      @click="changeTheme(index)"
                    >
                      <v-img :src="theme.icon"></v-img>
                      <v-fade-transition>
                        <v-overlay
                          v-if="hover"
                          absolute
                          color="black"
                        >
                          <span>{{ theme.name }}</span>
                        </v-overlay>
                      </v-fade-transition>
                    </v-card>
                  </template>
                </v-hover>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import themeApi from '@/api/themeApi'
export default {
  name: 'iTheme',
  data () {
    return {
    }
  },
  computed: {
    themes () {
      return this.$store.state.themes
    }
  },
  methods: {
    changeTheme (id) {
      Object.assign(this.$vuetify.theme.themes.light, this.themes[id])
      localStorage.setItem('theme', JSON.stringify(this.themes[id]))
      themeApi.setThemeId(id)
    }
  }
}
</script>

<style scoped>

</style>
