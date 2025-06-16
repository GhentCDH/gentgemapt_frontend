const webpack = require('webpack')
const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')
const paths = require('./paths')

// plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin');
const fs = require("node:fs");


module.exports = merge(common, {
    // Set the mode to development or production
    mode: 'development',

    // Control how source maps are generated
    devtool: 'inline-source-map',

    // Spin up a server for quick development
    devServer: {
        historyApiFallback: true,
        static: paths.build,
        open: false,
        compress: true,
        hot: true,
        port: 8080,
        // overlay: false
        proxy: [
          {
            context: ['/config.json'],
            selfHandleResponse: true,
            bypass(req, resp) {
              // resp.header("Content-Type", "application/json");
              fs.createReadStream(`./config.json`).pipe(resp);
            },
          },
        ],
    },

    module: {
        rules: [
            // Styles: Inject CSS into the head with source maps
            {
                test: /\.(scss|css)$/,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    {loader: 'css-loader', options: {sourceMap: true, importLoaders: 1, modules: false}}, // css modules disabled
                    {loader: 'postcss-loader', options: {sourceMap: true}},
                    {loader: 'resolve-url-loader'},
                    // Compiles Sass to CSS
                    {loader: 'sass-loader', options: {sourceMap: true}},
                ],
            },
        ]
    },

    plugins: [
        // Only update what has changed on hot reload
        new webpack.HotModuleReplacementPlugin(),

        // new BundleAnalyzerPlugin(),
    ],
})
