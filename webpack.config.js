const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool: 'eval',
    context: path.resolve(__dirname, 'src'),
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
        contentBase: path.resolve(__dirname, 'dist'),
        historyApiFallback: true,
        inline: true
    }
};
