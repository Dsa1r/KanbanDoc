
import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('Task Details', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should open task details', async ({ page }) => {
    // عدّلي المسار حسب المشروع الفعلي
    await page.goto('/projects/PROJECT_ID/board');

    await page.locator('.task-card').first().click();

    await expect(
      page.getByText('Task Description')
    ).toBeVisible();
  });

});
