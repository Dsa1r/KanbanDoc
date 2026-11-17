
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page', async ({ page }) => {
    await expect(
      page.locator('input[name="email"]')
    ).toBeVisible();

    await expect(
      page.locator('input[name="password"]')
    ).toBeVisible();
  });

    test('should login successfully', async ({ page }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing test credentials');
  }

  // فتح صفحة المصادقة
  await page.goto('/auth');

  // التحويل من Sign Up إلى Log In
  await page.getByRole('tab', { name: 'Log in' }).click();

  // التأكد من ظهور نموذج تسجيل الدخول
  await expect(
    page.locator('input[name="identifier"]')
  ).toBeVisible();

  // إدخال بيانات الدخول
  await page.locator('input[name="identifier"]').fill(email);
  await page.locator('input[name="password"]').fill(password);

  // الضغط على Log In
  await page.getByRole('button', { name: 'Log in' }).click();

  // التأكد من الانتقال إلى Dashboard
  await expect(page).toHaveURL(/dashboard/);
});

});
