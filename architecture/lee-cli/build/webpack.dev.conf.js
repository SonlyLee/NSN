const path = require('path')
const merge = require('webpack-merge')
const baseWebpackPlugin = require('./webpack.base.conf.js')
const webpack = require('webpack')
const mock = require('dynamic-mock-express')

module.exports = merge(baseWebpackPlugin, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "js/[name].js"
    },
    devtool: 'cheap-module-eval-source-map',
    // source-map每个module生成对应的map文件
    // eval 每一个module模块执行eval，不生成map文件，在尾部生成一个sourceURL对应前后关系，所以更快
    // cheap 列信息 VLQ编码
    // module 包含了模块之间的sourcemap
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        port: '8080',
        contentBase: path.join(__dirname, '../public/'), // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
        compress: true, // 一切服务都启用gzip 压缩
        historyApiFallback: true,//该选项的作用所有的404都连接到index.html,
        hot: true,
        https: false,
        noInfo: true,
        // 在页面上全屏输出报错信息
        overlay: {
            warnings: true,
            errors: true
        },
        open: true,
        host: "localhost",  //手机可以访问
        before (app, server) {
            app.use(
              mock({
                mockDir: path.resolve(__dirname, '../mock')
              })
            )
        }
        // proxy: {
        //     // 代理到后端的服务端地址
        //     "/api": "http://localhost：3000"
        // }
    }

})