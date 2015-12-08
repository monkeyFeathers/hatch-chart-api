var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var User = require('../models/User');
var appRootUrl = 'http://localhost:3127';
chai.use(chaiHttp);

function handleErr(done, err) {if (err) done(err)}

describe('Protected Api', function() {

  describe('#bug verbs', function() {
    it('should not allow access with no token', function(done) {
      chai.request(appRootUrl).get('/api/bugs')
        .then(function(res) {
            expect(res.status).to.eql(401);
            done();
        })
        .catch(function(err) { handleErr(done, err) });
    });

    it('should allow GET access with token', function(done) {
      chai.request(appRootUrl).get('/api/bugs').set('Authorization', 'Bearer ' + process.env.token)
        .then(function(res) {
          expect(res.status).to.eql(200);
          done();
        })
        .catch(function(err) { handleErr(done, err) })
    });

    it('should check if user is MASTER before POST requests', function(done) {
      chai.request(appRootUrl).post('/api/bugs').set('Authorization', 'Bearer ' + process.env.token)
        .then(function(res) {
          expect(res.status).to.eql(401)
          expect(res.text).to.eql('Unauthorized')
          done()
        })
        .catch(function(err) { handleErr(done, err) })
    });

    it('should check if user is MASTER before PUT requests', function(done) {
      chai.request(appRootUrl).put('/api/bugs/56660508ac6acd3c0d4b1911').set('Authorization', 'Bearer ' + process.env.token)
        .then(function(res) {
          expect(res.status).to.eql(401)
          expect(res.text).to.eql('Unauthorized')
          done()
        })
        .catch(function(err) { handleErr(done, err) })
    });

    it('should check if user is MASTER before DELETE requests', function(done) {
      chai.request(appRootUrl).del('/api/bugs/56660508ac6acd3c0d4b1911').set('Authorization', 'Bearer ' + process.env.token)
        .then(function(res) {
          expect(res.status).to.eql(401)
          expect(res.text).to.eql('Unauthorized')
          done()
        })
        .catch(function(err) { handleErr(done, err) })
    });

  });

});
// create a new user for testing purposes and set a token
