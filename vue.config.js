/* eslint-disable linebreak-style */
const merge = require('deepmerge');
const path = require('path');

const resolve = dir => path.join(__dirname, dir);
module.exports = {
    publicPath: '/',

    // tweak internal webpack configuration.
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_c', resolve('src/view/components'))
            .set('_conf', resolve('config'));

        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => merge(options, {
                loaders: {
                    i18n: '@kazupon/vue-i18n-loader',
                },
            }));
    },

    css: {
        // 配置高于chainWebpack中关于css loader的配置
        loaderOptions: {
            // css预设器配置项
            less: {
                javascriptEnabled: true,
            },
        },
    },

    transpileDependencies: [
        /\bvue-echarts\b/,
        /\bresize-detector\b/,
        /\bview-design\/src\/locale\/lang\b/,
    ],

    devServer: {
        open: true,
        compress: true,
        // 解决 Webpack "Invalid Host Header"
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://events.admin.wdcloud.cc/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api',
                },
            },
        },
    },
};
