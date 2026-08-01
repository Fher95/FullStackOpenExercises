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
      )}
    </ul>
  </>)
}

export default BlogList