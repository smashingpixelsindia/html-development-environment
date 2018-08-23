const gulp        = require('gulp');
const sass        = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump'); 
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
  })
})
gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss')
      .pipe(sass({
        errLogToConsole : true,
        sourceComments : true,
      }).on('error', sass.logError))
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({
      stream: true
    }));
});
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})
gulp.task('compressjs', function (cb) {
  pump([
        gulp.src('app/js/**/*.js'),
        uglify(),
        gulp.dest('dist/js')
    ],
    cb
  );
});
gulp.task('compresscss', function() {
    return gulp.src('app/css/**/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
});
 gulp.task('compressimages', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});
gulp.task('watch',['browserSync', 'sass'], function () {
	watch('app/scss/**/*.scss', function() {
	    gulp.start( 'sass');
	});
	watch('app/js/**/*.js', function() {
	    gulp.start( 'compressjs');
	});
	watch('app/css/**/*.css', function() {
	    gulp.start( 'compresscss');
	});
	watch('app/images/**/*', function() {
	    gulp.start( 'compressimages');
	});
	watch('app/fonts/**/*', function() {
	    gulp.start( 'fonts');
	});
	watch('dist/**/*', browserSync.reload);
});
gulp.task('tasks', ['watch','sass','compressjs','compresscss','compressimages']);