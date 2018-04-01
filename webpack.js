const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const ip = '0.0.0.0';
const port = 3000;

const build = (cb) => {
	const opts = {
		prod: true,
	};

	const config = require('./webpack.config')(opts);

	webpack(config, (err) => {
		if (err) {
			console.error(err);
		}

		cb();
	});
};


const runDevServer = () => {
	const opts = {
		prod: false,
	};

	const config = require('./webpack.config')(opts);

	config.entry.app.unshift(`webpack-dev-server/client?http://${ip}:${port}/`, 'webpack/hot/dev-server');

	new WebpackDevServer(webpack(config), {
		publicPath: config.output.publicPath,
		proxy: {},
		hot: true,
		quiet: false,
		inline: true,
	}).listen(port, ip, function(err, result) {
		if (err) {
			return console.log(err);
		}
		console.log(`Listening at http://${ip}:${port}/`);
	});
};

module.exports = () => {
	return {runDevServer, build};
};
