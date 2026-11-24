import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('Fixed Kanban Project', () => {
  test('should create a Fixed project and display its tasks', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: /Generate New Project/i }).click();

    await page.getByLabel('Project name').fill('Playwright Fixed Project');

    await page.getByText('Pre-seeded Fixed Template', { exact: true }).click();

    await page.getByRole('button', { name: /Generate Project/i }).click();

    await expect(page).toHaveURL(/\/projects\/[^/]+\/board/, {
      timeout: 30000,
    });

    await expect(page.getByText('Loading board…')).toBeHidden({ timeout: 30000 });

    await expect(page.getByText('To Do', { exact: true })).toBeVisible();
    await expect(page.getByText('In Progress', { exact: true })).toBeVisible();
    await expect(page.getByText(/Testing.*Review/i)).toBeVisible();
    await expect(page.getByText('Done', { exact: true })).toBeVisible();

    const taskCards = page.locator('.task-card');

    await expect(taskCards.first()).toBeVisible();

    await expect(
      page.getByRole('button', { name: /add task/i })
    ).toHaveCount(0);
  });
});