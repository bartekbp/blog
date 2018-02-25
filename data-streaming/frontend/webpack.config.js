const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");


module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    module: "./module.js"
  },
  output: {
    filename: "[name]_[hash].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /(node_modules\/\/|bower_components)/,
        use: "babel-loader?cacheDirectory"
      },
      {
        test: /.s?css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|webp)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash].[ext]"
            }
          }
        ]
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src', 'app'),
        use: [
          { loader:'ngtemplate-loader?relativeTo=' + (path.resolve(__dirname, 'src')) },
          { loader: 'html-loader' }
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    inline: true
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, "dist")),
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
  devtool: "cheap-module-eval-source-map"
};
