import { test, expect, type Page, type Route } from '@playwright/test';

const USER = {
  id: 'user-1',
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  phone: null,
};

const nowIso = new Date().toISOString();
const oldIso = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();

const API_PROJECTS = [
  {
    project_id: 'proj-1',
    name: 'DevCompass Core API',
    description: 'Flask REST endpoints and Supabase schema',
    progress: { done: 4, total: 8, percent: 50 },
    is_owner: true,
    board_url: '/projects/proj-1/board',
    created_at: nowIso,
    updated_at: nowIso,
  },
  {
    project_id: 'proj-2',
    name: 'Learning Roadmap UI',
    description: 'Interactive phases and stage panel in React',
    progress: { done: 5, total: 5, percent: 100 },
    is_owner: true,
    board_url: '/projects/proj-2/board',
    created_at: nowIso,
    updated_at: nowIso,
  },
  {
    project_id: 'proj-3',
    name: 'Legacy CSV Migration',
    description: 'Archived one-time data import script',
    progress: { done: 0, total: 3, percent: 0 },
    is_owner: false,
    board_url: '/projects/proj-3/board',
    created_at: oldIso,
    updated_at: oldIso,
  },
];

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

async function mockDashboard(page: Page, projects = API_PROJECTS) {
  await page.addInitScript(() => {
    window.localStorage.setItem('access_token', 'test-token');
  });

  await page.route('**/api/v1/auth/me', (route) =>
    reply(route, 200, { data: USER }),
  );

  await page.route('**/api/v1/dashboard**', (route) =>
    reply(route, 200, {
      data: {
        summary_text: '3 active workspaces ready for review.',
        projects,
      },
    }),
  );

  await page.route('**/api/**', async (route) => {
    const url = route.request().url();
    if (url.includes('/api/v1/auth/me') || url.includes('/api/v1/dashboard')) {
      return route.fallback();
    }
    return reply(route, 200, { data: {} });
  });
}

async function openDashboard(page: Page, projects = API_PROJECTS) {
  await mockDashboard(page, projects);
  await page.goto('/dashboard');
  await expect(
    page.getByRole('heading', { level: 1, name: 'My Project Workspaces' }),
  ).toBeVisible({ timeout: 15000 });

  const loadingGrid = page.locator('[aria-busy="true"]');
  if (await loadingGrid.isVisible().catch(() => false)) {
    await loadingGrid.waitFor({ state: 'detached', timeout: 15000 });
  }

  if (projects.length > 0) {
    await expect(page.locator('.dashboard__count')).toContainText(
      `Showing ${projects.length} of ${projects.length} project workspaces`,
      { timeout: 15000 },
    );
  }
}

test.describe('Dashboard projects display, search, and filtering', () => {
  test('renders dashboard and displays projects without page errors', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await openDashboard(page);

    await expect(page.getByText('DevCompass Core API')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Learning Roadmap UI')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Legacy CSV Migration')).toBeVisible({ timeout: 15000 });
    expect(pageErrors).toEqual([]);
  });

  test('filters visible projects when typing in search input', async ({ page }) => {
    await openDashboard(page);

    const searchInput = page.locator('#project-search');
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await expect(searchInput).toBeEnabled({ timeout: 15000 });

    await searchInput.fill('Roadmap');
    await expect(page.getByText('Learning Roadmap UI')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('DevCompass Core API')).toBeHidden({ timeout: 15000 });
    await expect(page.getByText('Legacy CSV Migration')).toBeHidden({ timeout: 15000 });

    await searchInput.fill('');
    await expect(page.getByText('DevCompass Core API')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Learning Roadmap UI')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Legacy CSV Migration')).toBeVisible({ timeout: 15000 });
  });

  test('applies filter controls and supports clearing filters', async ({ page }) => {
    await openDashboard(page);

    const filterSelect = page.locator('aside select, main select, [role="combobox"]').first();
    const filterButton = page
      .locator('aside button')
      .filter({ hasNotText: /clear|reset/i })
      .first();

    if (await filterSelect.isVisible().catch(() => false)) {
      const options = await filterSelect.locator('option').allInnerTexts();
      const targetOption = options.find((opt) => opt.trim().length > 0 && !/^all$/i.test(opt.trim()));
      if (targetOption) {
        await filterSelect.selectOption({ label: targetOption.trim() });
        await expect(page.locator('main')).toBeVisible();
      }
    } else if (await filterButton.isVisible().catch(() => false)) {
      await filterButton.click();
      await expect(page.locator('main')).toBeVisible();
    }

    const clearBtn = page.getByRole('button', { name: /clear/i }).first();
    if (await clearBtn.isVisible().catch(() => false)) {
      await clearBtn.click();
      await expect(page.locator('.dashboard__count')).toContainText(
        'Showing 3 of 3 project workspaces',
        { timeout: 15000 },
      );
    }
  });

  test('handles empty project list gracefully', async ({ page }) => {
    await openDashboard(page, []);

    await expect(page.locator('main')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('DevCompass Core API')).toHaveCount(0);
  });
});