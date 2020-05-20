'use strict';
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const version = 'v1.1.1';
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//提取公共模块,其的依赖
const webpack = require('webpack');
//压缩混淆
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    //入口
    entry: {
        main: './src/main.js',
        //再加一个入口
        vendors: ['vue', 'vue-router', 'moment', 'axios', 'vue-preview'],
    },
    output: {
        //所有产出资源路径
        path: path.join(__dirname, 'dist_production'),
        //设置资源路径的请求地址
        //  style.css ->  /css/   assets/mui.ttf
        //  load的时候配置的name属性 assets/mui.ttf
        publicPath: '/', // 企业中也可以是www.baidu.com/

        // filename: 'build.js?v=1.1.1'   dasdsasa2s3e43
        filename: 'js/[name].[chunkhash:6].js',
    },
    module: {
        loaders: [{
            test: /\.css$/,
            // loader: 'style-loader!css-loader!autoprefixer-loader'
            // 打包提取css
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader!autoprefixer-loader"
            })
        },
        {
            test: /\.less$/,
            loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
        },
        {
            test: /\.(jpg|png|svg|ttf|woff|woff2|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 4096, //4096字节以上生成文件，否则base6
                name: 'assets/[name].[ext]'
            }
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            // options: {   如果多次使用babel-loader就需要多次options
            //     presets: ['es2015'], //关键字
            //     plugins: ['transform-runtime'], //函数
            // }
        },
        // 解析vue-preview的es6代码
        {
            test: /vue-preview.src.*?js$/,
            loader: 'babel-loader',
            // options: {   建议使用.babelrc文件，在当前根目录就可以了
            //     presets: ['es2015'], //关键字
            //     plugins: ['transform-runtime'], //函数
            // }
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        }
        ]
    },
    plugins: [
        //压缩混淆代码
        new UglifyJSPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            //manifest 清单，用来记录使用者和第三方包的依赖关系
            names: ['vendors', 'manifest']
        }),
        //提取css插件，设置名称
        new ExtractTextPlugin("css/style.[contenthash:6].css"),
        new htmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ]
}