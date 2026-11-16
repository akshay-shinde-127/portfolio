import { test, expect } from '@playwright/test';

test.describe('Smoke & Core Rendering', () => {
  test('page loads successfully without console errors or unhandled exceptions', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', error => pageErrors.push(error));

    const response = await page.goto('./');
    expect(response?.status()).toBe(200);

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test('has accurate professional title and SEO meta tags', async ({ page }) => {
    await page.goto('./');

    await expect(page).toHaveTitle(/Akshay Shinde · Senior QA Automation Engineer/);

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /Senior QA Automation & Agentic AI Engineer/);

    const keywords = page.locator('meta[name="keywords"]');
    await expect(keywords).toHaveAttribute('content', /Playwright.*Espresso.*Cypress.*AI Agents.*MCP Server/);
  });

  test('hero section displays core identity, status pill and tech chips', async ({ page }) => {
    await page.goto('./');

    const hero = page.locator('#home');
    await expect(hero).toBeVisible();

    const nameHeading = hero.locator('h1.hero-title');
    await expect(nameHeading).toHaveText('Akshay Shinde');

    const role = hero.locator('.hero-role');
    await expect(role).toContainText('Senior QA Automation Engineer');

    const statusPill = hero.locator('.status-badge');
    await expect(statusPill).toContainText('Available for Senior QA & AI Automation Roles');

    // Verify key chips exist
    const chips = hero.locator('.tech-chip');
    await expect(chips).toContainText(['Playwright', 'AI Agents & MCP', 'Espresso (Kotlin)', 'Cypress']);
  });

  test('all required page sections exist and are present in DOM', async ({ page }) => {
    await page.goto('./');

    const expectedSections = ['home', 'about', 'journey', 'skills', 'projects', 'contact'];
    for (const sectionId of expectedSections) {
      const section = page.locator(`section#${sectionId}`);
      await expect(section).toBeAttached();
    }
  });
});
