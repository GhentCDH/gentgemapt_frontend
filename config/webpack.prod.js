const paths = require('./paths')
const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')

// plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin');

// config
module.exports = merge(common, {
    mode: 'production',
    devtool: false,
    output: {
        path: paths.build,
        publicPath: '/',
        filename: 'js/[name].[contenthash].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: false,
                            modules: false, // css modules disabled
                        },
                    },
                    {loader: 'postcss-loader', options: {sourceMap: false}},
                    {loader: 'resolve-url-loader'},
                    {loader: 'sass-loader', options: {sourceMap: true}},
                ],
            },
        ],
    },
    plugins: [
        // Extracts CSS into separate files
        // Note: style-loader is for development, MiniCssExtractPlugin is for production
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css',
            chunkFilename: '[id].css',
        }),

        // partials
        new HtmlWebpackPartialsPlugin({
            path: paths.src + '/partials/analytics.html',
            location: 'head',
            priority: 'high'
        })

    ],
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), '...'],
        // Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
        // instead of having their own. This also helps with long-term caching, since the chunks will only
        // change when actual code changes, not the webpack runtime.
        runtimeChunk: {
            name: 'runtime',
        },
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
})
