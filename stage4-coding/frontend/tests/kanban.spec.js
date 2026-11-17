import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('Fixed Kanban Project', () => {

  test('should create a Fixed project and display its tasks', async ({ page }) => {

    await login(page);

    // فتح إنشاء مشروع
    await page.getByRole('button', { name: /Generate New Project/i }).click();

    // اسم المشروع
    await page.getByLabel('Project name').fill('Playwright Fixed Project');

    // اختيار القالب الثابت
    await page.getByText('Pre-seeded Fixed Template', { exact: true }).click();

    // إنشاء المشروع
    await page.getByRole('button', { name: /Generate Project/i }).click();

    // انتظار فتح لوحة المشروع
    await expect(page).toHaveURL(/\/projects\/[^/]+\/board/, {
      timeout: 15000
    });

    // التأكد من ظهور المراحل
    await expect(page.getByText('To Do', { exact: true })).toBeVisible();
    await expect(page.getByText('In Progress', { exact: true })).toBeVisible();
    await expect(page.getByText(/Testing.*Review/i)).toBeVisible();
    await expect(page.getByText('Done', { exact: true })).toBeVisible();

    // التأكد من وجود مهام ثابتة
    const taskCards = page.locator('.task-card');

    await expect(taskCards.first()).toBeVisible();

    // التأكد من عدم وجود زر إضافة مهمة
    await expect(
      page.getByRole('button', { name: /add task/i })
    ).toHaveCount(0);

  });

});