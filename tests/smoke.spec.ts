import { test, expect } from '@playwright/test';
import { HomePage } from './pages/PageObjects';

test.describe('Smoke & Core Rendering', () => {
  test('page loads successfully without console errors or unhandled exceptions', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(err));

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
    const home = new HomePage(page);
    await home.gotoHome();
    await home.expectHeroVisible();
    await home.expectName('Akshay Shinde');
    await home.expectRole('Senior QA Automation Engineer');
    await home.expectStatus('Available for Senior QA & AI Automation Roles');
    await home.expectTechChips(['Playwright', 'AI Agents & MCP', 'Espresso (Kotlin)', 'Cypress']);
  });

  test('all required page sections exist and are present in DOM', async ({ page }) => {
    const home = new HomePage(page);
    await home.gotoHome();
    const sections = ['home', 'about', 'journey', 'skills', 'projects', 'contact'];
    for (const id of sections) {
      await home.expectSectionAttached(id);
    }
  });
});
