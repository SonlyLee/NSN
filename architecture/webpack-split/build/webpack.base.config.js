const path = require("path")
const webpack = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

module.exports = {
    entry: ["./src/index.js"],
    output: {
        // 输出目录
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            '@': path.resolve(__dirname, '../src'),
            pages: path.resolve(__dirname, '../src/pages'),
            router: path.resolve(__dirname, '../src/router')
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "happypack/loader?id=happyBabel"
                    }
                ]
            },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader", //编译css
                    "postcss-loader",  //使用postcss为css加上浏览器前缀
                    "sass-loader"  //编译scss
                ]
            },
            {
                test: /\.(eot|woff2|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[hash:5].min.[ext]',
                            limit: 5000,
                            publicPath: 'fonts/',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: "url-loader",
                    options: {
                        outputPath: "images/",   //图片输出的路径
                        limit: 10 * 1024
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/template.html'),   //指定模板路径
            filename: 'index.html',
            minify: {
                collapseWhitespace: true   // 去除空白
            }
        }),
        // 暴露全局变量，可以直接在全局使用$变量
        new webpack.ProvidePlugin({ $: 'jquery' }),
        new HappyPack({
            id: 'happyBabel',
            loaders: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [
                            ['@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    "corejs": 3,
                                    targets: {
                                        edge: '17', // edge高于17的版本
                                        firefox: '60', // firefox 高于60的版本
                                        chrome: '67'  // chrome高于67的版本
                                    }
                                }
                            ],
                            // 处理react
                            "@babel/preset-react"
                        ]
                    }
                }
            ],
            threadPool: happyThreadPool,
            verbose: true
        }),
        // css单独提取
        new MiniCssExtractPlugin({
            filename: `[name].[contenthash].css`
        }),
        new OptimizeCSSPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                safe: true
            }
        }),
        new ParallelUglifyPlugin({
            uglifyJS: {},
            test: /.js$/g,
            include: [],
            exclude: [],
            cacheDir: '',
            workerCount: '',
            sourceMap: false
        })
    ]
}