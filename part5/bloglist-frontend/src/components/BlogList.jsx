import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  console.log(blogs)
  return (<>
    <h2>blogs</h2>
    <ul>
      {blogs.map(blog =>
        <li key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title + ' ' + blog.author}</Link>
        </li>
        // <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} currentUser={user} />
      )}
    </ul>
  </>)
}

export default BlogList