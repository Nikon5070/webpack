//basic vars
const path = require('path')
const webpack = require('webpack')

//additional plugins
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')


// function setWebpackConfig(env){

// }


module.exports = (env, options) => {


    let isProduction = options.mode === 'production';

    console.log(`Production? _${isProduction}`);


    let webpackConfig = {
        //базовый путь к проекту
        context: path.resolve(__dirname, 'src'),
        //точки входа JS
        entry: {
            main: [
                './js/app.js',
                './scss/main/style.scss'
            ]
        },

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'js/[name].js',
        },
        devtool: isProduction ?
            '#source-map' : '#cheap-module-eval-source-map',

        module: {
            rules: [{
                    test: /\.js$/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.pug$/,
                    loader: 'pug-loader',
                    options: {
                        pretty: true
                    }
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    include: path.resolve(__dirname, 'src/scss'),
                    use: [
                        // 'style-loader',
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ],
                },
                {
                    test: /\.(png|gif|jpe?g)$/,
                    loaders: [{
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                            },
                        },
                        'img-loader',
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        }
                    }]
                },

            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                inject: false,
                filename: 'index.html',
                template: './templates/views/main.pug',
            }),
            new HtmlWebpackPlugin({
                hash: true,
                inject: false,
                filename: 'about.html',
                template: './templates/views/page.pug',
            }),
            new MiniCssExtractPlugin({
                filename: './css/[name].css',
                chunkFilename: './css/[id].css',
            }),
            new CleanWebpackPlugin(['dist']),
            new CopyWebpackPlugin(
                [{
                        from: './fonts',
                        to: 'fonts'
                    },
                    {
                        from: './images',
                        to: 'images'
                    }
                ], {
                    ignore: [{
                        glob: 'svg/*'
                    }, ]
                }

            )
        ],

    }

    //PRODUCTION ONLY
    if (isProduction) {
        webpackConfig.plugins.push(
            new UglifyJSPlugin({
                sourceMap: true
            })
        );

        webpackConfig.plugins.push(
            new ImageminPlugin({
                test: /\.(jpe?g|png|gif|svg)$/i
            })
        );

        webpackConfig.plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true
            })
        );
    }

    return webpackConfig;

}