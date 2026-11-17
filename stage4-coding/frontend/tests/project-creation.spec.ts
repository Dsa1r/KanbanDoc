import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('Empty Kanban Project', () => {

  test('should create an Empty project and add a task', async ({ page }) => {

    await login(page);

    // فتح إنشاء مشروع
    await page.getByRole('button', { name: /create project/i }).click();

    // اسم المشروع
    await page.locator('input[name="name"]').fill('Playwright Empty Project');

    // اختيار القالب الفارغ
    await page.getByText('Empty Template', { exact: true }).click();

    // إنشاء المشروع
    await page.getByRole('button', { name: /Generate Project/i }).click();

    // انتظار فتح لوحة المشروع
    await expect(page).toHaveURL(/\/projects\/[^/]+\/board/, {
      timeout: 15000
    });

    // التأكد من ظهور المراحل الأربع
    await expect(page.getByText('To Do', { exact: true })).toBeVisible();
    await expect(page.getByText('In Progress', { exact: true })).toBeVisible();
    await expect(page.getByText(/Testing.*Review/i)).toBeVisible();
    await expect(page.getByText('Done', { exact: true })).toBeVisible();

    // إضافة مهمة في المرحلة الفارغة
    await page.getByRole('button', { name: /add task/i }).first().click();

    await page.locator('input[name="taskTitle"]').fill('Write unit tests');

    await page.getByRole('button', { name: 'Save' }).click();

    // التأكد من إضافة المهمة
    await expect(page.getByText('Write unit tests')).toBeVisible();

  });

});