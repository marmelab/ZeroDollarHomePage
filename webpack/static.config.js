import loaders from './loaders';
import plugins from './plugins';
import resolve from './resolve';

module.exports = {
    entry: {
    },
    module: {
        loaders: loaders('static'),
    },
    output: {
        path: __dirname + '/../build',
        publicPath: '/',
    },
    plugins: plugins('static'),
    resolve: resolve('static'),
    devServer: {
        historyApiFallback: true,
    },
};
