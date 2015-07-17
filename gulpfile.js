/* File: gulpfile.js */

var gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    jshint        = require('gulp-jshint'),
    sourcemaps    = require('gulp-sourcemaps'),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    uglify        = require('gulp-uglify'),
    imagemin   = require('gulp-imagemin'),
    browserSync   = require('browser-sync');


gulp.task('default', ['serve']);
gulp.task('serve', ['watch', 'browser-sync']);

gulp.task('watch', function() {
    gulp.watch('client/**/*.js', ['scripts']);
    gulp.watch('client/**/*.scss', ['styles']);
    gulp.watch('client/**/*.html').on('change', browserSync.reload);
});

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;
  browserSync.instance = browserSync.init(files, {
    server: {
      baseDir: baseDir
    },
    browser: browser
  });
}

gulp.task('scripts', function () {
  return gulp.src('client/**/*.js')
    .pipe(jshint())
    .pipe(uglify())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('images', function () {
  return gulp.src('client/assets/images/**/*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('client/assets/images'));
});

gulp.task('styles', function() {
  return gulp.src('client/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .on('error', handleError)
    .pipe(sourcemaps.init())  // Process the original sources
    .pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(autoprefixer())
    .pipe(gulp.dest('client/'))
    .pipe(browserSync.stream());
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./client"
        },
        port: 8000
    });
});


