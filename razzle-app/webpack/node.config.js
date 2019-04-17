const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/server/views", to: "views" },
            { from: "config", to: "config" }
        ])
    ]
};