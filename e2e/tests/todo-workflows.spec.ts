import { test, expect, Page } from '@playwright/test';

const API_BASE = 'http://localhost:3333/api';

async function addTodo(page: Page, title: string): Promise<void> {
  await page.getByPlaceholder('Enter your todo').fill(title);
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(
    page.locator('.todo-card').filter({ hasText: title })
  ).toBeVisible();
}

async function createAndArchiveTodosViaApi(
  page: Page,
  titles: string[]
): Promise<void> {
  const ids: string[] = [];
  for (const title of titles) {
    const res = await page.request.post(`${API_BASE}/active-todo`, {
      data: { title },
    });
    const { id } = await res.json();
    ids.push(id);
  }
  for (const id of ids) {
    await page.request.post(`${API_BASE}/active-todo/${id}/complete`);
  }
  await page.request.post(`${API_BASE}/archived-todo/archive`, {
    data: { activeTodoIds: ids },
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('');
});

test('can complete a todo', async ({ page }) => {
  const title = `Complete me ${Date.now()}`;
  await addTodo(page, title);

  const card = page.locator('.todo-card').filter({ hasText: title });
  await card.locator('[role="checkbox"]').click();

  await expect(card.locator('.checkbox-card.checked')).toBeVisible();
});

test('can delete a todo', async ({ page }) => {
  const title = `Delete me ${Date.now()}`;
  await addTodo(page, title);

  const card = page.locator('.todo-card').filter({ hasText: title });
  await card.locator('.icon-btn.danger').click();

  await expect(card).not.toBeVisible();
});

test('can review todos and convert to archived todos', async ({ page }) => {
  const title = `Archive via review ${Date.now()}`;
  await addTodo(page, title);

  // Complete the todo so it appears in the review
  const card = page.locator('.todo-card').filter({ hasText: title });
  await card.locator('[role="checkbox"]').click();
  await expect(card.locator('.checkbox-card.checked')).toBeVisible();

  // Navigate to the review page and start a review
  await page.getByRole('link', { name: /Review Todos/ }).click();
  await page.getByRole('button', { name: 'Start Review' }).click();

  // Our completed todo should appear in the review list
  await expect(
    page.locator('.todo-card').filter({ hasText: title })
  ).toBeVisible();

  // Archive all reviewed todos
  await page.getByRole('button', { name: 'Archive & Finish' }).click();

  // The review list should now be cleared
  await expect(
    page.locator('.todo-card').filter({ hasText: title })
  ).not.toBeVisible();

  // Navigate to archived todos and confirm our todo is there
  await page.getByRole('link', { name: /Archived Todos/ }).click();
  await expect(
    page.locator('.archived-card').filter({ hasText: title })
  ).toBeVisible();
});

test('can unarchive a todo', async ({ page }) => {
  const title = `Unarchive me ${Date.now()}`;
  await createAndArchiveTodosViaApi(page, [title]);

  await page.getByRole('link', { name: /Archived Todos/ }).click();

  const card = page.locator('.archived-card').filter({ hasText: title });
  await expect(card).toBeVisible();

  // Open the options menu and unarchive
  await card.locator('.menu-trigger').click();
  await expect(page.locator('.menu-dropdown')).toBeVisible();
  await page.getByRole('button', { name: 'Unarchive' }).click();

  // The archived card should be removed
  await expect(card).not.toBeVisible();

  // The todo should be back in the active list
  await page.getByRole('link', { name: /Active Todos/ }).click();
  await expect(
    page.locator('.todo-card').filter({ hasText: title })
  ).toBeVisible();
});

test('can delete an archived todo', async ({ page }) => {
  const title = `Delete archived ${Date.now()}`;
  await createAndArchiveTodosViaApi(page, [title]);

  await page.getByRole('link', { name: /Archived Todos/ }).click();

  const card = page.locator('.archived-card').filter({ hasText: title });
  await expect(card).toBeVisible();

  // Open the options menu and delete
  await card.locator('.menu-trigger').click();
  await expect(page.locator('.menu-dropdown')).toBeVisible();
  await card.locator('.menu-item.danger').click();

  // The archived card should be removed
  await expect(card).not.toBeVisible();
});

test('can paginate archived todos', async ({ page }) => {
  const timestamp = Date.now();
  const titles = Array.from(
    { length: 11 },
    (_, i) => `Paginate ${i + 1} ${timestamp}`
  );
  await createAndArchiveTodosViaApi(page, titles);

  await page.getByRole('link', { name: /Archived Todos/ }).click();

  // The "Load More" button should be visible since there are more than 10 archived items
  await expect(page.getByRole('button', { name: 'Load More' })).toBeVisible();

  const countBefore = await page.locator('.archived-card').count();

  // Click Load More to fetch the next page
  await page.getByRole('button', { name: 'Load More' }).click();

  // At least one additional archived card should now be visible
  await expect(
    page.locator('.archived-card').nth(countBefore)
  ).toBeVisible();
});
