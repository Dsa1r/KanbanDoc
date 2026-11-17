
import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('Navigation & Links', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to projects', async ({ page }) => {
    await page.getByRole('link', {
      name: /projects/i
    }).click();

    await expect(page).toHaveURL(/projects/);
  });

});
