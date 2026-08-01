import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSaveBlog', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm onSaveBlog={createBlog} />)

  const title = screen.getByLabelText('Title')
  const author = screen.getByLabelText('Author')
  const url = screen.getByLabelText('URL')

  const sendButton = screen.getByText('create')

  await user.type(title, 'title1')
  await user.type(author, 'author1')
  await user.type(url, 'url1')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('title1')
})