const gulp = require('gulp');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const jshint = require('gulp-jshint');
const del = require('del');

const config = {
  paths: {
    js: {
      src: 'src/**/*.js',
      dist: 'dist/',
    },
    test: {
      src: 'test/**/*.js',
      dist: 'test-dist/',
      run: 'test-dist/**/*.js',
    }
  }
};

// Clean task
const clean = () => del([config.paths.js.dist, config.paths.test.dist]);

// Lint tasks
const lintSrc = () => 
  gulp.src(config.paths.js.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));

const lintTest = () =>
  gulp.src(config.paths.test.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));

// Babel tasks
const babelSrc = () =>
  gulp.src(config.paths.js.src)
    .pipe(babel())
    .pipe(gulp.dest(config.paths.js.dist));

const babelTest = () =>
  gulp.src(config.paths.test.src)
    .pipe(babel())
    .pipe(gulp.dest(config.paths.test.dist));

// Test task
const test = () =>
  gulp.src([config.paths.test.run])
    .pipe(mocha({ reporter: 'spec' }))
    .on('error', err => console.log(err.stack));

// Watch task
const watch = () => {
  gulp.watch(config.paths.js.src, gulp.series(lintSrc, babelSrc, test));
  gulp.watch(config.paths.test.src, gulp.series(lintTest, babelTest, test));
};

// Define complex tasks
const buildBabel = gulp.parallel(
  gulp.series(lintSrc, babelSrc),
  gulp.series(lintTest, babelTest)
);

// Define default task
const defaultTask = gulp.series(
  clean,
  buildBabel,
  test
);

// Export tasks
exports.clean = clean;
exports.babel = buildBabel;
exports.test = test;
exports.watch = watch;
exports.default = defaultTask;
