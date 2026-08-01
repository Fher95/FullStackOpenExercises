import { Paper, Typography, Button } from '@mui/material'
const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {

  if (!blog) return null

  const showLikeButton = currentUser ? currentUser.username !== blog.user?.username : false

  const onLikes = (blog) => {
    blog.likes = blog.likes + 1
    handleLike(blog)
  }

  const onRemove = async (blog) => {
    const confirm = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (confirm) {
      handleDelete(blog)
    }
  }

  const RemoveButton = (blog) => {
    if (currentUser?.username === blog.user?.username) {
      return (<div><Button variant='outlined' color='error' onClick={() => onRemove(blog)}>remove</Button></div>)
    }
    return null
  }

  const LikeButton = (blog) => {
    if (showLikeButton) { return <Button variant='outlined' onClick={() => onLikes(blog)}>like</Button> }
    return null
  }

  return (
    <Paper elevation={3} style={{ padding: '10px', marginTop: '10px' }}>
      <Typography variant="h4">
        {blog.title}
      </Typography>
      <Typography variant="subtitle1" color='textSecondary'>
        by {blog.author}
      </Typography>
      <Typography variant="body1" style={{ marginTop: '8px' }}><a href={blog.url} target='_blank'>{blog.url}</a></Typography>
      <Typography variant="subtitle2" style={{ marginTop: '10px' }} color="textSecondary">
        Added by {blog.user?.name}
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
        <Typography variant="h6">
          {blog.likes} likes
        </Typography>
        {LikeButton(blog)}
        {RemoveButton(blog)}
      </div>


    </Paper>
  )
}

export default Blog