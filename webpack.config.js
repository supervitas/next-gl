const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (opts = {}) => {
	const devPlugins = [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
	];

	const prodPlugins = [
		new UglifyJSPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"',
			},
		}),
	];

	const rules = [
		{
			test: /\.css$/, loader: 'style-loader!css-loader',
		},
		{
			test: /\.(glsl|vert|frag)$/,
			loader: 'webpack-glsl-loader',
		},
		{
			test: /\.(html)$/,
			use: {
				loader: 'html-loader',
			},
		},
	];

	return {
		entry: {
			app: ['./src/app.js'],
		},
		resolve: {
			alias: {
				'twgl-base.js': path.resolve(__dirname, 'libs/twgl.js'),
			},
			symlinks: false,
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/dist/',
			filename: '[name].js',
		},
		performance: {
			hints: false,
		},
		module: {
			rules,
		},
		devtool: opts.prod ? 'eval' : 'source-map',
		plugins: opts.prod ? prodPlugins : devPlugins,
		watch: opts.watch || false,
		mode: opts.prod ? 'production' : 'development',
	};
};
