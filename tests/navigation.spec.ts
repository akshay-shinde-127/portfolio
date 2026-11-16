import { test, expect } from '@playwright/test';
import { NavBar } from './pages/PageObjects';

test.describe('Navigation, Scrollspy & Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('floating header navigation bar is visible and links to respective sections', async ({ page }) => {
    const nav = new NavBar(page);
    await nav.expectVisible();
    const expectedLinks = [
      { text: 'Home', hash: '#home' },
      { text: 'About', hash: '#about' },
      { text: 'Journey', hash: '#journey' },
      { text: 'Skills', hash: '#skills' },
      { text: 'Projects', hash: '#projects' },
      { text: 'Contact', hash: '#contact' },
    ];
    await nav.expectLinks(expectedLinks);
  });

  test('clicking navigation link scrolls to target section smoothly', async ({ page }) => {
    const nav = new NavBar(page);
    await nav.clickLink('#about');
    const aboutSection = page.locator('section#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('CV download buttons trigger proper PDF file download', async ({ page }) => {
    const headerCvBtn = page.locator('a.btn-cv');
    await expect(headerCvBtn).toHaveAttribute('href', /assets\\\/Akshay_Shinde_Resume\\\.pdf/);
    await expect(headerCvBtn).toHaveAttribute('download', 'Akshay_Shinde_Resume.pdf');
    const heroCvBtn = page.locator('a.btn-secondary:has-text("Download CV")');
    await expect(heroCvBtn).toHaveAttribute('href', /assets\\\/Akshay_Shinde_Resume\\\.pdf/);
  });

  test('external social links have secure rel and target attributes', async ({ page }) => {
    const linkedInLinks = page.locator('a[href*="linkedin.com/in/akshay-shinde"]');
    const count = await linkedInLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const link = linkedInLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('back to top button returns window scroll to top', async ({ page }) => {
    await page.locator('footer.footer').scrollIntoViewIfNeeded();
    const backToTopBtn = page.locator('a.back-to-top');
    await expect(backToTopBtn).toBeVisible();
    await backToTopBtn.click();
    await expect(page.locator('#home')).toBeInViewport();
  });
});
