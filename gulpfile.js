"use strict";
var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var tsProject = ts.createProject("tsconfig.json");

// clean
gulp.task("clean:lib", function() {
 return del(['lib/**/*']);
});

// build
gulp.task("tsc", function () {
 return tsProject.src()
 .pipe(tsProject())
 .js.pipe(gulp.dest("lib"));
});

// adding default tasks as clean and build
gulp.task('default', ['clean:lib','tsc'], function () {
});