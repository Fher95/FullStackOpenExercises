import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, vi } from 'vitest'

import Blog from './Blog'

beforeEach(() => {
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

afterEach(() => {
  vi.restoreAllMocks()
})

test('renders blog title and author', () => {
  const blog = {
    title: 'Blog Title',
    author: 'Linus Torvals',
    url: 'noUrl'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText(
    'Linus Torvals: Blog Title'
  )

  const ulrElement = screen.queryByText('noUrl')


  expect(element).toBeDefined()
  expect(ulrElement).not.toBeNull()
})


test('clicking the view button shows more info', async () => {
  const blog = {
    title: 'Blog Title',
    author: 'Linus Torvals',
    url: 'urlTest',
    likes: 2,
    user: { name: 'superuser', username: 'user' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} currentUser={blog.user} />)

  // const user = userEvent.setup()
  // const button = screen.getByText('view')
  // await user.click(button)

  const element = screen.getByText(
    'urlTest'
  )

  expect(element).toBeDefined()
})


test('Authenticated and author user can delete a blog', async () => {
  const blog = {
    title: 'Blog Title',
    author: 'Linus Torvals',
    url: 'urlTest',
    likes: 2,
    user: { name: 'superuser', username: 'user' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleDelete={mockHandler} currentUser={blog.user} />)

  const user = userEvent.setup()
  // const buttonView = screen.getByText('view')
  // await user.click(buttonView)
  const buttonLike = screen.getByText('remove')
  await user.click(buttonLike)
  await user.click(buttonLike)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('Author user cannot like his own blog', async () => {
  const blog = {
    title: 'Blog Title',
    author: 'Linus Torvals',
    url: 'urlTest',
    likes: 2,
    user: { name: 'superuser', username: 'user' }
  }
  const currentUser = { name: 'anotheruser', username: 'user' }
  render(<Blog blog={blog} currentUser={currentUser} />)
  const likes = screen.getByText('likes 2')
  console.log(likes.innerHTML)
  expect(likes.getElementsByTagName('button')).toHaveLength(0)
})

test('Not authenticated users cannot like or remove blogs', async () => {
  const blog = {
    title: 'Blog Title',
    author: 'Linus Torvals',
    url: 'urlTest',
    likes: 2,
    user: { name: 'superuser', username: 'user' }
  }
  render(<Blog blog={blog} />)
  const likes = screen.getByText('likes 2')
  const removeButton = screen.queryByText('remove')
  expect(likes.getElementsByTagName('button')).toHaveLength(0)
  expect(removeButton).not.toBeInTheDocument()
})
