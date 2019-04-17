const merge = require('webpack-merge');

const webpackWebConfig = require('./webpack/web.config.js');
const webpackWebDevConfig = require('./webpack/web.dev.config.js');
const webpackWebProdConfig = require('./webpack/web.prod.config.js');
const webpackNodeConfig = require('./webpack/node.config.js');

module.exports = {
    plugins: [
        {
            name: 'typescript',
            options: {
                useBabel: true
            }
        }
    ],
    modify: (config, { target, dev }) => {
        if (target === 'web') {
            config = merge(config, webpackWebConfig);
            if (dev) {
                return merge(config, webpackWebDevConfig);
            }

            return merge(config, webpackWebProdConfig);
        }

        if (target === "node") {
            config = merge(config, webpackNodeConfig);
        }

        return config;
    }
}