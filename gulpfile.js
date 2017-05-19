var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var _ = require('lodash');

var path = {
  wwwroot : './build/',
  src : './src/',
  web_deps : {
    css : [
      //'node_modules/bootstrap/dist/css/*'
    ],
    fonts : [
      //'node_modules/bootstrap/dist/fonts/*'
    ],
    js : [
      //'node_modules/flexibility/flexibility.js'
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

gulp.task('build', ['browserify', 'sass', 'move-web-dependencies'], function(){
  gulp.src(path.src + '**/*.html')
    .pipe(gulp.dest(path.wwwroot));
  gulp.src(path.src + 'css/*.css')
    .pipe(gulp.dest(path.wwwroot + 'css'));
  gulp.src(path.src + '/favicon.png')
    .pipe(gulp.dest(path.wwwroot));
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
  gulp.src(path.web_deps.js)
    .pipe(gulp.dest(path.wwwroot+'/js'));
});

gulp.task('sass', function () {
 return gulp.src(path.src+'css/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(path.wwwroot+'/css'));
});
