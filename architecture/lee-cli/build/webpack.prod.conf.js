const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf.js')
const BundleAnalyzer = require('webpack-bundle-analyzer')
const webpack = require("webpack")
const path = require("path")
module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    output: {
        filename: "js/[name].[chunkhash].js"
    },
    optimization: {
        usedExports: true,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                commons: {
                    // async 设置提取异步代码中的公用代码
                    chunks: 'async',
                    minChunks: 2,// 至少为两个 chunks 的公用代码
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new BundleAnalyzer.BundleAnalyzerPlugin()
    ]
})