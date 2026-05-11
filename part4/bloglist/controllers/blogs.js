const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response, next) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response) => {
  console.log('AQUI LLEGA LA PETICION')
  const blog = new Blog(request.body)
  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = blogsRouter