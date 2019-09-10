const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const webpack = require('webpack');
const PuriftCSS = require('purifycss-webpack')
const glob = require('glob-all')

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './js/main.js',
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, './dist')
    },
    // 可以自定义寻找依赖模块时的配置
    resolve: {
        alias: {
            '@src': '../src/'
        },
        extensions: ['.js', '.json'],
        modules: [
            // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
            path.resolve(__dirname, 'src'),
            'node_modules'
        ],
        mainFields: ['main'],  //只采用main字段作为入口文件描述字段，减少搜索
    },
    // 输出source-map以方便调试
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendor: { // 将第三方模块提取出来
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10, // 优先
                    enforce: true
                }
            }
        }
    },
    // 解析文件的配置
    module: {
        noParse: /jquery|lodash/,  //忽略未采用模块化的文件，因此jquery或者loadsh将不会被下面的loaders解析
        rules: [
            {
                // 用正则表达式匹配要用该loader转换的css文件
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
                exclude: path.resolve(__dirname, 'node_modules')
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'happypack/loader?id=happyBabel',
                },
                exclude: path.resolve(__dirname, 'node_modules')
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        outputPath: 'images/',   //图片输出的路径
                        limit: 10 * 1024
                    }
                }
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
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
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // 清除无用的css
        new PuriftCSS({
            paths: glob.sync([
                path.resolve(__dirname, './src/*.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
                path.resolve(__dirname, './src/js/*.js')
            ])
        }),
        new MiniCssExtractPlugin({
            // 从.js文件中提取出来的.css文件的名称
            filename: `[name].[contenthash].css`
        }),
        new OptimizeCSSPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                safe: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true // 去除空白
            }
        }),
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
        new ParallelUglifyPlugin({
            uglifyJS: {},
            test: /.js$/g,
            include: [],
            exclude: [],
            cacheDir: '',
            workerCount: '',
            sourceMap: false
        })
    ],
    devServer: {
        stats: 'errors-only', // 只有产生错误的时候，才显示错误信息，日志的输出等级是error.
        overlay: true,// 当有编译错误的时候，在浏览器页面上显示。
        compress: true,  //服务器返回浏览器的时候是否启动gzip压缩
        contentBase: path.join(__dirname, "./dist"),
        publicPath: '/',
        host: '127.0.0.1',
        port: '8089',
        hot: true
    }
}