import _ from 'lodash';
import bodyParser from 'body-parser';
import express from 'express';
import passport from 'passport';
import jwt from 'express-jwt';

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var BASE_URL = process.env.BASE_URL;

var app = express();

app.use(jwt({
  secret: process.env.SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/self', function(req, res) {
  res.json(req.user);
});

var server = app.listen(parseInt(process.env.PORT) || 8000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Api is listening at http://${host}:${port}`)
});
