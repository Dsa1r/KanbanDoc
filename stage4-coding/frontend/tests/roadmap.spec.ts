import { test, expect, type Page } from '@playwright/test';
// @ts-ignore
import { PHASES } from '../src/data/phases.js';

type Tool = { name: string; note: string; url: string };
type Phase = {
  id: number;
  name: string;
  summary: string;
  why: string;
  build: string[];
  tools: Tool[];
};

const phases = PHASES as Phase[];
const API_URL = process.env.E2E_API_URL ?? 'http://127.0.0.1:5001';

const panelFor = (page: Page, phase: Phase) =>
  page.getByRole('complementary', { name: `${phase.name} details` });

const nodeFor = (page: Page, phase: Phase) =>
  page.getByRole('button', { name: `Open ${phase.name}` });

const cardFor = (page: Page, phase: Phase) =>
  page.locator('button.phase__card').filter({ hasText: phase.name });

async function expectPhaseShown(page: Page, phase: Phase) {
  const panel = panelFor(page, phase);

  await expect(panel).toBeVisible();
  await expect(panel.getByRole('heading', { level: 2, name: phase.name })).toBeVisible();
  await expect(panel).toContainText(`Phase ${phase.id} of ${phases.length}`);
  await expect(panel).toContainText(phase.summary);

  await expect(nodeFor(page, phase)).toHaveAttribute('aria-pressed', 'true');
  await expect(cardFor(page, phase)).toHaveAttribute('aria-pressed', 'true');
}

test.describe('Roadmap page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/roadmap');
  });

  test('opens without logging in', async ({ page }) => {
    await expect(page).toHaveURL(/\/roadmap$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'From raw data to a real product.' }),
    ).toBeVisible();
    await expect(page.getByText(`${phases.length} phases · guided`)).toBeVisible();
  });

  test('the journey has the three stages in order: Database, Backend, Frontend', async () => {
    expect(phases.map((phase) => phase.name)).toEqual([
      'Database Stage',
      'Backend Stage',
      'Frontend Stage',
    ]);
  });

  test('shows every phase on the map', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(phases.length);

    for (const phase of phases) {
      await expect(nodeFor(page, phase)).toBeVisible();
      await expect(nodeFor(page, phase)).toHaveText(String(phase.id).padStart(2, '0'));
      await expect(cardFor(page, phase)).toBeVisible();
      await expect(cardFor(page, phase)).toContainText(`Phase ${phase.id}`);
    }
  });

  test('starts on the first phase', async ({ page }) => {
    await expectPhaseShown(page, phases[0]);
  });

  for (const phase of phases) {
    test(`clicking the card of "${phase.name}" shows its details`, async ({ page }) => {
      await cardFor(page, phase).click();
      await expectPhaseShown(page, phase);
    });

    test(`clicking the number of "${phase.name}" shows its details`, async ({ page }) => {
      await nodeFor(page, phase).click();
      await expectPhaseShown(page, phase);
    });

    test(`"${phase.name}" explains why it matters, what to build and which tools to use`, async ({
      page,
    }) => {
      await cardFor(page, phase).click();
      const panel = panelFor(page, phase);

      await expect(panel.getByRole('heading', { level: 3 }).nth(0)).toContainText('Why It Matters');
      await expect(panel).toContainText(phase.why);

      await expect(panel.getByRole('heading', { level: 3 }).nth(1)).toContainText('What to Build');
      const steps = panel.locator('.build-list li');
      await expect(steps).toHaveCount(phase.build.length);
      for (const [index, step] of phase.build.entries()) {
        await expect(steps.nth(index)).toContainText(String(index + 1));
        await expect(steps.nth(index)).toContainText(step);
      }

      await expect(panel.getByRole('heading', { level: 3 }).nth(2)).toContainText('Tools & Resources');
      await expect(panel.locator('.tool-list li')).toHaveCount(phase.tools.length);
    });

    test(`resource links of "${phase.name}" are correct and open in a new tab safely`, async ({
      page,
    }) => {
      await cardFor(page, phase).click();
      const links = panelFor(page, phase).locator('.tool-list a');
      await expect(links).toHaveCount(phase.tools.length);

      for (const [index, tool] of phase.tools.entries()) {
        const link = links.nth(index);
        await expect(link).toContainText(tool.name);
        await expect(link).toContainText(tool.note);
        await expect(link).toHaveAttribute('href', tool.url);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', /noreferrer/);
      }
    });
  }

  test('only one phase is selected at a time', async ({ page }) => {
    await cardFor(page, phases[1]).click();
    await expectPhaseShown(page, phases[1]);

    for (const other of [phases[0], phases[2]]) {
      await expect(nodeFor(page, other)).toHaveAttribute('aria-pressed', 'false');
      await expect(cardFor(page, other)).toHaveAttribute('aria-pressed', 'false');
      await expect(panelFor(page, other)).toHaveCount(0);
    }
  });

  test('can go through the phases in order and back', async ({ page }) => {
    for (const phase of [...phases, ...[...phases].reverse()]) {
      await cardFor(page, phase).click();
      await expectPhaseShown(page, phase);
    }
  });

  test('works with the keyboard', async ({ page }) => {
    await nodeFor(page, phases[1]).focus();
    await expect(nodeFor(page, phases[1])).toBeFocused();
    await page.keyboard.press('Enter');
    await expectPhaseShown(page, phases[1]);

    await cardFor(page, phases[2]).focus();
    await page.keyboard.press('Space');
    await expectPhaseShown(page, phases[2]);
  });

  test('has a Help button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Help' })).toBeVisible();
  });
});

test('the old /learning-path link redirects to /roadmap', async ({ page }) => {
  await page.goto('/learning-path');
  await expect(page).toHaveURL(/\/roadmap$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('From raw data');
});

test.describe('Roadmap with the Flask API', () => {
  test.skip(!process.env.RUN_REAL_API, 'Set RUN_REAL_API=1 to run Flask API tests');

  test('Flask is running', async ({ request }) => {
    const response = await request.get(`${API_URL}/`);
    expect(response.ok()).toBeTruthy();
    expect(await response.json()).toEqual({ message: 'DevCompass API is running' });
  });

  test('a logged-in user opens the roadmap from the header', async ({ page }) => {
    const login = process.env.E2E_LOGIN;
    const password = process.env.E2E_PASSWORD;
    test.skip(!login || !password, 'Set E2E_LOGIN and E2E_PASSWORD to run this test');

    await page.goto('/auth');
    await page.getByRole('tab', { name: 'Log in' }).click();
    await page.getByLabel('Username or email').fill(login!);
    await page.getByLabel('Password', { exact: true }).fill(password!);
    await page.getByRole('button', { name: 'Log in', exact: true }).click();

    await expect(page).toHaveURL(/\/dashboard$/);

    await page.getByRole('link', { name: 'Roadmap' }).click();
    await expect(page).toHaveURL(/\/roadmap$/);
    await expectPhaseShown(page, phases[0]);
  });
});