'use strict';

var compass = require('gulp-compass');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var gulp = require('gulp');
var gutil = require('gulp-util');
var minifyCSS = require('gulp-minify-css');
var ngmin = require('gulp-ngmin');
var rev = require('gulp-rev');
var rimraf = require('gulp-rimraf');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var dirs = {
    bower: 'client/bower_components',
    client: 'client',
    clientScripts: 'client/scripts',
    dist: 'dist',
    pub: 'dist/public',
    scripts: 'dist/public/scripts',
    styles: 'dist/public/styles',
    server: 'server',
    tmp: '.tmp'
  };

var paths = {
    clientScripts: [
      dirs.clientScripts + '/**/*.js',
      '!' + dirs.clientScripts + '/shims/*.js'
    ],
    compass: dirs.client + '/styles/main.scss',
    serverDir: dirs.server + '/**/*',
    serverFile: 'server.js',
    views: dirs.client + '/views/**/*.html'
  };

gulp.task('dist', ['misc', 'scripts', 'styles', 'views']);

gulp.task('clean', ['clean-dist', 'clean-tmp']);

gulp.task('clean-dist', function () {
  return gulp.src(dirs.dist)
    .pipe(rimraf());
});

gulp.task('clean-tmp', function () {
  return gulp.src(dirs.tmp)
    .pipe(rimraf());
});

gulp.task('compass', function () {
  return gulp.src(paths.compass)
    .pipe(compass({
      css: dirs.tmp + '/styles',
      font: dirs.client + '/styles/fonts',
      image: dirs.client + '/images',
      relative: true,
      sass: dirs.client + '/styles'
    }))
    .pipe(gulp.dest(dirs.tmp));
});

gulp.task('misc', ['misc-fonts', 'misc-ico-and-txt', 'misc-images', 'misc-package-json']);

gulp.task('misc-fonts', function () {
  return gulp.src(dirs.client + '/bower_components/**/*.{eot,svg,ttf,woff,otf}')
    .pipe(flatten())
    .pipe(gulp.dest(dirs.pub + '/fonts/'));
});

gulp.task('misc-ico-and-txt', function () {
  return gulp.src(dirs.client + '/*.{ico,txt}')
    .pipe(gulp.dest(dirs.pub + '/'));
});

gulp.task('misc-images', function () {
  return gulp.src(dirs.client + '/images/*.{jpg,png}')
    .pipe(gulp.dest(dirs.pub + '/images/'));
});

gulp.task('misc-package-json', function () {
  return gulp.src('package.json')
    .pipe(gulp.dest(dirs.dist));
});

gulp.task('scripts', ['scripts-bower', 'scripts-client', 'scripts-server', 'scripts-shims']);

gulp.task('scripts-bower', function () {
  var bower_dir = dirs.client + '/bower_components';

  var vendor_scripts = [
      dirs.bower + "/sugar/release/sugar-full.min.js",
      dirs.bower + "/lodash/dist/lodash.compat.js",
      dirs.bower + "/select2/select2.min.js",
      dirs.bower + "/angular-ui-select2/src/select2.js",
      dirs.bower + "/angular-ui-router/release/angular-ui-router.min.js",
      dirs.bower + "/angular-local-storage/angular-local-storage.min.js",
      dirs.bower + "/angular-bootstrap/ui-bootstrap-tpls.js",
      dirs.bower + "/angulartics/dist/angulartics.min.js",
      dirs.bower + "/angulartics/dist/angulartics-ga.min.js"
    ];

  return gulp.src(vendor_scripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(dirs.scripts));
});

gulp.task('scripts-client', function () {
  return gulp.src(paths.clientScripts)
    .pipe(gutil.env.type === 'production' ? ngmin() : gutil.noop())
    .pipe(gutil.env.type === 'production' ? uglify({mangle: false}) : gutil.noop())
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(dirs.scripts));
});

gulp.task('scripts-server', ['scripts-server-dir', 'scripts-server-file']);

gulp.task('scripts-server-dir', function () {
  return gulp.src(paths.serverDir)
    .pipe(gulp.dest(dirs.dist + '/server/'));
});

gulp.task('scripts-server-file', function () {
  return gulp.src(paths.serverFile)
    .pipe(gulp.dest(dirs.dist + '/'));
});

gulp.task('scripts-shims', function () {
  return gulp.src(dirs.client + '/scripts/shims/*')
    .pipe(gulp.dest(dirs.pub + '/scripts/shims/'));
});

gulp.task('styles', ['styles-compass', 'styles-images', 'styles-vendor']);

gulp.task('styles-compass', ['compass'], function () {
  return gulp.src(dirs.tmp + '/main.css')
    .pipe(gutil.env.type === 'production' ? minifyCSS() : gutil.noop())
    .pipe(gulp.dest(dirs.styles));
});

gulp.task('styles-images', function () {
  return gulp.src(dirs.client + '/bower_components/**/*.{png,jpg,jpeg,gif,webp,svg}')
    .pipe(flatten())
    .pipe(gulp.dest(dirs.pub + '/styles/'));
});

gulp.task('styles-vendor', function () {
  var vendor_styles = [
    dirs.bower + "/font-awesome/css/font-awesome.min.css",
    dirs.bower + "/select2/select2.css"
  ];

  return gulp.src(vendor_styles)
    .pipe(concat('vendor.css'))
    .pipe(gutil.env.type === 'production' ? minifyCSS() : gutil.noop())
    .pipe(gulp.dest(dirs.styles));
});

gulp.task('views', function () {
  return gulp.src(paths.views)
    .pipe(gulp.dest(dirs.dist + '/views/'));
});

gulp.task('serve', ['dist', 'serve-dist']);

gulp.task('serve-dist', ['scripts-server'], function () {
  var app = require('./' + dirs.dist + '/server.js');
});

gulp.task('watch', function () {
  gulp.watch(paths.clientScripts, ['scripts-client']);
  gulp.watch(paths.compass, ['styles-compass']);
  gulp.watch(paths.serverDir, ['scripts-server-dir', 'serve-dist']);
  gulp.watch(paths.serverFile, ['scripts-server-file', 'serve-dist']);
  gulp.watch(paths.views, ['views']);
});

gulp.task('default', ['watch', 'serve']);
