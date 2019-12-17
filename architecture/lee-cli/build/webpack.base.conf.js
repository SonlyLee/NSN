const path = require('path')
const resolve = (dir) => path.join(__dirname, '..', dir)
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
// const devMode = process.env.NODE_ENV !== 'production';

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/
const getStyleLoaders = (preProcessor) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        {
            loader: 'css-loader',
        },
        {
            loader: "postcss-loader"
        }
    ]
    if (preProcessor) {
        loaders.push({
            loader: preProcessor
        })
    }
    return loaders
}
module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        path: resolve('dist')   //输出的目录，对应一个绝对路径
    },
    resolve: {
        extensions: [".js", ".jsx"],  //模块默认的后缀
        alias: {
            '@src': path.resolve(__dirname, '../src/'),
            pages: path.resolve(__dirname, '../src/pages'),
            router: path.resolve(__dirname, '../src/router')
        }
    },
    module: {
        rules: [
            // @babel/core babel的核心库
            // @babel/preset-env把es6，es7语法换成es5
            // @babel/preset-react 把react语法转换为es5
            // @babel/plugin-transform-runtime 支持一些es6，es7的新语法
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                include: resolve('src')
            },
            // 编译css
            {
                test: cssRegex,
                exclude: cssModuleRegex,
                loader: getStyleLoaders(),
            },
            // 编译sass
            {
                test: sassRegex,
                exclude: sassModuleRegex,
                loader: getStyleLoaders('sass-loader')
            },
            {
                test: /\.(eot|woff2|ttf|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash:5].min.[ext]',
                            limit: 5000,
                            publicPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        outputPath: 'images/',   //图片输出的路径
                        esModule: false,  //启用common.js的语法，允许使用require()
                        name: '[name].[contenthash].[ext]',
                        //注意limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
                        limit: 10*1024
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // css单独提取
        new MiniCssExtractPlugin({
            filename: `css/[name].[contenthash].css`,
        }),
        new OptimizeCSSPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                safe: true
            }
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: 'body', // true：默认值，script标签位于html文件的 body 底部
            minify: {
                removeComments: true, //去注释
                collapseWhitespace: true, //压缩空格
                removeAttributeQuotes: true //去除属性引用
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

// hash一般是结合CDN缓存起来使用，通过webpack构建之后，生成对应文件名自动带上MD5的值。如果文件内容改变的话，
// 那么对应文件哈希值也会改变,对应的html引用的url地址也会改变,触发cdn服务器从源服务器上拉去对应的数据,进而进行本地缓存.
// hash每一次构建后生成的哈希值不一样,及是文件内容压根没有改变.

// chunkhash和hash不一样,它根据不同的入口文件进行依赖文件解析，构建对应chunk，生成对应的哈希值。
// 在生产环境里面把公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，
// 只要我们不该懂公共库的代码，就可以保证哈希值不受影响。

// 在chunkhash的例子，我们可以看到，由于index.css被index.js引用了，
// 所以共用相同的chunkhash值，但是如果index.js更改了代码，css文件就算内容没有任何改变，由于该模块发生了改变，导致css文件会重复构建。
// 这个时候，需要使用插件里面的contenthash值，将css文件与js文件分隔开，就算其他文件内容改变，只要css文件内容不改变，name不会重复构建。