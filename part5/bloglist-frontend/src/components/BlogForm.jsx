import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ onSaveBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    onSaveBlog({ title, author, url })
  }

  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <TextField label="Author" value={author} onChange={(event) => setAuthor(event.target.value)} />
        <TextField label="URL" value={url} onChange={(event) => setUrl(event.target.value)} />
        <Button type="submit" variant="contained" color="primary">create</Button>
      </form>
    </div>
  )
}

export default BlogForm