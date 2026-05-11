const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, item) => total + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  return [...blogs].sort((a, b) => -(a.likes - b.likes))[0]
}

const mostBlogs = (blogs) => {
  let result = { blogs: 0 }
  const blogsByAuthor = _.groupBy(blogs, 'author')
  Object.keys(blogsByAuthor).forEach((author) => {
    if (blogsByAuthor[author].length > result.blogs) {
      result = { author, blogs: blogsByAuthor[author].length }
    }
  })
  return result
}

const mostLikes = (blogs) => {
  let result = { likes: 0 }
  const blogsByAuthor = _.groupBy(blogs, 'author')
  Object.keys(blogsByAuthor).forEach(author => {
    const totalLikes = blogsByAuthor[author].reduce((total, item) => total + item.likes, 0)
    if (totalLikes > result.likes) {
      result = { author, likes: totalLikes }
    }
  })
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}