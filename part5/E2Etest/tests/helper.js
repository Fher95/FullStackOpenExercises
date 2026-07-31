const loginWith = async (page, username, password) => {
  await page.getByText('Login').click()
  // await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel("Username").fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`new blog ${title} by ${author} added`).waitFor()
}

export { loginWith, createBlog }