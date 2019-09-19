/**
 * Sam Grundman's Simple Server
 */
'use strict';

const argv = require('yargs')
	.command('', 'Start up a local server')
	.help('?')
	.epilog(' ©2019 Samuel B Grundman')
	.argv;

const gulp = require('gulp');

const options = {
	dest: 'www/',

	concat:{
		sass: {
			path: 'min.css',
		},
		js: {
			path: 'min.js',
		},
	},

	connect: {
		root: 'www',
		fallback: 'index.html',
		livereload: true,
		port: 3000,
	},

	sass: {
		importer: require('@mightyplow/sass-dedup-importer'),
		outputStyle: 'compressed',
		includePaths: [
			'node_modules',
			'scss',
		],
	},

	src: {
		sass: './scss/*.scss',
	},
};

const plugins = {
	...require('gulp-load-plugins')({
	}),
};
plugins['connect.reload'] = plugins.connect.reload;

gulp.task('sass', () => gulp.src(options.src.sass)
	.pipe(plugins.concat(options.concat.sass))
	.pipe(plugins.sass(options.sass))
	.pipe(plugins.connect.reload())
	.pipe(gulp.dest(options.dest)),
);

gulp.task('watch', (done) => {
	gulp.watch(options.src.sass, {
		usePolling: true,
	}, gulp.series('sass'));
	done();
});

gulp.task('default', gulp.series(
	'sass',
	gulp.parallel(
		'watch',
		(done) => {
			require('gulp-connect').server(options.connect);
			done();
		},
	),
));
