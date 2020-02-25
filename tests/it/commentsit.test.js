const request = require('supertest')
const expect = require('chai').expect;
const should = require('chai').should();
const app = require('../../app')

describe('=== Org comments Integration test cases ===', () => {

  
  it('should create a new comments', function(done) {
    request(app)
      .post('/orgs/xendit/comments')
      .send({
        comment: 'this is test comment'
      }).end((err, response) => {
      response.status.should.be.equal(200);
      done();
      })
  });

  it('invalid comment', function(done) {
    request(app)
      .post('/orgs/xendit/comments')
      .send({
        comment: ''
      }).end((err, response) => {
        response.status.should.be.equal(400);
        done(err);
      })
  });
  

  it('invalid org', function(done) {
    request(app)
      .post('/orgs/dummy/comments')
      .send({
        comment: 'hello'
      }).end((err, response) => {
        response.status.should.be.equal(400);
        done(err);
        })
  })

  it('should list the comments of org', function(done) {
    // Post the comment.
    request(app)
    .post('/orgs/xendit/comments')
    .send({
      comment: ''
    }).end((err, response) => {
      if (err) {
      response.status.should.be.equal(400);
      done(err);
      }
      })

    // List the comments.
    request(app)
      .get('/orgs/xendit/comments').end((err, response) => {
        response.status.should.be.equal(200);
        var body = response.body;
        expect(body).to.be.an('array');      
      })
      done();
  });

  
  it('should delete the comments of org', function(done) {
    // Create the comment. 
    request(app)
      .post('/orgs/xendit/comments')
      .send({
        comment: 'this is test comment'
      }).end((err, response) => {
         response.status.should.be.equal(200);
      })

    // Delete the comment.
    request(app)
      .delete('/orgs/xendit').end((err, response) => {
        response.status.should.be.equal(200);
      })

    // List the comments.
    request(app)
      .get('/orgs/xendit/comments').end((err, response) => {
        response.status.should.be.equal(200);
        response.body.length.should.be.equal(0);
      });
      done();
  });
})
