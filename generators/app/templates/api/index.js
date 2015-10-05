import _ from 'lodash';
import restify from 'restify';
import cookieSession from 'cookie-session';

var BASE_URL = process.env.BASE_URL;

var app = restify.createServer();

app.use(cookieSession({
  secret: process.env.SECRET,
}));


app.get('/self', function(req, res, next) {
  res.send(req.session);
  next();
});

var server = app.listen(parseInt(process.env.PORT) || 8000, function() {
  console.log(`Api is listening at ${server.url}`)
});
