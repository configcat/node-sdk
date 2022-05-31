var gulp = require('gulp');
var replace = require('gulp-replace');
var fs = require('fs');

const OUT_LIB = 'lib';

function updateVersion(dst, file){

    const VERSION = JSON.parse(fs.readFileSync('./package.json')).version;

    return gulp.src(dst + '/' + file)
        .pipe(replace('CONFIGCAT_SDK_VERSION', VERSION))
        .pipe(gulp.dest(dst));
}

function updateVersion_lib(){
    return updateVersion(OUT_LIB, 'version.js');
}

exports.default = gulp.series(    
    gulp.parallel(updateVersion_lib));