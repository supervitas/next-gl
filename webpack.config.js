const path = require('path');

module.exports = {  
	entry: {
		app: ['./src/app.js']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/',
		filename: 'bundle.js'
	},
	performance: {
		hints: false, 
	},
	module: {
		rules: [
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{ test: /\.(gif|png|jpe?g)$/i, loader: 'file-loader?name=dist/images/[name].[ext]' },
			{ test: /\.woff2?$/, loader: 'url-loader?name=dist/fonts/[name].[ext]&limit=10000&mimetype=application/font-woff' },
			{ test: /\.(ttf|eot|svg)$/, loader: 'file-loader?name=dist/fonts/[name].[ext]' },
			{test: /\.(glsl|vert|frag)$/, loader: 'webpack-glsl-loader'},
		]
	},
	devtool: 'source-map',
	plugins: [],
	mode: 'development',

};