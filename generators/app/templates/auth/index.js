import _ from 'lodash';
import bodyParser from 'body-parser';
import flash from 'flash';
import express from 'express';
import swig from 'swig';
import passport from 'passport';
import jwt from 'express-jwt';

import {doHash, getUser, updateUser, customerEvent, sendMail, readTokenParams, generateTokenUrl} from '../common';


//var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var BASE_URL = process.env.BASE_URL;

var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');

app.use(jwt({
  secret: process.env.SECRET,
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());


app.get('/login', function(req, res) {
  res.render('login', {messages: res.locals.flash});
  req.session.flash = [];
});

app.post('/login',
  urlencodedParser, passport.authenticate('login',{successRedirect: '/',
                                                   failureRedirect: `${BASE_URL}/login`,
                                                   failureFlash: true }),
);

app.get('/logout', function(req, res) {
  if (req.user) {
    customerEvent({email: req.user.email, event: 'logout'});
    req.logout();
  }
  res.redirect(`${BASE_URL}/login`);
});

app.get('/signup', function(req, res) {
  res.render('signup', {messages: res.locals.flash});
  req.session.flash = [];
});

//pumps to footer signup
app.post('/signup', urlencodedParser, function(req, res) {
  if (!req.body.first_name) {
    req.flash('error', 'first name is required');
    return res.redirect(`${BASE_URL}/signup`);
  }
  //if (!req.body.last_name) return res.status(400).send('last_name is required');
  if (!req.body.email) {
    req.flash('error', 'email is required');
    return res.redirect(`${BASE_URL}/signup`);
  }
  //if (!req.body.template) return res.status(400).send('template is required');

  var params = _.pick(req.body, ['first_name', 'last_name', 'email']);

  //signed url for /auth/footer-activate
  sendMail({
    email: req.body.email,
    action: 'signup',
    properties: _.merge(params, {
      url: generateTokenUrl(`${BASE_URL}/activate`, params)
    }),
  });
  //display check your email
  res.render('signup');
});

app.get('/forgot-password', function(req, res) {
  res.render('forgotPassword', {messages: res.locals.flash});
  req.session.flash = [];
});

app.post('/forgot-password', urlencodedParser, function(req, res) {
  if (!req.body || !req.body.username) {
    req.flash('error', 'Username is required');
    res.redirect(`${BASE_URL}/forgot-password`);
    return;
  }
  console.log("forgot password for:", req.body.username);

  getUser(req.body.username).then(user => {
    console.log("found user:", user);
    var url = generateTokenUrl(`${BASE_URL}/resest-password`, {username: user.username});
    console.log("password reset requested:", url);
    return sendMail({
      email: user.email,
      action: 'forgotPassword',
      properties: {
        url: url
      }
    }).then(info => {
      req.flash('success', 'Check your email');
      res.redirect(`${BASE_URL}/forgot-password`);
      console.log("sent link to set password");
    }, error => {
      req.flash('error', 'Error sending email: '+error);
      res.redirect(`${BASE_URL}/forgot-password`);
    });
  }, error => {
    req.flash('error', 'Invalid Username');
    res.redirect(`${BASE_URL}/forgot-password`);
  });
});



//meh
function setPassword(req, res, next) {
  if (!req.body || !req.body.password) return res.sendStatus(400);
  var password = req.body.password;
  var username = req.tokenParams.username;

  return getUser(username).then(user => {
    console.log("setting user password:", username);
    return doHash(password).then(hash => {
      user.password_hash = hash;
      user.email_confirmed = true;
      return updateUser(user.id, user).then(response => {
        req.login(user, function(err) {
          if (err) {
            console.error("Could not login")
            console.error(err);
            //res.status(500).send(err)
            return;
          }
          customerEvent({email:user.email, event:'login'});
          next();
        });
        return user;
      }, error => {
        console.error("Could not save password")
        console.error(error)
        res.status(500).send(err)
      });
    });
  }, notFound => {
    res.status(400);
  });
}

function setPasswordWithEvent(eventName) {
  return function(req, res, next) {
    setPassword(req, res, next).then(user => {
      customerEvent({email:user.email, event: eventName});
    });
  }
}

//activate == reset but with different templates

app.get('/activate', readTokenParams('username'), function(req, res) {
  res.render('activate', {
    username: req.tokenParams.username,
    messages: res.locals.flash,
  });
  req.session.flash = [];
});

app.post('/activate', readTokenParams('username'), urlencodedParser, function(req, res, next) {
  if (!req.body || !req.body.password || req.body.password !== req.body.password_confirm) {
    req.flash('error', 'Passwords do not match')
    res.redirect(BASE_URL+req.url);
  } else {
    next();
  }
}, setPasswordWithEvent('activate'), function(req, res) {
  res.redirect('/');
});

app.get('/reset-password', readTokenParams('username'), function(req, res) {
  res.render('resetPassword', {
    username: req.tokenParams.username,
    messages: res.locals.flash,
  });
  req.session.flash = [];
});

app.post('/reset-password', readTokenParams('username'), urlencodedParser, function(req, res, next) {
  if (!req.body || !req.body.password || req.body.password !== req.body.password_confirm) {
    req.flash('error', 'Passwords do not match')
    res.redirect(BASE_URL+req.url);
  } else {
    next();
  }
}, setPasswordWithEvent('resest-password'), function(req, res) {
  res.redirect('/');
});


var server = app.listen(parseInt(process.env.PORT) || 8000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Auth is listening at http://${host}:${port}`)
});
