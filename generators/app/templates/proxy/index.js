import request from 'request';
import express from 'express';
import _ from 'lodash';
import child_process from 'child_process';
import path from 'path';

export var app = express();
var SERVICES = [];


//detect if we are in Docker, if not cluster to the other apps
//mount directories
if (process.env.DOCKER_ENABLED) {
  app.use('/api', serveTo(environMatch(/API_PORT$/)));
  app.use('/auth', serveTo(environMatch(/AUTH_PORT$/)));
  app.use('/client', serveTo(environMatch(/CLIENT_PORT$/)));
} else {
  var apiServer = runService('api');
  var authServer = runService('auth');
  var clientServer = runService('client');
  app.use('/api', serveTo(apiServer));
  app.use('/auth', serveTo(authServer));
  app.use('/client', serveTo(clientServer));
}

app.use(express.static(path.resolve(__dirname, '..', 'public')));


function runService(name) {
  var base_url = '/' + name;
  var cwd = path.resolve(__dirname, '..', name);
  //return url to service
  var port = 8081 + SERVICES.length;
  console.log(`Starting service ${name} on port ${port}`);
  var child = child_process.spawn('npm', ['start'], {
    cwd: cwd,
    env: {
      BASE_URL: base_url,
      PORT: port,
      SECRET: process.env.SECRET || 'himitsu',
    },
    stdio: [
      'pipe', // use parents stdin for child
      'pipe', // pipe child's stdout to parent
      'pipe' // direct child's stderr to a file
    ]
  });
  child.on('error', function(err) {
    console.error("Child had an error:");
    console.error(err);
  });
  SERVICES.push(child);
  return `http://localhost:${port}/`;
}
process.on('exit', function() {
  SERVICES.map(service => service.kill());
});

function serveTo(url) {
  return function(req, res, next) {
    var fullUrl = url + req.path;
    console.log(fullUrl);
    var x = request(fullUrl);
    req.pipe(x);
    x.pipe(res);
  }
}

function environMatch(regex) {
  for (var key in process.env) {
    if (key.match(regex)) {
      // tcp:// => 6
      return 'http://' + process.env[key].slice(6);
    }
  }
}

var server = app.listen(parseInt(process.env.PORT) || 8000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Your app is listening at http://${host}:${port}`)
});
