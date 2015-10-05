import _ from 'lodash';
import querystring from 'querystring';
import jwt from 'jsonwebtoken';

export function readTokenParams(*required) {
  return function *(next) {
    var path = this.request.path;
    this.tokenParams = yield new Promise(function(resolve, reject) {
      jwt.verify(req.query.token, process.env.SECRET, function(err, decoded) {
        if (err) {
          reject(err);
        } else if (decoded.path !== path) {
          reject('incorrect path');
        } else {
          resolve(decoded);
        }
      });
    });
    yield next;
  }
}

export var DEFAULT_EXPIRATION = 60*24*3; //3 Days
export function generateTokenUrl(path, params, expiresIn=DEFAULT_EXPIRATION) {
  var token = jwt.sign(_.merge({path}, params), process.env.SECRET, {
    expiresInMinutes: expiresIn
  });
  return querystring.encode({token});
}
