import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入。axios是第三方组件，不是vue自带组件，所以不能用Vue.use(axios)。
// 使用Vue.use注册插件。
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
// 注册或获取全局过滤器。
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

new Vue({
  el: '#app', // .$mount('#app')
  router, // 挂载路由，将路由对象传递给Vue的实例, 路由就是SPA（单页应用）的路径管理器
  store, // 每一个 Vuex 应用的核心就是 store（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的状态
  // 将h作为createElement的别名是 Vue 生态系统中的一个通用惯例，render函数是渲染一个视图，然后提供给el挂载
  // 这是 es 6 的语法，表示 Vue 实例选项对象的 render 方法作为一个函数，接受传入的参数 h 函数，返回 h(App) 的函数调用结果。
  // Vue 在创建 Vue 实例时，通过调用 render 方法来渲染实例的 DOM 树。
  render: h => h(App) // 等价于components: { App }  vue1.0的写法
})

// main.js作为项目的入口文件，运行中找到其vue实例需要挂载的位置
// 入口文件 加载组件 初始化等
