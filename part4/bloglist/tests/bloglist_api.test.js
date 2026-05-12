const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

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

test('a new blog is correctly saved', async () => {
  await api.post('/api/blogs').send({
    title: 'Test note',
    author: 'Fernando Gomez',
    url: 'Random url'
  })
  const allBlogs = await Blog.find({})
  assert.equal(allBlogs.length, helper.initialBlogs.length + 1)
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
  await api.post('/api/blogs').send({
    author: 'Fernando Gomez',
    url: 'Random url'
  }).expect(400)
})

test('update de number of likes of a blog', async () => {
  const blogs = await helper.blogsInDb()
  const blogToUpdate = blogs[0]
  blogToUpdate.likes = 24
  await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate).expect(200)
  const updatedBlog = await Blog.findById(blogToUpdate.id)
  assert.strictEqual(updatedBlog.likes, 24)
})

test('deletion of a blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})
