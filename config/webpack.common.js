const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const {VueLoaderPlugin} = require("vue-loader");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const paths = require('./paths')
const webpack = require('webpack');
const path = require('path');

const Dotenv = require('dotenv-webpack');


module.exports = {
    // Where webpack looks to start building the bundle
    entry: [paths.src + '/main.js'],

    // Where webpack outputs the assets and bundles
    output: {
        path: paths.build,
        filename: '[name].bundle.js',
        publicPath: '/',
    },

    // Customize the webpack build process
    plugins: [
        // VueJS loader
        new VueLoaderPlugin(),

        // Removes/cleans build folders and unused assets when rebuilding
        new CleanWebpackPlugin(),

        // Copies files from target to destination folder
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: paths.public,
                    to: 'assets',
                    globOptions: {
                        ignore: ['*.DS_Store'],
                    },
                    noErrorOnMissing: true,
                },
            ],
        }),

        // Generates an HTML file from a template
        // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
        new HtmlWebpackPlugin({
            template: paths.src + '/index.html', // template file
            filename: 'index.html', // output file
        }),

        new webpack.IgnorePlugin({
            resourceRegExp: /@blueprintjs\/(core|icons)/, // ignore optional UI framework dependencies
        }),
    ],

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(paths.src),
        },
        extensions: ["*", ".js", ".vue", ".json"],
    },

    // Determine how modules within the project are treated
    module: {
        rules: [
            // JavaScript: Use Babel to transpile JavaScript files
            {
                test: /\.js$/,
                use: ['babel-loader']
            },

            // Images: Copy image files to build folder
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
                type: 'asset/resource'
            },

            // Fonts: Inline files
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/,
                type: 'asset/resource',
                dependency: { not: ['url'] },
                // use: {
                //     loader: 'file-loader',
                //     options: {
                //         name: '[name].[ext]',
                //         outputPath: 'fonts/'
                //     }
                // }
            },

            // Vue js
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
        ],
    },
}
