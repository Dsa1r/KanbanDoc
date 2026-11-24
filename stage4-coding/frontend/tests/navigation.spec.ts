import { test, expect, type Page, type Route } from '@playwright/test';

const USER = {
  id: 'user-1',
  name: 'Reema Ali',
  username: 'reema',
  email: 'reema@example.com',
  phone: null,
};

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization, content-type',
  'access-control-allow-methods': 'GET, POST, PATCH, DELETE, OPTIONS',
};

async function reply(route: Route, status: number, body?: unknown) {
  if (route.request().method() === 'OPTIONS') {
    return route.fulfill({ status: 204, headers: CORS });
  }
  return route.fulfill({
    status,
    headers: CORS,
    contentType: 'application/json',
    body: JSON.stringify(body ?? {}),
  });
}

async function mockNavigationBackend(page: Page, { authenticated = true }: { authenticated?: boolean } = {}) {
  if (authenticated) {
    await page.addInitScript(() => {
      window.localStorage.setItem('access_token', 'test-token');
    });
    await page.route('**/api/v1/auth/me', (route) =>
      reply(route, 200, { data: USER })
    );
  } else {
    await page.route('**/api/v1/auth/me', (route) =>
      reply(route, 401, { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } })
    );
  }

  await page.route('**/api/**', async (route) => {
    const url = route.request().url();
    if (url.includes('/api/v1/auth/me')) {
      return route.fallback();
    }
    return reply(route, 200, { data: [] });
  });
}

test.describe('Navigation: public routes, header, and footer', () => {
  test('public or auth route loads cleanly without runtime errors', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await mockNavigationBackend(page, { authenticated: false });
    await page.goto('/auth');

    await expect(page.locator('body')).not.toBeEmpty();
    expect(pageErrors).toEqual([]);
  });

  test('redirects or protects private routes when unauthenticated', async ({ page }) => {
    await mockNavigationBackend(page, { authenticated: false });
    await page.goto('/projects/project-1/board');

    await expect(page.locator('body')).not.toBeEmpty();
    await expect(page).toHaveURL(/\/(auth|login)?$/i);
  });

  test('header is visible and contains interactive navigation items', async ({ page }) => {
    await mockNavigationBackend(page, { authenticated: true });
    await page.goto('/');

    const header = page.locator('header, [role="banner"]').first();
    await expect(header).toBeVisible();

    const navControls = header.locator('a, button');
    await expect(navControls.first()).toBeVisible();
    expect(await navControls.count()).toBeGreaterThan(0);

    // مثال تنقل: إذا كان هناك رابط للـ Roadmap أو Learning Path ينتقل إليه بنجاح
    const roadmapLink = header.getByRole('link', { name: /roadmap|learning/i }).first();
    if (await roadmapLink.isVisible().catch(() => false)) {
      await roadmapLink.click();
      await expect(page).toHaveURL(/roadmap|learning/i);
    }
  });

  test('footer is visible and all links have non-empty hrefs', async ({ page }) => {
    await mockNavigationBackend(page, { authenticated: true });
    await page.goto('/');

    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer).toBeVisible();

    const footerLinks = footer.locator('a');
    const count = await footerLinks.count();

    for (let i = 0; i < count; i += 1) {
      const href = await footerLinks.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      expect(href?.trim()).not.toBe('');
      expect(href).not.toBe('#');
    }
  });
});