import request from 'request';
import express from 'express';
import _ from 'lodash';
import child_process from 'child_process';

export var app = express();


//detect if we are in Docker, if not cluster to the other apps
//mount directories
if (process.env.DOCKER_ENABLED) {
  app.use('/api', serveTo(environMatch(/_API_PORT$/)));
  app.use('/auth', serveTo(environMatch(/_AUTH_PORT$/)));
  app.use('/client', serveTo(environMatch(/_CLIENT_PORT$/)));
} else {
  var apiServer = runService('api');
  var authServer = runService('auth');
  var clientServer = runService('client');
  app.use('/api', serveTo(apiServer));
  app.use('/auth', serveTo(authServer));
  app.use('/client', serveTo(clientServer));
}

app.use(express.static(__dirname + '/../public'));


var SERVICES = [];
function runService(name) {
  var base_url = '/' + name;
  var path = __dirname + '/../' + name;
  //return url to service
  var port = 8081 + SERVICES.length;
  child = child_process.spawn('npm start', {
    cwd: path,
    env: {
      BASE_URL: base_url,
      PORT: port,
    },
    stdio: [
      0, // use parents stdin for child
      'pipe', // pipe child's stdout to parent
      'pipe' // direct child's stderr to a file
    ]
  });
  SERVICES.push(child);
  return `http://localhost:${port}/`;
}
proccess.on('exit', function() {
  SERVICES.map(service => service.kill());
});

function serveTo(url) {
  return function(req, res, next) {
    var fullUrl = url + req.path;
    var r = request(url);
    r.on('response', x => x.pipe(res));
  }
}

function environMatch(regex) {
  for (var key in process.env) {
    if (key.match(regex)) {
      return process.env[key];
    }
  }
}

var server = app.listen(80, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Your app is listening at http://${host}:${port}`)
});
