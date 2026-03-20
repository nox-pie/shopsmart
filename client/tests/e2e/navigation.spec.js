import { expect, test } from '@playwright/test';

test.describe('Navigation Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking "About" navigates to /about', async ({ page }) => {
    // The new premium UI uses exactly "About"
    await page.getByRole('link', { name: /^About$/ }).click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('clicking "Blog" navigates to /blog', async ({ page }) => {
    await page.getByRole('link', { name: /^Blog$/ }).click();
    await expect(page).toHaveURL(/\/blog/);
  });

  test('clicking "FAQ" navigates to /faq', async ({ page }) => {
    await page.getByRole('link', { name: /^FAQ$/ }).click();
    await expect(page).toHaveURL(/\/faq/);
  });

  test('clicking "Collection" navigates to /collection', async ({ page }) => {
    await page.getByRole('link', { name: /^Collection$/ }).click();
    await expect(page).toHaveURL(/\/collection/);
  });

  test('clicking SHOPSMART logo returns to home', async ({ page }) => {
    await page.goto('#/about');
    await page.getByText('SHOPSMART').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('h1')).toContainText('Unleash Your Style');
  });

  test('clicking Profile icon navigates to /profile', async ({ page }) => {
    // The new UI uses a lucide User icon wrapping a link to /profile
    await page.locator('nav').locator('a[href="#/profile"]').click();
    await expect(page).toHaveURL(/#\/profile/);
  });

  test('clicking Cart icon navigates to /cart', async ({ page }) => {
    // The new UI uses a lucide ShoppingBag icon wrapping a link to /cart
    await page.locator('nav').locator('a[href="#/cart"]').click();
    await expect(page).toHaveURL(/#\/cart/);
  });
});
