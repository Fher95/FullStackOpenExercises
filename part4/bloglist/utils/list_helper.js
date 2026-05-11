const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, item) => total + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.sort((a, b) => -(a.likes - b.likes))[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}