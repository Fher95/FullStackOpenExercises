const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  if (blogs) {
    response.json(blogs)
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (!request.user?.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(request.user.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({ ...request.body, user: user._id })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  if (request.user?.id !== blog.user?.toString()) {
    return response.status(401).send({ error: 'only user who created the blog can delete it' })
  }
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