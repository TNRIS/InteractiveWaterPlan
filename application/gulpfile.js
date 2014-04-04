'use strict';

var compass = require('gulp-compass');
var flatten = require('gulp-flatten');
var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var ngmin = require('gulp-ngmin');
var rev = require('gulp-rev');
var rimraf = require('gulp-rimraf');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');

var dirs = {
    build: 'build',
    client: 'client',
    pub: 'build/public',
    server: 'server',
    tmp: 'build/.tmp',
    usemin: 'build/.tmp/usemin'
}

gulp.task('compass', function () {
  return gulp.src(dirs.client + '/styles/main.scss')
    .pipe(compass({
      css: dirs.tmp + '/styles',
      font: dirs.client + '/styles/fonts',
      image: dirs.client + '/images',
      relative: true,
      sass: dirs.client + '/styles'
    }))
    .pipe(gulp.dest(dirs.tmp));
});

gulp.task('usemin', ['compass'], function () {
  return gulp.src(dirs.client + '/views/**/*.html')
    .pipe(usemin({
      css: [minifyCSS(), 'concat', rev()],
      //html: [minifyHtml({empty: true})],
      js: [ngmin(), uglify(), rev()]
    }))
    .pipe(gulp.dest(dirs.usemin));
});

gulp.task('dist', function () {
  gulp.src(dirs.usemin + '/scripts/*')
    .pipe(gulp.dest(dirs.pub + '/scripts/'));
  gulp.src(dirs.usemin + '/styles/*')
    .pipe(gulp.dest(dirs.pub + '/styles/'));
  gulp.src(dirs.usemin + '/**/*.html')
    .pipe(gulp.dest(dirs.build + '/views/'));

  gulp.src(dirs.client + '/scripts/shims/*')
    .pipe(gulp.dest(dirs.pub + '/scripts/shims/'));
  gulp.src(dirs.client + '/bower_components/**/*')
    .pipe(gulp.dest(dirs.pub + '/'));
  gulp.src(dirs.client + '/bower_components/**/*.{eot,svg,ttf,woff,otf}')
    .pipe(flatten())
    .pipe(gulp.dest(dirs.pub + '/fonts/'));
  gulp.src(dirs.client + '/bower_components/**/*.{png,jpg,jpeg,gif,webp,svg}')
    .pipe(flatten())
    .pipe(gulp.dest(dirs.pub + '/styles/'));
  gulp.src(dirs.client + '/*.{ico,txt}')
    .pipe(gulp.dest(dirs.pub + '/'));
  gulp.src(dirs.client + '/images/*.jpg')
    .pipe(gulp.dest(dirs.pub + '/images/'));

  gulp.src(dirs.server + '/**/*')
    .pipe(gulp.dest(dirs.build + '/server/'));
  gulp.src('server.js')
    .pipe(gulp.dest(dirs.build + '/'));

  gulp.src(dirs.tmp)
    .pipe(rimraf());
});

gulp.task('clean', function () {
  return gulp.src(dirs.build)
    .pipe(rimraf());
});

gulp.task('serve', function () {
  gulp.watch(dirs.client + '/styles/*.scss', ['compass']);

  var app = require('./server.js');
});

gulp.task('serve-dist', function () {
  var app = require('./' + dirs.build + '/server.js');
});
