const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  if (blogs) {
    response.json(blogs)
  }
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const newBlog = { ...request.body }
  const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, { returnDocument: 'after', runValidators: true })
  if (updatedBlog) {
    return response.json(updatedBlog)
  }
  response.status(404).end()
})

module.exports = blogsRouter