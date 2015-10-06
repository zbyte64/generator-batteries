import passport from 'koa-passport';
import bcrypt from 'bcrypt';
import {Strategy as LocalStrategy} from 'passport-local';
import {getUser} from './models';

passport.use('login', new LocalStrategy(function(username, password, done) {
  getUser({username}).then(user => {
    bcrypt.compare(password, user.password_hash, function(err, res) {
      if (err) {
        return done(err);
      } else if (res) {
        //customerEvent.emit('login', {email:user.email});
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

export {passport}
