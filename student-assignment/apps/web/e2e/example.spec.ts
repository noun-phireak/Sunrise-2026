import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    // Expect a title "to contain" a substring.
    // Verify expected title from index.html or implicit
    await expect(page).toHaveTitle(/Vite App/);
});
