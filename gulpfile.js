var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var $ = require('gulp-load-plugins')();

var path = {
	SCSS_SRC	: './_sass/**/*.scss',
	SCSS_DST	: './_site/css',
}


gulp.task('sass', function () {

	gulp.src( path.SCSS_SRC )
		.pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
		.pipe($.sourcemaps.init())
		.pipe($.sass())
		.pipe($.autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
		.pipe($.size({ showFiles: true }))
		.pipe($.sourcemaps.write('map'))
		.pipe(gulp.dest( path.SCSS_DST ))
		.pipe(browserSync.stream({ match: '**/*.css' }))
	;

});

gulp.task('jekyll', function (gulpCallBack){
    var spawn = require('child_process').spawn;
    var jekyll = spawn('jekyll', ['serve'], {stdio: 'inherit'});

    jekyll.on('exit', function(code) {
        gulpCallBack( code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code );
    });

});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

	browserSync.init({

        proxy: "http://127.0.0.1:4000/"
		
		//server: {
			//baseDir:	"./"
		//}

	});

	gulp.watch( path.SCSS_SRC, ['sass']);
    gulp.watch("_site/**/*.html").on('change', browserSync.reload);

});

// Creating a default task
gulp.task('default', ['sass', 'serve', 'jekyll']);

