import { test, expect } from '@playwright/test';

test.describe('Visual Regression & Layout Stability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    // Ensure all fonts and images are settled
    await page.waitForLoadState('networkidle');
  });

  test('hero section matches visual baseline', async ({ page }) => {
    const hero = page.locator('#home');
    await expect(hero).toHaveScreenshot('hero-section.png', {
      mask: [page.locator('.pulse-dot')], // Mask animated pulsing beacon
    });
  });

  test('interactive terminal card matches visual baseline', async ({ page }) => {
    const terminal = page.locator('.terminal-card');
    await terminal.scrollIntoViewIfNeeded();
    await expect(terminal).toHaveScreenshot('terminal-card.png');
  });

  test('about profile card matches visual baseline', async ({ page }) => {
    const profileCard = page.locator('.profile-card');
    await profileCard.scrollIntoViewIfNeeded();
    await expect(profileCard).toHaveScreenshot('about-profile-card.png');
  });
});
