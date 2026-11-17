
import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('Empty Kanban Project', () => {

  test('should create an Empty project and add a task', async ({ page }) => {

    // 1. تسجيل الدخول
    await login(page);

    // 2. فتح نافذة إنشاء المشروع
    await page.getByRole('button', { name: /Generate New Project/i }).click();

    // 3. إدخال اسم المشروع
    await page.getByLabel('Project name').fill('Playwright Empty Project');

    // 4. اختيار القالب الفارغ
    await page.getByText('Blank Slate Custom Template', { exact: true }).click();

    // 5. إنشاء المشروع
    await page.getByRole('button', { name: 'Generate Project' }).click();

    // 6. انتظار الانتقال إلى لوحة المشروع
    await expect(page).toHaveURL(/\/projects\/[^/]+\/board/, {
      timeout: 60000
    });

    console.log(await page.locator('body').innerText());
    
    // التأكد من ظهور المراحل
        await expect(page.getByText('To Do', { exact: true })).toBeVisible();
        await expect(page.getByText('In Progress', { exact: true })).toBeVisible();
        await expect(page.getByText(/Testing.*Review/i)).toBeVisible();
        await expect(page.getByText('Done', { exact: true })).toBeVisible();

    // 8. الضغط على إضافة مهمة
    await page.getByRole('button', { name: /add task/i }).first().click();

    // 9. إدخال اسم المهمة
    await page.getByLabel('Task Title').fill('Write unit tests');

    // 10. اختيار المرحلة
await page.locator('.add-task-modal select').selectOption('FRONTEND');
    // 11. إنشاء المهمة
    await page.getByRole('button', { name: 'Create Task' }).click();

    // 12. التأكد من ظهور المهمة
    await expect(
      page.getByText('Write unit tests', { exact: true })
    ).toBeVisible({ timeout: 30000 });

  });

});
