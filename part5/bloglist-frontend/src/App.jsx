import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import loginService from './services/login';
import BlogForm from "./components/BlogForm"
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const handleLoging = async () => {
    try {
      const userData = await loginService.login(username, password)
      setUser(userData)
      window.localStorage.setItem('user', JSON.stringify(userData))
      blogService.setToken(userData.token)
    } catch (error) {
      showNotification(error.response.data.error, false)
    }
  }

  const handleLoggout = () => {
    window.localStorage.removeItem('user')
    setUser(null);
  }

  const loginForm = () => (
    <>
      <Notification notification={notification} />
      <Login username={username} password={password} handleLogin={handleLoging} setUsername={setUsername} setPassword={setPassword}></Login>
    </>
  )

  const showNotification = (message, success) => {
    setNotification({ message, success })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const loadBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  useEffect(() => {
    const userStr = window.localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr)
      setUser(userData)
      blogService.setToken(userData.token)
    }
  }, [])

  return (
    <div>
      {!user && loginForm()}
      {user && (<div>
        <h2>blogs</h2>
        <Notification notification={notification} />
        <p>{user.name} logged in <button onClick={handleLoggout}>loggout</button></p>
        <BlogForm showNotification={showNotification} loadBlogs={loadBlogs} />
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )} </div>)
      }
    </div>
  )
}

export default App