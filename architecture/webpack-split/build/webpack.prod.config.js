const path = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const commonConfig = require("./webpack.base.config.js")
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')
const WorkboxPlugin = require('workbox-webpack-plugin')   //引入PWA插件

module.exports = merge(commonConfig, {
    mode: "production",
    output: {
        // 输出目录
        path: path.resolve(__dirname, "../dist"),
        // 文件名称
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js'
    },
    devtool: 'cheap-module-source-map',
    optimization: {
        // 清除到代码中无用的js代码，只支持import方式引入，不支持common.js的方式引入
        // 只要是mode是prodution就会生效，development的tree shaking是不生效的，因为webpack为了方便你的调试
        usedExports: true,
        splitChunks: {
            chunks: "all",    //所有的chunks代码公共的部分分离出来成为一个单独的文件
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                jquery: {
                    name: 'jquery',
                    test: /[\\/]node_modules[\\/]jquery[\\/]/
                },
                vendor: { // 将第三方模块提取出来
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10, // 优先
                    enforce: true
                }
            }
        }
    },
    plugins: [
        // 清除无用的css---生产环境---csstree-shaking
        new PurifyCSS({
            // 清除无用的css
            paths: glob.sync([
                // 要做CSS Tree Shaking的路径文件
                path.resolve(__dirname, '../src/*.html'),
                path.resolve(__dirname, '../src/*.js'),
                path.resolve(__dirname, '../src/**/*.jsx'),
            ])
        }),
        // PWA配置，生产环境才需要
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        }),
        // 通过运行npm run build:dll，多了dll文件夹，jquery现在已经单独打包了，通过下面插件将dd.js文件注入到生成的index.html中.
        new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, '../dll/jquery.dll.js')
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '../dll/jquery-manifest.json')
        })
    ]
})