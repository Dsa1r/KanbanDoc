import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
  });

  test('should render account fields and keep email disabled', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const usernameInput = page.locator('input[name="username"]');
    const emailInput = page.locator('input[disabled][readonly]');
    const phoneInput = page.locator('input[name="phone"]');

    await expect(nameInput).toBeVisible();
    await expect(usernameInput).toBeVisible();
    await expect(phoneInput).toBeVisible();

    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeDisabled();
    await expect(emailInput).not.toHaveValue('');
  });

  test('should show validation error for invalid username format', async ({ page }) => {
    const usernameInput = page.locator('input[name="username"]');
    await usernameInput.fill('ab!');
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByRole('alert')).toHaveText(
      'Username must be 3–20 characters: letters, numbers, _ or .',
    );
  });

  test('should save settings and display confirmation message', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const usernameInput = page.locator('input[name="username"]');
    const phoneInput = page.locator('input[name="phone"]');

    const currentName = await nameInput.inputValue();
    const currentUsername = await usernameInput.inputValue();
    const currentPhone = await phoneInput.inputValue();

    await nameInput.fill(currentName);
    if (currentUsername) {
      await usernameInput.fill(`@${currentUsername.toUpperCase()}`);
    }
    await phoneInput.fill(currentPhone);

    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByRole('status')).toHaveText('Your settings were saved.');
    if (currentUsername) {
      await expect(usernameInput).toHaveValue(currentUsername.toLowerCase());
    }
  });

  test('should navigate back to dashboard via back link', async ({ page }) => {
    await page.getByRole('link', { name: /Back to dashboard/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });
});