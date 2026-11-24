import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

async function openProjectBoard(page, projectName) {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: /Generate New Project/i }).click();
  await page.getByLabel('Project name').fill(projectName);
  await page.getByRole('button', { name: /Generate Project/i }).click();
  await expect(page).toHaveURL(/\/projects\/[^/]+\/board/, {
    timeout: 30000,
  });
  await expect(page.locator('.kanban__columns')).toBeVisible();
}

test.describe('Task Drawer Details', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await expect(page).not.toHaveURL(/\/(auth|login)/);
  });

  test('should open task drawer from a card and display task title and description', async ({ page }) => {
    await openProjectBoard(page, 'Task Drawer Details Spec');

    const firstCard = page.locator('.task-card').first();
    await expect(firstCard).toBeVisible();
    const cardTitle = (await firstCard.locator('.task-card__title').innerText()).trim();

    await firstCard.click();

    const drawer = page.locator('aside.drawer[role="dialog"]');
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute('aria-modal', 'true');
    await expect(drawer.locator('#task-drawer-title')).toHaveText(cardTitle);
    await expect(drawer.getByRole('heading', { name: /Task description/i })).toBeVisible();
  });

  test('should close task drawer using close button and Escape key', async ({ page }) => {
    await openProjectBoard(page, 'Task Drawer Close Spec');

    const firstCard = page.locator('.task-card').first();
    await firstCard.click();

    const drawer = page.locator('aside.drawer[role="dialog"]');
    await expect(drawer).toBeVisible();

    await page.getByRole('button', { name: 'Close task details' }).click();
    await expect(drawer).toBeHidden();

    await firstCard.click();
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
  });

  test('should open task drawer from NextUpBanner and update task status', async ({ page }) => {
    await openProjectBoard(page, 'Task Drawer Status Spec');

    const banner = page.locator('.next-up');
    await expect(banner).toBeVisible();
    const nextTaskTitle = (await banner.locator('.next-up__title').innerText()).trim();

    const columns = page.locator('.kanban-column');
    const firstColumn = columns.first();
    const secondColumn = columns.nth(1);
    const firstCountBefore = Number(await firstColumn.locator('.kanban-column__count').innerText());
    const secondCountBefore = Number(await secondColumn.locator('.kanban-column__count').innerText());

    await banner.getByRole('button', { name: 'Open task' }).click();

    const drawer = page.locator('aside.drawer[role="dialog"]');
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('#task-drawer-title')).toHaveText(nextTaskTitle);

    const statusSelect = drawer.locator('#task-status');
    const targetStatus = await statusSelect.locator('option').nth(1).getAttribute('value');
    if (targetStatus) {
      await statusSelect.selectOption(targetStatus);
      await expect(secondColumn.locator('.kanban-column__count')).toHaveText(
        String(secondCountBefore + 1),
      );
      await expect(firstColumn.locator('.kanban-column__count')).toHaveText(
        String(firstCountBefore - 1),
      );
    }
  });

  test('should open newly created task in TaskDrawer when manual task creation is available', async ({ page }) => {
    await openProjectBoard(page, 'Task Drawer New Task Spec');

    const addManualBtn = page.getByRole('button', { name: /Add tasks manually/i });
    if (await addManualBtn.count()) {
      await addManualBtn.click();
      await page.locator('#new-task-title').fill('Setup auth middleware');
      await page.locator('.add-task-modal select').selectOption('BACKEND');
      await page.getByRole('button', { name: 'Create Task' }).click();

      const createdCard = page.locator('.task-card', { hasText: 'Setup auth middleware' });
      await expect(createdCard).toBeVisible();
      await createdCard.click();

      const drawer = page.locator('aside.drawer[role="dialog"]');
      await expect(drawer).toBeVisible();
      await expect(drawer.locator('#task-drawer-title')).toHaveText('Setup auth middleware');
      await expect(drawer.getByRole('heading', { name: /Task description/i })).toBeVisible();
    } else {
      const firstCard = page.locator('.task-card').first();
      await firstCard.click();
      await expect(page.locator('aside.drawer[role="dialog"]')).toBeVisible();
    }
  });
});