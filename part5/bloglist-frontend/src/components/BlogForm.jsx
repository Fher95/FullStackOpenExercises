import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ showNotification, onBlogSaved }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      const saveResult = await blogService.save({ title, author, url })
      onBlogSaved()
      showNotification(`a new blog ${saveResult.title} by ${saveResult.author} added`, true)
    } catch (error) {
      showNotification(error.response?.data?.error, true)
    }
  }

  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={onSubmit}>
        <div><label>title <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} /></label></div>
        <div><label>author <input type="text" value={author} onChange={(event) => setAuthor(event.target.value)} /></label></div>
        <div><label>url <input type="text" value={url} onChange={(event) => setUrl(event.target.value)} /></label></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm