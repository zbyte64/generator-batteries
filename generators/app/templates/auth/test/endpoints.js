import {expect} from 'chai';

process.env.SECRET = "bwahaha"
process.env.BASE_URL = ""; //hack
var app = require('../app').app;
var generateTokenUrl = require('../url-signatures').generateTokenUrl;
var request = require('co-supertest').agent(app.listen());


describe('auth endpoints', function() {
  describe('/', function() {
    it('should return 404', function *(){
      var res = yield request.get('/').expect(404).end();
    });
  });

  describe('/login', function() {
    it('should render', function *(){
      var res = yield request.get('/login').expect(200).end();
      expect(res.text).to.be.a('string');
    });

    it('accept login attempts', function *(){
      var res = yield request.post('/login').expect(302).end();
      expect(res.headers.location).to.equal('/login');
    });
  });

  describe('/logout', function() {
    it('logs user out', function *(){
      var res = yield request.get('/logout').expect(302).end();
      expect(res.headers.location).to.equal('/login');
    });
  });

  describe('/signup', function() {
    it('should render', function *(){
      var res = yield request.get('/signup').expect(200).end();
      expect(res.text).to.be.a('string');
    });

    it('accept signup attempts', function *(){
      var res = yield request.post('/signup').expect(302).end();
      expect(res.headers.location).to.equal('/signup');
    });
  });

  describe('/forgot-password', function() {
    it('should render', function *(){
      var res = yield request.get('/forgot-password').expect(200).end();
      expect(res.text).to.be.a('string');
    });

    it('accept submissions', function *(){
      var res = yield request.post('/forgot-password').expect(302).end();
      expect(res.headers.location).to.equal('/forgot-password');
    });
  });

  describe('/activate', function() {
    it('requires a token', function *(){
      var res = yield request.get('/activate').expect(403).end();
    });


    it('renders when given a good token', function *(){
      var [url, query] = generateTokenUrl('/activate', {'username':'billy'}).split('?');
      expect(url).to.be.equal('/activate');
      var res = yield request.get(url).query(query).expect(200).end();
      expect(res.text).to.be.a('string');
    });

  });

  describe('/reset-password', function() {
    it('requires a token', function *(){
      var res = yield request.get('/reset-password').expect(403).end();
    });

    it('renders when given a good token', function *(){
      var [url, query] = generateTokenUrl('/reset-password', {'username':'billy'}).split('?');
      expect(url).to.be.equal('/reset-password');
      var res = yield request.get(url).query(query).expect(200).end();
      expect(res.text).to.be.a('string');
    });
  });
});
