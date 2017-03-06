var gulp = require ('gulp'),
	nodemon = require ('gulp-nodemon'),
	livereload = require ('gulp-livereload'),
	notify = require ('gulp-notify');

/**
* Real time server with auto update and reloading
*/
gulp.task ('server', () => {
	gulp.task ('server', () => {
		// the gulp will watch over all the js files and realod 
		// the app as soon as the changes are detected in the system
		livereload.listen ();
		nodemon ({
			script: './index.js',
			ext: 'js'
		}).on ('restart', () => {
			gulp.src ('.`/src/server.js')
				.pipe (livereload())
				.pipe (notify ('Reloading Snippets.. Hold on...'));
		});
	});
});