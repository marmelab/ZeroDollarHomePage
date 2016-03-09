import HtmlWebpackPlugin from 'html-webpack-plugin';
import resolve from './resolve';
import { definePlugin, extractTextPlugin } from './plugins';

module.exports = {
    entry: {
        index: [
            __dirname + '/../src/static/index.html',
        ],
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'html',
        }],
    },
    output: {
        filename: 'static/[name].html',
        path: __dirname + '/../build',
        publicPath: '/',
    },
    plugins: [
        definePlugin(),
        extractTextPlugin('static'),
        new HtmlWebpackPlugin({
            filename: 'static/index.html',
            template: __dirname + '/../src/static/index.html',
            hash: true,
        }),
    ],
    resolve: resolve('static'),
    devServer: {
        historyApiFallback: true,
    },
};
