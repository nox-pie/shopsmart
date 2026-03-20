import { expect, test } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('search icon button is visible in the Navbar', async ({ page }) => {
    // In the premium minimalist redesign, the search is an icon button inside the nav
    // We locate it by finding the button inside the nav area that contains the lucide Search svg
    const searchButton = page.locator('nav button').filter({ has: page.locator('svg.lucide-search') });
    await expect(searchButton).toBeVisible();
  });

  test('search button has hover scaling classes applied', async ({ page }) => {
    const searchButton = page.locator('nav button').filter({ has: page.locator('svg.lucide-search') });
    await expect(searchButton).toHaveClass(/hover-scale/);
    await expect(searchButton).toHaveClass(/transition-colors/);
  });
});
