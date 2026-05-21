import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

test('renders blog title and author', () => {
  const blog = {
    title: 'Blog Title',
    author: 'Linus Torvals',
    url: 'noUrl'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText(
    'Blog Title Linus Torvals'
  )

  const ulrElement = screen.queryByText('noUrl')


  expect(element).toBeDefined()
  expect(ulrElement).toBeNull()
})


test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'Blog Title',
    author: 'Linus Torvals',
    url: 'urlTest',
    likes: 2,
    user: { name: 'superuser', username: 'user' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} currentUser={blog.user} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const element = screen.getByText(
    'urlTest'
  )

  expect(element).toBeDefined()
})


test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'Blog Title',
    author: 'Linus Torvals',
    url: 'urlTest',
    likes: 2,
    user: { name: 'superuser', username: 'user' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} currentUser={blog.user} />)

  const user = userEvent.setup()
  const buttonView = screen.getByText('view')
  await user.click(buttonView)
  const buttonLike = screen.getByText('like')
  await user.click(buttonLike)
  await user.click(buttonLike)

  expect(mockHandler.mock.calls).toHaveLength(2)
})