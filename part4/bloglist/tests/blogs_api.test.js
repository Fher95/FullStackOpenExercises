const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)
let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  // Create the user
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root2', name: 'test user', passwordHash })
  await user.save()

  //Login to get the auth token
  const response = await api.post('/api/login').send({ username: 'root2', password: 'sekret' })
  token = 'Bearer ' + response.body.token
})

describe('Test get blogs methods', () => {
  test('Get all bloglist', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('response item has the id property', async () => {
    const result = await api.get('/api/blogs')
    assert.ok(Object.hasOwn(result.body[0], 'id'))
  })

})

describe('Test create and update blog methods', () => {
  test('a new blog is correctly saved', async () => {
    await api.post('/api/blogs')
      .set('Authorization', token)
      .send({
        title: 'Test note',
        author: 'Fernando Gomez',
        url: 'Random url'
      })
    const allBlogs = await Blog.find({})
    assert.equal(allBlogs.length, helper.initialBlogs.length + 1)
    const savedBlog = await Blog.findOne({ title: 'Test note', author: 'Fernando Gomez', })
    assert.deepEqual(savedBlog.author, 'Fernando Gomez')

  })

  test('unauthorized blog creation (with no token)', async () => {
    await api.post('/api/blogs')
      .send({
        title: 'Test note',
        author: 'Fernando Gomez',
        url: 'Random url'
      }).expect(401)
  })

  test('a new created blog has 0 likes by default', async () => {
    await api.post('/api/blogs')
      .set('Authorization', token)
      .send({
        title: 'Test note',
        author: 'Fernando Gomez',
        url: 'Random url'
      })
    const savedBlog = await Blog.findOne({ title: 'Test note', author: 'Fernando Gomez', })
    assert.equal(savedBlog.likes, 0)
  })

  test('should return 400 status when trying to save a blog without title', async () => {
    await api.post('/api/blogs')
      .set('Authorization', token)
      .send({
        author: 'Fernando Gomez',
        url: 'Random url'
      }).expect(400)
  })
})

describe('Test deletion blog methods', () => {
  test('update de number of likes of a blog', async () => {
    const blogs = await helper.blogsInDb()
    const blogToUpdate = blogs[0]
    blogToUpdate.likes = 24
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate).expect(200)
    const updatedBlog = await Blog.findById(blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, 24)
  })

  test('deletion of a blog with correct user', async () => {
    // Create a new blog with an user
    let blogToDelete = await api.post('/api/blogs')
      .set('Authorization', token)
      .send({
        title: 'Test note',
        author: 'Fernando Gomez',
        url: 'Random url'
      })
    blogToDelete = blogToDelete.body
    const blogsAtStart = await helper.blogsInDb()
    await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', token).expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('unauthorized deletion of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', 'randomInvalidToken').expect(401)
  })
})

after(async () => {
  await mongoose.connection.close()
})
