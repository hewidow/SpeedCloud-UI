import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/account',
    component: () => import('../views/front/Account'),
    alias: '/' // 别名是'/'，意味着根地址也是登录界面
  },
  {
    path: '/test',
    component: () => import('../views/front/test')
  },
  {
    path: '/home',
    component: () => import('../views/front/Home'),
    redirect: '/home/all',
    children: [
      {
        path: 'all',
        component: () => import('../views/front/All'),
        meta: {
          title: '全部文件'
        }
      },
      {
        path: 'recycle',
        component: () => import('../views/front/Recycle'),
        meta: {
          title: '回收站'
        }
      }
    ]
  },
  {
    path: '/play',
    component: () => import('../views/front/Play'),
    meta: {
      title: '在线浏览'
    }
  },
  {
    path: '/share',
    component: () => import('../views/front/Share'),
    meta: {
      title: '分享'
    }
  },
  {
    path: '/404',
    component: () => import('../views/front/NotFound'),
    meta: {
      title: '页面不存在'
    }
  },
  {
    path: '*',
    redirect: to => {
      return {
        path: '/404',
        query: null
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

const acceptUrl = ['/', '/account', '/share', '/404', '/test'] // 不需要token的url
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (acceptUrl.indexOf(to.path) === -1) { // 如果是进入需要token的url
    if (token) next() // 有token，放行
    else next('/account') // 无token，跳转到登录界面
  } else { // 如果是无需token的url
    if ((to.path === '/' || to.path === '/account') && token) next('/home') // 有token，且是登录界面，则跳转到home界面
    else next() // 否则放行
  }
})
router.afterEach((to, from) => {
  // 如果目标路由是登录界面，则记录起始路由，为登录后跳转到哪做准备
  if (to.path === '/' || to.path === '/account') sessionStorage.setItem('beforeRouter', JSON.stringify(from.fullPath))
  console.log(to.path)
  document.title = 'SpeedCloud'
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + document.title // 设置网页标题
  }
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch((err) => err)
}
export default router
