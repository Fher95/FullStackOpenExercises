import { useState } from 'react'
const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {

  const [view, setView] = useState(false)

  const toggleDetails = () => {
    setView(!view)
  }

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
    const btnRemoveStyle = {
      color: 'white',
      backgroundColor: 'blue'
    }
    if (currentUser.username === blog.user.username) {
      return (<div><button style={btnRemoveStyle} onClick={() => onRemove(blog)}>remove</button></div>)
    }
    return null
  }

  const DetailSection = (blog) => {
    return (<>
      <div id='blogUrl'>{blog.url}</div>
      <div>{blog.likes} <button onClick={() => onLikes(blog)}>like</button></div>
      <div>{blog.user.name}</div>
      {RemoveButton(blog)}
    </>)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleDetails}>{view ? 'hide' : 'view'}</button>
      </div>
      {view && DetailSection(blog)}

    </div>
  )
}

export default Blog