var path = require('path')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: ExtractTextWebpackPlugin.extract({
        /* 提取出文件用什么处理 */
        fallback: {
          loader: 'style-loader',
          options: {
            /* singleton(是否只使用一个 style 标签) */
            singleton: true,
            /* transform(转化, 浏览下, 插入页面前, 根据不同浏览器配置不同样式) */
            transform: './css.transform.js'
          }
        },
        use: [{
            loader: 'css-loader',
            options: {
              /* 是否压缩 */
              minimize: true,
              /* 启用 css-modules */
              modules: true,
              /* 定义编译出来的名称 */
              localIdentName: '[path][name]_[local]_[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                /* 加 css 各浏览器前缀 */
                require('autoprefixer')(),
                /* 使用未来的 css 语法 */
                require('postcss-cssnext')(),
                /* 压缩优化 css */
                require('cssnano')()
              ]
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      })
    }]
  },
  plugins: [
    /* 提取 css */
    new ExtractTextWebpackPlugin({
      filename: '[name].min.css',
      /* 指定提取css范围, 提取初始化 */
      allChunks: false
    })
  ]
}