const request = require('supertest')
const app = require('../server')
describe('Create comments', () => {
  it('should create a new comments', async () => {
    const res = await request(app)
      .post('/orgs/alpha/comments')
      .send({
        comment: 'this is test comment'
      })
    expect(res.statusCode).toEqual(200)

  })

  it('should list the comments of alpha', async () => {
    const res = await request(app)
      .get('/orgs/alpha/comments')
    expect(res.statusCode).toEqual(200)

  })

  it('should delete the comments of alpha', async () => {
    const res = await request(app)
      .post('/orgs/alpha/comments')
      .send({
        comment: 'this is test comment'
      })
    const res1 = await request(app)
      .delete('/orgs/alpha')
    expect(res1.statusCode).toEqual(200)

    const res2 = await request(app)
      .get('/orgs/alpha/comments')
    expect(res2.body.length).toEqual(0)
  })
})
