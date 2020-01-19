const path = require('path');

module.exports = {
  entry: {
    'moreajs': './src/index.js',
  },
  externals: {
    jquery: 'jquery',
    efmarkdown: 'efmarkdown',
  },
  module: {
	rules: [
	  {
		test: /.js$/,
		loader: 'babel-loader',
		exclude: /node_modules/
	  }
	]
  }
};
