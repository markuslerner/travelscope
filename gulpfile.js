// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var babelify = require('babelify');
var chalk = require('chalk');
var history = require('connect-history-api-fallback');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var autoprefixer = require('gulp-autoprefixer');
var eslint = require('gulp-eslint');
var gulpif = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var envify = require('loose-envify/custom');
var merge = require('utils-merge');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

const options = {
  dev: true,
  src: 'src',
  dest: 'public'
};


// Set deployment variables and path (production)
gulp.task('prepare-deploy', function() {
  options.dev = false;
  options.dest = 'dist';
});


// Es lint javascript (development and production)
gulp.task('lint', function() {
  var folders = [
    options.src + '/assets/**/*.js',
    options.src + '/assets/**/*.jsx'
  ];
  return gulp.src(folders)
    .pipe(eslint())
    .pipe(eslint.format());
});


// Compile Our Sass (development and production)
gulp.task('sass', function() {
  return gulp.src(options.src + '/assets/scss/main.scss')
    .pipe(plumber())
    .pipe(gulpif(options.dev, sourcemaps.init()))
    .pipe(sass())
    .on('error', function(err) {
      gutil.log('[sass]', err.message);
      browserSync.notify(err.message, 3000);
      this.emit('end');
    })
    .pipe(gulpif(!options.dev, autoprefixer()))
    .pipe(gulpif(!options.dev, minifyCSS({
      keepBreaks: true
    })))
    .pipe(browserSync.stream())
    .pipe(gulpif(options.dev, sourcemaps.write()))
    .pipe(plumber.stop())
    .pipe(gulp.dest(options.dest + '/css'))
    .pipe(gulpif(!options.dev, rename('main.min.css')));
});


// Map terminal errors (development)
function mapError(err) {
  if(err.fileName) {
    // regular error
    gutil.log(chalk.red(err.name) + ': ' + chalk.yellow(err.fileName.replace(options.src, '')) + ': ' +
      'Line ' + chalk.magenta(err.lineNumber) + ' & ' +
      'Column ' + chalk.magenta(err.columnNumber || err.column) + ': ' + chalk.blue(err.description));

    browserSync.notify('<span style="color:red">' + err.name + ': ' + err.fileName.replace(options.src, '') + ': ' +
      'Line ' + err.lineNumber + ' & ' +
      'Column ' + (err.columnNumber || err.column) + ': ' + err.description + '</span>',
      5000);
  } else {
    // browserify error..
    gutil.log(chalk.red(err.name) + ': ' + chalk.yellow(err.message));

    browserSync.notify('<span style="color:red">' + err.name + ': ' + err.message + '</span>',
      5000);
  }

  this.emit('end');
}


// Watch Javascript files for changes (development)
gulp.task('watchify', function() {
  process.env.NODE_ENV = 'development';

  var args = merge(watchify.args, {
    debug: true
  });
  var bundler = watchify(browserify(options.src + '/client.js', args))
    .transform(babelify, { /* opts */ });

  bundleJS(bundler, true);

  bundler.on('update', function() {
    bundleJS(bundler, false);
  });
});


// Build for production
gulp.task('build', function() {
  process.env.NODE_ENV = 'production';

  var args = merge(watchify.args, {
    debug: false
  });
  var bundler = browserify(options.src + '/client.js', args)
    .transform(babelify, { /* opts */ })
    .transform(envify({
      NODE_ENV: 'production'
    }));

  bundleJS(bundler, false);
});


// Bundle Javascript (development and production)
function bundleJS(bundler, refreshAfterBundling) {
  return bundler.bundle()
    .on('error', mapError)
    .pipe(source('client.js'))
    // optional, remove if you don't need to buffer file contents:
    .pipe(buffer())
    // capture sourcemaps from transforms:
    .pipe(gulpif(options.dev, sourcemaps.init({
      loadMaps: true
    })))
    // transform:
    .pipe(gulpif(!options.dev, streamify(uglify())))
    // write source maps:
    .pipe(gulpif(options.dev, sourcemaps.write('.')))
    .pipe(gulp.dest(options.dest + '/js'))
    .pipe(gulpif(options.dev && refreshAfterBundling, browserSync.stream()));
}


// Copy all static assets (development and production)
gulp.task('copy', function() {
  gulp.src(options.src + '/assets/fonts/**')
    .pipe(gulp.dest(options.dest + '/assets/fonts'));

  gulp.src(options.src + '/assets/img/**')
    .pipe(gulp.dest(options.dest + '/assets/img'));

  gulp.src(options.src + '/assets/*.html')
    .pipe(gulp.dest(options.dest));

  gulp.src(options.src + '/php/**')
    .pipe(gulp.dest(options.dest + '/php'));

  gulp.src(options.src + '/assets/*.php')
    .pipe(gulp.dest(options.dest));
});


// Watch Files For Changes (development)
gulp.task('watch', function() {
  // gulp.watch(options.src + '/client/**/*.js*', ['scripts']);
  gulp.watch(options.src + '/assets/scss/**/*.scss', ['sass']);
  gulp.watch(options.src + '/assets/scss/**/*.css', ['sass']);
  gulp.watch(options.src + '/assets/img/**', ['copy']);
  gulp.watch(options.src + '/assets/*.html', ['copy']);
  gulp.watch(options.src + '/php/**', ['copy']);
  gulp.watch(options.src + '/assets/*.php', ['copy']);
});


// Static server (development)
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './' + options.dest,
      middleware: [history()]
    },

    reloadDelay: 300
  });
  gulp.watch(options.dest + '/*.html').on('change', browserSync.reload);
});


gulp.task('default', ['lint', 'sass', 'copy', 'watch', 'watchify', 'browser-sync']);

gulp.task('deploy', ['prepare-deploy', 'lint', 'sass', 'copy', 'build']);

