const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const config = {
  entry: [
    'react-hot-loader/patch',
    './app/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.(js)$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.global\.css$/, use: ['style-loader', 'css-loader'], exclude: /\.module\.css$/ },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true, modules: true, localIdentName: '[local]___[hash:base64:5]' } }
        ],
        exclude: /\.global\.css$/
      },
      { test: /\.(png|jpg|gif)$/, use: [{ loader: 'url-loader', options: { limit: 8192 } }] }
    ]
  },
  devServer: {
    historyApiFallback: true,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'app/index.html' }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      // Copy directory contents to {output}/
      { from: 'app/pwa' }
    ]),
    new WorkboxPlugin({
      globDirectory: 'dist',
      globPatterns: ['**/*.{html,js,png,jpg,json}'],
      swSrc: './app/service-worker.js',
      swDest: path.join('dist', 'service-worker.js'),
      clientsClaim: true,
      skipWaiting: true,
    })
  ]
};

if (process.env.NODE_ENV === 'production')
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.DedupePlugin(), // dedupe similar code
    new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks
    new UglifyJsPlugin({
      parallel: 4,
      sourceMap: true,
      // mangle: true,
      // Eliminate comments
      // comments: false,
      // Compression specific options
      uglifyOptions: {
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
      }
    })
  );


module.exports = config;
