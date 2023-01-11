var gulp = require('gulp'),
    csscomb = require('gulp-csscomb'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('default', function () {
    
    return gulp.src('./styles/main.css')
        .pipe(autoprefixer({cascade: false}))
        .pipe(csscomb())
        .pipe(gulp.dest('./styles/'));
});