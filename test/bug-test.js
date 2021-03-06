var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var appRootUrl = 'http://localhost:3127'
var bugStubs = require('./bugStubs')


chai.use(chaiHttp);

describe('connection working', function() {
  it('should be ok', function(done) {
    chai.request(appRootUrl)
    .get('/')
    .then(function(res) {
      expect(res).to.have.status(200)
      done()
    })
    .catch(function(err) { if (err) done(err)})
  })
})

describe('Bug crud', function() {
  var bugId = null;
  describe('#create', function() {

    it('should create a new bug on POST to /bugs', function(bugOut) {
      chai.request(appRootUrl)
        .post('/bugs')
        .send(bugStubs.BWO)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('msg')
          expect(res.body.msg).to.eql('1 bug successfully saved')
          bugId = res.body.id;
          bugOut();
        })
        .catch(function(err) {
          if (err) bugOut(err)
        })
      })

    }) // describe Create

    describe('#read', function() {

      it('should return all the bugs with GET /bugs', function(bugOut) {
        chai.request(appRootUrl).get('/bugs')
        .then(function(res) {
          expect(res).to.have.status(200)
          expect(res.body[res.body.length - 1]._id).to.deep.eql(bugId)
          bugOut();
        })
        .catch(function(err) { if (err) bugOut(err) });
      });

      it('should return a specific bug with GET /bugs/:id', function(bugOut) {
        chai.request(appRootUrl).get('/bugs/' + bugId)
        .then(function(res) {
          expect(res).to.have.status(200)
          expect(res.body._id).to.eql(bugId)
          expect(res.body.scientificName).to.eql(bugStubs.BWO.scientificName)
          bugOut();
        })
        .catch(function(err) { if (err) bugOut(err) });
      });

    }); // describe Read

    describe('#update', function() {

      it('should update on PUT to /bugs/:id', function(bugOut) {
        chai.request(appRootUrl)
        .put('/bugs/' + bugId)
        .send({scientificName: 'Baetidae Acerpenna pygmaea'})
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body.scientificName).to.eql('Baetidae Acerpenna pygmaea')
          bugOut()
        })
        .catch(function(err) { if (err) bugOut(err) })
      });

    })

    describe('#delete', function() {

      it('should delete a bug on DELETE to /bugs/:bug', function(bugOut) {
        chai.request(appRootUrl)
          .del('/bugs/' + bugId)
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res.text).to.eql('1 bug successfully deleted');
            bugOut();
          })
          .catch(function(err) {
            if (err) bugOut(err)
          })

      })

  }) // describe Delete

});
