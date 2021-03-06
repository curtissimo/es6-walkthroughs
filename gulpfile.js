var fs, gulp, handlebars, mkdir, path, rename, traceur, web;

fs = require('fs');
gulp = require('gulp');
handlebars = require('handlebars');
mkdir = require('mkdirp');
path = require('path');
rename = require('gulp-rename');
traceur = require('gulp-traceur');
web = require('gulp-webserver');

handlebars.registerHelper('json', JSON.stringify);

gulp.task('default', [
  'build-modules',
  'build-index',
  'build-simple-walkthroughs',
  'build-narrated-walkthroughs'
]);

gulp.task('dev', [ 'default', 'serve' ], function () {
  gulp.watch('_src/modules/*', [ 'build-modules' ]);
  gulp.watch('_src/index.*', [ 'build-index' ]);
  gulp.watch([ '_src/simple*', '_src/index.json' ], [ 'build-simple-walkthroughs' ]);
  gulp.watch([ '_src/narrated*', '_src/index.json' ], [ 'build-narrated-walkthroughs' ]);
});

gulp.task('serve', function () {
  return gulp.src('.')
    .pipe(web({
      port: 8081
    }));
});

gulp.task('build-modules', function () {
  return gulp.src('_src/modules/*.js')
    .pipe(traceur({
      experimental: true,
      modules: 'instantiate',
      moduleName: true
    }))
    .pipe(gulp.dest('./assets'));
});

gulp.task('build-index', function (cb) {
  fs.readFile('./_src/index.html.hbs', 'utf8', function (sourceerr, source) {
    var template = handlebars.compile(source)
    fs.readFile('./_src/index.json', function (dataerr, data) {
      var i, j, section, features, content;
      data = JSON.parse(data);
      for (i = 0; i < data.interesting.length; i += 1) {
        section = data.interesting[i];
        if (section.features) {
          for (j = 0; j < section.features.length; j += 1) {
            feature = section.features[j];
            feature.key = feature.key || feature.title;
            feature.filename = feature.filename || 'redirect';
            feature.state = feature.state || '';
          }
        } else {
          section.state = section.state || '';
          section.filename = section.filename || 'redirect';
        }
      }
      for (i = 0; i < data.boring.length; i += 1) {
        section = data.boring[i];
        for (j = 0; j < section.features.length; j += 1) {
          feature = section.features[j];
          if (feature.key === undefined) {
            feature.key = feature.title;
          }
          if (feature.filename === undefined) {
            feature.filename = feature.key;
          }
        }
      }
      content = template(data).replace('<head>', '<head>\n    <meta name="generator" content="Handlebars - do not edit">')
      fs.writeFile('./index.html', content, 'utf8', cb);
    });
  });
});

gulp.task('build-narrated-walkthroughs', function (cb) {
  mkdir('./narrated-walkthroughs', function (e) {
    if (e) {
      return cb(e);
    }
    fs.readFile('./_src/narrated-walkthrough-template.html.hbs', 'utf8', function (sourceerr, source) {
      var template = handlebars.compile(source)
      fs.readFile('./_src/index.json', function (dataerr, data) {
        var i, j, section, features, content;
        data = JSON.parse(data);
        try {
          for (i = 0; i < data.interesting.length; i += 1) {
            section = data.interesting[i];
            if(section.features === undefined) {
              section.features = [ section ];
            }
            for (j = 0; j < section.features.length; j += 1) {
              feature = section.features[j];
              if (feature.filename === undefined) {
                continue;
              }
              if (feature.key === undefined) {
                feature.key = feature.title;
              }
              content = template(feature).replace('<head>', '<head>\n    <meta name="generator" content="Handlebars - do not edit">')
              fs.writeFileSync(path.join('./narrated-walkthroughs', feature.filename + '.html'), content, 'utf8');
            }
          }
        } catch (e) {
          return cb(e);
        }
        cb();
      });
    });
  })
});

gulp.task('build-simple-walkthroughs', function (cb) {
  mkdir('./simple-walkthroughs', function (e) {
    if (e) {
      return cb(e);
    }
    fs.readFile('./_src/simple-walkthrough-template.html.hbs', 'utf8', function (sourceerr, source) {
      var template = handlebars.compile(source)
      fs.readFile('./_src/index.json', function (dataerr, data) {
        var i, j, section, features, content;
        data = JSON.parse(data);
        try {
          for (i = 0; i < data.boring.length; i += 1) {
            section = data.boring[i];
            for (j = 0; j < section.features.length; j += 1) {
              feature = section.features[j];
              if (feature.key === undefined) {
                feature.key = feature.title;
              }
              if (feature.filename === undefined) {
                feature.filename = feature.key;
              }
              content = template(feature).replace('<head>', '<head>\n    <meta name="generator" content="Handlebars - do not edit">')
              fs.writeFileSync(path.join('./simple-walkthroughs', feature.filename + '.html'), content, 'utf8');
            }
          }
        } catch (e) {
          return cb(e);
        }
        cb();
      });
    });
  })
});
