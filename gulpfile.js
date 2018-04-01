const gulp = require('gulp');
const webpack = require('./webpack')();

gulp.task('webpack:build', (cb) => {
	return webpack.build(cb);
});

gulp.task('serve', () => {
	webpack.runDevServer();
});

gulp.task('build', ['webpack:build']);
