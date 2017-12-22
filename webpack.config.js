const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
      globPatterns: ['**/*.{html,js,png,jpg,json,css}'],
      swSrc: './app/service-worker.js',
      swDest: path.join('dist', 'service-worker.js'),
      clientsClaim: true,
      skipWaiting: true,
    })
    // new BundleAnalyzerPlugin() // Analyze the bundle file.
  ]
};

if (process.env.NODE_ENV.trim() === 'production') {
  config.module.rules[2] = ({ // In production model, replace the css rules in order to use ExtractTextPlugin. My css rules is in the position 2.
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1, sourceMap: true, modules: true, localIdentName: '[local]___[hash:base64:5]'
          }
        }
      ]
    }),
    exclude: /\.global\.css$/
  });

  config.plugins.push(
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    //   }
    // }),
    new ExtractTextPlugin('styles.css'), // Extract css to one file.
    // new webpack.optimize.DedupePlugin(), // Deprecated!! dedupe similar code
    // new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          // remove warnings
          warnings: false, // Display warnings when dropping unreachable code or unused declarations etc.
          sequences: true, // Join consecutive simple statements using the comma operator
          dead_code: true,
          conditionals: true, // Apply optimizations for if-s and conditional expressions.
          booleans: true,
          unused: true, // Drop unreferenced functions and variables.
          if_return: true,
          join_vars: true,
          drop_console: true
        }
      }
    })
  );
}

module.exports = config;
