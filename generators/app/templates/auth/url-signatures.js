import _ from 'lodash';
import querystring from 'querystring';
import jwt from 'jsonwebtoken';

export function readTokenParams() {
  return function(req, res, next) {
    jwt.verify(req.query.token, process.env.SECRET, function(err, decoded) {
      if (err) {
        return res.send(400, err);
      }
      if (decoded.path !== req.path) {
        return res.send(403);
      }
      req.tokenParams = decoded;
      next();
    });
  }
}

export var DEFAULT_EXPIRATION = 60*24*3; //3 Days
export function generateTokenUrl(path, params, expiresIn=DEFAULT_EXPIRATION) {
  var token = jwt.sign(_.merge({path}, params), process.env.SECRET, {
    expiresInMinutes: expiresIn
  });
  return querystring.encode({token});
}
