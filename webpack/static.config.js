import plugins from './plugins';
import resolve from './resolve';

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
    plugins: plugins('static'),
    resolve: resolve('static'),
    devServer: {
        historyApiFallback: true,
    },
};
