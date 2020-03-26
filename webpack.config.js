const path = require("path");
const webpack = require("webpack");
const dotenv=require("dotenv");


module.exports = () => {
     // call dotenv and it will return an Object with a parsed key 

     
  return {
    mode: "development",
    // babel-polyfill allows us to use all the latest es7 javascript features like Array.includes , Array.from and so on
    // 
    entry: ["babel-polyfill", path.join(__dirname, "client/src/app.js")],
    devServer: {
      proxy: {
        "/client/public/uploads/": "http://localhost:9001"
      },
      // index.html will be inside build and not dist after installing htmlWebpackPlugin.
      contentBase: path.join(__dirname, "client", "public", "build"),
      hot: false,
      inline: true,
      historyApiFallback: true,
      watchContentBase: true,
      port: 9002,
      watchOptions: {
        ignored: [
          path.resolve(__dirname, "fileUploadServer/server.js"),
          path.resolve(__dirname, "node_modules/")
        ]
      }
    },
    output: {
      path: path.join(__dirname, "client", "public", "build"),
      // Will generate a new bundle.js with name "main.somerandomhash.bundle.js" every time when app changes.
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          loader: "babel-loader",
          test: /\.js$/,
          exclude: /node_modules/,
          query: {compact: false}      
          },
        {
          test: /\.s?css$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.(jpe?g|png|gif|jpg)$/,
          loader: "file-loader",
          options: {
            name: '[name].[ext]',
          },
          
        }
      ]
    },
    devtool: "cheap-module-eval-source-map"
  };
};
