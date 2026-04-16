import { test, expect } from '@playwright/test';

test('can add a todo', async ({ page }) => {
  await page.goto('');

  const todoTitle = 'My first E2E todo';

  await page.getByPlaceholder('Enter your todo').fill(todoTitle);
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(
    page.locator('.todo-card').filter({ hasText: todoTitle })
  ).toBeVisible();
});
