import { test, expect } from '@playwright/test';
import type { Page, Route, Locator } from '@playwright/test';
import { login } from './helpers/auth.js';

const PROJECT_ID = 'project-1';
const BOARD_URL = `/projects/${PROJECT_ID}/board`;

const USER = { id: 'user-1', name: 'Reema Ali', username: 'reema', email: 'reema@example.com', phone: null };
const QUESTIONS = [
  { key: 'product', title: 'What are you building?', answer: 'A booking app for dental clinics' },
  { key: 'users', title: 'Who will use it?', answer: 'Receptionists and patients' },
  { key: 'features', title: 'What are the main features?', answer: 'appointments, patient records, reminders' },
  { key: 'stack', title: 'Which tech stack?', answer: 'PostgreSQL, Flask, React' },
  { key: 'timeline', title: 'What is the timeline?', answer: '8 weeks, 3 developers' },
];
type Answers = Record<string, string>;
const ANSWERS: Answers = Object.fromEntries(QUESTIONS.map((q) => [q.key, q.answer]));

const GENERATED_TASKS = [
  { id: 't1', title: 'Design the clinics table', stage_id: 'DATABASE', current_status: 'TO_DO', note: '' },
  { id: 't2', title: 'Build the appointments API', stage_id: 'BACKEND', current_status: 'TO_DO', note: '' },
  { id: 't3', title: 'Create the booking screen', stage_id: 'FRONTEND', current_status: 'TO_DO', note: '' },
];

const PASTED_TEXT = 'The system lets patients book appointments with their dentist and get reminders.';
const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization, content-type',
  'access-control-allow-methods': 'GET, POST, PATCH, DELETE, OPTIONS',
};
async function reply(route: Route, status: number, body?: unknown) {
  if (route.request().method() === 'OPTIONS') {
    return route.fulfill({ status: 204, headers: CORS });
  }
  return route.fulfill({ status, headers: CORS, contentType: 'application/json', body: JSON.stringify(body ?? {}) });
}

type ApiError = { status: number; code: string; message: string };

type Ai = {
  generated: boolean;
  boardRequests: number;
  generateBody?: any;
  extractBody?: any;
  generateGate?: Promise<void>;
  extractGate?: Promise<void>;
  generateError?: ApiError;
  extractError?: ApiError;
  offline?: boolean;
  extracted: Answers;
};

async function mockBackend(page: Page, { templateId = 0 }: { templateId?: number } = {}) {
  const ai: Ai = { generated: false, boardRequests: 0, extracted: { ...ANSWERS } };

  await page.addInitScript(() => window.localStorage.setItem('access_token', 'test-token'));
  await page.route('**/api/v1/auth/me', (route) => reply(route, 200, { data: USER }));

  await page.route(`**/api/v1/projects/${PROJECT_ID}/board`, (route) => {
    if (route.request().method() !== 'OPTIONS') ai.boardRequests += 1;
    return reply(route, 200, {
      data: {
        project: { id: PROJECT_ID, name: 'Dental Booking', description: '', is_completed: false, template_id: templateId },
        columns: {
          TO_DO: ai.generated ? GENERATED_TASKS : [],
          IN_PROGRESS: [],
          TESTING_REVIEW: [],
          DONE: [],
        },
      },
    });
  });

  await page.route(`**/api/v1/projects/${PROJECT_ID}/ai-extract`, async (route) => {
    if (route.request().method() === 'OPTIONS') return reply(route, 204);
    if (ai.offline) return route.abort('failed');
    ai.extractBody = route.request().postDataJSON();
    if (ai.extractGate) await ai.extractGate;
    if (ai.extractError) {
      const { status, code, message } = ai.extractError;
      return reply(route, status, { error: { code, message } });
    }
    return reply(route, 200, { data: { answers: ai.extracted } });
  });

  await page.route(`**/api/v1/projects/${PROJECT_ID}/ai-tasks`, async (route) => {
    if (route.request().method() === 'OPTIONS') return reply(route, 204);
    if (ai.offline) return route.abort('failed');
    ai.generateBody = route.request().postDataJSON();
    if (ai.generateGate) await ai.generateGate;
    if (ai.generateError) {
      const { status, code, message } = ai.generateError;
      return reply(route, status, { error: { code, message } });
    }
    ai.generated = true;
    return reply(route, 201, { data: { tasks: GENERATED_TASKS, progress: { done: 0, total: 3, percent: 0 }, phases_missing: [] } });
  });

  return ai;
}


function holdRequest() {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  return { gate, release };
}


async function openWizard(page: Page) {
  await page.goto(BOARD_URL);
  await page.getByRole('button', { name: /Generate with AI/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'How do you want to start?' })).toBeVisible();
  return dialog;
}

async function startQuestions(dialog: Locator) {
  await dialog.getByRole('button', { name: /Answer a few questions/ }).click();
  await expect(dialog.getByText('Question 1 of 5')).toBeVisible();
}


async function fillQuestions(dialog: Locator, { pad = false }: { pad?: boolean } = {}) {
  for (const [i, q] of QUESTIONS.entries()) {
    await dialog.getByRole('textbox').fill(pad ? `  ${q.answer}  ` : q.answer);
    if (i < QUESTIONS.length - 1) await dialog.getByRole('button', { name: 'Next' }).click();
  }
  await expect(dialog.getByRole('button', { name: 'Generate tasks' })).toBeEnabled();
}

async function goToGenerate(page: Page, { pad = false }: { pad?: boolean } = {}) {
  const dialog = await openWizard(page);
  await startQuestions(dialog);
  await fillQuestions(dialog, { pad });
  return dialog;
}

async function openPasteScreen(page: Page) {
  const dialog = await openWizard(page);
  await dialog.getByRole('button', { name: /Paste your requirements/ }).click();
  await expect(dialog.getByRole('heading', { name: 'Paste your requirements' })).toBeVisible();
  return dialog;
}

test.describe('AI task generator: access', () => {
  test('the AI option appears only on empty projects', async ({ page }) => {
    await mockBackend(page, { templateId: 1 });
    await page.goto(BOARD_URL);
    await expect(page.getByRole('heading', { name: 'Dental Booking' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate with AI/ })).toHaveCount(0);
  });

  test('an empty project offers both ways to add tasks', async ({ page }) => {
    await mockBackend(page);
    await page.goto(BOARD_URL);
    await expect(page.getByRole('button', { name: /Generate with AI/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add tasks manually/ })).toBeVisible();
  });
});

test.describe('AI task generator: start screen', () => {
  test('offers two ways to start', async ({ page }) => {
    await mockBackend(page);
    const dialog = await openWizard(page);

    await expect(dialog.getByRole('button', { name: /Answer a few questions/ })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Paste your requirements/ })).toBeVisible();
  });

  test('Cancel closes the wizard', async ({ page }) => {
    await mockBackend(page);
    const dialog = await openWizard(page);

    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toBeHidden();
  });

  test('Escape closes the wizard', async ({ page }) => {
    await mockBackend(page);
    const dialog = await openWizard(page);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('clicking outside the window closes it', async ({ page }) => {
    await mockBackend(page);
    const dialog = await openWizard(page);

    await page.mouse.click(5, 5);
    await expect(dialog).toBeHidden();
  });
});

test.describe('AI task generator: answering the questions', () => {
  test('question 1: Next stays disabled until there is a real answer', async ({ page }) => {
    await mockBackend(page);
    const dialog = await openWizard(page);
    await startQuestions(dialog);

    await expect(dialog.getByRole('heading', { name: 'What are you building?' })).toBeVisible();
    const next = dialog.getByRole('button', { name: 'Next' });
    await expect(next).toBeDisabled();

    await dialog.getByRole('textbox').fill('   ');
    await expect(next).toBeDisabled();

    await dialog.getByRole('textbox').fill(QUESTIONS[0].answer);
    await expect(next).toBeEnabled();
  });

  test('goes through the five questions in order', async ({ page }) => {
    await mockBackend(page);
    const dialog = await openWizard(page);
    await startQuestions(dialog);

    for (const [i, q] of QUESTIONS.entries()) {
      await expect(dialog.getByText(`Question ${i + 1} of 5`)).toBeVisible();
      await expect(dialog.getByRole('heading', { name: q.title })).toBeVisible();
      await dialog.getByRole('textbox').fill(q.answer);
      if (i < QUESTIONS.length - 1) await dialog.getByRole('button', { name: 'Next' }).click();
    }

    await expect(dialog.getByRole('button', { name: 'Generate tasks' })).toBeEnabled();
    await expect(dialog.getByRole('button', { name: 'Next' })).toHaveCount(0);
  });

  test('Back keeps the previous answer; Back on question 1 returns to the start screen', async ({ page }) => {
    await mockBackend(page);
    const dialog = await openWizard(page);
    await startQuestions(dialog);

    await dialog.getByRole('textbox').fill(QUESTIONS[0].answer);
    await dialog.getByRole('button', { name: 'Next' }).click();
    await expect(dialog.getByText('Question 2 of 5')).toBeVisible();

    await dialog.getByRole('button', { name: 'Back' }).click();
    await expect(dialog.getByText('Question 1 of 5')).toBeVisible();
    await expect(dialog.getByRole('textbox')).toHaveValue(QUESTIONS[0].answer);

    await dialog.getByRole('button', { name: 'Back' }).click();
    await expect(dialog.getByRole('heading', { name: 'How do you want to start?' })).toBeVisible();
  });
});

test.describe('AI task generator: generating tasks', () => {
  test('shows a loading screen that cannot be closed, sends trimmed answers, and fills the board', async ({ page }) => {
    const ai = await mockBackend(page);
    const hold = holdRequest();
    ai.generateGate = hold.gate;

    const dialog = await goToGenerate(page, { pad: true });
    await dialog.getByRole('button', { name: 'Generate tasks' }).click();
    await expect(dialog.getByRole('heading', { name: 'Building your tasks' })).toBeVisible();
    await expect(dialog.getByRole('status')).toContainText('This can take up to a minute');
    await page.keyboard.press('Escape');
    await page.mouse.click(5, 5);
    await expect(dialog).toBeVisible();

    hold.release();
    await expect(dialog).toBeHidden();
    for (const task of GENERATED_TASKS) {
      await expect(page.getByText(task.title).first()).toBeVisible();
    }
    expect(ai.boardRequests).toBeGreaterThanOrEqual(2);
    expect(ai.generateBody).toEqual({ answers: ANSWERS });
  });

  const GENERATE_ERRORS: Array<{ name: string } & ApiError> = [
    { name: 'AI is busy', status: 502, code: 'AI_FAILED', message: 'AI is busy. Please try again in a minute.' },
    { name: 'completed project', status: 409, code: 'PROJECT_COMPLETED', message: 'Completed projects are read-only' },
    { name: 'missing field', status: 400, code: 'VALIDATION_ERROR', message: "'stack' is required" },
  ];

  for (const failure of GENERATE_ERRORS) {
    test(`shows the server message (${failure.name}), keeps the answers, and works on retry`, async ({ page }) => {
      const ai = await mockBackend(page);
      ai.generateError = failure;

      const dialog = await goToGenerate(page);
      await dialog.getByRole('button', { name: 'Generate tasks' }).click();

      await expect(dialog.getByRole('alert')).toHaveText(failure.message);
      await expect(dialog.getByRole('textbox')).toHaveValue(QUESTIONS[4].answer);
      await expect(dialog.getByRole('button', { name: 'Generate tasks' })).toBeEnabled();

      ai.generateError = undefined;
      await dialog.getByRole('button', { name: 'Generate tasks' }).click();
      await expect(dialog).toBeHidden();
      await expect(page.getByText(GENERATED_TASKS[0].title).first()).toBeVisible();
    });
  }

  test('shows a clear message when the server cannot be reached', async ({ page }) => {
    const ai = await mockBackend(page);
    ai.offline = true;

    const dialog = await goToGenerate(page);
    await dialog.getByRole('button', { name: 'Generate tasks' }).click();

    await expect(dialog.getByRole('alert')).toHaveText('Cannot reach the server. Check your connection and try again.');
    await expect(dialog.getByRole('button', { name: 'Generate tasks' })).toBeEnabled();
  });
});

test.describe('AI task generator: pasting requirements', () => {
  test('Analyze text needs at least 20 characters and shows a counter', async ({ page }) => {
    await mockBackend(page);
    const dialog = await openPasteScreen(page);

    const text = dialog.getByLabel('Requirements text');
    const analyze = dialog.getByRole('button', { name: 'Analyze text' });

    await expect(dialog.getByText('0/15000')).toBeVisible();
    await expect(analyze).toBeDisabled();

    await text.fill('too short');
    await expect(analyze).toBeDisabled();

    await text.fill(PASTED_TEXT);
    await expect(dialog.getByText(`${PASTED_TEXT.length}/15000`)).toBeVisible();
    await expect(analyze).toBeEnabled();
  });

  test('Back from the paste screen returns to the start screen', async ({ page }) => {
    await mockBackend(page);
    const dialog = await openPasteScreen(page);

    await dialog.getByRole('button', { name: 'Back' }).click();
    await expect(dialog.getByRole('heading', { name: 'How do you want to start?' })).toBeVisible();
  });

  test('fills the answers from the text, lets you edit them, then generates', async ({ page }) => {
    const ai = await mockBackend(page);
    const hold = holdRequest();
    ai.extractGate = hold.gate;

    const dialog = await openPasteScreen(page);
    await dialog.getByLabel('Requirements text').fill(`  ${PASTED_TEXT}  `);
    await dialog.getByRole('button', { name: 'Analyze text' }).click();
    await expect(dialog.getByRole('heading', { name: 'Reading your text' })).toBeVisible();
    hold.release();
    await expect(dialog.getByText('Question 1 of 5')).toBeVisible();
    await expect(dialog.getByText('Filled from your text. Check it and edit if needed.')).toBeVisible();
    await expect(dialog.getByRole('textbox')).toHaveValue(ANSWERS.product);
    expect(ai.extractBody).toEqual({ text: PASTED_TEXT });

    await dialog.getByRole('textbox').fill('A booking app for dental clinics in Riyadh');
    for (let i = 0; i < 4; i += 1) {
      await dialog.getByRole('button', { name: 'Next' }).click();
    }
    await dialog.getByRole('button', { name: 'Generate tasks' }).click();
    await expect(dialog).toBeHidden();

    expect(ai.generateBody).toEqual({ answers: { ...ANSWERS, product: 'A booking app for dental clinics in Riyadh' } });
  });

  test('when nothing can be extracted, the questions open empty with their normal hint', async ({ page }) => {
    const ai = await mockBackend(page);
    ai.extracted = { product: '', users: '', features: '', stack: '', timeline: '' };

    const dialog = await openPasteScreen(page);
    await dialog.getByLabel('Requirements text').fill(PASTED_TEXT);
    await dialog.getByRole('button', { name: 'Analyze text' }).click();

    await expect(dialog.getByText('Question 1 of 5')).toBeVisible();
    await expect(dialog.getByText('Describe the product in a sentence or two.')).toBeVisible();
    await expect(dialog.getByRole('textbox')).toHaveValue('');
    await expect(dialog.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  test('if reading the text fails, it shows the error and keeps the text', async ({ page }) => {
    const ai = await mockBackend(page);
    ai.extractError = { status: 400, code: 'VALIDATION_ERROR', message: 'Please paste a longer text.' };

    const dialog = await openPasteScreen(page);
    await dialog.getByLabel('Requirements text').fill(PASTED_TEXT);
    await dialog.getByRole('button', { name: 'Analyze text' }).click();

    await expect(dialog.getByRole('alert')).toHaveText('Please paste a longer text.');
    await expect(dialog.getByLabel('Requirements text')).toHaveValue(PASTED_TEXT);
    await expect(dialog.getByRole('button', { name: 'Analyze text' })).toBeEnabled();
  });
});
test.describe('AI task generator: real backend', () => {
  test.skip(!process.env.RUN_REAL_AI, 'Set RUN_REAL_AI=1 to run this test against the real backend and AI');

  test('creates an empty project and generates real tasks with AI', async ({ page }) => {
    test.setTimeout(240_000);

    await login(page);
    await page.getByRole('button', { name: /Generate New Project/i }).click();
    await page.getByLabel('Project name').fill(`Playwright AI Project ${Date.now()}`);
    await page.getByText('Blank Slate Custom Template', { exact: true }).click();
    await page.getByRole('button', { name: 'Generate Project' }).click();
    await expect(page).toHaveURL(/\/projects\/[^/]+\/board/, { timeout: 60000 });
    await page.getByRole('button', { name: /Generate with AI/ }).click();
    const dialog = page.getByRole('dialog');
    await startQuestions(dialog);
    await fillQuestions(dialog);
    await dialog.getByRole('button', { name: 'Generate tasks' }).click();
    await expect(dialog).toBeHidden({ timeout: 180_000 });
    await expect(page.getByText(/next up/i).first()).toBeVisible({ timeout: 30_000 });
  });
});