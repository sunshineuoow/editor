const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    index: path.join(__dirname, '../src/index.tsx'),
    mobile: path.join(__dirname, '../src/mobile.tsx')
  },
  output: {
    path: path.resolve(__dirname, '../build/dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf|png|jpg|jpeg|gif)(\?v=[\d\.]+)?$/,
        use: 'file-loader',
        exclude: /node_modules\/antd-mobile/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../src/index.html'),
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: 'mobile.html',
      template: path.join(__dirname, '../src/mobile.html'),
      chunks: ['mobile']
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.less']
  },
  devServer: {
    host: '0.0.0.0',
    port: '9999',
    hot: true
  }
}