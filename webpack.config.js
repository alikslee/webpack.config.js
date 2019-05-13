const path = require('path')
const glob = require('glob-all')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][hash:6].bundle.js'
    },
    mode: 'production',
    module: {
        rules: [{
                test: /\.less$/, //less的解析
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: [
                            require('autoprefixer')(),
                            require('cssnano')()
                        ]
                    }
                }, 'less-loader']
            },
            {
                test: /\.css$/, //css解析
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: [
                            require('autoprefixer')(),
                            require('cssnano')()
                        ]
                    }
                }]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ //处理html
            filename: 'resume.hrml', //输出的文件名
            template: './resume.html', //参照的模板
            minify: {
                removeComments: true, //去掉注释
                collapseWhitespace: true, //压缩
                collapseInlineTagWhitespace: true, //去掉行级元素的间隙
                removeAttributeQuotes: true //去掉引号
            }
        }),
        new MiniCssExtractPlugin({ //抽离css
            filename: '[name][hash:6].css'
        }),
        new PurifyCSSPlugin({ //css抖动
            paths: glob.sync([path.join(__dirname, './*.html'), path.join(__dirname, '.src/*.js')]),
        }),
        new webpack.ProvidePlugin({ //自动获取依赖
            jquery: 'jquery'
        }),
        new WebpackDeepScopeAnalysisPlugin() //深度抽离js,必须在css抖动之后
    ]
}