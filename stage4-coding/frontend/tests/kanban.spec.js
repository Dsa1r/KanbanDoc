import { test, expect } from '@playwright/test';

test('KanbanDoc application loads', async ({ page }) => {

  await page.goto('/');

  // Verify that the page has loaded
  await expect(page).toHaveTitle(/./);

  // Capture the current page
  await page.screenshot({
    path: 'test-results/kanban-homepage.png',
    fullPage: true
  });

});