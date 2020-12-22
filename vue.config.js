
// // 引入等比适配插件
// const px2rem = require('postcss-px2rem')

// // 配置基本大小
// const postcss = px2rem({
//   // 基准大小 baseSize，需要和rem.js中相同
//   remUnit: 12
// })
module.exports = {
  // lintOnSave: true,
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        data: `
                      @import "@/global.scss";
                      @import "@/其他.scss";
            `
      },
      // postcss: {
      //   plugins: [
      //     postcss
      //   ]
      // }
    }
  },
  chainWebpack: config => {
    // svg rule loader
    // const svgRule = config.module.rule('svg') // 找到svg-loader
    // svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
    // svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
    // svgRule // 添加svg新的loader处理
    //   .test(/\.svg$/)
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')
    //   .options({
    //     symbolId: 'icon-[name]',
    //   })
    // // 修改images loader 添加svg处理
    // const imagesRule = config.module.rule('images')
    // imagesRule.exclude.add(resolve('src/assets/icons'))
    // .rule('images')
    // .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)

    config.module
      .rule('css')
      .test(/\.css$/)
      .oneOf('vue')
      .resourceQuery(/\?vue/)
      .use('px2rem')
      .loader('px2rem-loader')
      .options({
        remUnit: 192
      })

    // .loader('css-loader')
    // .options({ sourceMap: options.sourceMap })



  },

  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],

  devServer: {
    proxy: {
      '/api': {
        target: 'http://yingyan.baidu.com/api/',
        // target: 'http://yingyan.baidu.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/': {
        target: 'http://192.168.3.220:8083/'
      }
    }
  },
  // 打包去掉console.log
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
}