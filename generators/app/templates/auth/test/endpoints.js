import {app} from '../app.js';
import {expect} from 'chai';
var request = require('co-supertest').agent(app.listen());

describe('auth endpoints', function() {
  describe('/', function() {
    it('should return 404', function *(){
      var res = yield request.get('/').expect(404).end();
    });
  });

  describe('/login', function() {
    it('should return Hello, World', function *(){
      var res = yield request.get('/login').expect(200).end();
      //expect(res.text).to.equal('Hello, World');
    });
  });
});
