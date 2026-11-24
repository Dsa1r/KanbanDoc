import { expect } from '@playwright/test';

export async function login(page) {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing TEST_EMAIL or TEST_PASSWORD');
  }

  await page.goto('/auth');

  await page.getByRole('tab', { name: 'Log in' }).click();

  await page.locator('input[name="identifier"]').fill(email);
  await page.locator('input[name="password"]').fill(password);

  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/\/dashboard/, {
    timeout: 15000,
  });

  await expect(page.getByRole('button', { name: /Generate New Project/i })).toBeVisible();
}