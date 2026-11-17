import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('Fixed Kanban Project', () => {

  test('should create a Fixed project and display its tasks', async ({ page }) => {

    await login(page);

    // بيسوي إنشاء للمشروع
    await page.getByRole('button', { name: /Generate New Project/i }).click();

    // هنا نسمي المشروع
    await page.getByLabel('Project name').fill('Playwright Fixed Project');

    // يختار القالب الفكسد
    await page.getByText('Pre-seeded Fixed Template', { exact: true }).click();

    // نضغط انشاء المشروع
    await page.getByRole('button', { name: /Generate Project/i }).click();


    // هنا يودينا للكانبان
    await expect(page).toHaveURL(/\/projects\/[^/]+\/board/, {
      timeout: 30000 // لازم نسألهم عن الوقت كيف نعرف وش الصح
    });

    // الفيزز لازم تظهر اول
    await expect(page.getByText('To Do', { exact: true })).toBeVisible();
    await expect(page.getByText('In Progress', { exact: true })).toBeVisible();
    await expect(page.getByText(/Testing.*Review/i)).toBeVisible();
    await expect(page.getByText('Done', { exact: true })).toBeVisible();

    // هنا لازم تكون فيه مهام ثابتة
    const taskCards = page.locator('.task-card');

    await expect(taskCards.first()).toBeVisible();

    // لازم مايكون فيهاضافة تاسك هنا
    await expect(
      page.getByRole('button', { name: /add task/i })
    ).toHaveCount(0);

  });

});