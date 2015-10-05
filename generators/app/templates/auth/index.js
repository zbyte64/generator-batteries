import _ from 'lodash';
import koa from 'koa';
import $router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import flash from 'koa-connect-flash';
import views from 'koa-views';
import passport from 'koa-passport';
import session from 'koa-session';
import {Strategy as LocalStrategy} from 'passport-local';
import bcrypt from 'bcrypt';
import {EventEmitter} from "events";
import path from 'path';
import thunkify from 'thunkify';

import {getUser, updateUser} from './models';
import {sendMail} from './mailer';
import {readTokenParams, generateTokenUrl} from './url-signatures';

export var customerEvent = new EventEmitter();

//todo common passport
passport.use('login', new LocalStrategy(function(username, password, done) {
  getUser({username}).then(user => {
    bcrypt.compare(password, user.password_hash, function(err, res) {
      if (err) {
        return done(err);
      } else if (res) {
        customerEvent.emit('login', {email:user.email});
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect Login' });
      }
    });
  }, notFound => {
    return done(null, false, { message: 'Incorrect Login'});
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  getUser({id}).then(user => {
    done(null, user);
  }, notFound => {
    done(notFound, null)
  });
});


var urlencodedParser = bodyParser.urlencoded({ extended: false });
var BASE_URL = process.env.BASE_URL;
var viewsDir = path.join(__dirname, 'views');

var router = $router();
var app = koa();

app.keys = [process.env.SECRET];

app.use(views(viewsDir, {
  map: {
    html: 'swig'
  }
}));

//we need sessions for passport, but express-jwt is not session based
app.use(session(app));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(router.routes());
app.use(router.allowedMethods());

router.get('/login', *function() {
  this.body = yield this.render('login', {errors: this.flash('error')});
});

router.post('/login',
  urlencodedParser, passport.authenticate('login',{successRedirect: '/',
                                                   failureRedirect: `${BASE_URL}/login`,
                                                   failureFlash: true }));

router.get('/logout', *function() {
  if (req.user) {
    customerEvent.emit('logout', {email: this.user.email});
    this.logout();
  }
  this.redirect(`${BASE_URL}/login`);
});

router.get('/signup', *function() {
  this.body = yield res.render('signup', {messages: this.flash()});
});

//pumps to footer signup
router.post('/signup', urlencodedParser, *function() {
  if (!this.request.body.first_name) {
    this.flash('error', 'first name is required');
    return this.redirect(`${BASE_URL}/signup`);
  }
  //if (!req.body.last_name) return res.status(400).send('last_name is required');
  if (!this.request.body.email) {
    this.flash('error', 'email is required');
    return this.redirect(`${BASE_URL}/signup`);
  }
  //if (!req.body.template) return res.status(400).send('template is required');

  var params = _.pick(this.request.body, ['first_name', 'last_name', 'email']);

  //signed url for /auth/footer-activate
  sendMail('signup', {
    email: params.email,
    properties: _.merge(params, {
      url: generateTokenUrl(`${BASE_URL}/activate`, params)
    }),
  });
  //display check your email
  this.flash('succes', 'check your email');
  return this.redirect(`${BASE_URL}/signup`);
});

router.get('/forgot-password', *function() {
  this.body = yield this.render('forgotPassword', {messages: this.flash()});
});

router.post('/forgot-password', urlencodedParser, *function() {
  if (!this.request.body || !this.request.body.username) {
    this.flash('error', 'Username is required');
    return this.redirect(`${BASE_URL}/forgot-password`);
  }
  console.log("forgot password for:", this.request.body.username);

  var ctx = this;

  //TODO big rework
  var user = yield getUser(this.request.body.username)

  console.log("found user:", user);
  var url = generateTokenUrl(`${BASE_URL}/resest-password`, {username: user.username});
  console.log("password reset requested:", url);
  var results = sendMail('forgotPassword', {
    email: user.email,
    properties: {
      url: url
    }
  });
  this.flash('success', 'Check your email');
  this.redirect(`${BASE_URL}/forgot-password`);
});


function *setPassword(next) {
  var ctx = this;
  var body = this.request.body;
  if (!body || !body.password) {
    this.response.status = 400
    return;
  }
  var password = body.password;
  var username = this.tokenParams.username;

  var user = this.user = yield getUser(username);

  console.log("setting user password:", username);
  var hash = yield thunkify(bcrypt.hash(password, 10));

  user.password_hash = hash;
  user.email_confirmed = true;

  var response = yield updateUser(user.id, user);

  yield this.login(user);
  customerEvent.emit('login', {email:user.email});
  yield next;
}

//activate == reset but with different templates

router.get('/activate', readTokenParams('username'), *function() {
  this.body = yield this.render('activate', {
    username: this.tokenParams.username,
    messages: this.flash('error'),
  });
});

router.post('/activate', readTokenParams('username'), urlencodedParser, *function(next) {
  var body = this.request.body;
  if (!body || !body.password || body.password !== body.confirm_password) {
    this.flash('error', 'Passwords do not match');
    return this.redirect(BASE_URL+req.url);
  } else {
    yield next;
  }
}, setPassword, *function() {
  customerEvent.emit('activate', {email:this.user.email});
  this.redirect('/');
});

router.get('/reset-password', readTokenParams('username'), *function() {
  this.body = yield this.render('resetPassword', {
    username: this.tokenParams.username,
    messages: this.flash('error'),
  });
});

router.post('/reset-password', readTokenParams('username'), urlencodedParser, *function(next) {
  var body = this.request.body;
  if (!body || !body.password || body.password !== body.confirm_password) {
    this.flash('error', 'Passwords do not match')
    return this.redirect(BASE_URL+req.url);
  } else {
    yield next;
  }
}, setPassword, *function() {
  customerEvent.emit('reset-password', {email:this.user.email});
  this.redirect('/');
});


var server = app.listen(parseInt(process.env.PORT) || 8000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Auth is listening at http://${host}:${port}`)
});
