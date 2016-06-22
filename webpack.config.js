const webpack = require('webpack');
const { resolve } = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool: 'eval',
    context: resolve(__dirname, 'src'),
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react', 'stage-1'],
                plugins: ['transform-decorators-legacy']
            }
        }]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './index.html'
        })
    ],
    devServer: {
        contentBase: resolve(__dirname, 'dist'),
        colors: true,
        historyApiFallback: true,
        inline: true
    }
};
