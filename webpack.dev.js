const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  watchOptions: {
    poll: true,
    aggregateTimeout: 400
  },
  output: {
	path: path.resolve(__dirname, 'dist'),
	filename: '[name].test.js'
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
  },
});
