
import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('User Settings', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should open settings page', async ({ page }) => {
    await page.goto('/settings');

    await expect(page).toHaveURL(/settings/);
  });

});
