import _ from 'lodash';
import koa from 'koa';
import csrf from 'koa-csrf';
import bodyParser from 'koa-bodyparser';
import flash from 'koa-connect-flash';
import views from 'koa-views';
import session from 'koa-session';
import path from 'path';

import {passport} from './strategies';
import {router} from './router';


export var app = koa();
export var viewsDir = path.join(__dirname, 'views');

app.keys = [new Buffer(process.env.SECRET || "foobar")];

app.use(views(viewsDir, {
  map: {
    html: 'swig'
  }
}));

app.use(session(app));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser());
csrf(app);
app.use(csrf.middleware);
app.use(router.routes());
app.use(router.allowedMethods());
