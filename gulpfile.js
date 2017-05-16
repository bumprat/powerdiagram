var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var _ = require('lodash');

var path = {
  wwwroot : './build/',
  src : './src/',
  web_deps : {
    css : [
      'node_modules/bootstrap/dist/css/*'
    ],
    fonts : [
      'node_modules/bootstrap/dist/fonts/*'
    ]
  }
};

gulp.task('default', ['browser-sync']);

gulp.task('browser-sync', ['build'], function(){
  browserSync.init({
    server:{
      baseDir: path.wwwroot
    }
  });
  gulp.watch(path.src + '**/*', ['auto-reload'])
});

gulp.task('auto-reload', ['build'], function(done){
  browserSync.reload();
  done();
});

gulp.task('build', ['browserify', 'move-web-dependencies'], function(){
  gulp.src(path.src + '**/*.html')
    .pipe(gulp.dest(path.wwwroot));
  gulp.src(path.src + 'css/*.css')
    .pipe(gulp.dest(path.wwwroot + 'css'));
});

gulp.task('browserify', function(){
  return browserify(path.src+'scripts/index.js')
    .transform('babelify', {presets:["es2015", "react"]})
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(path.wwwroot));
});

gulp.task('move-web-dependencies', function(){
  gulp.src(path.web_deps.css)
    .pipe(gulp.dest(path.wwwroot+'/css'));
  gulp.src(path.web_deps.fonts)
    .pipe(gulp.dest(path.wwwroot+'/fonts'));
});
