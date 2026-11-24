import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('Empty Kanban Project', () => {
  test('should create an Empty project and add a task', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: /Generate New Project/i }).click();
    await page.getByLabel('Project name').fill('Playwright Empty Project');
    await page.getByText('Blank Slate Custom Template', { exact: true }).click();
    await page.getByRole('button', { name: 'Generate Project' }).click();

    await expect(page).toHaveURL(/\/projects\/[^/]+\/board/, {
      timeout: 60000,
    });

    await expect(page.getByText('To Do', { exact: true })).toBeVisible();
    await expect(page.getByText('In Progress', { exact: true })).toBeVisible();
    await expect(page.getByText(/Testing.*Review/i)).toBeVisible();
    await expect(page.getByText('Done', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: /add task/i }).first().click();
    await page.getByLabel('Task Title').fill('Write unit tests');
    await page.locator('.add-task-modal select').selectOption('FRONTEND');
    await page.getByRole('button', { name: 'Create Task' }).click();

    await expect(
      page.locator('.task-card').getByText('Write unit tests', { exact: true }).first(),
    ).toBeVisible({ timeout: 30000 });
  });
});