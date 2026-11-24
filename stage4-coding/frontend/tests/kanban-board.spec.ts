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

test.describe('Kanban Board Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await expect(page).not.toHaveURL(/\/(auth|login)/);
  });

  test('should render board columns and task cards', async ({ page }) => {
    await openProjectBoard(page, 'Board Columns Spec');

    await expect(page.getByText('To Do', { exact: true })).toBeVisible();
    await expect(page.getByText('In Progress', { exact: true })).toBeVisible();
    await expect(page.getByText(/Testing.*Review/i)).toBeVisible();
    await expect(page.getByText('Done', { exact: true })).toBeVisible();
    await expect(page.locator('.task-card').first()).toBeVisible();
  });

  test('should display next up task banner and open task via Open task button', async ({ page }) => {
    await openProjectBoard(page, 'Board Next Up Spec');

    const banner = page.locator('.next-up');
    await expect(banner).toBeVisible();
    await expect(banner.locator('.next-up__title')).not.toBeEmpty();

    await banner.getByRole('button', { name: 'Open task' }).click();

    const drawer = page.locator('aside.drawer[role="dialog"]');
    await expect(drawer).toBeVisible();
    await page.getByRole('button', { name: 'Close task details' }).click();
    await expect(drawer).toBeHidden();
  });

  test('should select task card, open task drawer, and change task status', async ({ page }) => {
    await openProjectBoard(page, 'Board Drawer Status Spec');

    const columns = page.locator('.kanban-column');
    const firstColumn = columns.first();
    const secondColumn = columns.nth(1);

    const firstCard = firstColumn.locator('.task-card').first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard).not.toHaveClass(/task-card--selected/);

    const firstCountBefore = Number(await firstColumn.locator('.kanban-column__count').innerText());
    const secondCountBefore = Number(await secondColumn.locator('.kanban-column__count').innerText());

    await firstCard.click();
    await expect(firstCard).toHaveClass(/task-card--selected/);

    const drawer = page.locator('aside.drawer[role="dialog"]');
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('#task-drawer-title')).not.toBeEmpty();

    const statusSelect = drawer.locator('#task-status');
    const secondOptionValue = await statusSelect.locator('option').nth(1).getAttribute('value');
    if (secondOptionValue) {
      await statusSelect.selectOption(secondOptionValue);
      await expect(secondColumn.locator('.kanban-column__count')).toHaveText(
        String(secondCountBefore + 1),
      );
      await expect(firstColumn.locator('.kanban-column__count')).toHaveText(
        String(firstCountBefore - 1),
      );
    }

    await page.getByRole('button', { name: 'Close task details' }).click();
    await expect(drawer).toBeHidden();
  });

  test('should create a task via AddTaskModal on a custom project board', async ({ page }) => {
    await openProjectBoard(page, 'Board Task Creation Spec');

    const addManualBtn = page.getByRole('button', { name: /Add tasks manually/i });
    if (await addManualBtn.count()) {
      await expect(addManualBtn).toBeVisible();
      await addManualBtn.click();

      await expect(page.getByRole('heading', { name: 'Add Task' })).toBeVisible();

      const createBtn = page.getByRole('button', { name: 'Create Task' });
      await expect(createBtn).toBeDisabled();

      await page.locator('#new-task-title').fill('Configure schema indexes');
      await page.locator('.add-task-modal select').selectOption('DATABASE');

      await expect(createBtn).toBeEnabled();
      await createBtn.click();

      await expect(page.getByText('Configure schema indexes')).toBeVisible();
    } else {
      await expect(page.locator('.task-card').first()).toBeVisible();
    }
  });

  test('should drag a task card to another column and update column counts', async ({ page }) => {
    await openProjectBoard(page, 'Board Drag And Drop Spec');

    const columns = page.locator('.kanban-column');
    const sourceColumn = columns.first();
    const targetColumn = columns.nth(1);

    const sourceDraggable = sourceColumn.locator('.kanban-column__draggable').first();
    await expect(sourceDraggable).toBeVisible();

    const sourceCountBefore = Number(await sourceColumn.locator('.kanban-column__count').innerText());
    const targetCountBefore = Number(await targetColumn.locator('.kanban-column__count').innerText());

    const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
    await sourceDraggable.dispatchEvent('dragstart', { dataTransfer });
    await targetColumn.dispatchEvent('dragover', { dataTransfer });
    await targetColumn.dispatchEvent('drop', { dataTransfer });
    await sourceDraggable.dispatchEvent('dragend', { dataTransfer });

    await expect(targetColumn.locator('.kanban-column__count')).toHaveText(
      String(targetCountBefore + 1),
    );
    await expect(sourceColumn.locator('.kanban-column__count')).toHaveText(
      String(sourceCountBefore - 1),
    );
  });
});