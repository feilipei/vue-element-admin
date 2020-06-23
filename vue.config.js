'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

// vue.config.js 是一个可选的配置文件，如果项目的 (和 package.json 同级的)
// 根目录中存在这个文件，那么它会被 @vue/cli-service 自动加载。

// 路径拼接
function resolve(dir) {
  return path.join(__dirname, dir)
}

// 表达式a || 表达式b :   计算表达式a（也可以是函数）的运算结果，
//                       如果为 Fasle, 执行表达式b（或函数），并返回b的结果；
//                       如果为 True，返回a的结果；
const name = defaultSettings.title || 'vue Element Admin' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

// vue.config.js这个文件应该导出一个包含了选项的对象：
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  // 当使用webpack命令进行打包上生产时，它确实是在静态资源路径前面加上publicPath的值。 但是当我们使用webpack-dev-server 进行开发时，
  // 它却不是在静态文件的路径上加publicPath的值，相反它指的是webpack-dev-server 在进行打包时生成的静态文件所在的位置，publicPath的使用是分环境的。
  publicPath: '/', //  基本路径
  outputDir: 'dist', // 输出文件目录
  assetsDir: 'static', //  放置静态资源的目录
  lintOnSave: process.env.NODE_ENV === 'development', // 是否在保存的时候使用 `eslint-loader` 进行检查。
  productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  // dev-server 使用了非常强大的 http-proxy-middleware 包。
  devServer: {
    // 指定要监听请求的端口号
    port: port,
    // 告诉 dev-server 在 server 启动后打开浏览器。默认禁用。
    open: true,
    // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层。默认禁用。
    overlay: {
      warnings: false,
      errors: true
    },
    // 如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器。
    // 接口用代理, 静态文件用本地.
    // proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      // NODE_ENV 和 BASE_URL 是两个特殊变量，在代码中始终可用
      // [process.env.VUE_APP_BASE_API]: {
        // 目标 API 地址，即代理路径，target中设置服务器地址
      //  target: `http://127.0.0.1:${port}/mock`,
        // 允许跨域
     //   changeOrigin: true,
        // 路径重写：重定向或者重新赋值的功能。
     //   pathRewrite: {
          // 如果接口中没有VUE_APP_BASE_API的，那就直接置空
     //     ['^' + process.env.VUE_APP_BASE_API]: ''
     //   }
     // }
    // },
    before: require('./mock/mock-server.js')
  },
  // Webpack相关配置
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // config.plugins.delete('preload')

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
