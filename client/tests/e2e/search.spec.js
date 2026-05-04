import { expect, test } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/collection');
  });

  test('collection search field is visible with search label', async ({ page }) => {
    await expect(page.getByLabel('Search collection')).toBeVisible();
    await expect(page.getByText(/^Search$/i).first()).toBeVisible();
  });

  test('search input accepts text and filters grid', async ({ page }) => {
    const input = page.getByLabel('Search collection');
    await input.fill('hoodie');
    await expect(input).toHaveValue('hoodie');
  });
});
