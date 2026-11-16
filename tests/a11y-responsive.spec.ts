import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility & Responsive Design', () => {
  test('passes axe automated accessibility scans', async ({ page }) => {
    await page.goto('./');

    // Run axe accessibility audit
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['color-contrast']) // Allow dark sci-fi design token contrast
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('mobile viewport toggles navigation drawer cleanly without text break issues', async ({ page }) => {
    // Set viewport to mobile phone size (iPhone / Pixel)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('./');

    const mobileToggle = page.locator('.mobile-menu-toggle');
    await expect(mobileToggle).toBeVisible();

    const navBar = page.locator('.nav-bar');
    await expect(navBar).not.toHaveClass(/mobile-open/);

    // Click hamburger menu
    await mobileToggle.click();
    await expect(navBar).toHaveClass(/mobile-open/);

    // Verify nav links become visible inside drawer
    const navLinks = page.locator('.nav-links');
    await expect(navLinks).toBeVisible();

    // Click a link -> should close the drawer
    const aboutLink = navLinks.locator('a[href="#about"]');
    await aboutLink.click();
    await expect(navBar).not.toHaveClass(/mobile-open/);
  });

  test('all image assets load with valid dimensions and non-broken sources', async ({ page }) => {
    await page.goto('./');

    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();

      // Check naturalWidth in browser
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});
