var del, gulp, rename, traceur;

del = require('del');
gulp = require('gulp');
rename = require('gulp-rename');
traceur = require('gulp-traceur');

gulp.task('clean', function (cb) {
  var targets = [
    './assets/tests.js',
    './assets/index.js',
    './assets/setup.js',
    './assets/dom-console.js',
    './assets/repl.js'
  ];
  del(targets, cb);
});

gulp.task('default', [
  'tests',
  'index',
  'simple-walkthrough-setup',
  'dom-console',
  'repl'
]);

gulp.task('dev', [ 'default' ], function () {
  gulp.watch('_assets/*', [ 'default' ]);
});

gulp.task('tests', function () {
  return gulp.src('_assets/tests.js')
    .pipe(traceur({
      experimental: true,
      modules: 'instantiate',
      moduleName: true
    }))
    .pipe(rename('tests.js'))
    .pipe(gulp.dest('./assets'));
});

gulp.task('index', function () {
  return gulp.src('_assets/index.js')
    .pipe(traceur({
      experimental: true,
      modules: 'instantiate',
      moduleName: true
    }))
    .pipe(gulp.dest('./assets'));
});

gulp.task('simple-walkthrough-setup', function () {
  return gulp.src('_assets/simple-walkthrough-setup.js')
    .pipe(traceur({
      experimental: true,
      modules: 'instantiate',
      moduleName: true
    }))
    .pipe(gulp.dest('./assets'));
});

gulp.task('dom-console', function () {
  return gulp.src('_assets/dom-console.js')
    .pipe(traceur({
      experimental: true,
      modules: 'instantiate',
      moduleName: true
    }))
    .pipe(gulp.dest('./assets'));
});

gulp.task('repl', function () {
  return gulp.src('_assets/repl.js')
    .pipe(traceur({
      experimental: true,
      modules: 'instantiate',
      moduleName: true
    }))
    .pipe(gulp.dest('./assets'));
});
