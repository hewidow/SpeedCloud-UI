/**
 * 图片api
 */
const imageApi = {
  /**
   * 轮播图集合
   * @type {CarouselImage[]}
   */
  carousel: [
    /**
     * 轮播图信息
     * @typedef {Object} CarouselImage
     * @property {String} src 忘记密码
     * @property {String} text 轮播图文字
     */
    {
      // src: require('../assets/carousel/bg0.jpg'),
      src: 'https://gitee.com/heguangfu/picture-bed/raw/master/bg0.jpg',
      text: '“ 在线浏览 \n  文件即开即看 ”'
    },
    {
      // src: require('../assets/carousel/bg1.jpg'),
      src: 'https://gitee.com/heguangfu/picture-bed/raw/master/bg1.jpg',
      text: '“ 好友分享 \n  共享幸福时光 ”'
    }
  ],
  /**
   * 分享页面背景图
   * @type {String}
   */
  shareBackground: 'https://gitee.com/heguangfu/picture-bed/raw/master/bg.png'
}
// 使用码云的链接，console上会有error，而且还看不到error的详细信息，不知道怎么回事，其他第三方图床就没有这个问题
export default imageApi
