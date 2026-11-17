
import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('Dashboard & Projects View', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should display projects', async ({ page }) => {
    await expect(
      page.getByText('Projects')
    ).toBeVisible();
  });

  test('should search for a project', async ({ page }) => {
    await page.getByPlaceholder('Search').fill('DevCompass');

    await expect(
      page.getByText('DevCompass')
    ).toBeVisible();
  });

});
