const { InjectManifest } = require('workbox-webpack-plugin');
const webpack = require("webpack");
const path = require("path");

module.exports = {
    performance: {
        hints: 'warning',
        maxEntrypointSize: 500000,
        maxAssetSize: 500000
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|ru/),
        new InjectManifest({
            swSrc: path.resolve('src', 'service-worker.js'),
            swDest: path.resolve('build/public/', 'service-worker.js')
        })
    ]
};