const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        index: "./src/index.tsx"
    },
    mode: "development",
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: { noEmit: false },
                        }
                    }],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "manifest.json", to: "../manifest.json" },
                { from: "background.js", to: "../background.js" },
            ],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'statics', // Source folder (relative to your project root)
                    to: 'statics', // Destination folder inside 'dist'
                },
            ],
        }),
        ...getHtmlPlugins(["index"]),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js",
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'), // Serve static files from "dist"
        },
        port: 3000, // Specify a port
        open: true, // Automatically open the browser
        hot: true, // Enable Hot Module Replacement
        historyApiFallback: true, // Serve index.html for SPA routes
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "React extension",
                filename: `${chunk}.html`,
                chunks: [chunk],
                template: path.resolve(__dirname, "template.html"),
            })
    );
}