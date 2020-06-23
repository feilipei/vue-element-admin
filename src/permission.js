import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

// permission.js vue-router的全局拦截器
// 权限管理
// 在路由跳转的时候，需要一些权限判断或者其他操作。这个时候就需要使用路由的钩子函数
// 路由钩子主要是给使用者在路由发生变化时进行一些特殊的处理而定义的函数。
router.beforeEach(async(to, from, next) => {
  // 在跳转之前执行
  // to:router即将进入的路由对象
  // from:当前导航即将离开的路由
  // next:Function,进行管道中的一个钩子
  // 动态加载路由肯定要在全局做判断，需要写在路由跳转之前router.beforeEach
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // 判断是否有token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info获取用户信息，角色为对象数组
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles 根据角色生成可访问的路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes 动态添加可访问路由表
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // 否则全部重定向到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 在跳转之后执行
  // finish progress bar
  NProgress.done()
})
