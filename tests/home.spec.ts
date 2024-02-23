import { test, expect, type Page } from '@playwright/test';

test('Visual Comparision @HOME', async ({ page }: { page: Page }) => {
    await page.goto('/');
    await expect.soft(page).toHaveScreenshot();
});