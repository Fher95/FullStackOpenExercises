import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Toggable'
import BlogList from './components/BlogList'
import {
  Routes, Route, Link, useMatch
} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const noteFormRef = useRef()
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(blog => blog.id === match.params.id) : null
  const navigate = useNavigate()

  const handleLoging = async () => {
    try {
      const userData = await loginService.login(username, password)
      setUser(userData)
      window.localStorage.setItem('user', JSON.stringify(userData))
      blogService.setToken(userData.token)
      navigate('/blogs')
    } catch (error) {
      showNotification(error.response.data.error, false)
    }
  }

  const handleLoggout = () => {
    window.localStorage.removeItem('user')
    setUser(null)
    navigate('/blogs')
  }

  const onSaveBlog = async (blog) => {
    try {
      noteFormRef.current?.toggleVisibility()
      const saveResult = await blogService.save(blog)
      loadBlogs()
      showNotification(`a new blog ${saveResult.title} by ${saveResult.author} added`, true)
      navigate('/blogs')
    } catch (error) {
      showNotification(error.response?.data?.error, true)
    }
  }

  const blogForm = () => {
    return (
      <>
        <Togglable buttonLabel="new blog" ref={noteFormRef}>
          <BlogForm showNotification={showNotification} onSaveBlog={onSaveBlog} />
        </Togglable>
      </>
    )
  }

  const showNotification = (message, success) => {
    setNotification({ message, success })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const loadBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs.sort((a, b) => b.likes - a.likes))
  }

  const handleLike = async (blog) => {
    try {
      await blogService.update(blog.id, { ...blog, user: blog.user.id })
      loadBlogs()
    } catch (error) {
      showNotification(error.response.data.error, false)
    }
  }

  const handleDelete = async (blog) => {
    try {
      await blogService.remove(blog.id)
      showNotification(`${blog.title} has been removed`, true)
      loadBlogs()
      navigate('/blogs')
    } catch (error) {
      showNotification(error.response.data.error, false)
    }
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  useEffect(() => {
    const userStr = window.localStorage.getItem('user')
    if (userStr) {
      const userData = JSON.parse(userStr)
      setUser(userData)
      blogService.setToken(userData.token)
    }
  }, [])

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }} >Blog App</Typography>
          <Button color="inherit" component={Link} to="/blogs" sx={style}>Blogs</Button>
          {!user && <Button color="inherit" component={Link} to="/login" sx={style}>Login</Button>}
          {user && <Button color="inherit" component={Link} to="/new-blog" sx={style}>new blog</Button>}
          {user && <Button color="inherit" onClick={handleLoggout} sx={style}>logout</Button>}
        </Toolbar>
      </AppBar>
      <Notification notification={notification} />
      <Routes>
        <Route path='/blogs' element={<BlogList blogs={blogs} />} />
        <Route path='/blogs/:id' element={<Blog blog={blog} handleLike={handleLike} handleDelete={handleDelete} currentUser={user} />} />
        <Route path='/new-blog' element={<BlogForm showNotification={showNotification} onSaveBlog={onSaveBlog} />} />
        <Route path='/login' element={<LoginForm username={username} password={password} handleSubmit={handleLoging} handleUsernameChange={setUsername} handlePasswordChange={setPassword}></LoginForm>} />
      </Routes>
    </Container>
  )
}

export default App