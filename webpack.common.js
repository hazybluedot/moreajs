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
		test: /.jsx?$/,
		loader: 'babel-loader?cacheDirectory',
		exclude: /node_modules/,
	  },
	  {
		test: /\.css$/i,
		use: ["style-loader", "css-loader"],
	  }
	]
  },
  resolve: {
	  extensions: ['.js', '.jsx']
  }
};
