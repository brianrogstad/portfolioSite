/* File: gulpfile.js */
/* jshint -W040 */

'use strict';

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')({lazy: true}),
    args          = require('yargs').argv,
    browserSync   = require('browser-sync'),
    colors        = $.util.colors;

/////////////////////// set default task as serve app ///////////////////////
gulp.task('default', ['serve']);

////////////////////////////// start application ///////////////////////////
gulp.task('serve', ['scripts', 'styles'], function () {
    log('starting server and watching with gulp-nodemon');
    $.nodemon({
        script: './src/server/server.js',
        ext: 'js html'
    })
    .on('restart', ['scripts'], function () {
        log('server restarted!');
        setTimeout(function() {
            browserSync.notify('reloading now ...');
            browserSync.reload({stream: false});
        }, 1000);
    })
    .on('start', function () {
        log('server started');
        startBrowserSync();
    })
    .on('crash', function () {
        log('server crashed for some reason');
    })
    .on('exit', function () {
        log('server exited cleanly');
    });
});

////////////////////////////// analyzing source code ///////////////////////////
gulp.task('scripts', function () {
    log('analyzing source with JSHint and JSCS');
    return gulp.src([
            './src/**/*.js',
            './*.js',
            '!./src/client/js/vendor/**/*.js',
        ])
      .pipe($.if(args.verbose, $.print()))
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
      .pipe($.jshint.reporter('fail'))
      .pipe($.jscs())
      .pipe($.jscs.reporter());
});

/////////////////////// converting and compressing sass ///////////////////////
gulp.task('styles', function() {
    log('analyzing, converting and compressing sass');
    return gulp.src([
            './src/client/styles/**/*.scss'
        ])
        .pipe($.scssLint({
            'config': './lint.yml',
        }))
        .pipe($.sass({outputStyle: 'compressed'}))
        .on('error', handleError)
        .pipe($.sourcemaps.init())  // Process the original sources
        .pipe($.sourcemaps.write()) // Add the map to modified source.
        .pipe($.autoprefixer({browsers: ['last 4 versions', '> 5%']}))
        .pipe(gulp.dest('./src/client/styles'));
});

/////////////////////// start up browser-sync ///////////////////////
gulp.task('browser-sync', ['serve'], function() {
    browserSync.init(null, {
        proxy: 'http://localhost:8000',
        browser: 'google chrome',
        port: 3000
    });
});

//////// Log a message or series of messages using chalk's blue color ///////////
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

function  handleError(err) {
    console.error(err.toString());
    this.emit('end');
}

//////////////////////////// Log when file changes ///////////////////////////////////
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/src/)/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
    browserSync.reload({stream: false});
}

//////////////////////////// Start BrowserSync ///////////////////////////////////
function startBrowserSync() {

    log('Starting BrowserSync on port 8000');
    gulp.watch(['./src/client/styles/**/*.scss'], ['styles']).on('change', changeEvent);

    var options = {
        proxy: 'http://localhost:8000',
        port: 3000,
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'debug info',
        notify: true,
        reloadDelay: 1000
    } ;

    browserSync(options);
}

module.exports = gulp;

