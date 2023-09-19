"use strict";

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const DotenvPlugin = require("dotenv-webpack");

module.exports = {
  entry: {
    content: "./src/content.js",
    pageWorld: "@inboxsdk/core/pageWorld.js",
    background: "@inboxsdk/core/background.js",
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  experiments: {
    topLevelAwait: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: "/dist/",
  },

  plugins: [
    new CopyPlugin({
      patterns: [{ from: "static" }],
    }),

    new DotenvPlugin({ systemvars: true }),
  ],
};
