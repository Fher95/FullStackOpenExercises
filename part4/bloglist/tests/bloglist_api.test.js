const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const { initialBlogs } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('Get all bloglist', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('response item has the id property', async () => {
  const result = await api.get('/api/blogs')
  assert.ok(Object.hasOwn(result.body[0], 'id'))
})

test('a new blog is correctly saved', async () => {
  await api.post('/api/blogs').send({
    title: 'Test note',
    author: 'Fernando Gomez',
    url: 'Random url'
  })
  const allBlogs = await Blog.find({})
  assert.equal(allBlogs.length, initialBlogs.length + 1)
  const savedBlog = await Blog.findOne({ title: 'Test note', author: 'Fernando Gomez', })
  assert.deepEqual(savedBlog.author, 'Fernando Gomez')

})

test('a new created blog has 0 likes by default', async () => {
  await api.post('/api/blogs').send({
    title: 'Test note',
    author: 'Fernando Gomez',
    url: 'Random url'
  })
  const savedBlog = await Blog.findOne({ title: 'Test note', author: 'Fernando Gomez', })
  assert.equal(savedBlog.likes, 0)
})

test('should return 400 status when trying to save a blog without title', async () => {
  const response = await api.post('/api/blogs').send({
    author: 'Fernando Gomez',
    url: 'Random url'
  })
  assert.equal(response.statusCode, 400)
})

// test('a specific blog is within the returned blogs', async () => {
//   const response = await api.get('/api/notes')

//   const contents = response.body.map((e) => e.content)
//   assert(contents.includes('HTML is easy'))
// })

after(async () => {
  await mongoose.connection.close()
})
