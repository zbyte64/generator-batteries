import _ from 'lodash';
import querystring from 'querystring';
import jwt from 'jsonwebtoken';

export function readTokenParams(...required) {
  return function *(next) {
    if (this.request.query && this.request.query.token) {
      var path = this.request.path;
      var token = this.request.query.token;
      this.tokenParams = yield new Promise(function(resolve, reject) {
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
          if (err) {
            reject(err);
          } else if (decoded.path !== path) {
            reject('incorrect path');
          } else {
            //TODO required
            resolve(decoded);
          }
        });
      });
      yield next;
    } else {
      this.throw(403);
    }
  }
}

export var DEFAULT_EXPIRATION = 60*60*24*3; //3 Days ; seconds
export function generateTokenUrl(path, params, expiresIn=DEFAULT_EXPIRATION) {
  var token = jwt.sign(_.merge({path}, params), process.env.SECRET, {
    expiresIn: expiresIn
  });
  return path+'?'+querystring.encode({token});
}
