<template>
  <v-app>
    <i-app-bar is-not-opacity>
      <template v-slot:menu>
        <i-user-panel></i-user-panel>
      </template>
    </i-app-bar>
    <v-main style="background-color: #EEEEEE">
      <v-container class="fill-height align-content-start">
        <v-row style="height: 48px">
          <v-col>
            <v-subheader class="font-weight-medium text-h6">{{ name }}</v-subheader>
          </v-col>
        </v-row>
        <v-row style="height: calc(100% - 48px)">
          <v-col class="mx-auto" style="height: 100%">
            <i-video
              :src="src"
              :poster="poster"
              v-if="type === fileSuffix.VIDEO.type"
            ></i-video>
            <i-pdf
              :src="src"
              :type="type"
              v-else-if="type === fileSuffix.PDF.type"
            ></i-pdf>
            <v-card
              v-else
              height="100%"
              outlined
              style="background-color: #DDDDDD"
              class="d-flex align-center justify-center flex-column"
            >
              <div>
                <v-icon
                  size="256"
                  :color="suffix.icon.color"
                >{{ suffix.icon.name }}</v-icon>
              </div>
              <div>该类型不支持在线浏览</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { fileSuffix, fileApi } from '@/api/fileApi'
import iAppBar from '@/components/iAppBar'
import iUserPanel from '@/components/iUserPanel'
import iVideo from '@/components/iVideo'
import iPdf from '@/components/iPdf'
import { mapState } from 'vuex'

export default {
  name: 'Play',
  components: {
    iAppBar,
    iUserPanel,
    iVideo,
    iPdf
  },
  data () {
    return {
      fileSuffix: fileSuffix,
      id: 0,
      type: fileSuffix.DEFAULT.type,
      name: '测试',
      poster: '',
      src: ''
    }
  },
  computed: {
    ...mapState(['token']),
    suffix () {
      return fileApi.getSuffixData(fileApi.getSuffix(this.name))
    }
  },
  created () {
    this.name = this.$route.query.name
    this.type = Number(this.$route.query.type)
    this.id = this.$route.query.id
    if (this.type === fileSuffix.VIDEO.type) {
      fileApi.playVideo(this.id)
        .then((r) => {
          this.src = r.data.data.url
        })
        .catch((e) => {
        })
    } else {
      this.src = fileApi.play(this.token, this.id)
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
