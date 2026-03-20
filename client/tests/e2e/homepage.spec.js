import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully and shows hero heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Unleash Your Style');
  });

  test('Navbar is visible with SHOPSMART logo', async ({ page }) => {
    await expect(page.getByText('SHOPSMART')).toBeVisible();
  });

  test('Explore Collection button is visible on hero', async ({ page }) => {
    await expect(page.getByRole('link', { name: /explore collection/i })).toBeVisible();
  });

  test('15M+ customer stat is shown', async ({ page }) => {
    await expect(page.getByText(/15M\+/i)).toBeVisible();
  });

  test('page title is set (not blank)', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
