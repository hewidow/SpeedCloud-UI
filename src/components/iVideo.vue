<template>
  <div style="height: 100%" ref="videoBoxRef">
    <link href="https://vjs.zencdn.net/7.17.0/video-js.min.css" rel="stylesheet" />
    <link href="https://unpkg.com/@videojs/themes@1/dist/sea/index.css" rel="stylesheet">
    <v-fade-transition>
      <v-overlay
        color="black"
        opacity="1"
        z-index="6"
        v-if="!light"
      ></v-overlay>
    </v-fade-transition>
    <v-sheet
      color="black"
      :width="width"
      :height="height"
      style="z-index: 7"
    >
      <v-row
        class="fill-height ma-0"
        align="center"
        justify="center"
        v-if="src === ''"
      >
        <v-progress-circular
          indeterminate
          size="64"
          color="grey lighten-5"
        ></v-progress-circular>
      </v-row>
      <video
        id="my-player"
        class="video-js vjs-big-play-centered vjs-theme-sea"
        controls
        :width="width"
        :height="height"
        preload="auto"
        :poster="poster"
        v-else
      >
        <source :src="src"/>
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a
          web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video>
    </v-sheet>
  </div>
</template>

<script>
import videojs from 'video.js'
export default {
  name: 'iVideo',
  props: {
    src: {
      type: String,
      required: true
    },
    poster: String
  },
  data () {
    return {
      width: 0,
      height: 0,
      beforeWidth: -1,
      beforeHeight: -1,
      fullscreenIn: false,
      light: true
    }
  },
  watch: {
    src (val) {
      this.$nextTick(() => {
        if (val !== '') this.init()
      })
    }
  },
  mounted () {
    window.onresize = this.onresize
    document.onfullscreenchange = this.fullscreen
    this.width = this.$refs.videoBoxRef.clientWidth
    this.height = this.$refs.videoBoxRef.clientHeight
  },
  destroyed () {
    window.onresize = null
    document.onfullscreenchange = null
  },
  methods: {
    onresize () {
      if (this.fullscreenIn) {
        this.width = this.beforeWidth
        this.height = this.beforeHeight
      } else {
        this.beforeWidth = this.width
        this.beforeHeight = this.height
        this.width = this.$refs.videoBoxRef.clientWidth
        this.height = this.$refs.videoBoxRef.clientHeight
      }
      document.getElementById('my-player').style.width = this.width + 'px'
      document.getElementById('my-player').style.height = this.height + 'px'
    },
    fullscreen (event) {
      this.fullscreenIn = !!document.fullscreenElement // 判断是否是进入全屏
    },
    init () {
      const Component = videojs.getComponent('Component')
      const SideBar = videojs.extend(Component, {
        constructor: function (player, options) {
          Component.apply(this, arguments)
        },
        createEl: function () {
          return videojs.createEl('div', {
            className: 'vjs-side-bar'
          })
        }
      }) // 创建侧边栏组件类
      const player = videojs('my-player') // 初始化player
      const sideBar = new SideBar(player) // 新建侧边栏对象sideBar
      const Button = videojs.getComponent('Button') // 获取Button组件
      const lightToggle = new Button(player) // 新建按钮对象button
      lightToggle.setAttribute('style', 'width:40px;height:40px;cursor:pointer;display:block;') // 设置按钮style
      lightToggle.addClass('v-icon') // 使用vuetify的v-icon美化
      lightToggle.addClass('mdi') // 使用mdi图标
      lightToggle.addClass('mdi-lightbulb-on') // 灯亮图标
      lightToggle.controlText('关灯') // 设置按钮提示信息
      lightToggle.handleClick = () => {
        this.light = !this.light
        if (this.light) {
          lightToggle.addClass('mdi-lightbulb-on')
          lightToggle.removeClass('mdi-lightbulb-outline')
          lightToggle.controlText('关灯')
        } else {
          lightToggle.addClass('mdi-lightbulb-outline')
          lightToggle.removeClass('mdi-lightbulb-on')
          lightToggle.controlText('开灯')
        }
      } // 灯光切换事件
      sideBar.addChild(lightToggle) // 往侧边栏添加按钮
      const reportToggle = new Button(player)
      reportToggle.setAttribute('style', 'width:40px;height:40px;cursor:pointer;display:block;')
      reportToggle.addClass('v-icon')
      reportToggle.addClass('mdi')
      reportToggle.addClass('mdi-alert-rhombus')
      reportToggle.controlText('申诉')
      reportToggle.handleClick = () => {
        window.alert('暂未开放')
      }
      sideBar.addChild(reportToggle)
      player.addChild(sideBar) // 往player添加侧边栏
    }
  }
}
</script>

<style>
.video-js .vjs-side-bar {
  background: rgba(255, 255, 255, 0.4);
  color: white;
  display: none;
  position: absolute;
  height: 80px;
  top: 35%;
  right: 0
}
.video-js.vjs-paused.vjs-has-started .vjs-side-bar,
.video-js.vjs-user-active.vjs-has-started .vjs-side-bar {
  display: block;
}
#my-player{
  z-index: 7;
}
</style>
