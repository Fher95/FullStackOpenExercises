const blogsController = require('express').Router()
const Blog = require('../models/blog')

blogsController.get('/', (request, response, next) => {
  Blog.find({}
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
  )
})

blogsController.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  blog.save().then((result) => {
    response.status(201).json(result)
  })
})