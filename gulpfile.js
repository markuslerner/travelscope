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
var cleanCSS = require('gulp-clean-css');
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
// var del = require('del');
var runSequence = require('run-sequence');

const options = {
  dev: true,
  src: 'src',
  dest: 'public', // dev
};


// Set deployment variables and path (force production)
gulp.task('prepare-production', function() {
  options.dev = false;
  // options.dest = 'public';
});


// Clean dev directory
// gulp.task('clean', () => {
//   if(options.dev) {
//     return del([options.dest + '/*'], {dot: false});
//   }
//   return true;
// });


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
  return gulp.src(options.src + '/scss/main.scss')
    .pipe(plumber())
    .pipe(gulpif(options.dev, sourcemaps.init()))
    .pipe(sass())
    .on('error', function(err) {
      gutil.log('[sass]', err.message);
      browserSync.notify(err.message, 3000);
      this.emit('end');
    })
    .pipe(gulpif(!options.dev, autoprefixer({
      browsers: ['last 2 versions']
    })))
    .pipe(gulpif(!options.dev, cleanCSS()))
    .pipe(browserSync.reload({
      stream: true
    }))
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
  var args = merge(watchify.args, {
    debug: options.dev,
    plugin: []
  });
  var bundler = watchify(browserify(options.src + '/client.js', args))
    .transform(babelify, { /* opts */ })
    .transform(envify({
      NODE_ENV: 'development',
    }));

  bundler.on('log', gutil.log);

  bundler.on('update', function() {
    bundleJS(bundler);
  });

  bundleJS(bundler);

});


// Build and bundle for production
gulp.task('build-bundle', function() {
  var args = merge(watchify.args, {
    debug: false
  });
  var bundler = browserify(options.src + '/client.js', args)
    .transform(babelify, { /* opts */ })
    .transform({global: true}, envify({ // global is important here!
      _: 'purge',
      NODE_ENV: 'production'
    }));

  bundleJS(bundler);
});


// Bundle Javascript (development and production)
function bundleJS(bundler) {
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
    .pipe(gulpif(options.dev, browserSync.reload({
      stream: true
    })));
}


// Copy all static assets (development and production)
gulp.task('copy', function() {
  gulp.src(options.src + '/assets/fonts/**')
    .pipe(gulp.dest(options.dest + '/assets/fonts'));

  gulp.src(options.src + '/assets/img/**')
    .pipe(gulp.dest(options.dest + '/assets/img'));

  if(options.dev) {
    gulp.src(options.src + '/*.html')
      .pipe(gulp.dest(options.dest));
  }

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
});


// Watch files for changes (development)
gulp.task('watch', function() {
  gulp.watch(options.src + '/scss/**/*.scss', ['sass']);
  gulp.watch(options.src + '/scss/**/*.css', ['sass']);
  gulp.watch(options.src + '/assets/img/**', ['copy']);
  gulp.watch(options.src + '/*.html', ['copy']);

  gulp.watch(options.dest + '/*.html').on('change', browserSync.reload);
});


gulp.task('default', callback =>
  runSequence(
    // 'clean',
    ['sass', 'lint', 'copy', 'watchify'],
    'browser-sync',
    'watch',
    callback
  )
);


gulp.task('build', callback =>
  runSequence(
    'prepare-production',
    ['sass', 'lint', 'copy'],
    'build-bundle',
    callback
  )
);
