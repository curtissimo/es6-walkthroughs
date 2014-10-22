var del, gulp, rename, traceur;

del = require('del');
gulp = require('gulp');
rename = require('gulp-rename');
traceur = require('gulp-traceur');

gulp.task('clean', function (cb) {
  del([ './assets/tests.js', './assets/index.js' ], cb);
});

gulp.task('default', [ 'tests', 'index' ]);

gulp.task('dev', [ 'default' ], function () {
  gulp.watch('_assets/*', [ 'default' ]);
});

gulp.task('tests', function () {
  return gulp.src('_assets/tests.js')
    .pipe(traceur({
      experimental: true,
      modules: 'instantiate',
      moduleName: 'tests'
    }))
    .pipe(rename('tests.js'))
    .pipe(gulp.dest('./assets'));
});

gulp.task('index', function () {
  return gulp.src('_assets/index.js')
    .pipe(traceur({
      experimental: true,
      modules: 'instantiate',
      moduleName: 'index'
    }))
    .pipe(gulp.dest('./assets'));
});
