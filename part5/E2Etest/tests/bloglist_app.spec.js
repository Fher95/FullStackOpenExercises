const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Fher Gomez',
        username: 'fher',
        password: '1234'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Login in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      const errorDiv = page.locator('.red-alert')
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Viaje al centro de la tierra', 'Julio Verne', 'http://julioverne.com')
      await expect(page.getByText('a new blog Viaje al centro de la tierra by Julio Verne added'))
      await expect(page.getByText('Viaje al centro de la tierra Julio Verne added'))
    })

    describe('when a blogs has been already created', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Blog 1', 'Author 1', 'http://author1.com')
        await createBlog(page, 'Blog 2', 'Author 2', 'http://author2.com')
        await createBlog(page, 'To delete', 'Author to delete', 'http://todelete.com')
      })
      test('a blog can be liked', async ({ page }) => {
        const blogElement = page.getByText('Blog 1 Author 1')
        await blogElement.getByRole('button', { name: 'view' }).click()
        const expandedElement = page.getByText('Blog 1 Author 1').locator('..')
        await expandedElement.getByRole('button', { name: 'like' }).click()
        await expandedElement.getByText('1 like').waitFor()
        await expect(page.getByText('1 like')).toBeVisible()
      })

      test('confirm deletion', async ({ page }) => {
        page.once('dialog', async dialog => {
          console.log(`Dialog message: ${dialog.message()}`);
          await dialog.accept(); // Clicks "OK"
        });
        const blogElement = page.getByText('To delete Author to delete')
        await blogElement.getByRole('button', { name: 'view' }).click()
        const expandedElement = page.getByText('To delete Author to delete').locator('..')
        await expandedElement.getByRole('button', { name: 'remove' }).click()
        await page.getByText('To delete has been removed').waitFor()
        await expect(page.getByText('To delete has been removed')).toBeVisible()
      })

      test('login with another user to verify remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'loggout' }).click()
        await loginWith(page, 'fher', '1234')
        await page.getByText('Blog 1').waitFor()
        const blogElement = page.getByText('Blog 1')
        await blogElement.getByRole('button', { name: 'view' }).click()
        const expandedElement = page.getByText('To delete Author to delete').locator('..')
        await expect(expandedElement.getByRole('button', { name: 'remove' })).toBeHidden();
      })

      test('blogs are arranged in the order according to the likes', async ({ page }) => {

        // One like click to Blog 1
        await page.getByText('Blog 1').getByRole('button', { name: 'view' }).click()
        const expandedBlog1 = page.getByText('Blog 1').locator('..')
        await expandedBlog1.getByRole('button', { name: 'like' }).click()
        await expandedBlog1.getByText('1 like').waitFor()

        // Two like clicks to Blog 2
        await page.getByText('Blog 2 Author 2').getByRole('button', { name: 'view' }).click()
        const expandedBlog2 = page.getByText('Blog 2').locator('..')
        await expandedBlog2.getByRole('button', { name: 'like' }).click()
        await expandedBlog2.getByText('1 like').waitFor()
        await expandedBlog2.getByRole('button', { name: 'like' }).click()
        await expandedBlog2.getByText('2 like').waitFor()

        const items = page.locator('.blog-style');
        await expect(items).toHaveText([
          'Blog 2 Author 2 hidehttp://author2.com2 likeMatti Luukkainenremove',
          'Blog 1 Author 1 hidehttp://author1.com1 likeMatti Luukkainenremove',
          'To delete Author to delete view'
        ]);
      })

    })

  })

})