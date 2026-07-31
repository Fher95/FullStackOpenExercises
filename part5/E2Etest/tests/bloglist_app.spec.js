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
    const locator = page.getByText('Login')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('loggout')).toBeVisible()
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
      await expect(page.getByText('loggout')).toBeVisible()
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
      test('user cannot like their own blog', async ({ page }) => {
        await page.getByText('Blog 1 Author 1').click()
        await page.getByText('Author 1: Blog 1').waitFor()
        await expect(page.getByRole('button', { name: 'like' })).toBeHidden();
      })

      test('confirm deletion', async ({ page }) => {
        page.once('dialog', async dialog => {
          console.log(`Dialog message: ${dialog.message()}`);
          await dialog.accept(); // Clicks "OK"
        });
        await page.getByText('To delete Author to delete').click()
        await page.getByRole('button', { name: 'remove' }).click()
        await page.getByText('To delete has been removed').waitFor()
        await expect(page.getByText('To delete has been removed')).toBeVisible()
      })

      test('login with another user to verify remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'loggout' }).click()
        await loginWith(page, 'fher', '1234')
        await page.getByText('Blog 1').waitFor()
        await page.getByText('Blog 1').click()
        const expandedElement = page.getByText('To delete Author to delete').locator('..')
        await expect(expandedElement.getByRole('button', { name: 'remove' })).toBeHidden();
      })

      test('blogs are arranged in the order according to the likes', async ({ page }) => {

        // Loggout and login with another user
        await page.getByRole('button', { name: 'loggout' }).click()
        await loginWith(page, 'fher', '1234')

        // One like click to Blog 1
        await page.getByText('Blog 1').click()
        await page.getByText('Author 1: Blog 1').waitFor()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByText('likes 1').waitFor()

        // Go back to the main page
        await page.goBack()

        // Two like clicks to Blog 2
        await page.getByText('Blog 2 Author 2').click()
        await page.getByText('Author 2: Blog 2').waitFor()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByText('likes 1').waitFor()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByText('likes 2').waitFor()

        // Go back to the main page
        await page.goBack()

        // const items = page.locator('.blog-style');
        const items = await page.getByRole('listitem');
        await expect(items).toHaveText([
          'Blog 2 Author 2',
          'Blog 1 Author 1',
          'To delete Author to delete'
        ]);
      })

    })

  })
})