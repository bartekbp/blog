const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    index: "./index.js"
  },
  output: {
    filename: isProd ? "[name]_[chunkhash].js" : "[name]_[hash].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: "babel-loader?cacheDirectory"
      },
      {
        test: /.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                minimize: isProd,
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
        })
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
  resolve: {
    alias: {
      'module': path.resolve(__dirname, 'src', 'module.js'),
      'angular-oboe': path.resolve(__dirname, 'node_modules', 'angular-oboe', 'dist', 'angular-oboe.js'),
      'common': path.resolve(__dirname, 'src', 'common'),
    },
    mainFields: ["browser", "module", "jsnext:main", "main"]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    inline: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        pathRewrite: {"^/api" : ""}
      }
    },
    historyApiFallback: true,
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, "dist")),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new ExtractTextPlugin({
      filename: "[name]_[contenthash].css",
      disable: !isProd,
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    isProd ? new webpack.optimize.ModuleConcatenationPlugin() : null,
  ].filter(plugin => plugin),
  devtool: isProd ? false : "cheap-module-eval-source-map"
};
