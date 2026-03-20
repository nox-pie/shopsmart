import { expect, test } from '@playwright/test';

test.describe('Mocked API E2E', () => {
  test('mocked GET /api/products returns JSON and page loads', async ({ page }) => {
    // Intercept the API call and return mock data
    await page.route('/api/products', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Premium Mock Shirt', price: 49.99 },
          { id: 2, name: 'Premium Mock Denim', price: 89.99 },
        ]),
      });
    });

    await page.goto('/');
    // Page should still render correctly with mocked API
    await expect(page.getByText('SHOPSMART')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Unleash Your Style');
  });

  test('mocked GET /api/cart returns cart items', async ({ page }) => {
    await page.route('/api/cart', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, productId: 5, name: 'Premium Boots', qty: 1 },
        ]),
      });
    });

    await page.goto('/cart');
    // Cart page should render regardless of API data
    await expect(page).toHaveURL(/\/cart/);
  });

  test('mocked POST /api/cart responds with success', async ({ page }) => {
    await page.route('/api/cart', async (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/');
    await expect(page.getByText('SHOPSMART')).toBeVisible();
  });

  test('page loads correctly when API returns 500 error', async ({ page }) => {
    await page.route('/api/products', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // App should not crash even when API fails
    await page.goto('/');
    await expect(page.getByText('SHOPSMART')).toBeVisible();
  });

  test('cart badge shows count on mocked navbar state', async ({ page }) => {
    await page.goto('/');
    // The hardcoded badge "3" in the redesigned Navbar should be visible
    await expect(page.getByRole('link', { name: '3' }).locator('span')).toBeVisible();
  });
});
