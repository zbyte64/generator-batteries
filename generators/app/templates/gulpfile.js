var gulp = require('gulp');
var shell = require('gulp-shell');
var _ = require('lodash');
var child_process = require('child_process');

gulp.task('run-proxy', function() {
  return gulp.src('')
    .pipe(shell(['npm start'], {cwd:'./proxy'}));
});

gulp.task('init', function() {
  //install deps...
  child_process.exec('which docker-compose', function(err, stdout, stderr) {
    var child;
    //TODO why does the io not pipe?
    var stdio = ['pipe', 'pipe', 'pipe'];
    if (err) {
      console.log("intsall deps")
      //run proxy;
      child = child_process.spawn('npm', ['install'], {cwd:'./api', stdio: stdio});
      child = child_process.spawn('npm', ['install'], {cwd:'./auth', stdio: stdio});
      //TODO knex migrate:latest
      child = child_process.spawn('npm', ['install'], {cwd:'./client', stdio: stdio});
      child = child_process.spawn('npm', ['install'], {cwd:'./proxy', stdio: stdio});
    } else {
      console.log('run docker build')
      //run docker:
      child = child_process.spawn('docker-compose', ['build'], {cwd: './', stdio: stdio});
    }
    //console.log(child)
    child.on('exit', cb)
    console.log("waiting")
  });
});


//run
gulp.task('default', function(cb) {
  child_process.exec('which docker-compose', function(err, stdout, stderr) {
    var child;
    //TODO why does the io not pipe?
    var stdio = ['pipe', 'pipe', 'pipe'];
    if (err) {
      console.log("run proxy")
      //run proxy;
      child = child_process.spawn('npm', ['start'], {cwd:'./proxy', stdio: stdio});
    } else {
      console.log('run docker')
      //run docker:
      child = child_process.spawn('docker-compose', ['up'], {cwd: './', stdio: stdio});
    }
    //console.log(child)
    child.on('exit', cb)
    console.log("waiting")
  });
});
