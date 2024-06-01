/*
vue-cli@4: https://cli.vuejs.org/zh/guide/
webpack@4: https://v4.webpack.js.org/concepts/
 */

const isProduction = process.env.NODE_ENV === 'production' // 是否是生产环境，相对的是开发环境
const CompressionPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const cdn = {
  css: [],
  js: [
    'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
    'https://cdn.jsdelivr.net/npm/vuex@3.6.2/dist/vuex.min.js',
    'https://cdn.jsdelivr.net/npm/vue-router@3.5.3/dist/vue-router.min.js',
    'https://cdn.jsdelivr.net/npm/axios@0.21.4/dist/axios.min.js',
    'https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js',
    'https://cdn.jsdelivr.net/npm/vuetify@2.6.1/dist/vuetify.min.js',
    'https://vjs.zencdn.net/7.17.0/video.min.js',
    'https://cdn.jsdelivr.net/npm/viewerjs@1.10.2/dist/viewer.min.js'
  ]
} // 生产环境的cdn
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  devServer: { // 开发环境解决跨域问题
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4399',
        changeOrigin: true
      }
    }
  },
  productionSourceMap: false,
  configureWebpack: config => {
    if (isProduction) {
      config.mode = 'production'
      config.plugins.push(
        // 压缩太大的资源为gzip
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8
        }),
        // 去除控制台输出信息
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_debugger: true,
              drop_console: true
            }
          },
          sourceMap: false,
          parallel: true
        })
      )
      /*
        用处：告诉webpack不将以下的包打包
        举例：
        import a from 'b'
        就写
        b: 'x' (写暴露的全局对象名，不知道可以进对应的js文件看看export default是啥)
        这样设置后当npm run build就会自动将from 'b'的部分替换为注册好的全局变量
        不需要修改main.js
       */
      config.externals = {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        'spark-md5': 'SparkMD5',
        vuetify: 'Vuetify',
        'video.js': 'videojs',
        viewerjs: 'Viewer'
      }
    } else {
      config.mode = 'development'
    }
  },
  chainWebpack: config => {
    if (isProduction) {
      config
        .plugin('html')
        .tap(args => {
          args[0].title = 'SpeedCloud'
          args[0].cdn = cdn // 设置cdn
          return args
        })
    } else {
      config
        .plugin('html')
        .tap(args => {
          args[0].title = 'SpeedCloud'
          args[0].cdn = {
            css: [],
            js: []
          } // 使用本地node_modules
          return args
        })
    }
  }
}
