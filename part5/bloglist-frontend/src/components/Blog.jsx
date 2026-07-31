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
    const btnRemoveStyle = {
      color: 'white',
      backgroundColor: 'blue'
    }
    if (currentUser?.username === blog.user?.username) {
      return (<div><button style={btnRemoveStyle} onClick={() => onRemove(blog)}>remove</button></div>)
    }
    return null
  }

  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5
  // }
  return (
    <div className='blog-style'>
      <h2>
        {blog.author}: {blog.title}
      </h2>
      <div id='blogUrl'><a href={blog.url} target='_blank'>{blog.url}</a> </div>
      <div>likes {blog.likes} {showLikeButton && (<button onClick={() => onLikes(blog)}>like</button>)}</div>
      <div>{blog.user?.name}</div>
      {RemoveButton(blog)}

    </div>
  )
}

export default Blog