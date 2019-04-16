// 一个简单的 webpack.config.js 文件
var path = require('path');
var webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 抽取css，单独打包
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// 打包公共模块代码
//var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
    // webpack 进行打包的入口文件
    entry: {
        index: './src/index.jsx',

        //vendor: ['react', "react-dom"] // 这里是依赖的库文件配置，和CommonsChunkPlugin配合使用可以单独打包
    },
    // webpack 打包后的输出文件的路径
    output: {
        path: path.join(__dirname, 'OpenPlanet'), // 文件放至当前路径下的 dist 文件夹
        filename: './js/bundle.js', // 将打包后的输出文件命名为bundle.js
        publicPath: './' // html中资源文件的访问路径
        //publicPath: path.resolve(__dirname, 'OpenPlanet')
    },
    // 加载器配置
    module: {
        rules: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: "css-loader"
                }]
            })
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "less-loader"
                }]
            })
        }, {
            // 图片加载器
            test: /\.(png|jpg|gif|ico)$/,
            use: {
                loader: 'file-loader?name=img/[hash:8].[name].[ext]'
            }

        }, {
            test: /\.json$/,
            use: 'json-loader'
        }]
    },
    // 加载时省略的扩展名
    resolve: {
        extensions: ['.js', '.json', '.jsx', ".css"]
    },
    devServer: {
        contentBase: path.join(__dirname, "OpenPlanet"),
        compress: false,
        port: 9000,
        inline: true, // 修改代码刷新页面
        overlay: true, // 调试时，如有编译错误，会显示在界面上
        historyApiFallback: true // 404跳转到根目录
    },
    devtool: "source-map", //"cheap-module-eval-source-map",
    plugins: [
        new OpenBrowserPlugin({
            url: 'http://localhost:9000'
        }),
        // 根据模板插入css/js等生成最终HTML
        new HtmlWebpackPlugin({
            favicon: './src/com/efounder/react/resources/ewallet/system.png', // favicon路径
            filename: 'index.html', // 生成的html存放路径，相对于 path
            template: './src/index.html', // html模板路径
            inject: true, // 允许插件修改哪些内容，包括head与body
            hash: true, // 为静态资源生成hash值
            minify: { // 压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        }),
        // 分离css
        new ExtractTextPlugin({
            filename: "./css/styles.css",
            disable: process.env.NODE_ENV === "development"
        }),
        // 公共代码单独打包
        /*new CommonsChunkPlugin({
            name: 'vendor',
            filename: './js/vendor.js',
            minChunks: Infinity
        })*/
    ]
}