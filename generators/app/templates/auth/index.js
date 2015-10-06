import {app} from './app';

export var server = app.listen(parseInt(process.env.PORT) || 8000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Auth is listening at http://${host}:${port}`)
});
