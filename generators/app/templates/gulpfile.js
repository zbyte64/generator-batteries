var gulp = require('gulp');
var shell = require('gulp-shell')

gulp.task('run-proxy', function() {
  return gulp.src('')
    .pipe(shell(['npm start'], {cwd:'./proxy'}));
});
