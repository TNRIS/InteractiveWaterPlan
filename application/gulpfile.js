'use strict';

var compass = require('gulp-compass');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var gulp = require('gulp');
var gutil = require('gulp-util');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var templateCache = require('gulp-angular-templatecache');

var dirs = {
    bower: 'client/bower_components',
    client: 'client',
    clientScripts: 'client/scripts',
    ngTemplates: 'client/templates',
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
    ngTemplates: dirs.ngTemplates + '/**/*.html',
    compass: dirs.client + '/styles/main.scss',
    serverDir: dirs.server + '/**/*',
    serverFile: './server/index.js',
    views: dirs.server + '/views/**/*.html'
  };

gulp.task('dist', ['misc', 'scripts', 'styles']);

gulp.task('clean', ['clean-dist', 'clean-tmp']);

gulp.task('clean-dist', function (cb) {
  del([dirs.dist], cb);
});


gulp.task('clean-tmp', function (cb) {
  del([dirs.tmp], cb);
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
  return gulp.src(dirs.client + '/images/*.{jpg,png,gif}')
    .pipe(gulp.dest(dirs.pub + '/images/'));
});

gulp.task('misc-package-json', function () {
  return gulp.src('package.json')
    .pipe(gulp.dest(dirs.dist));
});

gulp.task('scripts', ['scripts-bower', 'scripts-client', 'scripts-server', 'scripts-shims']);

gulp.task('scripts-bower', function () {
  var vendorScripts = [
    dirs.bower + "/sugar/release/sugar-full.min.js",
    dirs.bower + "/lodash/dist/lodash.compat.js",
    dirs.bower + "/Leaflet.utfgrid/dist/leaflet.utfgrid.js",
    dirs.bower + "/angular-ui-router/release/angular-ui-router.min.js",
    dirs.bower + "/angular-ui-select/dist/select.min.js",
    dirs.bower + "/angular-local-storage/angular-local-storage.min.js",
    dirs.bower + "/angular-bootstrap/ui-bootstrap-tpls.js",
    dirs.bower + "/angulartics/dist/angulartics.min.js",
    dirs.bower + "/angulartics/dist/angulartics-ga.min.js",
  ];

  return gulp.src(vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(dirs.scripts));
});

gulp.task('scripts-templates', function() {
  return gulp.src(paths.ngTemplates)
    .pipe(templateCache('templates.js', {
      root: 'templates',
      module: 'iswpApp.templates',
      standalone: true
    }))
    .pipe(gulp.dest(dirs.tmp));
});

gulp.task('scripts-client', ['scripts-jshint', 'scripts-templates'], function () {
  var scriptsAndTemplates = [].concat(paths.clientScripts,
    [dirs.tmp + '/templates.js']);

  return gulp.src(scriptsAndTemplates)
    .pipe(gutil.env.type === 'production' ? ngAnnotate() : gutil.noop())
    .pipe(concat('scripts.js'))
    .pipe(gutil.env.type === 'production' ? uglify({mangle: true}) : gutil.noop())
    .pipe(gulp.dest(dirs.scripts));
});

gulp.task('scripts-server', ['scripts-server-dir', 'scripts-server-file']);

gulp.task('scripts-server-dir', ['scripts-jshint'], function () {
  return gulp.src(paths.serverDir)
    .pipe(gulp.dest(dirs.dist + '/server/'));
});

gulp.task('scripts-server-file', function () {
  return gulp.src(paths.serverFile)
    .pipe(gulp.dest(dirs.dist));
});

gulp.task('scripts-jshint', function () {
  var clientAndServerScripts = [].concat(paths.clientScripts,
    paths.serverDir + '.js');

  return gulp.src(clientAndServerScripts)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('scripts-shims', function () {
  return gulp.src(dirs.client + '/scripts/shims/*')
    .pipe(gulp.dest(dirs.pub + '/scripts/shims/'));
});

gulp.task('styles', ['styles-compass', 'styles-images', 'styles-vendor']);

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

gulp.task('styles-compass', ['compass'], function () {
  return gulp.src(dirs.tmp + '/styles/main.css')
    .pipe(gutil.env.type === 'production' ? minifyCSS() : gutil.noop())
    .pipe(gulp.dest(dirs.styles));
});

gulp.task('styles-images', function () {
  return gulp.src(dirs.client + '/bower_components/**/*.{png,jpg,jpeg,gif,webp,svg}')
    .pipe(flatten())
    .pipe(gulp.dest(dirs.styles));
});

gulp.task('styles-vendor', function () {
  var vendorStyles = [
    dirs.bower + "/font-awesome/css/font-awesome.min.css",
    dirs.bower + "/angular-ui-select/dist/select.min.css"
  ];

  return gulp.src(vendorStyles)
    .pipe(concat('vendor.css'))
    .pipe(gutil.env.type === 'production' ? minifyCSS() : gutil.noop())
    .pipe(gulp.dest(dirs.styles));
});

gulp.task('watch', function () {
  gulp.watch(paths.clientScripts, ['scripts-client']);
  gulp.watch(paths.ngTemplates, ['scripts-client']);
  gulp.watch(paths.compass, ['styles-compass']);
  gulp.watch(paths.serverDir, ['scripts-server-dir']);

  console.log('Watches are active for continuously disting dev files.');
  console.log('  To start dev server: `npm run start` in a separate shell');
  console.log('  In debug mode: `npm run debug` and `node-inspector` in two separate shells');
});

gulp.task('default', ['dist', 'watch']);
