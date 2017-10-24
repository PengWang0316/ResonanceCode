const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const config = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|jpg|gif)$/, use: [{ loader: 'url-loader', options: { limit: 8192 } }] }
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'app/index.html'
  })]
};

if (process.env.NODE_ENV === 'production')
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.DedupePlugin(), //dedupe similar code
    new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
    new webpack.optimize.UglifyJsPlugin({
      // mangle: true,
      // Eliminate comments
      // comments: false,
    // Compression specific options
      compress: {
        // remove warnings
        warnings: false,
        sequences: true,
         		dead_code: true,
         		conditionals: true,
         		booleans: true,
         		unused: true,
         		if_return: true,
         		join_vars: true,
         		drop_console: true
      }
    })
  );


module.exports = config;
